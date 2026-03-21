/**
 * Contains classes for controlling Reaper's OSC device state
 * @module
 */
import {ISendOscMessage, OscMessage} from './Messages';

/** Controls the OSC device's navigation state within Reaper */
export class DeviceState {
  constructor(private readonly _sendOscMessage: ISendOscMessage) {}

  // --- Track ---

  /**
   * Set the device's focused track to a specific bank-relative slot.
   * Reaper will respond with a full state sync burst for the selected track.
   * @param index 1-based track index within the current device track bank
   */
  public selectTrack(index: number): void {
    this._sendOscMessage(new OscMessage(`/device/track/select/${index}`));
  }

  /** Move the device's focused track to the next track in the bank */
  public nextTrack(): void {
    this._sendOscMessage(new OscMessage('/device/track/+'));
  }

  /** Move the device's focused track to the previous track in the bank */
  public prevTrack(): void {
    this._sendOscMessage(new OscMessage('/device/track/-'));
  }

  // --- Track bank ---

  /**
   * Set the active device track bank.
   * e.g. bank 2 with a bank size of 8 maps `/track/1/` through `/track/8/` to absolute tracks 9-16.
   * @param index 1-based bank index
   */
  public selectTrackBank(index: number): void {
    this._sendOscMessage(new OscMessage(`/device/track/bank/select/${index}`));
  }

  /** Move to the next track bank */
  public nextTrackBank(): void {
    this._sendOscMessage(new OscMessage('/device/track/bank/+'));
  }

  /** Move to the previous track bank */
  public prevTrackBank(): void {
    this._sendOscMessage(new OscMessage('/device/track/bank/-'));
  }

  // --- FX ---

  /**
   * Set the device's focused FX slot on the currently selected track.
   * @param index 1-based FX index within the current device FX bank
   */
  public selectFx(index: number): void {
    this._sendOscMessage(new OscMessage(`/device/fx/select/${index}`));
  }

  /** Move the device's focused FX to the next slot */
  public nextFx(): void {
    this._sendOscMessage(new OscMessage('/device/fx/+'));
  }

  /** Move the device's focused FX to the previous slot */
  public prevFx(): void {
    this._sendOscMessage(new OscMessage('/device/fx/-'));
  }

  // --- FX param bank ---

  /**
   * Set the active FX parameter bank.
   * @param index 1-based bank index
   */
  public selectFxParamBank(index: number): void {
    this._sendOscMessage(new OscMessage(`/device/fxparam/bank/select/${index}`));
  }

  /** Move to the next FX parameter bank */
  public nextFxParamBank(): void {
    this._sendOscMessage(new OscMessage('/device/fxparam/bank/+'));
  }

  /** Move to the previous FX parameter bank */
  public prevFxParamBank(): void {
    this._sendOscMessage(new OscMessage('/device/fxparam/bank/-'));
  }

  // --- FX instrument param bank ---

  /**
   * Set the active FX instrument parameter bank.
   * @param index 1-based bank index
   */
  public selectFxInstParamBank(index: number): void {
    this._sendOscMessage(new OscMessage(`/device/fxinstparam/bank/select/${index}`));
  }

  /** Move to the next FX instrument parameter bank */
  public nextFxInstParamBank(): void {
    this._sendOscMessage(new OscMessage('/device/fxinstparam/bank/+'));
  }

  /** Move to the previous FX instrument parameter bank */
  public prevFxInstParamBank(): void {
    this._sendOscMessage(new OscMessage('/device/fxinstparam/bank/-'));
  }

  // --- Marker bank ---

  /**
   * Set the active marker bank.
   * @param index 1-based bank index
   */
  public selectMarkerBank(index: number): void {
    this._sendOscMessage(new OscMessage(`/device/marker/bank/select/${index}`));
  }

  /** Move to the next marker bank */
  public nextMarkerBank(): void {
    this._sendOscMessage(new OscMessage('/device/marker/bank/+'));
  }

  /** Move to the previous marker bank */
  public prevMarkerBank(): void {
    this._sendOscMessage(new OscMessage('/device/marker/bank/-'));
  }

  // --- Region bank ---

  /**
   * Set the active region bank.
   * @param index 1-based bank index
   */
  public selectRegionBank(index: number): void {
    this._sendOscMessage(new OscMessage(`/device/region/bank/select/${index}`));
  }

  /** Move to the next region bank */
  public nextRegionBank(): void {
    this._sendOscMessage(new OscMessage('/device/region/bank/+'));
  }

  /** Move to the previous region bank */
  public prevRegionBank(): void {
    this._sendOscMessage(new OscMessage('/device/region/bank/-'));
  }
}
