/**
 * Contains classes for controlling FX in Reaper
 * @module
 */
import {IEvent} from 'ste-events';
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './notify/Notify';
import {BooleanMessageHandler, IMessageHandler, StringMessageHandler} from './osc/Handlers';
import {BooleanMessage, ISendOscMessage, OscMessage} from './osc/Messages';

/**
 * A Reaper FX.
 * 
 * @example
 * // Open an FX UI window
 * fx.openUi();
 * // Bypass the FX
 * fx.bypass();
 * 
 * @decorator {@link notifyOnPropertyChanged}
 */
@notifyOnPropertyChanged
export class Fx implements INotifyPropertyChanged<Fx> {
  @notify<Fx>('isBypassed')
  private _isBypassed = false;

  @notify<Fx>('isUiOpen')
  private _isUiOpen = false;

  @notify<Fx>('name')
  private _name: string;

  protected readonly _handlers: IMessageHandler[] = [
    new StringMessageHandler(this.oscAddress + '/name', value => (this._name = value)),
    new BooleanMessageHandler(this.oscAddress + '/bypass', value => (this._isBypassed = !value)), // Reaper sends 0/false when the track is bypassed
    new BooleanMessageHandler(this.oscAddress + '/openui', value => (this._isUiOpen = value)),
  ];

  protected readonly _sendOscMessage: ISendOscMessage;

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
    this._sendOscMessage(new BooleanMessage(this.oscAddress + '/openUi', false));
  }

  public get isBypassed(): boolean {
    return this._isBypassed;
  }

  public get isUiOpen(): boolean {
    return this._isUiOpen;
  }

  public get name(): string {
    return this._name;
  }

  /** Open the UI of the FX */
  openUi(): void {
    this._sendOscMessage(new BooleanMessage(this.oscAddress + '/openUi', true));
  }

  public receive(message: OscMessage): void {
    this._handlers.forEach(handler => {
      handler.handle(message);
    });
  }

  /** Unbypass the FX */
  unbypass(): void {
    this._sendOscMessage(new BooleanMessage(this.oscAddress + '/bypass', true)); // true to unbypass
  }

  public get onPropertyChanged(): IEvent<Fx, string> {
    throw new Error('not implemented');
  }
}

/**
 * An FX on a {@link Track}
 */
export class TrackFx extends Fx {
  constructor(public readonly trackNumber: number, public readonly fxNumber: number, sendOscMessage: ISendOscMessage) {
    super(`Fx ${fxNumber}`, `\\track\\${trackNumber}\\fx\\${fxNumber}`, sendOscMessage);
  }
}
