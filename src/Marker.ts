/**
 * Contains classes for Reaper markers
 * @module
 */
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './Notify';
import {ReaperOscEvent} from './Client/Events';
import {SetMarkerName, SetMarkerTime, SetMarkerNumber, ReaperOscCommand} from './Client/Commands';

type SendCommand = (command: ReaperOscCommand) => void;

/** A marker in the current device marker bank */
@notifyOnPropertyChanged
export class Marker implements INotifyPropertyChanged {
  @notify<Marker>('name')
  private _name = '';

  /** The user-assigned marker number (as shown in Reaper's UI), or empty string if not yet populated */
  @notify<Marker>('number')
  private _number = '';

  @notify<Marker>('time')
  private _time = 0;

  /**
   * @param slotIndex The 1-based slot index within the current device marker bank
   * @param send A callback used to send typed commands to Reaper
   */
  constructor(public readonly slotIndex: number, private readonly _send: SendCommand) {}

  /** The marker's name */
  public get name(): string { return this._name; }

  /**
   * The user-assigned marker number (as shown in Reaper's UI).
   * This is a string because Reaper sends it as a string (e.g. "1", "2").
   * Empty string if not yet populated.
   */
  public get number(): string { return this._number; }

  /** The marker's time position in seconds */
  public get time(): number { return this._time; }

  /**
   * Handle a typed incoming event
   * @param event The event to handle
   */
  public handleEvent(event: ReaperOscEvent): void {
    switch (event.type) {
      case 'marker:name': if (event.slotIndex === this.slotIndex) this._name = event.name; break;
      case 'marker:number': if (event.slotIndex === this.slotIndex) this._number = event.number; break;
      case 'marker:time': if (event.slotIndex === this.slotIndex) this._time = event.time; break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onPropertyChanged(property: string, callback: () => void): () => void {
    throw new Error('not implemented');
  }

  /**
   * Rename this marker. Uses write-by-ID: the user-assigned marker number from {@link number}.
   * @param name The new name for the marker
   */
  public rename(name: string): void {
    this._send(SetMarkerName(parseInt(this._number), name));
  }

  /**
   * Move this marker to a new time position. Uses write-by-ID.
   * Note: moving a marker may change its bank slot index on the next sync.
   * @param time The new time position in seconds
   */
  public setTime(time: number): void {
    this._send(SetMarkerTime(parseInt(this._number), time));
  }

  /**
   * Change the user-assigned number of this marker. Uses write-by-ID.
   * @param number The new user-assigned marker number
   */
  public setNumber(number: number): void {
    this._send(SetMarkerNumber(parseInt(this._number), number));
  }
}

/** The most recently passed marker during playback */
@notifyOnPropertyChanged
export class LastMarker implements INotifyPropertyChanged {
  @notify<LastMarker>('name')
  private _name = '';

  @notify<LastMarker>('number')
  private _number = '';

  @notify<LastMarker>('time')
  private _time = 0;

  /** The marker's name */
  public get name(): string { return this._name; }

  /**
   * The user-assigned marker number (as shown in Reaper's UI).
   * Empty string if no marker has been passed yet.
   */
  public get number(): string { return this._number; }

  /** The marker's time position in seconds */
  public get time(): number { return this._time; }

  /**
   * Handle a typed incoming event
   * @param event The event to handle
   */
  public handleEvent(event: ReaperOscEvent): void {
    switch (event.type) {
      case 'lastMarker:name': this._name = event.name; break;
      case 'lastMarker:number': this._number = event.number; break;
      case 'lastMarker:time': this._time = event.time; break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onPropertyChanged(property: string, callback: () => void): () => void {
    throw new Error('not implemented');
  }
}
