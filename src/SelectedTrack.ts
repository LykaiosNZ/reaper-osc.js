/**
 * Contains classes for the OSC device's currently selected track
 * @module
 */
import {DeviceSelectedFx, Fx, SelectedTrackFxSlot} from './Fx';
import {SelectedTrackSend} from './Send';
import {SelectedTrackReceive} from './Receive';
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './Notify';
import {ReaperOscEvent, RecordMonitoringMode} from './Client/Events';
import {SetSelectedTrackSelect, SetSelectedTrackMute, ToggleSelectedTrackMute, SetSelectedTrackSolo, ToggleSelectedTrackSolo, SetSelectedTrackRecordArm, ToggleSelectedTrackRecordArm, SetSelectedTrackName, SetSelectedTrackPan, SetSelectedTrackPan2, SetSelectedTrackVolume, SetSelectedTrackVolumeDb, SetSelectedTrackMonitoringMode, ReaperOscCommand} from './Client/Commands';

type SendCommand = (command: ReaperOscCommand) => void;

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

  private readonly _fx: SelectedTrackFxSlot[] = [];
  private readonly _selectedFx: DeviceSelectedFx;
  private readonly _sends: SelectedTrackSend[] = [];
  private readonly _receives: SelectedTrackReceive[] = [];
  private readonly _send: SendCommand;

  /**
   * @param numberOfFx The number of FX slots in the device FX bank
   * @param numberOfSends The number of sends in the device send bank
   * @param numberOfReceives The number of receives in the device receive bank
   * @param send A callback used to send typed commands to Reaper
   */
  constructor(numberOfFx: number, numberOfSends: number, numberOfReceives: number, send: SendCommand) {
    this._send = send;

    for (let i = 0; i < numberOfFx; i++) {
      this._fx[i] = new SelectedTrackFxSlot(i + 1, send);
    }

    this._selectedFx = new DeviceSelectedFx(send);

    for (let i = 0; i < numberOfSends; i++) {
      this._sends[i] = new SelectedTrackSend(i + 1, send);
    }

    for (let i = 0; i < numberOfReceives; i++) {
      this._receives[i] = new SelectedTrackReceive(i + 1, send);
    }
  }

  /** Deselect this track in Reaper */
  public deselect(): void {
    this._send(SetSelectedTrackSelect(false));
  }

  /** The FX bank for this track */
  public get fx(): ReadonlyArray<Fx> {
    return this._fx;
  }

  /** The sends for this track */
  public get sends(): ReadonlyArray<SelectedTrackSend> {
    return this._sends;
  }

  /** The receives for this track */
  public get receives(): ReadonlyArray<SelectedTrackReceive> {
    return this._receives;
  }

  /**
   * Handle a typed incoming event
   * @param event The event to handle
   */
  public handleEvent(event: ReaperOscEvent): void {
    switch (event.type) {
      case 'selectedTrack:name': this._name = event.name; break;
      case 'selectedTrack:mute': this._isMuted = event.muted; break;
      case 'selectedTrack:solo': this._isSoloed = event.soloed; break;
      case 'selectedTrack:recordArm': this._isRecordArmed = event.armed; break;
      case 'selectedTrack:monitoringMode': this._recordMonitoring = event.mode; break;
      case 'selectedTrack:select': this._isSelected = event.selected; break;
      case 'selectedTrack:pan': this._pan = event.pan; break;
      case 'selectedTrack:pan2': this._pan2 = event.pan2; break;
      case 'selectedTrack:panMode': this._panMode = event.panMode; break;
      case 'selectedTrack:volume': this._volumeFaderPosition = event.volume; break;
      case 'selectedTrack:volumeDb': this._volumeDb = event.volumeDb; break;
      case 'selectedTrack:vu': this._vu = event.vu; break;
      case 'selectedTrack:vuLeft': this._vuLeft = event.vuLeft; break;
      case 'selectedTrack:vuRight': this._vuRight = event.vuRight; break;
      case 'selectedTrack:fx:name':
      case 'selectedTrack:fx:bypass':
      case 'selectedTrack:fx:openUi':
      case 'selectedTrack:fx:preset': {
        const slot = this._fx[event.fxNumber - 1];
        if (slot) slot.handleEvent(event);
        break;
      }
      case 'selectedFx:name':
      case 'selectedFx:bypass':
      case 'selectedFx:openUi':
      case 'selectedFx:preset':
        this._selectedFx.handleEvent(event);
        break;
      case 'selectedTrack:send:name':
      case 'selectedTrack:send:volume':
      case 'selectedTrack:send:volumeStr':
      case 'selectedTrack:send:pan':
      case 'selectedTrack:send:panStr': {
        const send = this._sends[event.sendNumber - 1];
        if (send) send.handleEvent(event);
        break;
      }
      case 'selectedTrack:recv:name':
      case 'selectedTrack:recv:volume':
      case 'selectedTrack:recv:volumeStr':
      case 'selectedTrack:recv:pan':
      case 'selectedTrack:recv:panStr': {
        const receive = this._receives[event.receiveNumber - 1];
        if (receive) receive.handleEvent(event);
        break;
      }
    }
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
    this._send(SetSelectedTrackMute(true));
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

  /** Arm the track for recording */
  public recordArm(): void {
    this._send(SetSelectedTrackRecordArm(true));
  }

  /** Indicates the record monitoring mode */
  public get recordMonitoring(): RecordMonitoringMode {
    return this._recordMonitoring;
  }

  /** Disarm track recording */
  public recordDisarm(): void {
    this._send(SetSelectedTrackRecordArm(false));
  }

  /**
   * Renames the track
   * @param name The new name for the track
   */
  public rename(name: string): void {
    this._send(SetSelectedTrackName(name));
    this._name = name;
  }

  /**
   * Select this track in Reaper.
   * Note: this selects the track in the Reaper project. To change which track the
   * device is focused on, use {@link DeviceState.selectTrack} instead.
   */
  public select(): void {
    this._send(SetSelectedTrackSelect(true));
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
    this._send(SetSelectedTrackMonitoringMode(value));
  }

  /**
   * Sets the pan
   * @param value A floating-point value between -1 and 1, where -1 is 100% left and 1 is 100% right
   */
  public setPan(value: number): void {
    if (value < -1 || value > 1) {
      throw new RangeError('Must be between -1 and 1');
    }

    this._send(SetSelectedTrackPan(value));
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

    this._send(SetSelectedTrackPan2(value));
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

    this._send(SetSelectedTrackVolumeDb(value));
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

    this._send(SetSelectedTrackVolume(position));
    this._volumeFaderPosition = position;
  }

  /** Solo the track */
  public solo(): void {
    this._send(SetSelectedTrackSolo(true));
  }

  /** Toggle mute on/off */
  public toggleMute(): void {
    this._send(ToggleSelectedTrackMute());
  }

  /** Toggle record arm on/off */
  public toggleRecordArm(): void {
    this._send(ToggleSelectedTrackRecordArm());
  }

  /** Toggle solo on/off */
  public toggleSolo(): void {
    this._send(ToggleSelectedTrackSolo());
  }

  /** Unmute the track */
  public unmute(): void {
    this._send(SetSelectedTrackMute(false));
  }

  /** Unsolo the track */
  public unsolo(): void {
    this._send(SetSelectedTrackSolo(false));
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
}
