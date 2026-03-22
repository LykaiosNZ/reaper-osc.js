/** Contains classes for controlling tracks in Reaper
 * @module
 */
import {TrackFx} from './Fx';
import {TrackSend} from './Send';
import {TrackReceive} from './Receive';
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './Notify';
import {ReaperOscEvent, RecordMonitoringMode} from './Client/Events';
import {SetTrackSelect, SetTrackMute, ToggleTrackMute, SetTrackSolo, ToggleTrackSolo, SetTrackRecordArm, ToggleTrackRecordArm, SetTrackName, SetTrackPan, SetTrackPan2, SetTrackVolume, SetTrackVolumeDb, SetTrackMonitoringMode, ReaperOscCommand} from './Client/Commands';

export {RecordMonitoringMode} from './Client/Events';

type SendCommand = (command: ReaperOscCommand) => void;

/** A Reaper track */
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
  private _name: string = 'Track' + this.trackNumber;

  @notify<Track>('pan')
  private _pan = 0;

  @notify<Track>('pan2')
  private _pan2 = 0;

  // TODO: Find out what the modes are - should this be an enum value?
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
  private readonly _sends: TrackSend[] = [];
  private readonly _receives: TrackReceive[] = [];
  private readonly _send: SendCommand;

  /**
   * @param trackNumber The track's number in the current bank
   * @param numberOfFx The number of FX per FX bank
   * @param numberOfSends The number of sends per track
   * @param numberOfReceives The number of receives per track
   * @param send A callback used to send typed commands to Reaper
   */
  constructor(public readonly trackNumber: number, numberOfFx: number, numberOfSends: number, numberOfReceives: number, send: SendCommand) {
    this._send = send;

    for (let i = 0; i < numberOfFx; i++) {
      this._fx[i] = new TrackFx(trackNumber, i + 1, send);
    }

    for (let i = 0; i < numberOfSends; i++) {
      this._sends[i] = new TrackSend(trackNumber, i + 1, send);
    }

    for (let i = 0; i < numberOfReceives; i++) {
      this._receives[i] = new TrackReceive(trackNumber, i + 1, send);
    }
  }

  /**
   * Deselect the track in the Reaper project.
   * Note: this affects Reaper's project-level track selection (visible in the UI).
   * To change which track the OSC device is focused on, use {@link DeviceState.selectTrack} instead.
   */
  public deselect(): void {
    this._send(SetTrackSelect(this.trackNumber, false));
  }

  /** The track's current FX bank */
  public get fx(): TrackFx[] {
    return this._fx;
  }

  /** The track's sends */
  public get sends(): ReadonlyArray<TrackSend> {
    return this._sends;
  }

  /** The track's receives */
  public get receives(): ReadonlyArray<TrackReceive> {
    return this._receives;
  }

  /**
   * Handle a typed incoming event
   * @param event The event to handle
   */
  public handleEvent(event: ReaperOscEvent): void {
    switch (event.type) {
      case 'track:name': if (event.trackNumber === this.trackNumber) this._name = event.name; break;
      case 'track:mute': if (event.trackNumber === this.trackNumber) this._isMuted = event.muted; break;
      case 'track:solo': if (event.trackNumber === this.trackNumber) this._isSoloed = event.soloed; break;
      case 'track:recordArm': if (event.trackNumber === this.trackNumber) this._isRecordArmed = event.armed; break;
      case 'track:monitoringMode': if (event.trackNumber === this.trackNumber) this._recordMonitoring = event.mode; break;
      case 'track:select': if (event.trackNumber === this.trackNumber) this._isSelected = event.selected; break;
      case 'track:pan': if (event.trackNumber === this.trackNumber) this._pan = event.pan; break;
      case 'track:pan2': if (event.trackNumber === this.trackNumber) this._pan2 = event.pan2; break;
      case 'track:panMode': if (event.trackNumber === this.trackNumber) this._panMode = event.panMode; break;
      case 'track:volume': if (event.trackNumber === this.trackNumber) this._volumeFaderPosition = event.volume; break;
      case 'track:volumeDb': if (event.trackNumber === this.trackNumber) this._volumeDb = event.volumeDb; break;
      case 'track:vu': if (event.trackNumber === this.trackNumber) this._vu = event.vu; break;
      case 'track:vuLeft': if (event.trackNumber === this.trackNumber) this._vuLeft = event.vuLeft; break;
      case 'track:vuRight': if (event.trackNumber === this.trackNumber) this._vuRight = event.vuRight; break;
      case 'track:fx:name':
      case 'track:fx:bypass':
      case 'track:fx:openUi':
      case 'track:fx:preset':
        if (event.trackNumber === this.trackNumber) {
          const fx = this._fx[event.fxNumber - 1];
          if (fx) fx.handleEvent(event);
        }
        break;
      case 'track:send:name':
      case 'track:send:volume':
      case 'track:send:volumeStr':
      case 'track:send:pan':
      case 'track:send:panStr':
        if (event.trackNumber === this.trackNumber) {
          const send = this._sends[event.sendNumber - 1];
          if (send) send.handleEvent(event);
        }
        break;
      case 'track:recv:name':
      case 'track:recv:volume':
      case 'track:recv:volumeStr':
      case 'track:recv:pan':
      case 'track:recv:panStr':
        if (event.trackNumber === this.trackNumber) {
          const receive = this._receives[event.receiveNumber - 1];
          if (receive) receive.handleEvent(event);
        }
        break;
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
   * Indicates whether the track is selected in the Reaper project.
   * Note: this reflects Reaper's project-level selection, not the OSC device's focused track.
   * @see {@link DeviceState.selectTrack} and {@link Reaper.selectedTrack}
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
    this._send(SetTrackMute(this.trackNumber, true));
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
    this._send(SetTrackRecordArm(this.trackNumber, true));
  }

  /** Indicates the record monitoring mode */
  public get recordMonitoring(): RecordMonitoringMode {
    return this._recordMonitoring;
  }

  /** Disarm track recording */
  public recordDisarm(): void {
    this._send(SetTrackRecordArm(this.trackNumber, false));
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
    this._send(SetTrackName(this.trackNumber, name));

    // Reaper will not send a name message in response
    this._name = name;
  }

  /**
   * Select the track in the Reaper project.
   * Note: this affects Reaper's project-level track selection (visible in the UI).
   * To change which track the OSC device is focused on, use {@link DeviceState.selectTrack} instead.
   */
  public select(): void {
    this._send(SetTrackSelect(this.trackNumber, true));
  }

  /**
   * Set the record monitoring mode
   * @param {RecordMonitorMode} value
   * */
  public setMonitoringMode(value: RecordMonitoringMode): void {
    this._send(SetTrackMonitoringMode(this.trackNumber, value));
  }

  /**
   * Sets the pan
   * @param value A floating-point value between -1 and 1, where -1 is 100% left and 1 is 100% right
   */
  public setPan(value: number): void {
    if (value < -1 || value > 1) {
      throw new RangeError('Must be between -1 and 1');
    }

    this._send(SetTrackPan(this.trackNumber, value));

    // Reaper won't send a pan message, but will send pan2 when pan changes
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

    this._send(SetTrackPan2(this.trackNumber, value));

    // Reaper won't send a pan2 message, but will send pan when pan2 changes
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

    this._send(SetTrackVolumeDb(this.trackNumber, value));

    // Reaper does not send OSC message to update this, but does send other volume messages
    this._volumeDb = value;
  }

  /** Sets the volume by moving the fader to a specific position
   * @param position A value for the fader position between 0 and 1, where 0 is all the way down and 1 is all the way up
   */
  public setVolumeFaderPosition(position: number): void {
    if (position < 0 || position > 1) {
      throw new RangeError('Must be between 0 and 1');
    }

    this._send(SetTrackVolume(this.trackNumber, position));

    // Reaper does not send OSC message to update this, but does send other volume messages
    this._volumeFaderPosition = position;
  }

  /** Solo the track */
  public solo(): void {
    this._send(SetTrackSolo(this.trackNumber, true));
  }

  /** Toggle mute on/off */
  public toggleMute(): void {
    this._send(ToggleTrackMute(this.trackNumber));
  }

  /** Toggle record arm on/off */
  public toggleRecordArm(): void {
    this._send(ToggleTrackRecordArm(this.trackNumber));
  }

  /** Toggle solo on/off */
  public toggleSolo(): void {
    this._send(ToggleTrackSolo(this.trackNumber));
  }

  /** Unmute the track */
  public unmute(): void {
    this._send(SetTrackMute(this.trackNumber, false));
  }

  /** Unsolo the track */
  public unsolo(): void {
    this._send(SetTrackSolo(this.trackNumber, false));
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

