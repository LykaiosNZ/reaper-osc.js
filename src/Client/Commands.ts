/**
 * Strongly typed commands accepted by {@link ReaperOscClient} for sending messages to Reaper
 * @module
 */
import {ActionMessage, BooleanMessage, FloatMessage, IntegerMessage, OscMessage, StringMessage} from '../Messages';
import {RecordMonitoringMode} from './Events';

// --- Global Commands ---

export interface ToggleMetronome { type: 'metronome:toggle' }
export function ToggleMetronome(): ToggleMetronome { return {type: 'metronome:toggle'}; }

export interface ToggleAutoRecordArm { type: 'autoRecArm:toggle' }
export function ToggleAutoRecordArm(): ToggleAutoRecordArm { return {type: 'autoRecArm:toggle'}; }

export interface ResetSolos { type: 'soloReset' }
export function ResetSolos(): ResetSolos { return {type: 'soloReset'}; }

export interface TriggerAction { type: 'action'; commandId: string | number; value?: number }
export function TriggerAction(commandId: string | number, value?: number): TriggerAction { return {type: 'action', commandId, value}; }

// --- Transport Commands ---

export interface Play { type: 'transport:play' }
export function Play(): Play { return {type: 'transport:play'}; }

export interface Stop { type: 'transport:stop' }
export function Stop(): Stop { return {type: 'transport:stop'}; }

export interface Pause { type: 'transport:pause' }
export function Pause(): Pause { return {type: 'transport:pause'}; }

export interface ToggleRecord { type: 'transport:record' }
export function ToggleRecord(): ToggleRecord { return {type: 'transport:record'}; }

export interface SetRewind { type: 'transport:rewind'; rewinding: boolean }
export function SetRewind(rewinding: boolean): SetRewind { return {type: 'transport:rewind', rewinding}; }

export interface SetFastForward { type: 'transport:fastForward'; fastForwarding: boolean }
export function SetFastForward(fastForwarding: boolean): SetFastForward { return {type: 'transport:fastForward', fastForwarding}; }

export interface ToggleRepeat { type: 'transport:repeat:toggle' }
export function ToggleRepeat(): ToggleRepeat { return {type: 'transport:repeat:toggle'}; }

export interface SetTime { type: 'transport:time'; time: number }
export function SetTime(time: number): SetTime { return {type: 'transport:time', time}; }

export interface SetBeat { type: 'transport:beat'; beat: string }
export function SetBeat(beat: string): SetBeat { return {type: 'transport:beat', beat}; }

export interface SetFrames { type: 'transport:frames'; frames: string }
export function SetFrames(frames: string): SetFrames { return {type: 'transport:frames', frames}; }

export interface SetLoopStart { type: 'transport:loopStart'; time: number }
export function SetLoopStart(time: number): SetLoopStart { return {type: 'transport:loopStart', time}; }

export interface SetLoopEnd { type: 'transport:loopEnd'; time: number }
export function SetLoopEnd(time: number): SetLoopEnd { return {type: 'transport:loopEnd', time}; }

// --- Track Commands ---

export interface SetTrackMute { type: 'track:mute'; trackNumber: number; muted: boolean }
export function SetTrackMute(trackNumber: number, muted: boolean): SetTrackMute { return {type: 'track:mute', trackNumber, muted}; }

export interface ToggleTrackMute { type: 'track:mute:toggle'; trackNumber: number }
export function ToggleTrackMute(trackNumber: number): ToggleTrackMute { return {type: 'track:mute:toggle', trackNumber}; }

export interface SetTrackSolo { type: 'track:solo'; trackNumber: number; soloed: boolean }
export function SetTrackSolo(trackNumber: number, soloed: boolean): SetTrackSolo { return {type: 'track:solo', trackNumber, soloed}; }

export interface ToggleTrackSolo { type: 'track:solo:toggle'; trackNumber: number }
export function ToggleTrackSolo(trackNumber: number): ToggleTrackSolo { return {type: 'track:solo:toggle', trackNumber}; }

