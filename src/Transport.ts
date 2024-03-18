/**
 * Contains classes for controlling Reaper's transport
 * @module
 */
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './Notify';
import {BooleanMessageHandler, IMessageHandler, StringMessageHandler} from './Handlers';
import {BooleanMessage, ISendOscMessage, OscMessage} from './Messages';

/** The Reaper transport */
@notifyOnPropertyChanged
export class Transport implements INotifyPropertyChanged {
  @notify<Transport>('beat')
  private _beat = '1.1.00'

  @notify<Transport>('frames')
  private _frames = '00:00:00:00'

  @notify<Transport>('isFastForwarding')
  private _isFastForwarding = false;

  @notify<Transport>('isPlaying')
  private _isPlaying = false;

  @notify<Transport>('isRecording')
  private _isRecording = false;

  @notify<Transport>('isRepeatEnabled')
  private _isRepeatEnabled = false;

  @notify<Transport>('isRewinding')
  private _isRewinding = false;

  @notify<Transport>('isStopped')
  private _isStopped = false;

  @notify<Transport>('time')
  private _time = '0:00.0000';

  private readonly _handlers: IMessageHandler[] = [
    new BooleanMessageHandler('/repeat', value => (this._isRepeatEnabled = value)),
    new BooleanMessageHandler('/record', value => (this._isRecording = value)),
    new BooleanMessageHandler('/stop', value => (this._isStopped = value)),
    new BooleanMessageHandler('/play', value => (this._isPlaying = value)),
    new BooleanMessageHandler('/rewind', value => (this._isRewinding = value)),
    new BooleanMessageHandler('/forward', value => (this._isFastForwarding = value)),

    new StringMessageHandler('/time/str', value => (this._time = value)),
    new StringMessageHandler('/beat/str', value => (this._beat = value)),
    new StringMessageHandler('/frames/str', value => (this._frames = value))
  ];

  private readonly _sendOscMessage: ISendOscMessage;

  /**
   * @param sendOscMessage A callback used to send OSC messages to Reaper
   */
  constructor(sendOscMessage: ISendOscMessage) {
    this._sendOscMessage = sendOscMessage;
  }

  public get beat(): string {
    return this._beat;
  }

  public get frames(): string {
    return this._frames;
  }

  /** Indicates whether playback is active  */
  public get isPlaying(): boolean {
    return this._isPlaying;
  }

  /** Indicates whether playback is stopped */
  public get isStopped(): boolean {
    return this._isStopped;
  }

  /** Indicates whether recording is active */
  public get isRecording(): boolean {
    return this._isRecording;
  }

  /** Indicates whether rewind is active */
  public get isRewinding(): boolean {
    return this._isRewinding;
  }

  /** Indicates whether fast-foward is active */
  public get isFastForwarding(): boolean {
    return this._isFastForwarding;
  }

  /** Indicates whether repeat is enabled */
  public get isRepeatEnabled(): boolean {
    return this._isRepeatEnabled;
  }

  /** Indicates the current transport time in string format */
  public get time(): string {
    return this._time;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onPropertyChanged(property: string, callback: () => void): () => void {
    throw new Error('not implemented');
  }

  /** Toggle pause */
  public pause(): void {
    this._sendOscMessage(new OscMessage('/pause'));
  }

  /** Toggle play */
  public play(): void {
    this._sendOscMessage(new OscMessage('/play'));
  }

  /**
   * Receive and handle an OSC message
   * @param message The message to be handled
   */
  public receive(message: OscMessage): boolean {
    for (const handler of this._handlers) {
      if (handler.handle(message)) {
        return true;
      }
    }

    return false;
  }

  /** Toggle recording */
  public record(): void {
    this._sendOscMessage(new OscMessage('/record'));
  }

  /** Start fast fowarding. Will continue until stopped */
  public startFastForwarding(): void {
    this._sendOscMessage(new BooleanMessage('/forward', true));
  }

  /** Start rewinding. Will continue until stopped */
  public startRewinding(): void {
    this._sendOscMessage(new BooleanMessage('/rewind', true));
  }

  /** Stop playback or recording */
  public stop(): void {
    this._sendOscMessage(new OscMessage('/stop'));
  }

  /** Stop fast forwarding */
  public stopFastForwarding(): void {
    this._sendOscMessage(new BooleanMessage('/forward', false));
  }

  /** Stop rewinding */
  public stopRewinding(): void {
    this._sendOscMessage(new BooleanMessage('/rewind', false));
  }

  /** Toggle repeat on or off */
  public toggleRepeat(): void {
    this._sendOscMessage(new OscMessage('/repeat'));
  }
}
