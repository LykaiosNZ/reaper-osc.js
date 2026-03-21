/**
 * Stateless OSC client for communicating with Reaper
 * @module
 */
import {EventEmitter} from 'events';
import * as osc from 'osc';
import {OscMessage, RawOscMessage} from '../Messages';
import {
  ReaperOscEvent, RecordMonitoringMode,
  // Global
  MetronomeEvent, AutoRecordArmEvent, AnySoloEvent,
  // Transport
  PlayEvent, StopEvent, PauseEvent, RecordEvent, RewindEvent, FastForwardEvent, RepeatEvent,
  TimeChanged, BeatChanged, FramesChanged, LoopStartChanged, LoopEndChanged,
  // Track
  TrackMuteEvent, TrackSoloEvent, TrackRecordArmEvent, TrackSelectEvent, TrackNameChanged,
  TrackPanChanged, TrackPan2Changed, TrackPanModeChanged,
  TrackVolumeChanged, TrackVolumeDbChanged,
  TrackVuChanged, TrackVuLeftChanged, TrackVuRightChanged, TrackMonitoringModeChanged,
  // Track FX
  TrackFxNameChanged, TrackFxBypassEvent, TrackFxOpenUiEvent, TrackFxPresetChanged,
  // Selected Track
  SelectedTrackMuteEvent, SelectedTrackSoloEvent, SelectedTrackRecordArmEvent, SelectedTrackSelectEvent,
  SelectedTrackNameChanged, SelectedTrackPanChanged, SelectedTrackPan2Changed, SelectedTrackPanModeChanged,
  SelectedTrackVolumeChanged, SelectedTrackVolumeDbChanged,
  SelectedTrackVuChanged, SelectedTrackVuLeftChanged, SelectedTrackVuRightChanged, SelectedTrackMonitoringModeChanged,
  // Selected Track FX
  SelectedTrackFxNameChanged, SelectedTrackFxBypassEvent, SelectedTrackFxOpenUiEvent, SelectedTrackFxPresetChanged,
  // Selected FX
  SelectedFxNameChanged, SelectedFxBypassEvent, SelectedFxOpenUiEvent, SelectedFxPresetChanged,
} from './Events';
import {ReaperOscCommand, commandToOscMessage} from './Commands';
import {ConsoleLogger, Logger, ReaperConfiguration} from '../Config';

// --- Value extractors ---

function boolFrom(msg: OscMessage): boolean {
  return msg.args[0]?.value === 1;
}

function floatFrom(msg: OscMessage): number {
  return msg.args[0]?.value as number;
}

function intFrom(msg: OscMessage): number {
  return msg.args[0]?.value as number;
}

function stringFrom(msg: OscMessage): string {
  return msg.args[0]?.value as string;
}

// --- Exact address parsers (global + transport) ---

const EXACT_PARSERS = new Map<string, (msg: OscMessage) => ReaperOscEvent>([
  // Global
  ['/click', msg => MetronomeEvent(boolFrom(msg))],
  ['/autorecarm', msg => AutoRecordArmEvent(boolFrom(msg))],
  ['/anysolo', msg => AnySoloEvent(boolFrom(msg))],
  // Transport
  ['/play', msg => PlayEvent(boolFrom(msg))],
  ['/stop', msg => StopEvent(boolFrom(msg))],
  ['/pause', msg => PauseEvent(boolFrom(msg))],
  ['/record', msg => RecordEvent(boolFrom(msg))],
  ['/rewind', msg => RewindEvent(boolFrom(msg))],
  ['/forward', msg => FastForwardEvent(boolFrom(msg))],
  ['/repeat', msg => RepeatEvent(boolFrom(msg))],
  ['/time', msg => TimeChanged(floatFrom(msg))],
  ['/beat/str', msg => BeatChanged(stringFrom(msg))],
  ['/frames/str', msg => FramesChanged(stringFrom(msg))],
  ['/loop/start/time', msg => LoopStartChanged(floatFrom(msg))],
  ['/loop/end/time', msg => LoopEndChanged(floatFrom(msg))],
]);