export interface SetTrackRecordArm { type: 'track:recarm'; trackNumber: number; armed: boolean }
export function SetTrackRecordArm(trackNumber: number, armed: boolean): SetTrackRecordArm { return {type: 'track:recarm', trackNumber, armed}; }

export interface ToggleTrackRecordArm { type: 'track:recarm:toggle'; trackNumber: number }
export function ToggleTrackRecordArm(trackNumber: number): ToggleTrackRecordArm { return {type: 'track:recarm:toggle', trackNumber}; }

export interface SetTrackSelect { type: 'track:select'; trackNumber: number; selected: boolean }
export function SetTrackSelect(trackNumber: number, selected: boolean): SetTrackSelect { return {type: 'track:select', trackNumber, selected}; }

export interface SetTrackName { type: 'track:name'; trackNumber: number; name: string }
export function SetTrackName(trackNumber: number, name: string): SetTrackName { return {type: 'track:name', trackNumber, name}; }

export interface SetTrackPan { type: 'track:pan'; trackNumber: number; pan: number }
export function SetTrackPan(trackNumber: number, pan: number): SetTrackPan { return {type: 'track:pan', trackNumber, pan}; }

export interface SetTrackPan2 { type: 'track:pan2'; trackNumber: number; pan2: number }
export function SetTrackPan2(trackNumber: number, pan2: number): SetTrackPan2 { return {type: 'track:pan2', trackNumber, pan2}; }

export interface SetTrackVolume { type: 'track:volume'; trackNumber: number; volume: number }
export function SetTrackVolume(trackNumber: number, volume: number): SetTrackVolume { return {type: 'track:volume', trackNumber, volume}; }

export interface SetTrackVolumeDb { type: 'track:volumeDb'; trackNumber: number; volumeDb: number }
export function SetTrackVolumeDb(trackNumber: number, volumeDb: number): SetTrackVolumeDb { return {type: 'track:volumeDb', trackNumber, volumeDb}; }

export interface SetTrackMonitor { type: 'track:monitor'; trackNumber: number; monitor: RecordMonitoringMode }
export function SetTrackMonitor(trackNumber: number, monitor: RecordMonitoringMode): SetTrackMonitor { return {type: 'track:monitor', trackNumber, monitor}; }

// --- Track FX Commands ---

export interface SetTrackFxBypass { type: 'track:fx:bypass'; trackNumber: number; fxNumber: number; bypassed: boolean }
export function SetTrackFxBypass(trackNumber: number, fxNumber: number, bypassed: boolean): SetTrackFxBypass { return {type: 'track:fx:bypass', trackNumber, fxNumber, bypassed}; }

export interface SetTrackFxOpenUi { type: 'track:fx:openUi'; trackNumber: number; fxNumber: number; open: boolean }
export function SetTrackFxOpenUi(trackNumber: number, fxNumber: number, open: boolean): SetTrackFxOpenUi { return {type: 'track:fx:openUi', trackNumber, fxNumber, open}; }

export interface NextTrackFxPreset { type: 'track:fx:preset:next'; trackNumber: number; fxNumber: number }
export function NextTrackFxPreset(trackNumber: number, fxNumber: number): NextTrackFxPreset { return {type: 'track:fx:preset:next', trackNumber, fxNumber}; }

export interface PrevTrackFxPreset { type: 'track:fx:preset:prev'; trackNumber: number; fxNumber: number }
export function PrevTrackFxPreset(trackNumber: number, fxNumber: number): PrevTrackFxPreset { return {type: 'track:fx:preset:prev', trackNumber, fxNumber}; }

// --- Selected Track Commands ---

export interface SetSelectedTrackMute { type: 'selectedTrack:mute'; muted: boolean }
export function SetSelectedTrackMute(muted: boolean): SetSelectedTrackMute { return {type: 'selectedTrack:mute', muted}; }

export interface ToggleSelectedTrackMute { type: 'selectedTrack:mute:toggle' }
export function ToggleSelectedTrackMute(): ToggleSelectedTrackMute { return {type: 'selectedTrack:mute:toggle'}; }

