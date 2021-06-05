/** Contains classes for controlling tracks in Reaper
 * @module
 */
import {TrackFx} from './Fx';
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './Notify';
import {BooleanMessageHandler, StringMessageHandler, IMessageHandler, IntegerMessageHandler, TrackFxMessageHandler, FloatMessageHandler} from './Handlers';
import {BooleanMessage, IntegerMessage, ISendOscMessage, FloatMessage, OscMessage, StringMessage, ToggleMessage} from './Messages';

@notifyOnPropertyChanged
export class Track implements INotifyPropertyChanged {
  @notify<Track>('isMuted')
  private _isMuted = false;

  @notify<Track>('isRecordArmed')
  private _isRecordArmed = false;

  @notify<Track>('isSelected')
  private _isSelected = false;

  @notify<Track>('isSoloed')
  private _isSoloed = false;

  @notify<Track>('name')
  private _name: string = 'Fx' + this.trackNumber;

  @notify<Track>('pan')
  private _pan = 0;

  @notify<Track>('pan2')
  private _pan2 = 0;

  @notify<Track>('panMode')
  private _panMode = '';

  @notify<Track>('recordMonitoring')
  private _recordMonitoring: RecordMonitoringMode = RecordMonitoringMode.OFF;

  @notify<Track>('volumeDb')
  private _volumeDb = 0;

  @notify<Track>('volumeFaderPosition')
  private _volumeFaderPosition = 0;

  @notify<Track>('vu')
  private _vu = 0;

  @notify<Track>('vuLeft')
  private _vuLeft = 0;

  @notify<Track>('vuRight')
  private _vuRight = 0;

  private readonly _fx: TrackFx[] = [];
  private readonly _handlers: IMessageHandler[] = [];
  private readonly _sendOscMessage: ISendOscMessage;

  constructor(public readonly trackNumber: number, numberOfFx: number, sendOscMessage: ISendOscMessage) {
    this._sendOscMessage = sendOscMessage;

    for (let i = 1; i <= numberOfFx; i++) {
      this._fx[i] = new TrackFx(trackNumber, i, sendOscMessage);
    }

    this.initHandlers();
  }

  /** Deselect the track */
  public deselect(): void {
    this._sendOscMessage(new BooleanMessage(this.oscAddress + '/select', false));
  }

  public get fx(): TrackFx[] {
    return this._fx;
  }

  public get isMuted(): boolean {
    return this._isMuted;
  }

  public get isRecordArmed(): boolean {
    return this._isRecordArmed;
  }

  public get isSelected(): boolean {
    return this._isSelected;
  }

  public get isSoloed(): boolean {
    return this._isSoloed;
  }

  /** Mute the track */
  public mute(): void {
    this._sendOscMessage(new BooleanMessage(this.oscAddress + '/mute', true));
  }

