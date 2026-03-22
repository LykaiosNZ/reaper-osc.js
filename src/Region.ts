/**
 * Contains classes for Reaper regions
 * @module
 */
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './Notify';
import {ReaperOscEvent} from './Client/Events';
import {SetRegionName, SetRegionTime, SetRegionLength, SetRegionNumber, ReaperOscCommand} from './Client/Commands';

type SendCommand = (command: ReaperOscCommand) => void;

/** A region in the current device region bank */
@notifyOnPropertyChanged
export class Region implements INotifyPropertyChanged {
  @notify<Region>('name')
  private _name = '';

  /** The user-assigned region number (as shown in Reaper's UI), or empty string if not yet populated */
  @notify<Region>('number')
  private _number = '';

  @notify<Region>('time')
  private _time = 0;

  @notify<Region>('length')
  private _length = 0;

  /**
   * @param slotIndex The 1-based slot index within the current device region bank
   * @param send A callback used to send typed commands to Reaper
   */
  constructor(public readonly slotIndex: number, private readonly _send: SendCommand) {}

  /** The region's name */
  public get name(): string { return this._name; }

  /**
   * The user-assigned region number (as shown in Reaper's UI).
   * This is a string because Reaper sends it as a string (e.g. "1", "2").
   * Empty string if not yet populated.
   */
  public get number(): string { return this._number; }

  /** The region's start time in seconds */
  public get time(): number { return this._time; }

  /** The region's length in seconds */
  public get length(): number { return this._length; }

  /**
   * Handle a typed incoming event
   * @param event The event to handle
   */
  public handleEvent(event: ReaperOscEvent): void {
    switch (event.type) {
      case 'region:name': if (event.slotIndex === this.slotIndex) this._name = event.name; break;
      case 'region:number': if (event.slotIndex === this.slotIndex) this._number = event.number; break;
      case 'region:time': if (event.slotIndex === this.slotIndex) this._time = event.time; break;
      case 'region:length': if (event.slotIndex === this.slotIndex) this._length = event.length; break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onPropertyChanged(property: string, callback: () => void): () => void {
    throw new Error('not implemented');
  }

  /**
   * Rename this region. Uses write-by-ID: the user-assigned region number from {@link number}.
   * @param name The new name for the region
   */
  public rename(name: string): void {
    this._send(SetRegionName(parseInt(this._number), name));
  }

  /**
   * Move this region to a new start time. Uses write-by-ID.
   * Note: moving a region may change its bank slot index on the next sync.
   * @param time The new start time in seconds
   */
  public setTime(time: number): void {
    this._send(SetRegionTime(parseInt(this._number), time));
  }

  /**
   * Set the length of this region. Uses write-by-ID.
   * @param length The new length in seconds
   */
  public setLength(length: number): void {
    this._send(SetRegionLength(parseInt(this._number), length));
  }

  /**
   * Change the user-assigned number of this region. Uses write-by-ID.
   * @param number The new user-assigned region number
   */
  public setNumber(number: number): void {
    this._send(SetRegionNumber(parseInt(this._number), number));
  }
}

/** The most recently entered region during playback (or the last one from the sync burst) */
@notifyOnPropertyChanged
export class LastRegion implements INotifyPropertyChanged {
  @notify<LastRegion>('name')
  private _name = '';

  @notify<LastRegion>('number')
  private _number = '';

  @notify<LastRegion>('time')
  private _time = 0;

  @notify<LastRegion>('length')
  private _length = 0;

  /** The region's name */
  public get name(): string { return this._name; }

  /**
   * The user-assigned region number (as shown in Reaper's UI).
   * Empty string if no region has been entered yet.
   */
  public get number(): string { return this._number; }

  /** The region's start time in seconds */
  public get time(): number { return this._time; }

  /** The region's length in seconds */
  public get length(): number { return this._length; }

  /**
   * Handle a typed incoming event
   * @param event The event to handle
   */
  public handleEvent(event: ReaperOscEvent): void {
    switch (event.type) {
      case 'lastRegion:name': this._name = event.name; break;
      case 'lastRegion:number': this._number = event.number; break;
      case 'lastRegion:time': this._time = event.time; break;
      case 'lastRegion:length': this._length = event.length; break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onPropertyChanged(property: string, callback: () => void): () => void {
    throw new Error('not implemented');
  }
}
