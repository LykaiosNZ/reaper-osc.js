/**
 * Contains classes for track send routing controls
 * @module
 */
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './Notify';
import {ReaperOscEvent} from './Client/Events';
import {SetTrackSendVolume, SetTrackSendPan, SetSelectedTrackSendVolume, SetSelectedTrackSendPan, ReaperOscCommand} from './Client/Commands';

type SendCommand = (command: ReaperOscCommand) => void;

/** A send from a specific track to another destination */
@notifyOnPropertyChanged
export class TrackSend implements INotifyPropertyChanged {
  @notify<TrackSend>('name')
  private _name = '';

  @notify<TrackSend>('volume')
  private _volume = 0;

  @notify<TrackSend>('volumeStr')
  private _volumeStr = '';

  @notify<TrackSend>('pan')
  private _pan = 0;

  @notify<TrackSend>('panStr')
  private _panStr = '';

  private readonly _send: SendCommand;

  constructor(
    public readonly trackNumber: number,
    public readonly sendNumber: number,
    send: SendCommand,
  ) {
    this._send = send;
  }

  /**
   * Handle a typed incoming event
   * @param event The event to handle
   */
  public handleEvent(event: ReaperOscEvent): void {
    switch (event.type) {
      case 'track:send:name':
        if (event.trackNumber === this.trackNumber && event.sendNumber === this.sendNumber) this._name = event.name;
        break;
      case 'track:send:volume':
        if (event.trackNumber === this.trackNumber && event.sendNumber === this.sendNumber) this._volume = event.volume;
        break;
      case 'track:send:volumeStr':
        if (event.trackNumber === this.trackNumber && event.sendNumber === this.sendNumber) this._volumeStr = event.volumeStr;
        break;
      case 'track:send:pan':
        if (event.trackNumber === this.trackNumber && event.sendNumber === this.sendNumber) this._pan = event.pan;
        break;
      case 'track:send:panStr':
        if (event.trackNumber === this.trackNumber && event.sendNumber === this.sendNumber) this._panStr = event.panStr;
        break;
    }
  }

  /** The destination track name */
  public get name(): string {
    return this._name;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onPropertyChanged(property: string, callback: () => void): () => void {
    throw new Error('not implemented');
  }

  /** A floating-point value between -1 and 1 that indicates the pan position */
  public get pan(): number {
    return this._pan;
  }

  /** Human-readable pan position string (e.g. "50%R") */
  public get panStr(): string {
    return this._panStr;
  }

  /**
   * Sets the pan
   * @param value A floating-point value between -1 and 1, where -1 is 100% left and 1 is 100% right
   */
  public setPan(value: number): void {
    if (value < -1 || value > 1) {
      throw new RangeError('Must be between -1 and 1');
    }
    this._send(SetTrackSendPan(this.trackNumber, this.sendNumber, value));
    this._pan = value;
  }

  /**
   * Sets the send volume fader position
   * @param value A floating-point value between 0 and 1, where 0 is silent and 1 is unity (0 dB)
   */
  public setVolume(value: number): void {
    if (value < 0 || value > 1) {
      throw new RangeError('Must be between 0 and 1');
    }
    this._send(SetTrackSendVolume(this.trackNumber, this.sendNumber, value));
    this._volume = value;
  }

  /** A floating-point value between 0 and 1 that indicates the fader position */
  public get volume(): number {
    return this._volume;
  }

  /** Human-readable volume string (e.g. "0.00 dB") */
  public get volumeStr(): string {
    return this._volumeStr;
  }
}

/** A send from the OSC device's currently selected track */
@notifyOnPropertyChanged
export class SelectedTrackSend implements INotifyPropertyChanged {
  @notify<SelectedTrackSend>('name')
  private _name = '';

  @notify<SelectedTrackSend>('volume')
  private _volume = 0;

  @notify<SelectedTrackSend>('volumeStr')
  private _volumeStr = '';

  @notify<SelectedTrackSend>('pan')
  private _pan = 0;

  @notify<SelectedTrackSend>('panStr')
  private _panStr = '';

  private readonly _send: SendCommand;

  constructor(
    public readonly sendNumber: number,
    send: SendCommand,
  ) {
    this._send = send;
  }

  /**
   * Handle a typed incoming event
   * @param event The event to handle
   */
  public handleEvent(event: ReaperOscEvent): void {
    switch (event.type) {
      case 'selectedTrack:send:name':
        if (event.sendNumber === this.sendNumber) this._name = event.name;
        break;
      case 'selectedTrack:send:volume':
        if (event.sendNumber === this.sendNumber) this._volume = event.volume;
        break;
      case 'selectedTrack:send:volumeStr':
        if (event.sendNumber === this.sendNumber) this._volumeStr = event.volumeStr;
        break;
      case 'selectedTrack:send:pan':
        if (event.sendNumber === this.sendNumber) this._pan = event.pan;
        break;
      case 'selectedTrack:send:panStr':
        if (event.sendNumber === this.sendNumber) this._panStr = event.panStr;
        break;
    }
  }

  /** The destination track name */
  public get name(): string {
    return this._name;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onPropertyChanged(property: string, callback: () => void): () => void {
    throw new Error('not implemented');
  }

  /** A floating-point value between -1 and 1 that indicates the pan position */
  public get pan(): number {
    return this._pan;
  }

  /** Human-readable pan position string (e.g. "50%R") */
  public get panStr(): string {
    return this._panStr;
  }

  /**
   * Sets the pan
   * @param value A floating-point value between -1 and 1, where -1 is 100% left and 1 is 100% right
   */
  public setPan(value: number): void {
    if (value < -1 || value > 1) {
      throw new RangeError('Must be between -1 and 1');
    }
    this._send(SetSelectedTrackSendPan(this.sendNumber, value));
    this._pan = value;
  }

  /**
   * Sets the send volume fader position
   * @param value A floating-point value between 0 and 1, where 0 is silent and 1 is unity (0 dB)
   */
  public setVolume(value: number): void {
    if (value < 0 || value > 1) {
      throw new RangeError('Must be between 0 and 1');
    }
    this._send(SetSelectedTrackSendVolume(this.sendNumber, value));
    this._volume = value;
  }

  /** A floating-point value between 0 and 1 that indicates the fader position */
  public get volume(): number {
    return this._volume;
  }

  /** Human-readable volume string (e.g. "0.00 dB") */
  public get volumeStr(): string {
    return this._volumeStr;
  }
}