export interface SetSelectedTrackSolo { type: 'selectedTrack:solo'; soloed: boolean }
export function SetSelectedTrackSolo(soloed: boolean): SetSelectedTrackSolo { return {type: 'selectedTrack:solo', soloed}; }

export interface ToggleSelectedTrackSolo { type: 'selectedTrack:solo:toggle' }
export function ToggleSelectedTrackSolo(): ToggleSelectedTrackSolo { return {type: 'selectedTrack:solo:toggle'}; }

export interface SetSelectedTrackRecordArm { type: 'selectedTrack:recarm'; armed: boolean }
export function SetSelectedTrackRecordArm(armed: boolean): SetSelectedTrackRecordArm { return {type: 'selectedTrack:recarm', armed}; }

export interface ToggleSelectedTrackRecordArm { type: 'selectedTrack:recarm:toggle' }
export function ToggleSelectedTrackRecordArm(): ToggleSelectedTrackRecordArm { return {type: 'selectedTrack:recarm:toggle'}; }

export interface SetSelectedTrackSelect { type: 'selectedTrack:select'; selected: boolean }
export function SetSelectedTrackSelect(selected: boolean): SetSelectedTrackSelect { return {type: 'selectedTrack:select', selected}; }

export interface SetSelectedTrackName { type: 'selectedTrack:name'; name: string }
export function SetSelectedTrackName(name: string): SetSelectedTrackName { return {type: 'selectedTrack:name', name}; }

export interface SetSelectedTrackPan { type: 'selectedTrack:pan'; pan: number }
export function SetSelectedTrackPan(pan: number): SetSelectedTrackPan { return {type: 'selectedTrack:pan', pan}; }

export interface SetSelectedTrackPan2 { type: 'selectedTrack:pan2'; pan2: number }
export function SetSelectedTrackPan2(pan2: number): SetSelectedTrackPan2 { return {type: 'selectedTrack:pan2', pan2}; }

export interface SetSelectedTrackVolume { type: 'selectedTrack:volume'; volume: number }
export function SetSelectedTrackVolume(volume: number): SetSelectedTrackVolume { return {type: 'selectedTrack:volume', volume}; }

export interface SetSelectedTrackVolumeDb { type: 'selectedTrack:volumeDb'; volumeDb: number }
export function SetSelectedTrackVolumeDb(volumeDb: number): SetSelectedTrackVolumeDb { return {type: 'selectedTrack:volumeDb', volumeDb}; }

export interface SetSelectedTrackMonitor { type: 'selectedTrack:monitor'; monitor: RecordMonitoringMode }
export function SetSelectedTrackMonitor(monitor: RecordMonitoringMode): SetSelectedTrackMonitor { return {type: 'selectedTrack:monitor', monitor}; }

// --- Selected Track FX Commands ---

export interface SetSelectedTrackFxBypass { type: 'selectedTrack:fx:bypass'; fxNumber: number; bypassed: boolean }
export function SetSelectedTrackFxBypass(fxNumber: number, bypassed: boolean): SetSelectedTrackFxBypass { return {type: 'selectedTrack:fx:bypass', fxNumber, bypassed}; }

export interface SetSelectedTrackFxOpenUi { type: 'selectedTrack:fx:openUi'; fxNumber: number; open: boolean }
export function SetSelectedTrackFxOpenUi(fxNumber: number, open: boolean): SetSelectedTrackFxOpenUi { return {type: 'selectedTrack:fx:openUi', fxNumber, open}; }

export interface NextSelectedTrackFxPreset { type: 'selectedTrack:fx:preset:next'; fxNumber: number }
export function NextSelectedTrackFxPreset(fxNumber: number): NextSelectedTrackFxPreset { return {type: 'selectedTrack:fx:preset:next', fxNumber}; }

