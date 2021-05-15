/** Contains classes for controlling tracks in Reaper
 * @module
 */

import {IEvent} from 'ste-events';
import {TrackFx} from './Fx';
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './notify/Notify';
import {BooleanMessageHandler, StringMessageHandler, IMessageHandler, IntegerMessageHandler, TrackFxMessageHandler} from './osc/Handlers';
import {BooleanMessage, IntegerMessage, ISendOscMessage, OscMessage, StringMessage, ToggleMessage} from './osc/Messages';

@notifyOnPropertyChanged
export class Track implements INotifyPropertyChanged<Track> {
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

  @notify<Track>('recordMonitoring')
  private _recordMonitoring: RecordMonitoringMode = RecordMonitoringMode.OFF;

  private readonly _fx: TrackFx[] = [];
  private readonly _handlers: IMessageHandler[] = [];
  private readonly _sendOscMessage: ISendOscMessage;

  constructor(public readonly trackNumber: number, numberOfFx: number, sendOscMessage: ISendOscMessage) {
    this._sendOscMessage = sendOscMessage;

    for (let i = 1; i < numberOfFx; i++) {
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

  public get onPropertyChanged(): IEvent<Track, string> {
    throw new Error('not implemented');
  }

  public get oscAddress(): string {
    return `/track/${this.trackNumber}`;
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
  select(): void {
    this._sendOscMessage(new BooleanMessage(this.oscAddress + '/select', true));
  }

  /**
   * Set the record monitoring mode
   * @param {RecordMonitorMode} value
   * */
  public setMonitoringMode(value: RecordMonitoringMode): void {
    this._sendOscMessage(new IntegerMessage(this.oscAddress + '/monitor', value));
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

  private initHandlers() {
    this._handlers.push(
      new StringMessageHandler(this.oscAddress + '/name', value => (this._name = value)),
      new BooleanMessageHandler(this.oscAddress + '/mute', value => (this._isMuted = value)),
      new BooleanMessageHandler(this.oscAddress + '/solo', value => (this._isSoloed = value)),
      new BooleanMessageHandler(this.oscAddress + '/recarm', value => (this._isRecordArmed = value)),
      new IntegerMessageHandler(this.oscAddress + '/monitor', value => (this._recordMonitoring = value)),
      new BooleanMessageHandler(this.oscAddress + '/select', value => (this._isSelected = value)),
      new TrackFxMessageHandler(fxNumber => this._fx[fxNumber]),
    );
  }
}

export enum RecordMonitoringMode {
  OFF = 0,
  ON = 1,
  AUTO = 2,
}
