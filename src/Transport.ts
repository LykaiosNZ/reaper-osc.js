/**
 * Contains classes for controlling Reaper's transport
 * @module
 */
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './Notify';
import {ReaperOscEvent} from './Client/Events';
import {SetBeat, SetFrames, SetTime, Pause, Play, ToggleRecord, SetLoopEnd, SetLoopStart, SetFastForward, SetRewind, Stop, ToggleRepeat, ToggleRewindByMarker, ToggleSetLoop, GotoMarker, GotoRegion, ReaperOscCommand} from './Client/Commands';
import {LastMarker} from './Marker';
import {LastRegion} from './Region';

type SendCommand = (command: ReaperOscCommand) => void;

/** The Reaper transport */
@notifyOnPropertyChanged
export class Transport implements INotifyPropertyChanged {
  @notify<Transport>('beat')
  private _beat = '1.1.00'

  @notify<Transport>('frames')
  private _frames = '00:00:00:00'

  @notify<Transport>('isFastForwarding')
  private _isFastForwarding = false;

  @notify<Transport>('isPaused')
  private _isPaused = false;

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

  @notify<Transport>('isRewindByMarker')
  private _isRewindByMarker = false;

  @notify<Transport>('isSetLoop')
  private _isSetLoop = false;

  @notify<Transport>('loopEnd')
  private _loopEnd = 0;

  @notify<Transport>('loopStart')
  private _loopStart = 0;

  @notify<Transport>('time')
  private _time = 0;

  private readonly _lastMarker = new LastMarker();
  private readonly _lastRegion = new LastRegion();

  private readonly _send: SendCommand;

  /**
   * @param send A callback used to send typed commands to Reaper
   */
  constructor(send: SendCommand) {
    this._send = send;
  }

  /** Indicates the current transport beat in format mm.bb.xx */
  public get beat(): string {
    return this._beat;
  }

  /** Indicates the current transport from in format h:m:s:f */
  public get frames(): string {
    return this._frames;
  }

