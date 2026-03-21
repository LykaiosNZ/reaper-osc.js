/**
 * Contains classes for the OSC device's currently selected track
 * @module
 */
import {Fx} from './Fx';
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './Notify';
import {BooleanMessageHandler, FloatMessageHandler, IMessageHandler, IntegerMessageHandler, StringMessageHandler} from './Handlers';
import {BooleanMessage, FloatMessage, ISendOscMessage, IntegerMessage, OscMessage, StringMessage, ToggleMessage} from './Messages';
import {RecordMonitoringMode} from './Tracks';

/**
 * The OSC device's currently selected track.
 *
 * Receives state via the `/track/` (no index) address space, which Reaper populates
 * with a full sync burst whenever the device's focused track changes.
 *
 * @see {@link DeviceState.selectTrack} to change which track is selected
 */
@notifyOnPropertyChanged
export class SelectedTrack implements INotifyPropertyChanged {
  @notify<SelectedTrack>('isMuted')
  private _isMuted = false;

  @notify<SelectedTrack>('isRecordArmed')
  private _isRecordArmed = false;

  @notify<SelectedTrack>('isSelected')
  private _isSelected = false;

  @notify<SelectedTrack>('isSoloed')
  private _isSoloed = false;

  @notify<SelectedTrack>('name')
  private _name = '';

  @notify<SelectedTrack>('pan')
  private _pan = 0;

  @notify<SelectedTrack>('pan2')
  private _pan2 = 0;

  @notify<SelectedTrack>('panMode')
  private _panMode = '';

  @notify<SelectedTrack>('recordMonitoring')
  private _recordMonitoring: RecordMonitoringMode = RecordMonitoringMode.OFF;

  @notify<SelectedTrack>('volumeDb')
  private _volumeDb = 0;

  @notify<SelectedTrack>('volumeFaderPosition')
  private _volumeFaderPosition = 0;

  @notify<SelectedTrack>('vu')
  private _vu = 0;

  @notify<SelectedTrack>('vuLeft')
  private _vuLeft = 0;

  @notify<SelectedTrack>('vuRight')
  private _vuRight = 0;

  private readonly _fx: Fx[] = [];
  private readonly _handlers: IMessageHandler[] = [];
  private readonly _selectedFx: Fx;
  private readonly _sendOscMessage: ISendOscMessage;

  /**
   * @param numberOfFx The number of FX slots in the device FX bank
   * @param sendOscMessage A callback used to send OSC messages to Reaper
   */
  constructor(numberOfFx: number, sendOscMessage: ISendOscMessage) {
    this._sendOscMessage = sendOscMessage;

    for (let i = 0; i < numberOfFx; i++) {
      this._fx[i] = new Fx(`Fx ${i + 1}`, `/fx/${i + 1}`, sendOscMessage);
    }

    this._selectedFx = new Fx('Selected FX', '/fx', sendOscMessage);

    this.initHandlers();
  }

  /** Deselect this track in Reaper */
  public deselect(): void {
    this._sendOscMessage(new BooleanMessage('/track/select', false));
  }

  /** The FX bank for this track */
  public get fx(): ReadonlyArray<Fx> {
    return this._fx;
  }

  /** Indicates whether the track is muted */
  public get isMuted(): boolean {
    return this._isMuted;
  }

  /** Indicates whether the track is armed for recording */
  public get isRecordArmed(): boolean {
    return this._isRecordArmed;
  }

  /**
   * Indicates whether this track is selected in the Reaper project.
   * @see {@link DeviceState.selectTrack} to change the device's focused track
   */
  public get isSelected(): boolean {
    return this._isSelected;
  }

  /** Indicates whether the track is soloed */
  public get isSoloed(): boolean {
    return this._isSoloed;
  }

  /** Mute the track */
  public mute(): void {
    this._sendOscMessage(new BooleanMessage('/track/mute', true));
  }