export interface PrevSelectedTrackFxPreset { type: 'selectedTrack:fx:preset:prev'; fxNumber: number }
export function PrevSelectedTrackFxPreset(fxNumber: number): PrevSelectedTrackFxPreset { return {type: 'selectedTrack:fx:preset:prev', fxNumber}; }

// --- Selected FX Commands ---

export interface SetSelectedFxBypass { type: 'selectedFx:bypass'; bypassed: boolean }
export function SetSelectedFxBypass(bypassed: boolean): SetSelectedFxBypass { return {type: 'selectedFx:bypass', bypassed}; }

export interface SetSelectedFxOpenUi { type: 'selectedFx:openUi'; open: boolean }
export function SetSelectedFxOpenUi(open: boolean): SetSelectedFxOpenUi { return {type: 'selectedFx:openUi', open}; }

export interface NextSelectedFxPreset { type: 'selectedFx:preset:next' }
export function NextSelectedFxPreset(): NextSelectedFxPreset { return {type: 'selectedFx:preset:next'}; }

export interface PrevSelectedFxPreset { type: 'selectedFx:preset:prev' }
export function PrevSelectedFxPreset(): PrevSelectedFxPreset { return {type: 'selectedFx:preset:prev'}; }

// --- Device Navigation Commands ---

export interface SelectDeviceTrack { type: 'device:track:select'; index: number }
export function SelectDeviceTrack(index: number): SelectDeviceTrack { return {type: 'device:track:select', index}; }

export interface NextDeviceTrack { type: 'device:track:next' }
export function NextDeviceTrack(): NextDeviceTrack { return {type: 'device:track:next'}; }

export interface PrevDeviceTrack { type: 'device:track:prev' }
export function PrevDeviceTrack(): PrevDeviceTrack { return {type: 'device:track:prev'}; }

export interface SelectDeviceTrackBank { type: 'device:trackBank:select'; index: number }
export function SelectDeviceTrackBank(index: number): SelectDeviceTrackBank { return {type: 'device:trackBank:select', index}; }

export interface NextDeviceTrackBank { type: 'device:trackBank:next' }
export function NextDeviceTrackBank(): NextDeviceTrackBank { return {type: 'device:trackBank:next'}; }

export interface PrevDeviceTrackBank { type: 'device:trackBank:prev' }
export function PrevDeviceTrackBank(): PrevDeviceTrackBank { return {type: 'device:trackBank:prev'}; }

export interface SelectDeviceFx { type: 'device:fx:select'; index: number }
export function SelectDeviceFx(index: number): SelectDeviceFx { return {type: 'device:fx:select', index}; }

export interface NextDeviceFx { type: 'device:fx:next' }
export function NextDeviceFx(): NextDeviceFx { return {type: 'device:fx:next'}; }

export interface PrevDeviceFx { type: 'device:fx:prev' }
export function PrevDeviceFx(): PrevDeviceFx { return {type: 'device:fx:prev'}; }

export interface SelectDeviceFxParamBank { type: 'device:fxParamBank:select'; index: number }
export function SelectDeviceFxParamBank(index: number): SelectDeviceFxParamBank { return {type: 'device:fxParamBank:select', index}; }

export interface NextDeviceFxParamBank { type: 'device:fxParamBank:next' }
export function NextDeviceFxParamBank(): NextDeviceFxParamBank { return {type: 'device:fxParamBank:next'}; }

export interface PrevDeviceFxParamBank { type: 'device:fxParamBank:prev' }
export function PrevDeviceFxParamBank(): PrevDeviceFxParamBank { return {type: 'device:fxParamBank:prev'}; }

export interface SelectDeviceFxInstParamBank { type: 'device:fxInstParamBank:select'; index: number }
export function SelectDeviceFxInstParamBank(index: number): SelectDeviceFxInstParamBank { return {type: 'device:fxInstParamBank:select', index}; }

export interface NextDeviceFxInstParamBank { type: 'device:fxInstParamBank:next' }
export function NextDeviceFxInstParamBank(): NextDeviceFxInstParamBank { return {type: 'device:fxInstParamBank:next'}; }

