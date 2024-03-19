/**
 * Contains classes for controlling Reaper via OSC
 * @module
 */
import {ActionMessage, OscMessage, RawOscMessage} from './Messages';
import {Track} from './Tracks';
import {Transport} from './Transport';
import * as osc from 'osc';
import {BooleanMessageHandler, IMessageHandler, TrackMessageHandler, TransportMessageHandler} from './Handlers';
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './Notify';

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
  @notify<Reaper>('isMetronomeEnabled')
  private _isMetronomeEnabled = false;

  private readonly _afterMessageReceived: ((message: OscMessage, handled: boolean) => void) | null;
  private readonly _handlers: IMessageHandler[] = [];
  private _isReady = false;
  private readonly _log: Logger;
  private readonly _masterTrack: Track;

  // No type defs for osc libary so don't have much choice here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _osc: any;

  private readonly _tracks: Track[] = [];
  private readonly _transport: Transport = new Transport(message => this.sendOscMessage(message));

  constructor(config: ReaperConfiguration = new ReaperConfiguration()) {
    this._osc = new osc.UDPPort({
      localAddress: config.localAddress,
      localPort: config.localPort,
      remoteAddress: config.remoteAddress,
      remotePort: config.remotePort,
      broadcast: true,
      metadata: true,
    });

    this._afterMessageReceived = config.afterMessageReceived;
    this._log = config.log;

    this.initOsc();
    this.initHandlers();

    this._masterTrack = new Track(0, config.numberOfFx, message => this.sendOscMessage(message));

    for (let i = 0; i < config.numberOfTracks; i++) {
      this._tracks[i] = new Track(i + 1, config.numberOfFx, message => this.sendOscMessage(message));
    }
  }

  /** Indicates whether the metronome is enabled */
  public get isMetronomeEnabled(): boolean {
    return this._isMetronomeEnabled;
  }

  /** Indicates whether OSC is ready to send and receive messages */
  public get isReady(): boolean {
    return this._isReady;
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
    if (!this._isReady) {
      throw new Error("Can't send while OSC is not ready");
    }

    this._osc.send(message);

    this._log('debug', 'OSC Message sent', message);
  }

  /** Open the OSC port and start listening for messages */
  public async start(): Promise<void> {
    if (this.isReady) {
      return;
    }

    const promise = new Promise<void>(resolve => {
      this._osc.once('ready', () => {
        this._log('debug', 'OSC listener ready');
        this._isReady = true;
        resolve();
      });
    });

    this._osc.open();

    return promise;
  }

  /** Stop listening for OSC messages */
  public async stop(): Promise<void> {
    if (!this._isReady) {
      return;
    }

    const promise = new Promise<void>(resolve => {
      this._osc.once('close', () => {
        this._log('debug', 'OSC listener stopped');
        resolve();
      });
    });

    this._isReady = false;
    this._osc.close();

    return promise;
  }

  /** Toggle the metronome on or off */
  public toggleMetronome(): void {
    this.sendOscMessage(new OscMessage('/click'));
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

    this.sendOscMessage(new ActionMessage(commandId, value));
  }

  private initHandlers() {
    this._handlers.push(
      new TrackMessageHandler(trackNumber => {
        if (trackNumber == 0) {
          return this._masterTrack;
        }

        return this._tracks[trackNumber - 1] !== undefined ? this._tracks[trackNumber - 1] : null;
      }),
      new TransportMessageHandler(this._transport),
      new BooleanMessageHandler('/click', value => (this._isMetronomeEnabled = value)),
    );
  }

  private initOsc() {
    this._osc.on('error', (err: Error) => {
      this._log('error', 'OSC error received', err);
    });

    this._osc.on('message', (rawMessage: RawOscMessage) => {
      const message = new OscMessage(rawMessage.address, rawMessage.args);

      let handled = false;

      for (const handler of this._handlers) {
        if (handler.handle(message)) {
          handled = true;
          break;
        }
      }

      if (this._afterMessageReceived !== null) {
        this._afterMessageReceived(message, handled);
      }
    });
  }
}

export class ReaperConfiguration {
  afterMessageReceived: ((message: OscMessage, handled: boolean) => void) | null = null;
  /** The address to listen for Reaper OSC messages on */
  localAddress = '127.0.0.1';
  /** The port to listen for Reaper OSC messages on */
  localPort = 9000;
  /** Function for logging messages. Defaults to logging to console */
  log: Logger = ConsoleLogger;
  /** Number of FX per track */
  numberOfFx = 8;
  /** Number of tracks per bank */
  numberOfTracks = 8;
  /** The address to send Reaper OSC messages to */
  remoteAddress = '127.0.0.1';
  /** The port to send Reaper OSC messages to */
  remotePort = 8000;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Logger = (level: LogLevel, message: string, ...optionalParams: any[]) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ConsoleLogger(level: LogLevel, message: string, ...optionalParams: any[]): void {
  switch (level) {
    case 'debug': {
      console.debug(message, optionalParams);
      break;
    }
    case 'info': {
      console.log(message, optionalParams);
      break;
    }
    case 'warn': {
      console.warn(message, optionalParams);
      break;
    }
    case 'error': {
      console.error(message, optionalParams);
      break;
    }
  }
}
