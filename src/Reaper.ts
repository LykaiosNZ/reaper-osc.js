/**
 * A library for controlling Reaper via Open Sound Control (OSC)
 *
 * @packageDescription
 */

/** 
 * Contains classes for controlling Reaper via OSC
 * @module
 */
import {ActionMessage, OscMessage} from './osc/Messages';
import {Track} from './Tracks';
import {Transport} from './Transport';
import * as osc from 'osc';
import {BooleanMessageHandler, IMessageHandler, TrackMessageHandler, TransportMessageHandler} from './osc/Handlers';
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './notify/Notify';
import {IEvent} from 'ste-events';

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
 * @decorator {@link notifyOnPropertyChanged}
 */
@notifyOnPropertyChanged
export class Reaper implements INotifyPropertyChanged<Reaper> {
  @notify<Reaper>('isMetronomeEnabled')
  private _isMetronomeEnabled = false;

  @notify<Reaper>('isReady')
  private _isReady = false;

  private readonly _handlers: IMessageHandler[] = [];

  // No type defs for osc libary so don't have much choice here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _osc: any;

  private readonly _tracks: Track[] = [];
  private readonly _transport: Transport = new Transport(message => this.sendOscMessage(message));

  constructor({
    localAddress = '127.0.0.1',
    localPort = 9000,
    remoteAddress = '127.0.0.1',
    remotePort = 8000,
    numberOfTracks = 8,
    numberOfFx = 8,
  }: ReaperConfiguration) {
    this._osc = new osc.UDPPort({
      localAddress: localAddress,
      localPort: localPort,
      remoteAddress: remoteAddress,
      remotePort: remotePort,
      broadcast: true,
      metadata: true,
    });

    this.initOsc();
    this.initHandlers();

    for (let i = 1; i < numberOfTracks; i++) {
      this._tracks[i] = new Track(i, numberOfFx, this.sendOscMessage);
    }
  }

  public get isMetronomeEnabled(): boolean {
    return this._isMetronomeEnabled;
  }

  public get isReady(): boolean {
    return this._isReady;
  }

  public get onPropertyChanged(): IEvent<Reaper, string> {
    throw new Error('not implemented');
  }

  /**
   * Triggers the action 'Control surface: Refresh all surfaces' (Command ID: 41743)
   */
  public refreshControlSurfaces(): void {
    this.triggerAction(41743);
  }

  /** Send a message to Reaper via OSC */
  public sendOscMessage(message: OscMessage): void {
    if (!this._isReady) {
      console.error("Can't send while OSC is not ready");
      return;
    }

    this._osc.send(message);

    console.debug('OSC message sent', message);
  }

  /** Start listening for OSC messages */
  public startOsc(): void {
    this._osc.open();
  }

  /** Stop listening for OSC messages */
  public stopOsc(): void {
    this._osc.close();
    this._isReady = false;
  }

  /** Toggle the metronome on or off */
  public toggleMetronome(): void {
    this.sendOscMessage(new OscMessage('/click'));
  }

  public get tracks(): ReadonlyArray<Track> {
    return this._tracks;
  }

  public get transport(): Transport {
    return this._transport;
  }

  /**
   * Trigger a Reaper action
   * @param {number | string} commandId
   * @example
   * ```typescript
   * // Trigger action 'Track: Toggle mute for master track'
   * reaper.triggerAction(14);
   * // Trigger SWS Extension action 'SWS: Set all master track outputs muted'
   * reaper.triggerAction('_XEN_SET_MAS_SENDALLMUTE');
   * ```
   */
  public triggerAction(commandId: number | string): void {
    this.sendOscMessage(new ActionMessage(commandId));
  }

  private initHandlers() {
    this._handlers.push(
      new TrackMessageHandler(trackNumber => this._tracks[trackNumber]),
      new TransportMessageHandler(this._transport),
      new BooleanMessageHandler('/click', value => (this._isMetronomeEnabled = value)),
    );
  }

  private initOsc() {
    this._osc.on('ready', () => {
      console.debug('OSC ready');
      this._isReady = true;
    });

    this._osc.on('error', (err: Error) => {
      console.error('OSC error received', err);
    });

    this._osc.on('message', (message: OscMessage) => {
      // TODO: Figure out a better way to handle this
      message = new OscMessage(message.address, message.args);

      this._handlers.forEach(handler => {
        handler.handle(message);
      });
    });
  }
}

export interface ReaperConfiguration {
  /** The address to listen for Reaper OSC messages on */
  localAddress?: string;
  /** The port to listen for Reaper OSC messages on */
  localPort?: number;
  /** Number of FX per track */
  numberOfFx?: number;
  /** Number of tracks per bank */
  numberOfTracks?: number;
  /** The address to send Reaper OSC messages to */
  remoteAddress?: string;
  /** The port to send Reaper OSC messages to */
  remotePort?: number;
}
