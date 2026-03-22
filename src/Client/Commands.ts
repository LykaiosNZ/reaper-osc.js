/**
 * Strongly typed commands accepted by {@link ReaperOscClient} for sending messages to Reaper
 * @module
 */
import {ActionMessage, BooleanMessage, FloatMessage, IntegerMessage, OscMessage, StringMessage} from '../Messages';
import {RecordMonitoringMode} from './Events';

// --- Global Commands ---

export interface ToggleMetronome { type: 'metronome:toggle' }
export function ToggleMetronome(): ToggleMetronome { return {type: 'metronome:toggle'}; }

export interface ToggleAutoRecordArm { type: 'autoRecordArm:toggle' }
export function ToggleAutoRecordArm(): ToggleAutoRecordArm { return {type: 'autoRecordArm:toggle'}; }

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

export interface SetTrackRecordArm { type: 'track:recordArm'; trackNumber: number; armed: boolean }
export function SetTrackRecordArm(trackNumber: number, armed: boolean): SetTrackRecordArm { return {type: 'track:recordArm', trackNumber, armed}; }

export interface ToggleTrackRecordArm { type: 'track:recordArm:toggle'; trackNumber: number }
export function ToggleTrackRecordArm(trackNumber: number): ToggleTrackRecordArm { return {type: 'track:recordArm:toggle', trackNumber}; }

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

export interface SetTrackMonitoringMode { type: 'track:monitoringMode'; trackNumber: number; mode: RecordMonitoringMode }
export function SetTrackMonitoringMode(trackNumber: number, mode: RecordMonitoringMode): SetTrackMonitoringMode { return {type: 'track:monitoringMode', trackNumber, mode: mode}; }

// --- Track FX Commands ---

export interface SetTrackFxBypass { type: 'track:fx:bypass'; trackNumber: number; fxNumber: number; bypassed: boolean }
export function SetTrackFxBypass(trackNumber: number, fxNumber: number, bypassed: boolean): SetTrackFxBypass { return {type: 'track:fx:bypass', trackNumber, fxNumber, bypassed}; }

export interface SetTrackFxOpenUi { type: 'track:fx:openUi'; trackNumber: number; fxNumber: number; open: boolean }
export function SetTrackFxOpenUi(trackNumber: number, fxNumber: number, open: boolean): SetTrackFxOpenUi { return {type: 'track:fx:openUi', trackNumber, fxNumber, open}; }

export interface NextTrackFxPreset { type: 'track:fx:preset:next'; trackNumber: number; fxNumber: number }
export function NextTrackFxPreset(trackNumber: number, fxNumber: number): NextTrackFxPreset { return {type: 'track:fx:preset:next', trackNumber, fxNumber}; }

export interface PreviousTrackFxPreset { type: 'track:fx:preset:previous'; trackNumber: number; fxNumber: number }
export function PreviousTrackFxPreset(trackNumber: number, fxNumber: number): PreviousTrackFxPreset { return {type: 'track:fx:preset:previous', trackNumber, fxNumber}; }

// --- Selected Track Commands ---

export interface SetSelectedTrackMute { type: 'selectedTrack:mute'; muted: boolean }
export function SetSelectedTrackMute(muted: boolean): SetSelectedTrackMute { return {type: 'selectedTrack:mute', muted}; }

export interface ToggleSelectedTrackMute { type: 'selectedTrack:mute:toggle' }
export function ToggleSelectedTrackMute(): ToggleSelectedTrackMute { return {type: 'selectedTrack:mute:toggle'}; }

export interface SetSelectedTrackSolo { type: 'selectedTrack:solo'; soloed: boolean }
export function SetSelectedTrackSolo(soloed: boolean): SetSelectedTrackSolo { return {type: 'selectedTrack:solo', soloed}; }

export interface ToggleSelectedTrackSolo { type: 'selectedTrack:solo:toggle' }
export function ToggleSelectedTrackSolo(): ToggleSelectedTrackSolo { return {type: 'selectedTrack:solo:toggle'}; }