export interface PrevDeviceFxInstParamBank { type: 'device:fxInstParamBank:prev' }
export function PrevDeviceFxInstParamBank(): PrevDeviceFxInstParamBank { return {type: 'device:fxInstParamBank:prev'}; }

export interface SelectDeviceMarkerBank { type: 'device:markerBank:select'; index: number }
export function SelectDeviceMarkerBank(index: number): SelectDeviceMarkerBank { return {type: 'device:markerBank:select', index}; }

export interface NextDeviceMarkerBank { type: 'device:markerBank:next' }
export function NextDeviceMarkerBank(): NextDeviceMarkerBank { return {type: 'device:markerBank:next'}; }

export interface PrevDeviceMarkerBank { type: 'device:markerBank:prev' }
export function PrevDeviceMarkerBank(): PrevDeviceMarkerBank { return {type: 'device:markerBank:prev'}; }

export interface SelectDeviceRegionBank { type: 'device:regionBank:select'; index: number }
export function SelectDeviceRegionBank(index: number): SelectDeviceRegionBank { return {type: 'device:regionBank:select', index}; }

export interface NextDeviceRegionBank { type: 'device:regionBank:next' }
export function NextDeviceRegionBank(): NextDeviceRegionBank { return {type: 'device:regionBank:next'}; }

export interface PreviousDeviceRegionBank { type: 'device:regionBank:prev' }
export function PreviousDeviceRegionBank(): PreviousDeviceRegionBank { return {type: 'device:regionBank:prev'}; }

// --- Raw Command ---

export interface RawMessage { type: 'raw'; message: OscMessage }
export function RawMessage(message: OscMessage): RawMessage { return {type: 'raw', message}; }

// --- Union ---

export type ReaperOscCommand =
  // Global
  | ToggleMetronome
  | ToggleAutoRecordArm
  | ResetSolos
  | TriggerAction
  // Transport
  | Play
  | Stop
  | Pause
  | ToggleRecord
  | SetRewind
  | SetFastForward
  | ToggleRepeat
  | SetTime
  | SetBeat
  | SetFrames
  | SetLoopStart
  | SetLoopEnd
  // Track
  | SetTrackMute
  | ToggleTrackMute
  | SetTrackSolo
  | ToggleTrackSolo
  | SetTrackRecordArm
  | ToggleTrackRecordArm
  | SetTrackSelect
  | SetTrackName
  | SetTrackPan
  | SetTrackPan2
  | SetTrackVolume
  | SetTrackVolumeDb
  | SetTrackMonitor
  // Track FX
  | SetTrackFxBypass
  | SetTrackFxOpenUi
  | NextTrackFxPreset
  | PrevTrackFxPreset
  // Selected Track
  | SetSelectedTrackMute
  | ToggleSelectedTrackMute
  | SetSelectedTrackSolo
  | ToggleSelectedTrackSolo
  | SetSelectedTrackRecordArm
  | ToggleSelectedTrackRecordArm
  | SetSelectedTrackSelect
  | SetSelectedTrackName
  | SetSelectedTrackPan
  | SetSelectedTrackPan2
  | SetSelectedTrackVolume
  | SetSelectedTrackVolumeDb
  | SetSelectedTrackMonitor
  // Selected Track FX
  | SetSelectedTrackFxBypass
  | SetSelectedTrackFxOpenUi
  | NextSelectedTrackFxPreset
  | PrevSelectedTrackFxPreset
  // Selected FX
  | SetSelectedFxBypass
  | SetSelectedFxOpenUi
  | NextSelectedFxPreset
  | PrevSelectedFxPreset
  // Device Navigation
  | SelectDeviceTrack
  | NextDeviceTrack
  | PrevDeviceTrack
  | SelectDeviceTrackBank
  | NextDeviceTrackBank
  | PrevDeviceTrackBank
  | SelectDeviceFx
  | NextDeviceFx
  | PrevDeviceFx
  | SelectDeviceFxParamBank
  | NextDeviceFxParamBank
  | PrevDeviceFxParamBank
  | SelectDeviceFxInstParamBank
  | NextDeviceFxInstParamBank
  | PrevDeviceFxInstParamBank
  | SelectDeviceMarkerBank
  | NextDeviceMarkerBank
  | PrevDeviceMarkerBank
  | SelectDeviceRegionBank
  | NextDeviceRegionBank
  | PreviousDeviceRegionBank
  // Raw
  | RawMessage;

