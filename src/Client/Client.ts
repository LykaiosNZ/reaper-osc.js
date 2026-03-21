/**
 * Stateless OSC client for communicating with Reaper
 * @module
 */
import {EventEmitter} from 'events';
import * as osc from 'osc';
import {OscMessage, RawOscMessage} from '../Messages';
import {ReaperOscEvent, RecordMonitoringMode} from './Events';
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
  ['/click', msg => ({type: 'metronome', enabled: boolFrom(msg)})],
  ['/autorecarm', msg => ({type: 'autoRecArm', enabled: boolFrom(msg)})],
  ['/anysolo', msg => ({type: 'anySolo', active: boolFrom(msg)})],
  // Transport
  ['/play', msg => ({type: 'transport:play', playing: boolFrom(msg)})],
  ['/stop', msg => ({type: 'transport:stop', stopped: boolFrom(msg)})],
  ['/pause', msg => ({type: 'transport:pause', paused: boolFrom(msg)})],
  ['/record', msg => ({type: 'transport:record', recording: boolFrom(msg)})],
  ['/rewind', msg => ({type: 'transport:rewind', rewinding: boolFrom(msg)})],
  ['/forward', msg => ({type: 'transport:fastForward', fastForwarding: boolFrom(msg)})],
  ['/repeat', msg => ({type: 'transport:repeat', enabled: boolFrom(msg)})],
  ['/time', msg => ({type: 'transport:time', time: floatFrom(msg)})],
  ['/beat/str', msg => ({type: 'transport:beat', beat: stringFrom(msg)})],
  ['/frames/str', msg => ({type: 'transport:frames', frames: stringFrom(msg)})],
  ['/loop/start/time', msg => ({type: 'transport:loopStart', time: floatFrom(msg)})],
  ['/loop/end/time', msg => ({type: 'transport:loopEnd', time: floatFrom(msg)})],
]);

// --- Track property suffix parsers ---

type IndexedTrackParser = (trackNumber: number, msg: OscMessage) => ReaperOscEvent;

const TRACK_PARSERS = new Map<string, IndexedTrackParser>([
  ['mute', (n, m) => ({type: 'track:mute', trackNumber: n, muted: boolFrom(m)})],
  ['solo', (n, m) => ({type: 'track:solo', trackNumber: n, soloed: boolFrom(m)})],
  ['recarm', (n, m) => ({type: 'track:recarm', trackNumber: n, armed: boolFrom(m)})],
  ['select', (n, m) => ({type: 'track:select', trackNumber: n, selected: boolFrom(m)})],
  ['name', (n, m) => ({type: 'track:name', trackNumber: n, name: stringFrom(m)})],
  ['pan', (n, m) => ({type: 'track:pan', trackNumber: n, pan: floatFrom(m)})],
  ['pan2', (n, m) => ({type: 'track:pan2', trackNumber: n, pan2: floatFrom(m)})],
  ['panmode', (n, m) => ({type: 'track:panMode', trackNumber: n, panMode: stringFrom(m)})],
  ['volume', (n, m) => ({type: 'track:volume', trackNumber: n, volume: floatFrom(m)})],
  ['volume/db', (n, m) => ({type: 'track:volumeDb', trackNumber: n, volumeDb: floatFrom(m)})],
  ['vu', (n, m) => ({type: 'track:vu', trackNumber: n, vu: floatFrom(m)})],
  ['vu/L', (n, m) => ({type: 'track:vuLeft', trackNumber: n, vuLeft: floatFrom(m)})],
  ['vu/R', (n, m) => ({type: 'track:vuRight', trackNumber: n, vuRight: floatFrom(m)})],
  ['monitor', (n, m) => ({type: 'track:monitor', trackNumber: n, monitor: intFrom(m) as RecordMonitoringMode})],
]);

// --- Track FX suffix parsers (for /track/N/fx/M/suffix) ---

type IndexedFxParser = (trackNumber: number, fxNumber: number, msg: OscMessage) => ReaperOscEvent;