export interface SetSelectedTrackRecordArm { type: 'selectedTrack:recordArm'; armed: boolean }
export function SetSelectedTrackRecordArm(armed: boolean): SetSelectedTrackRecordArm { return {type: 'selectedTrack:recordArm', armed}; }

export interface ToggleSelectedTrackRecordArm { type: 'selectedTrack:recordArm:toggle' }
export function ToggleSelectedTrackRecordArm(): ToggleSelectedTrackRecordArm { return {type: 'selectedTrack:recordArm:toggle'}; }

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

export interface SetSelectedTrackMonitoringMode { type: 'selectedTrack:monitoringMode'; mode: RecordMonitoringMode }
export function SetSelectedTrackMonitoringMode(mode: RecordMonitoringMode): SetSelectedTrackMonitoringMode { return {type: 'selectedTrack:monitoringMode', mode: mode}; }

// --- Selected Track FX Commands ---

export interface SetSelectedTrackFxBypass { type: 'selectedTrack:fx:bypass'; fxNumber: number; bypassed: boolean }
export function SetSelectedTrackFxBypass(fxNumber: number, bypassed: boolean): SetSelectedTrackFxBypass { return {type: 'selectedTrack:fx:bypass', fxNumber, bypassed}; }

export interface SetSelectedTrackFxOpenUi { type: 'selectedTrack:fx:openUi'; fxNumber: number; open: boolean }
export function SetSelectedTrackFxOpenUi(fxNumber: number, open: boolean): SetSelectedTrackFxOpenUi { return {type: 'selectedTrack:fx:openUi', fxNumber, open}; }

export interface NextSelectedTrackFxPreset { type: 'selectedTrack:fx:preset:next'; fxNumber: number }
export function NextSelectedTrackFxPreset(fxNumber: number): NextSelectedTrackFxPreset { return {type: 'selectedTrack:fx:preset:next', fxNumber}; }

export interface PreviousSelectedTrackFxPreset { type: 'selectedTrack:fx:preset:previous'; fxNumber: number }
export function PreviousSelectedTrackFxPreset(fxNumber: number): PreviousSelectedTrackFxPreset { return {type: 'selectedTrack:fx:preset:previous', fxNumber}; }

// --- Selected FX Commands ---

export interface SetSelectedFxBypass { type: 'selectedFx:bypass'; bypassed: boolean }
export function SetSelectedFxBypass(bypassed: boolean): SetSelectedFxBypass { return {type: 'selectedFx:bypass', bypassed}; }

export interface SetSelectedFxOpenUi { type: 'selectedFx:openUi'; open: boolean }
export function SetSelectedFxOpenUi(open: boolean): SetSelectedFxOpenUi { return {type: 'selectedFx:openUi', open}; }

export interface NextSelectedFxPreset { type: 'selectedFx:preset:next' }
export function NextSelectedFxPreset(): NextSelectedFxPreset { return {type: 'selectedFx:preset:next'}; }

export interface PreviousSelectedFxPreset { type: 'selectedFx:preset:previous' }
export function PreviousSelectedFxPreset(): PreviousSelectedFxPreset { return {type: 'selectedFx:preset:previous'}; }

// --- Track Send Commands ---

export interface SetTrackSendVolume { type: 'track:send:volume'; trackNumber: number; sendNumber: number; volume: number }
export function SetTrackSendVolume(trackNumber: number, sendNumber: number, volume: number): SetTrackSendVolume { return {type: 'track:send:volume', trackNumber, sendNumber, volume}; }

export interface SetTrackSendPan { type: 'track:send:pan'; trackNumber: number; sendNumber: number; pan: number }
export function SetTrackSendPan(trackNumber: number, sendNumber: number, pan: number): SetTrackSendPan { return {type: 'track:send:pan', trackNumber, sendNumber, pan}; }

// --- Track Receive Commands ---