  public get name(): string {
    return this._name;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onPropertyChanged(property: string, callback: () => void): void {
    throw new Error('not implemented');
  }

  public get oscAddress(): string {
    return `/track/${this.trackNumber}`;
  }

  /** A floating-point value between -1 and 1 that indicates the pan position, with -1 being 100% left and 1 being 100% right */
  public get pan(): number {
    return this._pan;
  }

  /** A floating-point value between -1 and 1 that indicates the pan 2 position, with -1 being 100% left and 1 being 100% right */
  public get pan2(): number {
    return this._pan2;
  }

  /** The current pan mode */
  public get panMode(): string {
    return this._panMode;
  }

  public receive(message: OscMessage): void {
    this._handlers.forEach(handler => {
      handler.handle(message);
    });
  }

  /** Arm the track for recording */
  public recordArm(): void {
    this._sendOscMessage(new BooleanMessage(this.oscAddress + '/recarm', true));
  }

  public get recordMonitoring(): RecordMonitoringMode {
    return this._recordMonitoring;
  }

  /** Disarm track recording */
  public recordDisarm(): void {
    this._sendOscMessage(new BooleanMessage(this.oscAddress + '/recarm', false));
  }

  /**
   * Renames the track
   * @param name The new name of the track
   * @example
   * ```typescript
   * // Change the track name to 'Guitar'
   * track.rename('Guitar');
   * ```
   */
  public rename(name: string): void {
    this._sendOscMessage(new StringMessage(this.oscAddress + '/name', name));

    // Haven't figured out why yet (possibly to do with track selection?)
    // but Reaper doesn't send an OSC message even though it does if you
    // change the name in Reaper
    this._name = name;
  }

  /** Select the track */
  public select(): void {
    this._sendOscMessage(new BooleanMessage(this.oscAddress + '/select', true));
  }

  /**
   * Set the record monitoring mode
   * @param {RecordMonitorMode} value
   * */
  public setMonitoringMode(value: RecordMonitoringMode): void {
    this._sendOscMessage(new IntegerMessage(this.oscAddress + '/monitor', value));
  }

  /**
   * Sets the pan
   * @param value A floating-point value between -1 and 1, where -1 is 100% left and 1 is 100% right
   */
  public setPan(value: number): void {
    if (value < -1 || value > 1) {
      throw new RangeError('Must be between -1 and 1');
    }

    this._sendOscMessage(new FloatMessage(this.oscAddress + '/pan', value));
  }

  /**
   * Sets the pan 2
   * @param value A floating-point value between -1 and 1, where -1 is 100% left and 1 is 100% right
   */
  public setPan2(value: number): void {
    if (value < -1 || value > 1) {
      throw new RangeError('Must be between -1 and 1');
    }

    this._sendOscMessage(new FloatMessage(this.oscAddress + '/pan', value));
  }

  /**
   * Sets the volume to a specific dB value.
   * @param value Value (in dB) to set the volume to. Valid range is -100 to 12
   */
  public setVolumeDb(value: number): void {
    this._sendOscMessage(new FloatMessage(this.oscAddress + '/volume/db', value));
  }

  /** Sets the volume by moving the fader to a specific position
   * @param position A value for the fader position between 0 and 1, where 0 is all the way down and 1 is all the way up
   */
  public setVolumeFaderPosition(position: number): void {
    if (position < 0 || position > 1) {
      throw new RangeError('Must be between 0 and 1');
    }

    this._sendOscMessage(new FloatMessage(this.oscAddress + '/volume', position));
  }

  /** Solo the track */
  public solo(): void {
    this._sendOscMessage(new BooleanMessage(this.oscAddress + '/solo', true));
  }

  /** Toggle mute on/off */
  public toggleMute(): void {
    this._sendOscMessage(new ToggleMessage(this.oscAddress + '/mute'));
  }

  /** Toggle record arm on/off */
  public toggleRecordArm(): void {
    this._sendOscMessage(new ToggleMessage(this.oscAddress + '/recarm'));
  }

  /** Toggle solo on/off */
  public toggleSolo(): void {
    this._sendOscMessage(new ToggleMessage(this.oscAddress + '/solo'));
  }

  /** Unmute the track */
  public unmute(): void {
    this._sendOscMessage(new BooleanMessage(this.oscAddress + '/mute', false));
  }

  /** Unsolo the track */
  public unsolo(): void {
    this._sendOscMessage(new BooleanMessage(this.oscAddress + '/solo', false));
  }

  /** The track volume in dB */
  public get volumeDb(): number {
    return this._volumeDb;
  }

  /** A floating-point value between 0 and 1 that indicates the fader position, with 0 being all the way down and 1 being all the way up */
  public get volumeFaderPosition(): number {
    return this._volumeFaderPosition;
  }

  /** A floating-point value between 0 and 1 that indicates the VU level */
  public get vu(): number {
    return this._vu;
  }

  /** A floating-point value between 0 and 1 that indicates the Left VU level */
  public get vuLeft(): number {
    return this._vuLeft;
  }

  /** A floating-point value between 0 and 1 that indicates the Right VU level */
  public get vuRight(): number {
    return this._vuRight;
  }

  private initHandlers() {
    this._handlers.push(
      new StringMessageHandler(this.oscAddress + '/name', value => (this._name = value)),
      new BooleanMessageHandler(this.oscAddress + '/mute', value => (this._isMuted = value)),
      new BooleanMessageHandler(this.oscAddress + '/solo', value => (this._isSoloed = value)),
      new BooleanMessageHandler(this.oscAddress + '/recarm', value => (this._isRecordArmed = value)),
      new IntegerMessageHandler(this.oscAddress + '/monitor', value => (this._recordMonitoring = value)),
      new BooleanMessageHandler(this.oscAddress + '/select', value => (this._isSelected = value)),
      new TrackFxMessageHandler(fxNumber => this._fx[fxNumber]),
      new FloatMessageHandler(this.oscAddress + '/pan', value => (this._pan = value)),
      new FloatMessageHandler(this.oscAddress + '/pan2', value => (this._pan2 = value)),
      new StringMessageHandler(this.oscAddress + '/panmode', value => (this._panMode = value)),
      new FloatMessageHandler(this.oscAddress + '/volume', value => (this._volumeFaderPosition = value)),
      new FloatMessageHandler(this.oscAddress + '/volume/db', value => (this._volumeDb = value)),
      new FloatMessageHandler(this.oscAddress + '/vu', value => (this._vu = value)),
      new FloatMessageHandler(this.oscAddress + '/vu/L', value => (this._vuLeft = value)),
      new FloatMessageHandler(this.oscAddress + '/vu/R', value => (this._vuRight = value))
    );
  }
}

export enum RecordMonitoringMode {
  OFF = 0,
  ON = 1,
  AUTO = 2,
}