// --- Track property suffix parsers ---

type IndexedTrackParser = (trackNumber: number, msg: OscMessage) => ReaperOscEvent;

const TRACK_PARSERS = new Map<string, IndexedTrackParser>([
  ['mute', (n, m) => TrackMuteEvent(n, boolFrom(m))],
  ['solo', (n, m) => TrackSoloEvent(n, boolFrom(m))],
  ['recarm', (n, m) => TrackRecordArmEvent(n, boolFrom(m))],
  ['select', (n, m) => TrackSelectEvent(n, boolFrom(m))],
  ['name', (n, m) => TrackNameChanged(n, stringFrom(m))],
  ['pan', (n, m) => TrackPanChanged(n, floatFrom(m))],
  ['pan2', (n, m) => TrackPan2Changed(n, floatFrom(m))],
  ['panmode', (n, m) => TrackPanModeChanged(n, stringFrom(m))],
  ['volume', (n, m) => TrackVolumeChanged(n, floatFrom(m))],
  ['volume/db', (n, m) => TrackVolumeDbChanged(n, floatFrom(m))],
  ['vu', (n, m) => TrackVuChanged(n, floatFrom(m))],
  ['vu/L', (n, m) => TrackVuLeftChanged(n, floatFrom(m))],
  ['vu/R', (n, m) => TrackVuRightChanged(n, floatFrom(m))],
  ['monitor', (n, m) => TrackMonitoringModeChanged(n, intFrom(m) as RecordMonitoringMode)],
]);

// --- Track FX suffix parsers (for /track/N/fx/M/suffix) ---

type IndexedFxParser = (trackNumber: number, fxNumber: number, msg: OscMessage) => ReaperOscEvent;

const TRACK_FX_PARSERS = new Map<string, IndexedFxParser>([
  // bypass is inverted: Reaper sends 0 when bypassed
  ['name', (t, f, m) => TrackFxNameChanged(t, f, stringFrom(m))],
  ['bypass', (t, f, m) => TrackFxBypassEvent(t, f, !boolFrom(m))],
  ['openui', (t, f, m) => TrackFxOpenUiEvent(t, f, boolFrom(m))],
  ['preset', (t, f, m) => TrackFxPresetChanged(t, f, stringFrom(m))],
]);

// --- Selected track suffix parsers (for /track/suffix, no track number) ---

type SelectedTrackParser = (msg: OscMessage) => ReaperOscEvent;

const SELECTED_TRACK_PARSERS = new Map<string, SelectedTrackParser>([
  ['mute', m => SelectedTrackMuteEvent(boolFrom(m))],
  ['solo', m => SelectedTrackSoloEvent(boolFrom(m))],
  ['recarm', m => SelectedTrackRecordArmEvent(boolFrom(m))],
  ['select', m => SelectedTrackSelectEvent(boolFrom(m))],
  ['name', m => SelectedTrackNameChanged(stringFrom(m))],
  ['pan', m => SelectedTrackPanChanged(floatFrom(m))],
  ['pan2', m => SelectedTrackPan2Changed(floatFrom(m))],
  ['panmode', m => SelectedTrackPanModeChanged(stringFrom(m))],
  ['volume', m => SelectedTrackVolumeChanged(floatFrom(m))],
  ['volume/db', m => SelectedTrackVolumeDbChanged(floatFrom(m))],
  ['vu', m => SelectedTrackVuChanged(floatFrom(m))],
  ['vu/L', m => SelectedTrackVuLeftChanged(floatFrom(m))],
  ['vu/R', m => SelectedTrackVuRightChanged(floatFrom(m))],
  ['monitor', m => SelectedTrackMonitoringModeChanged(intFrom(m) as RecordMonitoringMode)],
]);

// --- FX on selected track (for /fx/M/suffix) ---