export interface SetTrackReceiveVolume { type: 'track:recv:volume'; trackNumber: number; receiveNumber: number; volume: number }
export function SetTrackReceiveVolume(trackNumber: number, receiveNumber: number, volume: number): SetTrackReceiveVolume { return {type: 'track:recv:volume', trackNumber, receiveNumber, volume}; }

export interface SetTrackReceivePan { type: 'track:recv:pan'; trackNumber: number; receiveNumber: number; pan: number }
export function SetTrackReceivePan(trackNumber: number, receiveNumber: number, pan: number): SetTrackReceivePan { return {type: 'track:recv:pan', trackNumber, receiveNumber, pan}; }

// --- Selected Track Send Commands ---

export interface SetSelectedTrackSendVolume { type: 'selectedTrack:send:volume'; sendNumber: number; volume: number }
export function SetSelectedTrackSendVolume(sendNumber: number, volume: number): SetSelectedTrackSendVolume { return {type: 'selectedTrack:send:volume', sendNumber, volume}; }

export interface SetSelectedTrackSendPan { type: 'selectedTrack:send:pan'; sendNumber: number; pan: number }
export function SetSelectedTrackSendPan(sendNumber: number, pan: number): SetSelectedTrackSendPan { return {type: 'selectedTrack:send:pan', sendNumber, pan}; }

// --- Selected Track Receive Commands ---

export interface SetSelectedTrackReceiveVolume { type: 'selectedTrack:recv:volume'; receiveNumber: number; volume: number }
export function SetSelectedTrackReceiveVolume(receiveNumber: number, volume: number): SetSelectedTrackReceiveVolume { return {type: 'selectedTrack:recv:volume', receiveNumber, volume}; }

export interface SetSelectedTrackReceivePan { type: 'selectedTrack:recv:pan'; receiveNumber: number; pan: number }
export function SetSelectedTrackReceivePan(receiveNumber: number, pan: number): SetSelectedTrackReceivePan { return {type: 'selectedTrack:recv:pan', receiveNumber, pan}; }

// --- Viewport Scroll Commands (boolean: held, like rewind/forward) ---

export interface SetScrollLeft { type: 'viewport:scroll:left'; active: boolean }
export function SetScrollLeft(active: boolean): SetScrollLeft { return {type: 'viewport:scroll:left', active}; }

export interface SetScrollRight { type: 'viewport:scroll:right'; active: boolean }
export function SetScrollRight(active: boolean): SetScrollRight { return {type: 'viewport:scroll:right', active}; }

export interface SetScrollUp { type: 'viewport:scroll:up'; active: boolean }
export function SetScrollUp(active: boolean): SetScrollUp { return {type: 'viewport:scroll:up', active}; }

export interface SetScrollDown { type: 'viewport:scroll:down'; active: boolean }
export function SetScrollDown(active: boolean): SetScrollDown { return {type: 'viewport:scroll:down', active}; }

// --- Viewport Zoom Commands (boolean: held) ---

export interface SetZoomInX { type: 'viewport:zoom:in:x'; active: boolean }
export function SetZoomInX(active: boolean): SetZoomInX { return {type: 'viewport:zoom:in:x', active}; }

export interface SetZoomOutX { type: 'viewport:zoom:out:x'; active: boolean }
export function SetZoomOutX(active: boolean): SetZoomOutX { return {type: 'viewport:zoom:out:x', active}; }

export interface SetZoomInY { type: 'viewport:zoom:in:y'; active: boolean }
export function SetZoomInY(active: boolean): SetZoomInY { return {type: 'viewport:zoom:in:y', active}; }

export interface SetZoomOutY { type: 'viewport:zoom:out:y'; active: boolean }
export function SetZoomOutY(active: boolean): SetZoomOutY { return {type: 'viewport:zoom:out:y', active}; }

// --- Viewport Scroll/Zoom Commands (rotary: positive = right/down/in, negative = left/up/out) ---