  /** The track name */
  public get name(): string {
    return this._name;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onPropertyChanged(property: string, callback: () => void): () => void {
    throw new Error('not implemented');
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

  /** Arm the track for recording */
  public recordArm(): void {
    this._sendOscMessage(new BooleanMessage('/track/recarm', true));
  }

  /** Indicates the record monitoring mode */
  public get recordMonitoring(): RecordMonitoringMode {
    return this._recordMonitoring;
  }

  /** Disarm track recording */
  public recordDisarm(): void {
    this._sendOscMessage(new BooleanMessage('/track/recarm', false));
  }

  /**
   * Renames the track
   * @param name The new name for the track
   */
  public rename(name: string): void {
    this._sendOscMessage(new StringMessage('/track/name', name));
    this._name = name;
  }

  /**
   * Select this track in Reaper.
   * Note: this selects the track in the Reaper project. To change which track the
   * device is focused on, use {@link DeviceState.selectTrack} instead.
   */
  public select(): void {
    this._sendOscMessage(new BooleanMessage('/track/select', true));
  }

  /** The device's currently focused FX on this track */
  public get selectedFx(): Fx {
    return this._selectedFx;
  }

  /**
   * Set the record monitoring mode
   * @param value The monitoring mode to set
   */
  public setMonitoringMode(value: RecordMonitoringMode): void {
    this._sendOscMessage(new IntegerMessage('/track/monitor', value));
  }

  /**
   * Sets the pan
   * @param value A floating-point value between -1 and 1, where -1 is 100% left and 1 is 100% right
   */
  public setPan(value: number): void {
    if (value < -1 || value > 1) {
      throw new RangeError('Must be between -1 and 1');
    }

    this._sendOscMessage(new FloatMessage('/track/pan', value));
    this._pan = value;
  }

  /**
   * Sets the pan 2
   * @param value A floating-point value between -1 and 1, where -1 is 100% left and 1 is 100% right
   */
  public setPan2(value: number): void {
    if (value < -1 || value > 1) {
      throw new RangeError('Must be between -1 and 1');
    }

    this._sendOscMessage(new FloatMessage('/track/pan2', value));
    this._pan2 = value;
  }

  /**
   * Sets the volume to a specific dB value.
   * @param value Value (in dB) to set the volume to. Valid range is -100 to 12.
   */
  public setVolumeDb(value: number): void {
    if (value < -100 || value > 12) {
      throw new RangeError('Must be between -100 and 12');
    }

    this._sendOscMessage(new FloatMessage('/track/volume/db', value));
    this._volumeDb = value;
  }

  /**
   * Sets the volume by moving the fader to a specific position
   * @param position A value for the fader position between 0 and 1, where 0 is all the way down and 1 is all the way up
   */
  public setVolumeFaderPosition(position: number): void {
    if (position < 0 || position > 1) {
      throw new RangeError('Must be between 0 and 1');
    }

    this._sendOscMessage(new FloatMessage('/track/volume', position));
    this._volumeFaderPosition = position;
  }

  /** Solo the track */
  public solo(): void {
    this._sendOscMessage(new BooleanMessage('/track/solo', true));
  }

  /** Toggle mute on/off */
  public toggleMute(): void {
    this._sendOscMessage(new ToggleMessage('/track/mute'));
  }

  /** Toggle record arm on/off */
  public toggleRecordArm(): void {
    this._sendOscMessage(new ToggleMessage('/track/recarm'));
  }

  /** Toggle solo on/off */
  public toggleSolo(): void {
    this._sendOscMessage(new ToggleMessage('/track/solo'));
  }

  /** Unmute the track */
  public unmute(): void {
    this._sendOscMessage(new BooleanMessage('/track/mute', false));
  }

  /** Unsolo the track */
  public unsolo(): void {
    this._sendOscMessage(new BooleanMessage('/track/solo', false));
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

  private initHandlers(): void {
    this._handlers.push(
      new StringMessageHandler('/track/name', value => (this._name = value)),
      new BooleanMessageHandler('/track/mute', value => (this._isMuted = value)),
      new BooleanMessageHandler('/track/solo', value => (this._isSoloed = value)),
      new BooleanMessageHandler('/track/recarm', value => (this._isRecordArmed = value)),
      new IntegerMessageHandler('/track/monitor', value => (this._recordMonitoring = value)),
      new BooleanMessageHandler('/track/select', value => (this._isSelected = value)),
      new FloatMessageHandler('/track/pan', value => (this._pan = value)),
      new FloatMessageHandler('/track/pan2', value => (this._pan2 = value)),
      new StringMessageHandler('/track/panmode', value => (this._panMode = value)),
      new FloatMessageHandler('/track/volume', value => (this._volumeFaderPosition = value)),
      new FloatMessageHandler('/track/volume/db', value => (this._volumeDb = value)),
      new FloatMessageHandler('/track/vu', value => (this._vu = value)),
      new FloatMessageHandler('/track/vu/L', value => (this._vuLeft = value)),
      new FloatMessageHandler('/track/vu/R', value => (this._vuRight = value)),
    );
  }
}
