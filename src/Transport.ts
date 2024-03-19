/**
 * Contains classes for controlling Reaper's transport
 * @module
 */
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './Notify';
import {BooleanMessageHandler, FloatMessageHandler, IMessageHandler, StringMessageHandler} from './Handlers';
import {BooleanMessage, FloatMessage, ISendOscMessage, OscMessage, StringMessage} from './Messages';

/** The Reaper transport */
@notifyOnPropertyChanged
export class Transport implements INotifyPropertyChanged {
  @notify<Transport>('beat')
  private _beat = '1.1.00';

  @notify<Transport>('frames')
  private _frames = '00:00:00:00';

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
  private _time = 0;

  private readonly _handlers: IMessageHandler[] = [
    new BooleanMessageHandler('/repeat', value => (this._isRepeatEnabled = value)),
    new BooleanMessageHandler('/record', value => (this._isRecording = value)),
    new BooleanMessageHandler('/stop', value => (this._isStopped = value)),
    new BooleanMessageHandler('/play', value => (this._isPlaying = value)),
    new BooleanMessageHandler('/rewind', value => (this._isRewinding = value)),
    new BooleanMessageHandler('/forward', value => (this._isFastForwarding = value)),

    new FloatMessageHandler('/time', value => (this._time = value)),
    new StringMessageHandler('/beat/str', value => (this._beat = value)),
    new StringMessageHandler('/frames/str', value => (this._frames = value)),
  ];

  private readonly _sendOscMessage: ISendOscMessage;

  /**
   * @param sendOscMessage A callback used to send OSC messages to Reaper
   */
  constructor(sendOscMessage: ISendOscMessage) {
    this._sendOscMessage = sendOscMessage;
  }

  /** Indicates the current transport beat in format mm.bb.xx */
  public get beat(): string {
    return this._beat;
  }

  /** Indicates the current transport from in format h:m:s:f */
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

  /** Indicates the current transport time in seconds */
  public get time(): number {
    return this._time;
  }

  /** Jumps to the specified beat (absolute)
   * @param beat The beat to jump to
   */
  public jumpToBeat(beat: Beat): void {
    this._sendOscMessage(new StringMessage('/beat/str', beat.toString()));
  }

  /** Jumps to the specified frame (absolute)
   * @param frame Frame to jump to (in format h:m:s:f). Values in an invalid format will be ignored by Reaper
   */
  public jumpToFrame(frame: string): void {
    this._sendOscMessage(new StringMessage('/frames/str', frame));
  }

  /** Jumps to the specified time in seconds (absolute)
   * @param time The time to jump to (in seconds). If this value is negative, Reaper will jump to 0
   */
  public jumpToTime(time: number): void {
    this._sendOscMessage(new FloatMessage('/time', time));
  }

  /**
   * Jumps to a relative time in seconds.
   * Note that the absolute value to jump to is calculated by the library based on the currently known time,
   * as Reaper does not appear to support jumping to a relative time via OSC
   * @param time The relative time jump (in seconds)
   */
  public jumpToTimeRelative(time: number): void {
    const newTime = Math.max(this._time + time, 0);

    this._sendOscMessage(new FloatMessage('/time', newTime));
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

/** Represents a beat value in Reaper */
export class Beat {
  private readonly _beat: number;
  private readonly _fraction: number;
  private readonly _measure: number;

  /**
   * @param measure The measure of the beat
   * @param beat The beat in the measure
   * @param fraction The beat fraction (must be >= 0 and < 100)
   */
  constructor(measure: number, beat: number, fraction: number) {
    if (fraction < 0 || fraction >= 100) {
      throw new Error(`Invalid fraction ${fraction}, must be >= 0 and < 100`);
    }

    this._beat = beat;
    this._fraction = fraction;
    this._measure = measure;
  }

  /** Indicates the beat portion of the beat (mm) */
  public get beat(): number {
    return this._beat;
  }

  /** Indicates the fraction portion of the beat (bb) */
  public get fraction(): number {
    return this._fraction;
  }

  /** Indicates the measure of the beat (xx) */
  public get measure(): number {
    return this._measure;
  }

  /**
   * Parses a string into a Beat
   * @param value String value in the format mm.bb.xx
   * @returns The parsed beat
   * @throws Throws an error when the format is invalid
   */
  public static parse(value: string): Beat {
    const parts = value.split('.');

    if (parts.length != 3) {
      throw new Error('Must be in the format mm.bb.xx');
    }

    const numberParts: number[] = [];

    parts.forEach(element => {
      const intValue = parseInt(element);
      numberParts.push(intValue);
    });

    return new Beat(numberParts[0], numberParts[1], numberParts[2]);
  }

  /**
   * Converts the beat into its string representation in the format mm.bb.xx
   */
  public toString(): string {
    return `${this.measure}.${this.beat}.${this.fraction}`;
  }
}