export interface ScrollX { type: 'viewport:scrollX'; value: number }
export function ScrollX(value: number): ScrollX { return {type: 'viewport:scrollX', value}; }

export interface ScrollY { type: 'viewport:scrollY'; value: number }
export function ScrollY(value: number): ScrollY { return {type: 'viewport:scrollY', value}; }

export interface ZoomX { type: 'viewport:zoomX'; value: number }
export function ZoomX(value: number): ZoomX { return {type: 'viewport:zoomX', value}; }

export interface ZoomY { type: 'viewport:zoomY'; value: number }
export function ZoomY(value: number): ZoomY { return {type: 'viewport:zoomY', value}; }

// --- Device Navigation Commands ---

export interface SelectDeviceTrack { type: 'device:track:select'; index: number }
export function SelectDeviceTrack(index: number): SelectDeviceTrack { return {type: 'device:track:select', index}; }

export interface NextDeviceTrack { type: 'device:track:next' }
export function NextDeviceTrack(): NextDeviceTrack { return {type: 'device:track:next'}; }

export interface PreviousDeviceTrack { type: 'device:track:previous' }
export function PreviousDeviceTrack(): PreviousDeviceTrack { return {type: 'device:track:previous'}; }

export interface SelectDeviceTrackBank { type: 'device:trackBank:select'; index: number }
export function SelectDeviceTrackBank(index: number): SelectDeviceTrackBank { return {type: 'device:trackBank:select', index}; }

export interface NextDeviceTrackBank { type: 'device:trackBank:next' }
export function NextDeviceTrackBank(): NextDeviceTrackBank { return {type: 'device:trackBank:next'}; }

export interface PreviousDeviceTrackBank { type: 'device:trackBank:previous' }
export function PreviousDeviceTrackBank(): PreviousDeviceTrackBank { return {type: 'device:trackBank:previous'}; }

export interface SelectDeviceFx { type: 'device:fx:select'; index: number }
export function SelectDeviceFx(index: number): SelectDeviceFx { return {type: 'device:fx:select', index}; }

export interface NextDeviceFx { type: 'device:fx:next' }
export function NextDeviceFx(): NextDeviceFx { return {type: 'device:fx:next'}; }

export interface PreviousDeviceFx { type: 'device:fx:previous' }
export function PreviousDeviceFx(): PreviousDeviceFx { return {type: 'device:fx:previous'}; }

export interface SelectDeviceFxParameterBank { type: 'device:fx:parameterBank:select'; index: number }
export function SelectDeviceFxParameterBank(index: number): SelectDeviceFxParameterBank { return {type: 'device:fx:parameterBank:select', index}; }

export interface NextDeviceFxParameterBank { type: 'device:fx:parameterBank:next' }
export function NextDeviceFxParameterBank(): NextDeviceFxParameterBank { return {type: 'device:fx:parameterBank:next'}; }

export interface PreviousDeviceFxParameterBank { type: 'device:fx:parameterBank:previous' }
export function PreviousDeviceFxParameterBank(): PreviousDeviceFxParameterBank { return {type: 'device:fx:parameterBank:previous'}; }

export interface SelectDeviceFxInstrumentParameterBank { type: 'device:fx:instrumentParameterBank:select'; index: number }
export function SelectDeviceFxInstrumentParameterBank(index: number): SelectDeviceFxInstrumentParameterBank { return {type: 'device:fx:instrumentParameterBank:select', index}; }

export interface NextDeviceFxInstrumentParameterBank { type: 'device:fx:instrumentParameterBank:next' }
export function NextDeviceFxInstrumentParameterBank(): NextDeviceFxInstrumentParameterBank { return {type: 'device:fx:instrumentParameterBank:next'}; }

export interface PreviousDeviceFxInstrumentParameterBank { type: 'device:fx:instrumentParameterBank:previous' }
export function PreviousDeviceFxInstrumentParameterBank(): PreviousDeviceFxInstrumentParameterBank { return {type: 'device:fx:instrumentParameterBank:previous'}; }