type SelectedTrackFxParser = (fxNumber: number, msg: OscMessage) => ReaperOscEvent;

const SELECTED_TRACK_FX_PARSERS = new Map<string, SelectedTrackFxParser>([
  ['name', (f, m) => SelectedTrackFxNameChanged(f, stringFrom(m))],
  ['bypass', (f, m) => SelectedTrackFxBypassEvent(f, !boolFrom(m))],
  ['openui', (f, m) => SelectedTrackFxOpenUiEvent(f, boolFrom(m))],
  ['preset', (f, m) => SelectedTrackFxPresetChanged(f, stringFrom(m))],
]);

// --- Device-selected FX (for /fx/suffix, no FX number) ---

type SelectedFxParser = (msg: OscMessage) => ReaperOscEvent;

const SELECTED_FX_PARSERS = new Map<string, SelectedFxParser>([
  ['name', m => SelectedFxNameChanged(stringFrom(m))],
  ['bypass', m => SelectedFxBypassEvent(!boolFrom(m))],
  ['openui', m => SelectedFxOpenUiEvent(boolFrom(m))],
  ['preset', m => SelectedFxPresetChanged(stringFrom(m))],
]);

// --- Message parsing ---

function parseTrackMessage(msg: OscMessage): ReaperOscEvent | null {
  const parts = msg.addressParts;
  const trackNumber = parseInt(parts[1]);

  if (isNaN(trackNumber)) {
    // Selected track: /track/mute, /track/name, etc.
    const suffix = parts.slice(1).join('/');
    const parser = SELECTED_TRACK_PARSERS.get(suffix);
    return parser ? parser(msg) : null;
  }

  // Track FX: /track/N/fx/M/property
  if (parts[2] === 'fx') {
    const fxNumber = parseInt(parts[3]);
    if (isNaN(fxNumber)) return null;
    const suffix = parts.slice(4).join('/');
    const parser = TRACK_FX_PARSERS.get(suffix);
    return parser ? parser(trackNumber, fxNumber, msg) : null;
  }

  // Track property: /track/N/property
  const suffix = parts.slice(2).join('/');
  const parser = TRACK_PARSERS.get(suffix);
  return parser ? parser(trackNumber, msg) : null;
}

function parseFxMessage(msg: OscMessage): ReaperOscEvent | null {
  const parts = msg.addressParts;
  const fxNumber = parseInt(parts[1]);

  if (isNaN(fxNumber)) {
    // Selected FX: /fx/name, /fx/bypass, etc.
    const suffix = parts.slice(1).join('/');
    const parser = SELECTED_FX_PARSERS.get(suffix);
    return parser ? parser(msg) : null;
  }

  // Indexed FX on selected track: /fx/M/name, /fx/M/bypass, etc.
  const suffix = parts.slice(2).join('/');
  const parser = SELECTED_TRACK_FX_PARSERS.get(suffix);
  return parser ? parser(fxNumber, msg) : null;
}

export function parseMessage(msg: OscMessage): ReaperOscEvent {
  // O(1) exact match for global + transport
  const exact = EXACT_PARSERS.get(msg.address);
  if (exact) return exact(msg);

  // Prefix-based routing
  const firstPart = msg.addressParts[0];

  if (firstPart === 'track') {
    const event = parseTrackMessage(msg);
    if (event) return event;
  }

  if (firstPart === 'fx') {
    const event = parseFxMessage(msg);
    if (event) return event;
  }

  return {type: 'unknown', message: msg};
}

// --- Typed EventEmitter overloads ---

export interface ReaperOscClient {
  on(event: 'message', listener: (event: ReaperOscEvent) => void): this;
  on(event: 'rawMessage', listener: (message: OscMessage) => void): this;
  once(event: 'message', listener: (event: ReaperOscEvent) => void): this;
  once(event: 'rawMessage', listener: (message: OscMessage) => void): this;
  off(event: 'message', listener: (event: ReaperOscEvent) => void): this;
  off(event: 'rawMessage', listener: (message: OscMessage) => void): this;
  emit(event: 'message', oscEvent: ReaperOscEvent): boolean;
  emit(event: 'rawMessage', message: OscMessage): boolean;
}

