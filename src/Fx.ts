/**
 * Contains classes for controlling FX in Reaper
 * @module
 */
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './Notify';
import {BooleanMessageHandler, IMessageHandler, StringMessageHandler} from './Handlers';
import {BooleanMessage, ISendOscMessage, OscMessage} from './Messages';

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
@notifyOnPropertyChanged
export class Fx implements INotifyPropertyChanged {
  @notify<Fx>('isBypassed')
  private _isBypassed = false;

  @notify<Fx>('isUiOpen')
  private _isUiOpen = false;

  @notify<Fx>('name')
  private _name: string;

  @notify<Fx>('preset')
  private _preset = 'No preset';

  protected readonly _handlers: IMessageHandler[] = [
    new StringMessageHandler(this.oscAddress + '/name', value => (this._name = value)),
    new BooleanMessageHandler(this.oscAddress + '/bypass', value => (this._isBypassed = !value)), // Reaper sends 0/false when the track is bypassed
    new BooleanMessageHandler(this.oscAddress + '/openui', value => (this._isUiOpen = value)),
    new StringMessageHandler(this.oscAddress + '/preset', value => (this._preset = value)),
  ];

  protected readonly _sendOscMessage: ISendOscMessage;

  /**
   * @param name The FX name
   * @param oscAddress The OSC address of the FX
   * @param sendOscMessage A callback used to send OSC messages to Reaper
   */
  constructor(name: string, public readonly oscAddress: string, sendOscMessage: ISendOscMessage) {
    this._sendOscMessage = sendOscMessage;
    this._name = name;
  }

  /** Bypass the FX */
  bypass(): void {
    this._sendOscMessage(new BooleanMessage(this.oscAddress + '/bypass', false)); // false to bypass
  }

  /** Close the UI of the FX */
  closeUi(): void {
    this._sendOscMessage(new BooleanMessage(this.oscAddress + '/openui', false));
  }

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
  public nextPreset(): void {
    this._sendOscMessage(new OscMessage(this.oscAddress + '/preset+'));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onPropertyChanged(property: string, callback: () => void): void {
    throw new Error('not implemented');
  }

  /** Open the UI of the FX */
  public openUi(): void {
    this._sendOscMessage(new BooleanMessage(this.oscAddress + '/openui', true));
  }

  /** The name of the current preset, if any */
  public get preset(): string {
    return this._preset;
  }

  /** Load the previous FX preset */
  public previousPreset(): void {
    this._sendOscMessage(new OscMessage(this.oscAddress + '/preset-'));
  }

  /**
   *  Receive and handle an OSC message
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

  /** Unbypass the FX */
  public unbypass(): void {
    this._sendOscMessage(new BooleanMessage(this.oscAddress + '/bypass', true)); // true to unbypass
  }
}

/**
 * An FX on a {@link Track}
 */
export class TrackFx extends Fx {
  /**
   * @param trackNumber The number of the track the FX is on
   * @param fxNumber The FX number in the current bank
   * @param sendOscMessage A callback used to send OSC messages to Reaper
   */
  constructor(public readonly trackNumber: number, public readonly fxNumber: number, sendOscMessage: ISendOscMessage) {
    super(`Fx ${fxNumber}`, `/track/${trackNumber}/fx/${fxNumber}`, sendOscMessage);
  }
}
