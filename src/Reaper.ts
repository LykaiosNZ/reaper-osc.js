/**
 * Contains classes for controlling Reaper via OSC
 * @module
 */
import {OscMessage} from './Messages';
import {Track} from './Tracks';
import {Transport} from './Transport';
import {DeviceState} from './Device';
import {SelectedTrack} from './SelectedTrack';
import {ReaperOscClient} from './Client/Client';
import {ToggleAutoRecordArm, ToggleMetronome, ResetSolos, TriggerAction} from './Client/Commands';
import {ReaperConfiguration} from './Config';
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './Notify';

// Re-export for backwards compatibility
export {ReaperConfiguration, ConsoleLogger, LogLevel, Logger} from './Config';

/**
 * Allows control of an instance of Reaper via OSC.
 *
 * @example
 * ```typescript
 * // Create an instance of Reaper using default settings
 * const reaper = new Reaper();
 * // Start OSC
 * reaper.startOsc();
 * // Give the port a chance to open, then tell Reaper to start playback
 * setTimeout(() => {reaper.transport.play();}, 100);
 *```
 */
@notifyOnPropertyChanged
export class Reaper implements INotifyPropertyChanged {
  @notify<Reaper>('isAutoRecordArmEnabled')
  private _isAutoRecordArmEnabled = false;

  @notify<Reaper>('isAnySoloed')
  private _isAnySoloed = false;

  @notify<Reaper>('isMetronomeEnabled')
  private _isMetronomeEnabled = false;

  private readonly _afterMessageReceived: ((message: OscMessage, handled: boolean) => void) | null;
  private readonly _client: ReaperOscClient;
  private readonly _masterTrack: Track;

  private readonly _device: DeviceState;
  private readonly _selectedTrack: SelectedTrack;
  private readonly _tracks: Track[] = [];
  private readonly _transport: Transport;

  constructor(config?: ReaperConfiguration);
  constructor(client: ReaperOscClient, config?: ReaperConfiguration);
  constructor(clientOrConfig?: ReaperOscClient | ReaperConfiguration, config?: ReaperConfiguration) {
    let resolvedConfig: ReaperConfiguration;

    if (clientOrConfig instanceof ReaperOscClient) {
      this._client = clientOrConfig;
      resolvedConfig = config ?? new ReaperConfiguration();
    } else {
      resolvedConfig = clientOrConfig ?? new ReaperConfiguration();
      this._client = new ReaperOscClient(resolvedConfig);
    }

    this._afterMessageReceived = resolvedConfig.afterMessageReceived;

    const send = (command: Parameters<ReaperOscClient['send']>[0]) => this._client.send(command);

    this._device = new DeviceState(send);
    this._transport = new Transport(send);
    this._selectedTrack = new SelectedTrack(resolvedConfig.numberOfFx, send);
    this._masterTrack = new Track(0, resolvedConfig.numberOfFx, send);

    for (let i = 0; i < resolvedConfig.numberOfTracks; i++) {
      this._tracks[i] = new Track(i + 1, resolvedConfig.numberOfFx, send);
    }

    // Track whether the last parsed event was known (for afterMessageReceived)
    let lastEventWasKnown = false;

    this._client.on('message', event => {
      lastEventWasKnown = event.type !== 'unknown';

      switch (event.type) {
        case 'metronome': this._isMetronomeEnabled = event.enabled; break;
        case 'autoRecordArm': this._isAutoRecordArmEnabled = event.enabled; break;
        case 'anySolo': this._isAnySoloed = event.active; break;
      }

      this._transport.handleEvent(event);
      this._selectedTrack.handleEvent(event);

      if ('trackNumber' in event) {
        const trackNumber = (event as {trackNumber: number}).trackNumber;

        if (trackNumber === 0) {
          this._masterTrack.handleEvent(event);
        } else {
          this._tracks[trackNumber - 1]?.handleEvent(event);
        }
      }
    });

    this._client.on('rawMessage', message => {
      if (this._afterMessageReceived !== null) {
        this._afterMessageReceived(message, lastEventWasKnown);
      }
    });
  }

  /** The underlying stateless OSC client */
  public get client(): ReaperOscClient {
    return this._client;
  }

  /** Controls the OSC device's navigation state (track/bank/FX selection) */
  public get device(): DeviceState {
    return this._device;
  }

  /** Indicates whether auto-record-arm is enabled */
  public get isAutoRecordArmEnabled(): boolean {
    return this._isAutoRecordArmEnabled;
  }

  /** Indicates whether any track is soloed */
  public get isAnySoloed(): boolean {
    return this._isAnySoloed;
  }

  /** Indicates whether the metronome is enabled */
  public get isMetronomeEnabled(): boolean {
    return this._isMetronomeEnabled;
  }

  /** Indicates whether OSC is ready to send and receive messages */
  public get isReady(): boolean {
    return this._client.isReady;
  }

  /** The master track */
  public get master(): Track {
    return this._masterTrack;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onPropertyChanged(property: string, callback: () => void): () => void {
    throw new Error('not implemented');
  }

  /**
   * Triggers the action `Control surface: Refresh all surfaces` (Command ID: 41743)
   */
  public refreshControlSurfaces(): void {
    this.triggerAction(41743);
  }

  /**
   * Send a message to Reaper via OSC. Messages may not be sent while {@link Reaper.isReady} is false.
   * @param message The OSC message to be sent
   */
  public sendOscMessage(message: OscMessage): void {
    this._client.sendRaw(message);
  }

  /** Open the OSC port and start listening for messages */
  public async start(): Promise<void> {
    return this._client.start();
  }

  /** Stop listening for OSC messages */
  public async stop(): Promise<void> {
    return this._client.stop();
  }

  /** Toggle auto-record-arm on or off */
  public toggleAutoRecordArm(): void {
    this._client.send(ToggleAutoRecordArm());
  }

  /** Toggle the metronome on or off */
  public toggleMetronome(): void {
    this._client.send(ToggleMetronome());
  }

  /** Reset all solos */
  public soloReset(): void {
    this._client.send(ResetSolos());
  }

  /**
   * The OSC device's currently focused track.
   * State is populated by the sync burst Reaper sends when the focused track changes.
   * @see {@link DeviceState.selectTrack}
   */
  public get selectedTrack(): SelectedTrack {
    return this._selectedTrack;
  }

  /** The current bank of tracks */
  public get tracks(): ReadonlyArray<Track> {
    return this._tracks;
  }

  /** Transport controls */
  public get transport(): Transport {
    return this._transport;
  }

  /**
   * Trigger a Reaper action
   * @param commandId The Command ID of the action to be triggered.
   * @param value The value to send for the action. Note that some actions expect the CC value (0-127) while others expect a decimal value between 0 and 1.
   * @example
   * ```typescript
   * // Trigger action 'Track: Toggle mute for master track'
   * reaper.triggerAction(14);
   * // Trigger SWS Extension action 'SWS/S&M: Live Config #1 - Apply config (MIDI/OSC only)' with a CC value of 3, selects config #3
   * reaper.triggerAction('_S&M_LIVECFG_APPLY1', 3);
   * // Trigger action 'Track: Set volume for track 01 (MIDI CC/OSC only)' with a value of 0.75, sets volume of track 1 to +0.0dB
   * reaper.triggerAction(20, 0.7156)
   * ```
   */
  public triggerAction(commandId: number | string, value: number | null = null): void {
    if (value !== null && (value < 0 || value > 127)) {
      throw new RangeError('Values must be between 0 and 127 inclusive');
    }

    this._client.send(TriggerAction(commandId, value ?? undefined));
  }
}