/**
 * A stateless OSC client for communicating with Reaper.
 *
 * Translates incoming OSC messages into strongly typed events, and accepts
 * strongly typed commands for sending to Reaper. Does not maintain any state
 * about track properties, transport, or FX — use {@link Reaper} for that.
 *
 * @example
 * ```typescript
 * const client = new ReaperOscClient();
 * await client.start();
 *
 * // Receive typed events
 * client.on('message', event => {
 *   switch (event.type) {
 *     case 'track:mute':
 *       console.log(`Track ${event.trackNumber} muted: ${event.muted}`);
 *       break;
 *     case 'transport:play':
 *       console.log(`Playing: ${event.playing}`);
 *       break;
 *   }
 * });
 *
 * // Send typed commands
 * client.send({ type: 'transport:play' });
 * client.send({ type: 'track:mute', trackNumber: 3, muted: true });
 * ```
 */
export class ReaperOscClient extends EventEmitter {
  // No type defs for osc library so don't have much choice here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _osc: any;
  private readonly _log: Logger;
  private _isReady = false;

  constructor(config: ReaperConfiguration = new ReaperConfiguration()) {
    super();
    this._log = config.log;
    this._osc = new osc.UDPPort({
      localAddress: config.localAddress,
      localPort: config.localPort,
      remoteAddress: config.remoteAddress,
      remotePort: config.remotePort,
      broadcast: true,
      metadata: true,
    });
    this.initOsc();
  }

  /** Indicates whether OSC is ready to send and receive messages */
  public get isReady(): boolean {
    return this._isReady;
  }

  /**
   * Send a typed command to Reaper.
   * @param command The command to send
   */
  public send(command: ReaperOscCommand): void {
    this.sendRaw(commandToOscMessage(command));
  }

  /**
   * Send a raw OSC message to Reaper.
   * @param message The OSC message to send
   */
  public sendRaw(message: OscMessage): void {
    if (!this._isReady) {
      throw new Error("Can't send while OSC is not ready");
    }
    this._osc.send(message);
    this._log('debug', 'OSC Message sent', message);
  }

  /** Open the OSC port and start listening for messages */
  public async start(): Promise<void> {
    if (this._isReady) {
      return;
    }

    let errorCallback: (err: Error) => void;
    let readyCallback: () => void;

    const promise = new Promise<void>((resolve, reject) => {
      errorCallback = (err: Error): void => {
        this._log('debug', 'Error opening OSC connection', err);
        reject(err);
      };

      readyCallback = () => {
        this._log('debug', 'OSC listener ready');
        this._isReady = true;
        resolve();
      };

      this._osc.once('ready', readyCallback);
      this._osc.once('error', errorCallback);
    });

    const removeListeners = () => {
      this._osc.removeListener('ready', readyCallback);
      this._osc.removeListener('error', errorCallback);
    };

    this._osc.open();

    try {
      await promise;
    } finally {
      removeListeners();
    }
  }

  /** Stop listening for OSC messages */
  public async stop(): Promise<void> {
    if (!this._isReady) {
      return;
    }

    const promise = new Promise<void>(resolve => {
      this._osc.once('close', () => {
        this._log('debug', 'OSC listener stopped');
        resolve();
      });
    });

    this._isReady = false;
    this._osc.close();

    return promise;
  }

  private initOsc(): void {
    this._osc.on('error', (err: Error) => {
      this._log('error', 'OSC error received', err);
    });

    this._osc.on('message', (rawMessage: RawOscMessage) => {
      const message = new OscMessage(rawMessage.address, rawMessage.args);

      // Emit typed event first so state is updated before rawMessage listeners fire
      const event = parseMessage(message);
      this.emit('message', event);

      this.emit('rawMessage', message);
    });
  }
}
