/**
 * Contains classes for controlling Reaper's OSC device state
 * @module
 */
import {SelectDeviceTrack, NextDeviceTrack, PreviousDeviceTrack, SelectDeviceTrackBank, NextDeviceTrackBank, PreviousDeviceTrackBank, SelectDeviceFx, NextDeviceFx, PreviousDeviceFx, SelectDeviceFxParameterBank, NextDeviceFxParameterBank, PreviousDeviceFxParameterBank, SelectDeviceFxInstrumentParameterBank, NextDeviceFxInstrumentParameterBank, PreviousDeviceFxInstrumentParameterBank, SelectDeviceMarkerBank, NextDeviceMarkerBank, PreviousDeviceMarkerBank, SelectDeviceRegionBank, NextDeviceRegionBank, PreviousDeviceRegionBank, ReaperOscCommand} from './Client/Commands';

type SendCommand = (command: ReaperOscCommand) => void;

/** Controls the OSC device's navigation state within Reaper */
export class DeviceState {
  constructor(private readonly _send: SendCommand) {}

  // --- Track ---

  /**
   * Set the device's focused track to a specific bank-relative slot.
   * Reaper will respond with a full state sync burst for the selected track.
   * @param index 1-based track index within the current device track bank
   */
  public selectTrack(index: number): void {
    this._send(SelectDeviceTrack(index));
  }

  /** Move the device's focused track to the next track in the bank */
  public nextTrack(): void {
    this._send(NextDeviceTrack());
  }

  /** Move the device's focused track to the previous track in the bank */
  public previousTrack(): void {
    this._send(PreviousDeviceTrack());
  }

  // --- Track bank ---

  /**
   * Set the active device track bank.
   * e.g. bank 2 with a bank size of 8 maps `/track/1/` through `/track/8/` to absolute tracks 9-16.
   * @param index 1-based bank index
   */
  public selectTrackBank(index: number): void {
    this._send(SelectDeviceTrackBank(index));
  }

  /** Move to the next track bank */
  public nextTrackBank(): void {
    this._send(NextDeviceTrackBank());
  }

  /** Move to the previous track bank */
  public previousTrackBank(): void {
    this._send(PreviousDeviceTrackBank());
  }

  // --- FX ---

  /**
   * Set the device's focused FX slot on the currently selected track.
   * @param index 1-based FX index within the current device FX bank
   */
  public selectFx(index: number): void {
    this._send(SelectDeviceFx(index));
  }

  /** Move the device's focused FX to the next slot */
  public nextFx(): void {
    this._send(NextDeviceFx());
  }

  /** Move the device's focused FX to the previous slot */
  public previousFx(): void {
    this._send(PreviousDeviceFx());
  }

  // --- FX param bank ---

  /**
   * Set the active FX parameter bank.
   * @param index 1-based bank index
   */
  public selectFxParameterBank(index: number): void {
    this._send(SelectDeviceFxParameterBank(index));
  }

  /** Move to the next FX parameter bank */
  public nextFxParameterBank(): void {
    this._send(NextDeviceFxParameterBank());
  }

  /** Move to the previous FX parameter bank */
  public previousFxParameterBank(): void {
    this._send(PreviousDeviceFxParameterBank());
  }

  // --- FX instrument param bank ---

  /**
   * Set the active FX instrument parameter bank.
   * @param index 1-based bank index
   */
  public selectFxInstrumentParameterBank(index: number): void {
    this._send(SelectDeviceFxInstrumentParameterBank(index));
  }

  /** Move to the next FX instrument parameter bank */
  public nextFxInstrumentParameterBank(): void {
    this._send(NextDeviceFxInstrumentParameterBank());
  }

  /** Move to the previous FX instrument parameter bank */
  public previousFxInstrumentParameterBank(): void {
    this._send(PreviousDeviceFxInstrumentParameterBank());
  }

  // --- Marker bank ---

  /**
   * Set the active marker bank.
   * @param index 1-based bank index
   */
  public selectMarkerBank(index: number): void {
    this._send(SelectDeviceMarkerBank(index));
  }

  /** Move to the next marker bank */
  public nextMarkerBank(): void {
    this._send(NextDeviceMarkerBank());
  }

  /** Move to the previous marker bank */
  public previousMarkerBank(): void {
    this._send(PreviousDeviceMarkerBank());
  }

  // --- Region bank ---

  /**
   * Set the active region bank.
   * @param index 1-based bank index
   */
  public selectRegionBank(index: number): void {
    this._send(SelectDeviceRegionBank(index));
  }

  /** Move to the next region bank */
  public nextRegionBank(): void {
    this._send(NextDeviceRegionBank());
  }

  /** Move to the previous region bank */
  public previousRegionBank(): void {
    this._send(PreviousDeviceRegionBank());
  }
}