  /** Indicates whether playback is paused */
  public get isPaused(): boolean {
    return this._isPaused;
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

  /** Indicates whether rewind-to-previous-marker is enabled */
  public get isRewindByMarker(): boolean {
    return this._isRewindByMarker;
  }

  /** Indicates whether the set-loop-points mode is enabled */
  public get isSetLoop(): boolean {
    return this._isSetLoop;
  }

  /** The most recently passed marker (populated during playback and from the sync burst) */
  public get lastMarker(): LastMarker {
    return this._lastMarker;
  }

  /** The most recently entered region (populated during playback and from the sync burst) */
  public get lastRegion(): LastRegion {
    return this._lastRegion;
  }

  /** Indicates the end time of the loop (in seconds) */
  public get loopEnd() : number {
    return this._loopEnd;
  }

  /** Indicates the start time of the loop (in seconds) */
  public get loopStart(): number {
    return this._loopStart;
  }

  /** Indicates the current transport time in seconds */
  public get time(): number {
    return this._time;
  }

  /**
   * Handle a typed incoming event
   * @param event The event to handle
   */
  public handleEvent(event: ReaperOscEvent): void {
    switch (event.type) {
      case 'transport:repeat': this._isRepeatEnabled = event.enabled; break;
      case 'transport:record': this._isRecording = event.recording; break;
      case 'transport:stop': this._isStopped = event.stopped; break;
      case 'transport:pause': this._isPaused = event.paused; break;
      case 'transport:play': this._isPlaying = event.playing; break;
      case 'transport:rewind': this._isRewinding = event.rewinding; break;
      case 'transport:fastForward': this._isFastForwarding = event.fastForwarding; break;
      case 'transport:time': this._time = event.time; break;
      case 'transport:beat': this._beat = event.beat; break;
      case 'transport:frames': this._frames = event.frames; break;
      case 'transport:loopStart': this._loopStart = event.time; break;
      case 'transport:loopEnd': this._loopEnd = event.time; break;
      case 'transport:rewindByMarker': this._isRewindByMarker = event.enabled; break;
      case 'transport:setLoop': this._isSetLoop = event.enabled; break;
    }
    this._lastMarker.handleEvent(event);
    this._lastRegion.handleEvent(event);
  }

  /** Jumps to the specified beat (absolute)
   * @param beat The beat to jump to
   */
  public jumpToBeat(beat: Beat): void {
    this._send(SetBeat(beat.toString()));
  }

  /** Jumps to the specified frame (absolute)
   * @param frame Frame to jump to (in format h:m:s:f). Values in an invalid format will be ignored by Reaper
  */
  public jumpToFrame(frame: string): void {
    this._send(SetFrames(frame));
  }

  /** Jumps to the specified time in seconds (absolute)
   * @param time The time to jump to (in seconds). If this value is negative, Reaper will jump to 0
   */
  public jumpToTime(time: number): void {
    this._send(SetTime(time));
  }

  /**
   * Jumps to a relative time in seconds.
   * Note that the absolute value to jump to is calculated by the library based on the currently known time,
   * as Reaper does not appear to support jumping to a relative time via OSC
   * @param time The relative time jump (in seconds)
   */
  public jumpToTimeRelative(time: number): void {
    this._send(SetTime(Math.max(this._time + time, 0)));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onPropertyChanged(property: string, callback: () => void): () => void {
    throw new Error('not implemented');
  }

  /** Toggle pause */
  public pause(): void {
    this._send(Pause());
  }

  /** Toggle play */
  public play(): void {
    this._send(Play());
  }

  /** Toggle recording */
  public record(): void {
    this._send(ToggleRecord());
  }

  /**
   * Sets the loop end time
   * @param time End time for the loop (in seconds)
   */
  public setLoopEnd(time: number) : void {
    this._send(SetLoopEnd(time));
  }

  /**
   * Sets the loop start time
   * @param time Start time for the loop (in seconds)
   */
  public setLoopStart(time: number) : void {
    this._send(SetLoopStart(time));
  }

  /** Start fast fowarding. Will continue until stopped */
  public startFastForwarding(): void {
    this._send(SetFastForward(true));
  }

  /** Start rewinding. Will continue until stopped */
  public startRewinding(): void {
    this._send(SetRewind(true));
  }

  /** Stop playback or recording */
  public stop(): void {
    this._send(Stop());
  }

  /** Stop fast forwarding */
  public stopFastForwarding(): void {
    this._send(SetFastForward(false));
  }

  /** Stop rewinding */
  public stopRewinding(): void {
    this._send(SetRewind(false));
  }

  /** Toggle repeat on or off */
  public toggleRepeat(): void {
    this._send(ToggleRepeat());
  }

  /** Toggle rewind-to-previous-marker on or off */
  public toggleRewindByMarker(): void {
    this._send(ToggleRewindByMarker());
  }

  /** Toggle the set-loop-points mode on or off */
  public toggleSetLoop(): void {
    this._send(ToggleSetLoop());
  }

  /**
   * Jump to the marker with the given user-assigned number (as shown in Reaper's UI).
   * @param markerNumber The user-assigned marker number to jump to
   */
  public gotoMarker(markerNumber: number): void {
    this._send(GotoMarker(markerNumber));
  }

  /**
   * Jump to the region with the given user-assigned number (as shown in Reaper's UI).
   * @param regionNumber The user-assigned region number to jump to
   */
  public gotoRegion(regionNumber: number): void {
    this._send(GotoRegion(regionNumber));
  }
}

/** Represents a beat value in Reaper */
export class Beat {
	private readonly _beat: number
	private readonly _fraction: number
	private readonly _measure: number

  /**
   * @param measure The measure of the beat
   * @param beat The beat in the measure
   * @param fraction The beat fraction (must be >= 0 and < 100)
   */
	constructor(measure: number, beat: number, fraction: number) {
		if (fraction < 0 || fraction >= 100) {
			throw new Error(`Invalid fraction ${fraction}, must be >= 0 and < 100`)
		}

    this._beat = beat;
    this._fraction = fraction;
    this._measure = measure;
	}

  /** Indicates the beat portion of the beat (mm) */
	public get beat() : number {
    return this._beat;
  }

  /** Indicates the fraction portion of the beat (bb) */
  public get fraction() : number {
    return this._fraction;
  }

  /** Indicates the measure of the beat (xx) */
  public get measure() : number {
    return this._measure;
  }

  /**
   * Parses a string into a Beat
   * @param value String value in the format mm.bb.xx
   * @returns The parsed beat
   * @throws Throws an error when the format is invalid
   */
  public static parse(value: string) : Beat {
    const parts = value.split('.');

    if (parts.length != 3)
    {
      throw new Error('Must be in the format mm.bb.xx')
    }

    const numberParts: number[] = [];

    parts.forEach(element => {
      const intValue = parseInt(element);
      numberParts.push(intValue);
    });

    return new Beat(numberParts[0], numberParts[1], numberParts[2])
  }

  /**
   * Converts the beat into its string representation in the format mm.bb.xx
   */
  public toString() : string {
    return `${this.measure}.${this.beat}.${this.fraction}`
  }
}