const TRACK_FX_PARSERS = new Map<string, IndexedFxParser>([
  // bypass is inverted: Reaper sends 0 when bypassed
  ['name', (t, f, m) => ({type: 'track:fx:name', trackNumber: t, fxNumber: f, name: stringFrom(m)})],
  ['bypass', (t, f, m) => ({type: 'track:fx:bypass', trackNumber: t, fxNumber: f, bypassed: !boolFrom(m)})],
  ['openui', (t, f, m) => ({type: 'track:fx:openUi', trackNumber: t, fxNumber: f, open: boolFrom(m)})],
  ['preset', (t, f, m) => ({type: 'track:fx:preset', trackNumber: t, fxNumber: f, preset: stringFrom(m)})],
]);

// --- Selected track suffix parsers (for /track/suffix, no track number) ---

type SelectedTrackParser = (msg: OscMessage) => ReaperOscEvent;

const SELECTED_TRACK_PARSERS = new Map<string, SelectedTrackParser>([
  ['mute', m => ({type: 'selectedTrack:mute', muted: boolFrom(m)})],
  ['solo', m => ({type: 'selectedTrack:solo', soloed: boolFrom(m)})],
  ['recarm', m => ({type: 'selectedTrack:recarm', armed: boolFrom(m)})],
  ['select', m => ({type: 'selectedTrack:select', selected: boolFrom(m)})],
  ['name', m => ({type: 'selectedTrack:name', name: stringFrom(m)})],
  ['pan', m => ({type: 'selectedTrack:pan', pan: floatFrom(m)})],
  ['pan2', m => ({type: 'selectedTrack:pan2', pan2: floatFrom(m)})],
  ['panmode', m => ({type: 'selectedTrack:panMode', panMode: stringFrom(m)})],
  ['volume', m => ({type: 'selectedTrack:volume', volume: floatFrom(m)})],
  ['volume/db', m => ({type: 'selectedTrack:volumeDb', volumeDb: floatFrom(m)})],
  ['vu', m => ({type: 'selectedTrack:vu', vu: floatFrom(m)})],
  ['vu/L', m => ({type: 'selectedTrack:vuLeft', vuLeft: floatFrom(m)})],
  ['vu/R', m => ({type: 'selectedTrack:vuRight', vuRight: floatFrom(m)})],
  ['monitor', m => ({type: 'selectedTrack:monitor', monitor: intFrom(m) as RecordMonitoringMode})],
]);

// --- FX on selected track (for /fx/M/suffix) ---

type SelectedTrackFxParser = (fxNumber: number, msg: OscMessage) => ReaperOscEvent;

const SELECTED_TRACK_FX_PARSERS = new Map<string, SelectedTrackFxParser>([
  ['name', (f, m) => ({type: 'selectedTrack:fx:name', fxNumber: f, name: stringFrom(m)})],
  ['bypass', (f, m) => ({type: 'selectedTrack:fx:bypass', fxNumber: f, bypassed: !boolFrom(m)})],
  ['openui', (f, m) => ({type: 'selectedTrack:fx:openUi', fxNumber: f, open: boolFrom(m)})],
  ['preset', (f, m) => ({type: 'selectedTrack:fx:preset', fxNumber: f, preset: stringFrom(m)})],
]);

// --- Device-selected FX (for /fx/suffix, no FX number) ---

type SelectedFxParser = (msg: OscMessage) => ReaperOscEvent;

const SELECTED_FX_PARSERS = new Map<string, SelectedFxParser>([
  ['name', m => ({type: 'selectedFx:name', name: stringFrom(m)})],
  ['bypass', m => ({type: 'selectedFx:bypass', bypassed: !boolFrom(m)})],
  ['openui', m => ({type: 'selectedFx:openUi', open: boolFrom(m)})],
  ['preset', m => ({type: 'selectedFx:preset', preset: stringFrom(m)})],
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
