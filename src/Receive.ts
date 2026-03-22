/**
 * Contains classes for track receive routing controls
 * @module
 */
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './Notify';
import {ReaperOscEvent} from './Client/Events';
import {SetTrackReceiveVolume, SetTrackReceivePan, SetSelectedTrackReceiveVolume, SetSelectedTrackReceivePan, ReaperOscCommand} from './Client/Commands';

type SendCommand = (command: ReaperOscCommand) => void;

/** A receive on a specific track from another source */
@notifyOnPropertyChanged
export class TrackReceive implements INotifyPropertyChanged {
  @notify<TrackReceive>('name')
  private _name = '';

  @notify<TrackReceive>('volume')
  private _volume = 0;

  @notify<TrackReceive>('volumeStr')
  private _volumeStr = '';

  @notify<TrackReceive>('pan')
  private _pan = 0;

  @notify<TrackReceive>('panStr')
  private _panStr = '';

  private readonly _send: SendCommand;

  constructor(
    public readonly trackNumber: number,
    public readonly receiveNumber: number,
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
      case 'track:recv:name':
        if (event.trackNumber === this.trackNumber && event.receiveNumber === this.receiveNumber) this._name = event.name;
        break;
      case 'track:recv:volume':
        if (event.trackNumber === this.trackNumber && event.receiveNumber === this.receiveNumber) this._volume = event.volume;
        break;
      case 'track:recv:volumeStr':
        if (event.trackNumber === this.trackNumber && event.receiveNumber === this.receiveNumber) this._volumeStr = event.volumeStr;
        break;
      case 'track:recv:pan':
        if (event.trackNumber === this.trackNumber && event.receiveNumber === this.receiveNumber) this._pan = event.pan;
        break;
      case 'track:recv:panStr':
        if (event.trackNumber === this.trackNumber && event.receiveNumber === this.receiveNumber) this._panStr = event.panStr;
        break;
    }
  }

  /** The source track name */
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
    this._send(SetTrackReceivePan(this.trackNumber, this.receiveNumber, value));
    this._pan = value;
  }

  /**
   * Sets the receive volume fader position
   * @param value A floating-point value between 0 and 1, where 0 is silent and 1 is unity (0 dB)
   */
  public setVolume(value: number): void {
    if (value < 0 || value > 1) {
      throw new RangeError('Must be between 0 and 1');
    }
    this._send(SetTrackReceiveVolume(this.trackNumber, this.receiveNumber, value));
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

/** A receive on the OSC device's currently selected track */
@notifyOnPropertyChanged
export class SelectedTrackReceive implements INotifyPropertyChanged {
  @notify<SelectedTrackReceive>('name')
  private _name = '';

  @notify<SelectedTrackReceive>('volume')
  private _volume = 0;

  @notify<SelectedTrackReceive>('volumeStr')
  private _volumeStr = '';

  @notify<SelectedTrackReceive>('pan')
  private _pan = 0;

  @notify<SelectedTrackReceive>('panStr')
  private _panStr = '';

  private readonly _send: SendCommand;

  constructor(
    public readonly receiveNumber: number,
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
      case 'selectedTrack:recv:name':
        if (event.receiveNumber === this.receiveNumber) this._name = event.name;
        break;
      case 'selectedTrack:recv:volume':
        if (event.receiveNumber === this.receiveNumber) this._volume = event.volume;
        break;
      case 'selectedTrack:recv:volumeStr':
        if (event.receiveNumber === this.receiveNumber) this._volumeStr = event.volumeStr;
        break;
      case 'selectedTrack:recv:pan':
        if (event.receiveNumber === this.receiveNumber) this._pan = event.pan;
        break;
      case 'selectedTrack:recv:panStr':
        if (event.receiveNumber === this.receiveNumber) this._panStr = event.panStr;
        break;
    }
  }

  /** The source track name */
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
    this._send(SetSelectedTrackReceivePan(this.receiveNumber, value));
    this._pan = value;
  }

  /**
   * Sets the receive volume fader position
   * @param value A floating-point value between 0 and 1, where 0 is silent and 1 is unity (0 dB)
   */
  public setVolume(value: number): void {
    if (value < 0 || value > 1) {
      throw new RangeError('Must be between 0 and 1');
    }
    this._send(SetSelectedTrackReceiveVolume(this.receiveNumber, value));
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