/** Translates a typed command into the corresponding OSC message */
export function commandToOscMessage(command: ReaperOscCommand): OscMessage {
  switch (command.type) {
    // Global
    case 'metronome:toggle': return new OscMessage('/click');
    case 'autoRecArm:toggle': return new OscMessage('/autorecarm');
    case 'soloReset': return new OscMessage('/soloreset');
    case 'action': return new ActionMessage(command.commandId, command.value ?? null);

    // Transport
    case 'transport:play': return new OscMessage('/play');
    case 'transport:stop': return new OscMessage('/stop');
    case 'transport:pause': return new OscMessage('/pause');
    case 'transport:record': return new OscMessage('/record');
    case 'transport:rewind': return new BooleanMessage('/rewind', command.rewinding);
    case 'transport:fastForward': return new BooleanMessage('/forward', command.fastForwarding);
    case 'transport:repeat:toggle': return new OscMessage('/repeat');
    case 'transport:time': return new FloatMessage('/time', command.time);
    case 'transport:beat': return new StringMessage('/beat/str', command.beat);
    case 'transport:frames': return new StringMessage('/frames/str', command.frames);
    case 'transport:loopStart': return new FloatMessage('/loop/start/time', command.time);
    case 'transport:loopEnd': return new FloatMessage('/loop/end/time', command.time);

    // Track
    case 'track:mute': return new BooleanMessage(`/track/${command.trackNumber}/mute`, command.muted);
    case 'track:mute:toggle': return new OscMessage(`/track/${command.trackNumber}/mute/toggle`);
    case 'track:solo': return new BooleanMessage(`/track/${command.trackNumber}/solo`, command.soloed);
    case 'track:solo:toggle': return new OscMessage(`/track/${command.trackNumber}/solo/toggle`);
    case 'track:recarm': return new BooleanMessage(`/track/${command.trackNumber}/recarm`, command.armed);
    case 'track:recarm:toggle': return new OscMessage(`/track/${command.trackNumber}/recarm/toggle`);
    case 'track:select': return new BooleanMessage(`/track/${command.trackNumber}/select`, command.selected);
    case 'track:name': return new StringMessage(`/track/${command.trackNumber}/name`, command.name);
    case 'track:pan': return new FloatMessage(`/track/${command.trackNumber}/pan`, command.pan);
    case 'track:pan2': return new FloatMessage(`/track/${command.trackNumber}/pan2`, command.pan2);
    case 'track:volume': return new FloatMessage(`/track/${command.trackNumber}/volume`, command.volume);
    case 'track:volumeDb': return new FloatMessage(`/track/${command.trackNumber}/volume/db`, command.volumeDb);
    case 'track:monitor': return new IntegerMessage(`/track/${command.trackNumber}/monitor`, command.monitor);

    // Track FX (bypass is inverted on the wire: false = bypassed)
    case 'track:fx:bypass': return new BooleanMessage(`/track/${command.trackNumber}/fx/${command.fxNumber}/bypass`, !command.bypassed);
    case 'track:fx:openUi': return new BooleanMessage(`/track/${command.trackNumber}/fx/${command.fxNumber}/openui`, command.open);
    case 'track:fx:preset:next': return new OscMessage(`/track/${command.trackNumber}/fx/${command.fxNumber}/preset+`);
    case 'track:fx:preset:prev': return new OscMessage(`/track/${command.trackNumber}/fx/${command.fxNumber}/preset-`);

    // Selected track
    case 'selectedTrack:mute': return new BooleanMessage('/track/mute', command.muted);
    case 'selectedTrack:mute:toggle': return new OscMessage('/track/mute/toggle');
    case 'selectedTrack:solo': return new BooleanMessage('/track/solo', command.soloed);
    case 'selectedTrack:solo:toggle': return new OscMessage('/track/solo/toggle');
    case 'selectedTrack:recarm': return new BooleanMessage('/track/recarm', command.armed);
    case 'selectedTrack:recarm:toggle': return new OscMessage('/track/recarm/toggle');
    case 'selectedTrack:select': return new BooleanMessage('/track/select', command.selected);
    case 'selectedTrack:name': return new StringMessage('/track/name', command.name);
    case 'selectedTrack:pan': return new FloatMessage('/track/pan', command.pan);
    case 'selectedTrack:pan2': return new FloatMessage('/track/pan2', command.pan2);
    case 'selectedTrack:volume': return new FloatMessage('/track/volume', command.volume);
    case 'selectedTrack:volumeDb': return new FloatMessage('/track/volume/db', command.volumeDb);
    case 'selectedTrack:monitor': return new IntegerMessage('/track/monitor', command.monitor);

    // Selected track FX (bypass inverted)
    case 'selectedTrack:fx:bypass': return new BooleanMessage(`/fx/${command.fxNumber}/bypass`, !command.bypassed);
    case 'selectedTrack:fx:openUi': return new BooleanMessage(`/fx/${command.fxNumber}/openui`, command.open);
    case 'selectedTrack:fx:preset:next': return new OscMessage(`/fx/${command.fxNumber}/preset+`);
    case 'selectedTrack:fx:preset:prev': return new OscMessage(`/fx/${command.fxNumber}/preset-`);

    // Selected FX (bypass inverted)
    case 'selectedFx:bypass': return new BooleanMessage('/fx/bypass', !command.bypassed);
    case 'selectedFx:openUi': return new BooleanMessage('/fx/openui', command.open);
    case 'selectedFx:preset:next': return new OscMessage('/fx/preset+');
    case 'selectedFx:preset:prev': return new OscMessage('/fx/preset-');

    // Device navigation
    case 'device:track:select': return new OscMessage(`/device/track/select/${command.index}`);
    case 'device:track:next': return new OscMessage('/device/track/+');
    case 'device:track:prev': return new OscMessage('/device/track/-');
    case 'device:trackBank:select': return new OscMessage(`/device/track/bank/select/${command.index}`);
    case 'device:trackBank:next': return new OscMessage('/device/track/bank/+');
    case 'device:trackBank:prev': return new OscMessage('/device/track/bank/-');
    case 'device:fx:select': return new OscMessage(`/device/fx/select/${command.index}`);
    case 'device:fx:next': return new OscMessage('/device/fx/+');
    case 'device:fx:prev': return new OscMessage('/device/fx/-');
    case 'device:fxParamBank:select': return new OscMessage(`/device/fxparam/bank/select/${command.index}`);
    case 'device:fxParamBank:next': return new OscMessage('/device/fxparam/bank/+');
    case 'device:fxParamBank:prev': return new OscMessage('/device/fxparam/bank/-');
    case 'device:fxInstParamBank:select': return new OscMessage(`/device/fxinstparam/bank/select/${command.index}`);
    case 'device:fxInstParamBank:next': return new OscMessage('/device/fxinstparam/bank/+');
    case 'device:fxInstParamBank:prev': return new OscMessage('/device/fxinstparam/bank/-');
    case 'device:markerBank:select': return new OscMessage(`/device/marker/bank/select/${command.index}`);
    case 'device:markerBank:next': return new OscMessage('/device/marker/bank/+');
    case 'device:markerBank:prev': return new OscMessage('/device/marker/bank/-');
    case 'device:regionBank:select': return new OscMessage(`/device/region/bank/select/${command.index}`);
    case 'device:regionBank:next': return new OscMessage('/device/region/bank/+');
    case 'device:regionBank:prev': return new OscMessage('/device/region/bank/-');

    // Raw
    case 'raw': return command.message;
  }
}