export interface SelectDeviceMarkerBank { type: 'device:markerBank:select'; index: number }
export function SelectDeviceMarkerBank(index: number): SelectDeviceMarkerBank { return {type: 'device:markerBank:select', index}; }

export interface NextDeviceMarkerBank { type: 'device:markerBank:next' }
export function NextDeviceMarkerBank(): NextDeviceMarkerBank { return {type: 'device:markerBank:next'}; }

export interface PreviousDeviceMarkerBank { type: 'device:markerBank:previous' }
export function PreviousDeviceMarkerBank(): PreviousDeviceMarkerBank { return {type: 'device:markerBank:previous'}; }

export interface SelectDeviceRegionBank { type: 'device:regionBank:select'; index: number }
export function SelectDeviceRegionBank(index: number): SelectDeviceRegionBank { return {type: 'device:regionBank:select', index}; }

export interface NextDeviceRegionBank { type: 'device:regionBank:next' }
export function NextDeviceRegionBank(): NextDeviceRegionBank { return {type: 'device:regionBank:next'}; }

export interface PreviousDeviceRegionBank { type: 'device:regionBank:previous' }
export function PreviousDeviceRegionBank(): PreviousDeviceRegionBank { return {type: 'device:regionBank:previous'}; }

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
  | SetTrackMonitoringMode
  // Track FX
  | SetTrackFxBypass
  | SetTrackFxOpenUi
  | NextTrackFxPreset
  | PreviousTrackFxPreset
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
  | SetSelectedTrackMonitoringMode
  // Selected Track FX
  | SetSelectedTrackFxBypass
  | SetSelectedTrackFxOpenUi
  | NextSelectedTrackFxPreset
  | PreviousSelectedTrackFxPreset
  // Selected FX
  | SetSelectedFxBypass
  | SetSelectedFxOpenUi
  | NextSelectedFxPreset
  | PreviousSelectedFxPreset
  // Track Sends
  | SetTrackSendVolume
  | SetTrackSendPan
  // Track Receives
  | SetTrackReceiveVolume
  | SetTrackReceivePan
  // Selected Track Sends
  | SetSelectedTrackSendVolume
  | SetSelectedTrackSendPan
  // Selected Track Receives
  | SetSelectedTrackReceiveVolume
  | SetSelectedTrackReceivePan
  // Viewport Scroll (boolean)
  | SetScrollLeft
  | SetScrollRight
  | SetScrollUp
  | SetScrollDown
  // Viewport Zoom (boolean)
  | SetZoomInX
  | SetZoomOutX
  | SetZoomInY
  | SetZoomOutY
  // Viewport Scroll/Zoom (rotary)
  | ScrollX
  | ScrollY
  | ZoomX
  | ZoomY
  // Device Navigation
  | SelectDeviceTrack
  | NextDeviceTrack
  | PreviousDeviceTrack
  | SelectDeviceTrackBank
  | NextDeviceTrackBank
  | PreviousDeviceTrackBank
  | SelectDeviceFx
  | NextDeviceFx
  | PreviousDeviceFx
  | SelectDeviceFxParameterBank
  | NextDeviceFxParameterBank
  | PreviousDeviceFxParameterBank
  | SelectDeviceFxInstrumentParameterBank
  | NextDeviceFxInstrumentParameterBank
  | PreviousDeviceFxInstrumentParameterBank
  | SelectDeviceMarkerBank
  | NextDeviceMarkerBank
  | PreviousDeviceMarkerBank
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
    case 'autoRecordArm:toggle': return new OscMessage('/autorecarm');
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
    case 'track:recordArm': return new BooleanMessage(`/track/${command.trackNumber}/recarm`, command.armed);
    case 'track:recordArm:toggle': return new OscMessage(`/track/${command.trackNumber}/recarm/toggle`);
    case 'track:select': return new BooleanMessage(`/track/${command.trackNumber}/select`, command.selected);
    case 'track:name': return new StringMessage(`/track/${command.trackNumber}/name`, command.name);
    case 'track:pan': return new FloatMessage(`/track/${command.trackNumber}/pan`, command.pan);
    case 'track:pan2': return new FloatMessage(`/track/${command.trackNumber}/pan2`, command.pan2);
    case 'track:volume': return new FloatMessage(`/track/${command.trackNumber}/volume`, command.volume);
    case 'track:volumeDb': return new FloatMessage(`/track/${command.trackNumber}/volume/db`, command.volumeDb);
    case 'track:monitoringMode': return new IntegerMessage(`/track/${command.trackNumber}/monitor`, command.mode);

    // Track FX (bypass is inverted on the wire: false = bypassed)
    case 'track:fx:bypass': return new BooleanMessage(`/track/${command.trackNumber}/fx/${command.fxNumber}/bypass`, !command.bypassed);
    case 'track:fx:openUi': return new BooleanMessage(`/track/${command.trackNumber}/fx/${command.fxNumber}/openui`, command.open);
    case 'track:fx:preset:next': return new OscMessage(`/track/${command.trackNumber}/fx/${command.fxNumber}/preset+`);
    case 'track:fx:preset:previous': return new OscMessage(`/track/${command.trackNumber}/fx/${command.fxNumber}/preset-`);

    // Selected track
    case 'selectedTrack:mute': return new BooleanMessage('/track/mute', command.muted);
    case 'selectedTrack:mute:toggle': return new OscMessage('/track/mute/toggle');
    case 'selectedTrack:solo': return new BooleanMessage('/track/solo', command.soloed);
    case 'selectedTrack:solo:toggle': return new OscMessage('/track/solo/toggle');
    case 'selectedTrack:recordArm': return new BooleanMessage('/track/recarm', command.armed);
    case 'selectedTrack:recordArm:toggle': return new OscMessage('/track/recarm/toggle');
    case 'selectedTrack:select': return new BooleanMessage('/track/select', command.selected);
    case 'selectedTrack:name': return new StringMessage('/track/name', command.name);
    case 'selectedTrack:pan': return new FloatMessage('/track/pan', command.pan);
    case 'selectedTrack:pan2': return new FloatMessage('/track/pan2', command.pan2);
    case 'selectedTrack:volume': return new FloatMessage('/track/volume', command.volume);
    case 'selectedTrack:volumeDb': return new FloatMessage('/track/volume/db', command.volumeDb);
    case 'selectedTrack:monitoringMode': return new IntegerMessage('/track/monitor', command.mode);

    // Selected track FX (bypass inverted)
    case 'selectedTrack:fx:bypass': return new BooleanMessage(`/fx/${command.fxNumber}/bypass`, !command.bypassed);
    case 'selectedTrack:fx:openUi': return new BooleanMessage(`/fx/${command.fxNumber}/openui`, command.open);
    case 'selectedTrack:fx:preset:next': return new OscMessage(`/fx/${command.fxNumber}/preset+`);
    case 'selectedTrack:fx:preset:previous': return new OscMessage(`/fx/${command.fxNumber}/preset-`);

    // Selected FX (bypass inverted)
    case 'selectedFx:bypass': return new BooleanMessage('/fx/bypass', !command.bypassed);
    case 'selectedFx:openUi': return new BooleanMessage('/fx/openui', command.open);
    case 'selectedFx:preset:next': return new OscMessage('/fx/preset+');
    case 'selectedFx:preset:previous': return new OscMessage('/fx/preset-');

    // Track sends
    case 'track:send:volume': return new FloatMessage(`/track/${command.trackNumber}/send/${command.sendNumber}/volume`, command.volume);
    case 'track:send:pan': return new FloatMessage(`/track/${command.trackNumber}/send/${command.sendNumber}/pan`, command.pan);
    // Track receives
    case 'track:recv:volume': return new FloatMessage(`/track/${command.trackNumber}/recv/${command.receiveNumber}/volume`, command.volume);
    case 'track:recv:pan': return new FloatMessage(`/track/${command.trackNumber}/recv/${command.receiveNumber}/pan`, command.pan);
    // Selected track sends
    case 'selectedTrack:send:volume': return new FloatMessage(`/track/send/${command.sendNumber}/volume`, command.volume);
    case 'selectedTrack:send:pan': return new FloatMessage(`/track/send/${command.sendNumber}/pan`, command.pan);
    // Selected track receives
    case 'selectedTrack:recv:volume': return new FloatMessage(`/track/recv/${command.receiveNumber}/volume`, command.volume);
    case 'selectedTrack:recv:pan': return new FloatMessage(`/track/recv/${command.receiveNumber}/pan`, command.pan);

    // Viewport scroll (boolean)
    case 'viewport:scroll:left': return new BooleanMessage('/scroll/x/-', command.active);
    case 'viewport:scroll:right': return new BooleanMessage('/scroll/x/+', command.active);
    case 'viewport:scroll:up': return new BooleanMessage('/scroll/y/-', command.active);
    case 'viewport:scroll:down': return new BooleanMessage('/scroll/y/+', command.active);
    // Viewport zoom (boolean)
    case 'viewport:zoom:in:x': return new BooleanMessage('/zoom/x/+', command.active);
    case 'viewport:zoom:out:x': return new BooleanMessage('/zoom/x/-', command.active);
    case 'viewport:zoom:in:y': return new BooleanMessage('/zoom/y/+', command.active);
    case 'viewport:zoom:out:y': return new BooleanMessage('/zoom/y/-', command.active);
    // Viewport scroll/zoom (rotary)
    case 'viewport:scrollX': return new FloatMessage('/scroll/x', command.value);
    case 'viewport:scrollY': return new FloatMessage('/scroll/y', command.value);
    case 'viewport:zoomX': return new FloatMessage('/zoom/x', command.value);
    case 'viewport:zoomY': return new FloatMessage('/zoom/y', command.value);

    // Device navigation
    case 'device:track:select': return new OscMessage(`/device/track/select/${command.index}`);
    case 'device:track:next': return new OscMessage('/device/track/+');
    case 'device:track:previous': return new OscMessage('/device/track/-');
    case 'device:trackBank:select': return new OscMessage(`/device/track/bank/select/${command.index}`);
    case 'device:trackBank:next': return new OscMessage('/device/track/bank/+');
    case 'device:trackBank:previous': return new OscMessage('/device/track/bank/-');
    case 'device:fx:select': return new OscMessage(`/device/fx/select/${command.index}`);
    case 'device:fx:next': return new OscMessage('/device/fx/+');
    case 'device:fx:previous': return new OscMessage('/device/fx/-');
    case 'device:fx:parameterBank:select': return new OscMessage(`/device/fxparam/bank/select/${command.index}`);
    case 'device:fx:parameterBank:next': return new OscMessage('/device/fxparam/bank/+');
    case 'device:fx:parameterBank:previous': return new OscMessage('/device/fxparam/bank/-');
    case 'device:fx:instrumentParameterBank:select': return new OscMessage(`/device/fxinstparam/bank/select/${command.index}`);
    case 'device:fx:instrumentParameterBank:next': return new OscMessage('/device/fxinstparam/bank/+');
    case 'device:fx:instrumentParameterBank:previous': return new OscMessage('/device/fxinstparam/bank/-');
    case 'device:markerBank:select': return new OscMessage(`/device/marker/bank/select/${command.index}`);
    case 'device:markerBank:next': return new OscMessage('/device/marker/bank/+');
    case 'device:markerBank:previous': return new OscMessage('/device/marker/bank/-');
    case 'device:regionBank:select': return new OscMessage(`/device/region/bank/select/${command.index}`);
    case 'device:regionBank:next': return new OscMessage('/device/region/bank/+');
    case 'device:regionBank:previous': return new OscMessage('/device/region/bank/-');

    // Raw
    case 'raw': return command.message;
  }
}
