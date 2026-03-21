/**
 * Contains classes for controlling FX in Reaper
 * @module
 */
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './Notify';
import {ReaperOscEvent, SelectedTrackFxBypassEvent, SelectedTrackFxNameChanged, SelectedTrackFxOpenUiEvent, SelectedTrackFxPresetChanged, TrackFxBypassEvent, TrackFxNameChanged, TrackFxOpenUiEvent, TrackFxPresetChanged} from './Client/Events';
import {ReaperOscCommand, SetTrackFxBypass, SetTrackFxOpenUi, NextTrackFxPreset, PreviousTrackFxPreset, SetSelectedTrackFxBypass, SetSelectedTrackFxOpenUi, NextSelectedTrackFxPreset, PreviousSelectedTrackFxPreset, SetSelectedFxBypass, SetSelectedFxOpenUi, NextSelectedFxPreset, PreviousSelectedFxPreset} from './Client/Commands';

type SendCommand = (command: ReaperOscCommand) => void;

/**
 * A Reaper FX.
 *
 * @example
 * ```typescript
 * // Open an FX UI window
 * fx.openUi();
 * // Bypass the FX
 * fx.bypass();
 * ```
 */
// @notifyOnPropertyChanged cannot be applied to abstract classes; each concrete subclass applies it.
export abstract class Fx implements INotifyPropertyChanged {
  @notify<Fx>('isBypassed')
  protected _isBypassed = false;

  @notify<Fx>('isUiOpen')
  protected _isUiOpen = false;

  @notify<Fx>('name')
  protected _name: string;

  @notify<Fx>('preset')
  protected _preset = 'No preset';

  protected readonly _send: SendCommand;

  constructor(name: string, send: SendCommand) {
    this._send = send;
    this._name = name;
  }

  /** Bypass the FX */
  public abstract bypass(): void;

  /** Close the UI of the FX */
  public abstract closeUi(): void;

  /** Indicates whether the FX is bypassed */
  public get isBypassed(): boolean {
    return this._isBypassed;
  }

  /** Indicates whether the FX's UI is open */
  public get isUiOpen(): boolean {
    return this._isUiOpen;
  }

  /** The name of the FX */
  public get name(): string {
    return this._name;
  }

  /** Load the next FX preset */
  public abstract nextPreset(): void;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onPropertyChanged(property: string, callback: () => void): () => void {
    throw new Error('not implemented');
  }

  /** Open the UI of the FX */
  public abstract openUi(): void;

  /** The name of the current preset, if any */
  public get preset(): string {
    return this._preset;
  }

  /** Load the previous FX preset */
  public abstract previousPreset(): void;

  /** Unbypass the FX */
  public abstract unbypass(): void;

  /** Handle a typed incoming event */
  public abstract handleEvent(event: ReaperOscEvent): void;
}

/**
 * An FX on a {@link Track}
 */
@notifyOnPropertyChanged
export class TrackFx extends Fx {
  /**
   * @param trackNumber The number of the track the FX is on
   * @param fxNumber The FX number in the current bank
   * @param send A callback used to send typed commands to Reaper
   */
  constructor(public readonly trackNumber: number, public readonly fxNumber: number, send: SendCommand) {
    super(`Fx ${fxNumber}`, send);
  }

  public get oscAddress(): string {
    return `/track/${this.trackNumber}/fx/${this.fxNumber}`;
  }

  public handleEvent(event: ReaperOscEvent): void {
    switch (event.type) {
      case 'track:fx:name':
        if (this._matchesTrackFx(event)) this._name = event.name;
        break;
      case 'track:fx:bypass':
        if (this._matchesTrackFx(event)) this._isBypassed = event.bypassed;
        break;
      case 'track:fx:openUi':
        if (this._matchesTrackFx(event)) this._isUiOpen = event.open;
        break;
      case 'track:fx:preset':
        if (this._matchesTrackFx(event)) this._preset = event.preset;
        break;
    }
  }

  private _matchesTrackFx(event: TrackFxNameChanged | TrackFxBypassEvent | TrackFxOpenUiEvent | TrackFxPresetChanged): boolean {
    return event.trackNumber === this.trackNumber && event.fxNumber === this.fxNumber;
  }

  public bypass(): void { this._send(SetTrackFxBypass(this.trackNumber, this.fxNumber, true)); }
  public unbypass(): void { this._send(SetTrackFxBypass(this.trackNumber, this.fxNumber, false)); }
  public openUi(): void { this._send(SetTrackFxOpenUi(this.trackNumber, this.fxNumber, true)); }
  public closeUi(): void { this._send(SetTrackFxOpenUi(this.trackNumber, this.fxNumber, false)); }
  public nextPreset(): void { this._send(NextTrackFxPreset(this.trackNumber, this.fxNumber)); }
  public previousPreset(): void { this._send(PreviousTrackFxPreset(this.trackNumber, this.fxNumber)); }
}

/**
 * An FX slot on the OSC device's currently selected track (addressed via `/fx/N/`).
 */
@notifyOnPropertyChanged
export class SelectedTrackFxSlot extends Fx {
  /**
   * @param fxNumber The FX slot number in the device FX bank
   * @param send A callback used to send typed commands to Reaper
   */
  constructor(public readonly fxNumber: number, send: SendCommand) {
    super(`Fx ${fxNumber}`, send);
  }

  public handleEvent(event: ReaperOscEvent): void {
    switch (event.type) {
      case 'selectedTrack:fx:name':
        if (this._matchesFx(event)) this._name = event.name;
        break;
      case 'selectedTrack:fx:bypass':
        if (this._matchesFx(event)) this._isBypassed = event.bypassed;
        break;
      case 'selectedTrack:fx:openUi':
        if (this._matchesFx(event)) this._isUiOpen = event.open;
        break;
      case 'selectedTrack:fx:preset':
        if (this._matchesFx(event)) this._preset = event.preset;
        break;
    }
  }

  private _matchesFx(event: SelectedTrackFxNameChanged | SelectedTrackFxBypassEvent | SelectedTrackFxOpenUiEvent | SelectedTrackFxPresetChanged): boolean {
    return event.fxNumber === this.fxNumber;
  }

  public bypass(): void { this._send(SetSelectedTrackFxBypass(this.fxNumber, true)); }
  public unbypass(): void { this._send(SetSelectedTrackFxBypass(this.fxNumber, false)); }
  public openUi(): void { this._send(SetSelectedTrackFxOpenUi(this.fxNumber, true)); }
  public closeUi(): void { this._send(SetSelectedTrackFxOpenUi(this.fxNumber, false)); }
  public nextPreset(): void { this._send(NextSelectedTrackFxPreset(this.fxNumber)); }
  public previousPreset(): void { this._send(PreviousSelectedTrackFxPreset(this.fxNumber)); }
}

/**
 * The OSC device's currently focused FX (addressed via `/fx/` with no slot number).
 */
@notifyOnPropertyChanged
export class DeviceSelectedFx extends Fx {
  /**
   * @param send A callback used to send typed commands to Reaper
   */
  constructor(send: SendCommand) {
    super('Selected FX', send);
  }

  public handleEvent(event: ReaperOscEvent): void {
    switch (event.type) {
      case 'selectedFx:name': this._name = event.name; break;
      case 'selectedFx:bypass': this._isBypassed = event.bypassed; break;
      case 'selectedFx:openUi': this._isUiOpen = event.open; break;
      case 'selectedFx:preset': this._preset = event.preset; break;
    }
  }

  public bypass(): void { this._send(SetSelectedFxBypass(true)); }
  public unbypass(): void { this._send(SetSelectedFxBypass(false)); }
  public openUi(): void { this._send(SetSelectedFxOpenUi(true)); }
  public closeUi(): void { this._send(SetSelectedFxOpenUi(false)); }
  public nextPreset(): void { this._send(NextSelectedFxPreset()); }
  public previousPreset(): void { this._send(PreviousSelectedFxPreset()); }
}
