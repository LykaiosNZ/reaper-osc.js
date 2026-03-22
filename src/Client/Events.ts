/**
 * Strongly typed events emitted by {@link ReaperOscClient} when messages are received from Reaper
 * @module
 */
import {OscMessage} from '../Messages';

// --- Enums ---

export enum RecordMonitoringMode {
  /** Record monitoring disabled */
  OFF = 0,
  /** Record monitoring enabled */
  ON = 1,
  /** Tape auto style */
  AUTO = 2,
}

// --- Global Events ---

export interface MetronomeEvent { type: 'metronome'; enabled: boolean }
export function MetronomeEvent(enabled: boolean): MetronomeEvent { return {type: 'metronome', enabled}; }

export interface AutoRecordArmEvent { type: 'autoRecordArm'; enabled: boolean }
export function AutoRecordArmEvent(enabled: boolean): AutoRecordArmEvent { return {type: 'autoRecordArm', enabled}; }

export interface AnySoloEvent { type: 'anySolo'; active: boolean }
export function AnySoloEvent(active: boolean): AnySoloEvent { return {type: 'anySolo', active}; }

// --- Transport Events ---

export interface PlayEvent { type: 'transport:play'; playing: boolean }
export function PlayEvent(playing: boolean): PlayEvent { return {type: 'transport:play', playing}; }

export interface StopEvent { type: 'transport:stop'; stopped: boolean }
export function StopEvent(stopped: boolean): StopEvent { return {type: 'transport:stop', stopped}; }

export interface PauseEvent { type: 'transport:pause'; paused: boolean }
export function PauseEvent(paused: boolean): PauseEvent { return {type: 'transport:pause', paused}; }

export interface RecordEvent { type: 'transport:record'; recording: boolean }
export function RecordEvent(recording: boolean): RecordEvent { return {type: 'transport:record', recording}; }

export interface RewindEvent { type: 'transport:rewind'; rewinding: boolean }
export function RewindEvent(rewinding: boolean): RewindEvent { return {type: 'transport:rewind', rewinding}; }

export interface FastForwardEvent { type: 'transport:fastForward'; fastForwarding: boolean }
export function FastForwardEvent(fastForwarding: boolean): FastForwardEvent { return {type: 'transport:fastForward', fastForwarding}; }

export interface RepeatEvent { type: 'transport:repeat'; enabled: boolean }
export function RepeatEvent(enabled: boolean): RepeatEvent { return {type: 'transport:repeat', enabled}; }

export interface TimeChanged { type: 'transport:time'; time: number }
export function TimeChanged(time: number): TimeChanged { return {type: 'transport:time', time}; }

export interface BeatChanged { type: 'transport:beat'; beat: string }
export function BeatChanged(beat: string): BeatChanged { return {type: 'transport:beat', beat}; }

export interface FramesChanged { type: 'transport:frames'; frames: string }
export function FramesChanged(frames: string): FramesChanged { return {type: 'transport:frames', frames}; }

export interface LoopStartChanged { type: 'transport:loopStart'; time: number }
export function LoopStartChanged(time: number): LoopStartChanged { return {type: 'transport:loopStart', time}; }

export interface LoopEndChanged { type: 'transport:loopEnd'; time: number }
export function LoopEndChanged(time: number): LoopEndChanged { return {type: 'transport:loopEnd', time}; }

// --- Track Events ---

export interface TrackMuteEvent { type: 'track:mute'; trackNumber: number; muted: boolean }
export function TrackMuteEvent(trackNumber: number, muted: boolean): TrackMuteEvent { return {type: 'track:mute', trackNumber, muted}; }

export interface TrackSoloEvent { type: 'track:solo'; trackNumber: number; soloed: boolean }
export function TrackSoloEvent(trackNumber: number, soloed: boolean): TrackSoloEvent { return {type: 'track:solo', trackNumber, soloed}; }

export interface TrackRecordArmEvent { type: 'track:recordArm'; trackNumber: number; armed: boolean }
export function TrackRecordArmEvent(trackNumber: number, armed: boolean): TrackRecordArmEvent { return {type: 'track:recordArm', trackNumber, armed}; }

export interface TrackSelectEvent { type: 'track:select'; trackNumber: number; selected: boolean }
export function TrackSelectEvent(trackNumber: number, selected: boolean): TrackSelectEvent { return {type: 'track:select', trackNumber, selected}; }

export interface TrackNameChanged { type: 'track:name'; trackNumber: number; name: string }
export function TrackNameChanged(trackNumber: number, name: string): TrackNameChanged { return {type: 'track:name', trackNumber, name}; }

export interface TrackPanChanged { type: 'track:pan'; trackNumber: number; pan: number }
export function TrackPanChanged(trackNumber: number, pan: number): TrackPanChanged { return {type: 'track:pan', trackNumber, pan}; }

export interface TrackPan2Changed { type: 'track:pan2'; trackNumber: number; pan2: number }
export function TrackPan2Changed(trackNumber: number, pan2: number): TrackPan2Changed { return {type: 'track:pan2', trackNumber, pan2}; }

export interface TrackPanModeChanged { type: 'track:panMode'; trackNumber: number; panMode: string }
export function TrackPanModeChanged(trackNumber: number, panMode: string): TrackPanModeChanged { return {type: 'track:panMode', trackNumber, panMode}; }

export interface TrackVolumeChanged { type: 'track:volume'; trackNumber: number; volume: number }
export function TrackVolumeChanged(trackNumber: number, volume: number): TrackVolumeChanged { return {type: 'track:volume', trackNumber, volume}; }

export interface TrackVolumeDbChanged { type: 'track:volumeDb'; trackNumber: number; volumeDb: number }
export function TrackVolumeDbChanged(trackNumber: number, volumeDb: number): TrackVolumeDbChanged { return {type: 'track:volumeDb', trackNumber, volumeDb}; }

export interface TrackVuChanged { type: 'track:vu'; trackNumber: number; vu: number }
export function TrackVuChanged(trackNumber: number, vu: number): TrackVuChanged { return {type: 'track:vu', trackNumber, vu}; }

export interface TrackVuLeftChanged { type: 'track:vuLeft'; trackNumber: number; vuLeft: number }
export function TrackVuLeftChanged(trackNumber: number, vuLeft: number): TrackVuLeftChanged { return {type: 'track:vuLeft', trackNumber, vuLeft}; }

export interface TrackVuRightChanged { type: 'track:vuRight'; trackNumber: number; vuRight: number }
export function TrackVuRightChanged(trackNumber: number, vuRight: number): TrackVuRightChanged { return {type: 'track:vuRight', trackNumber, vuRight}; }

export interface TrackMonitoringModeChanged { type: 'track:monitoringMode'; trackNumber: number; mode: RecordMonitoringMode }
export function TrackMonitoringModeChanged(trackNumber: number, mode: RecordMonitoringMode): TrackMonitoringModeChanged { return {type: 'track:monitoringMode', trackNumber, mode: mode}; }

// --- Track FX Events ---

export interface TrackFxNameChanged { type: 'track:fx:name'; trackNumber: number; fxNumber: number; name: string }
export function TrackFxNameChanged(trackNumber: number, fxNumber: number, name: string): TrackFxNameChanged { return {type: 'track:fx:name', trackNumber, fxNumber, name}; }

export interface TrackFxBypassEvent { type: 'track:fx:bypass'; trackNumber: number; fxNumber: number; bypassed: boolean }
export function TrackFxBypassEvent(trackNumber: number, fxNumber: number, bypassed: boolean): TrackFxBypassEvent { return {type: 'track:fx:bypass', trackNumber, fxNumber, bypassed}; }

export interface TrackFxOpenUiEvent { type: 'track:fx:openUi'; trackNumber: number; fxNumber: number; open: boolean }
export function TrackFxOpenUiEvent(trackNumber: number, fxNumber: number, open: boolean): TrackFxOpenUiEvent { return {type: 'track:fx:openUi', trackNumber, fxNumber, open}; }

export interface TrackFxPresetChanged { type: 'track:fx:preset'; trackNumber: number; fxNumber: number; preset: string }
export function TrackFxPresetChanged(trackNumber: number, fxNumber: number, preset: string): TrackFxPresetChanged { return {type: 'track:fx:preset', trackNumber, fxNumber, preset}; }

// --- Selected Track Events ---

export interface SelectedTrackMuteEvent { type: 'selectedTrack:mute'; muted: boolean }
export function SelectedTrackMuteEvent(muted: boolean): SelectedTrackMuteEvent { return {type: 'selectedTrack:mute', muted}; }

export interface SelectedTrackSoloEvent { type: 'selectedTrack:solo'; soloed: boolean }
export function SelectedTrackSoloEvent(soloed: boolean): SelectedTrackSoloEvent { return {type: 'selectedTrack:solo', soloed}; }

export interface SelectedTrackRecordArmEvent { type: 'selectedTrack:recordArm'; armed: boolean }
export function SelectedTrackRecordArmEvent(armed: boolean): SelectedTrackRecordArmEvent { return {type: 'selectedTrack:recordArm', armed}; }

export interface SelectedTrackSelectEvent { type: 'selectedTrack:select'; selected: boolean }
export function SelectedTrackSelectEvent(selected: boolean): SelectedTrackSelectEvent { return {type: 'selectedTrack:select', selected}; }

export interface SelectedTrackNameChanged { type: 'selectedTrack:name'; name: string }
export function SelectedTrackNameChanged(name: string): SelectedTrackNameChanged { return {type: 'selectedTrack:name', name}; }

export interface SelectedTrackPanChanged { type: 'selectedTrack:pan'; pan: number }
export function SelectedTrackPanChanged(pan: number): SelectedTrackPanChanged { return {type: 'selectedTrack:pan', pan}; }

export interface SelectedTrackPan2Changed { type: 'selectedTrack:pan2'; pan2: number }
export function SelectedTrackPan2Changed(pan2: number): SelectedTrackPan2Changed { return {type: 'selectedTrack:pan2', pan2}; }

export interface SelectedTrackPanModeChanged { type: 'selectedTrack:panMode'; panMode: string }
export function SelectedTrackPanModeChanged(panMode: string): SelectedTrackPanModeChanged { return {type: 'selectedTrack:panMode', panMode}; }

export interface SelectedTrackVolumeChanged { type: 'selectedTrack:volume'; volume: number }
export function SelectedTrackVolumeChanged(volume: number): SelectedTrackVolumeChanged { return {type: 'selectedTrack:volume', volume}; }

export interface SelectedTrackVolumeDbChanged { type: 'selectedTrack:volumeDb'; volumeDb: number }
export function SelectedTrackVolumeDbChanged(volumeDb: number): SelectedTrackVolumeDbChanged { return {type: 'selectedTrack:volumeDb', volumeDb}; }

export interface SelectedTrackVuChanged { type: 'selectedTrack:vu'; vu: number }
export function SelectedTrackVuChanged(vu: number): SelectedTrackVuChanged { return {type: 'selectedTrack:vu', vu}; }

export interface SelectedTrackVuLeftChanged { type: 'selectedTrack:vuLeft'; vuLeft: number }
export function SelectedTrackVuLeftChanged(vuLeft: number): SelectedTrackVuLeftChanged { return {type: 'selectedTrack:vuLeft', vuLeft}; }

export interface SelectedTrackVuRightChanged { type: 'selectedTrack:vuRight'; vuRight: number }
export function SelectedTrackVuRightChanged(vuRight: number): SelectedTrackVuRightChanged { return {type: 'selectedTrack:vuRight', vuRight}; }

export interface SelectedTrackMonitoringModeChanged { type: 'selectedTrack:monitoringMode'; mode: RecordMonitoringMode }
export function SelectedTrackMonitoringModeChanged(mode: RecordMonitoringMode): SelectedTrackMonitoringModeChanged { return {type: 'selectedTrack:monitoringMode', mode: mode}; }

// --- Selected Track FX Events ---

export interface SelectedTrackFxNameChanged { type: 'selectedTrack:fx:name'; fxNumber: number; name: string }
export function SelectedTrackFxNameChanged(fxNumber: number, name: string): SelectedTrackFxNameChanged { return {type: 'selectedTrack:fx:name', fxNumber, name}; }

export interface SelectedTrackFxBypassEvent { type: 'selectedTrack:fx:bypass'; fxNumber: number; bypassed: boolean }
export function SelectedTrackFxBypassEvent(fxNumber: number, bypassed: boolean): SelectedTrackFxBypassEvent { return {type: 'selectedTrack:fx:bypass', fxNumber, bypassed}; }

export interface SelectedTrackFxOpenUiEvent { type: 'selectedTrack:fx:openUi'; fxNumber: number; open: boolean }
export function SelectedTrackFxOpenUiEvent(fxNumber: number, open: boolean): SelectedTrackFxOpenUiEvent { return {type: 'selectedTrack:fx:openUi', fxNumber, open}; }

export interface SelectedTrackFxPresetChanged { type: 'selectedTrack:fx:preset'; fxNumber: number; preset: string }
export function SelectedTrackFxPresetChanged(fxNumber: number, preset: string): SelectedTrackFxPresetChanged { return {type: 'selectedTrack:fx:preset', fxNumber, preset}; }

// --- Selected FX Events ---

export interface SelectedFxNameChanged { type: 'selectedFx:name'; name: string }
export function SelectedFxNameChanged(name: string): SelectedFxNameChanged { return {type: 'selectedFx:name', name}; }

export interface SelectedFxBypassEvent { type: 'selectedFx:bypass'; bypassed: boolean }
export function SelectedFxBypassEvent(bypassed: boolean): SelectedFxBypassEvent { return {type: 'selectedFx:bypass', bypassed}; }

export interface SelectedFxOpenUiEvent { type: 'selectedFx:openUi'; open: boolean }
export function SelectedFxOpenUiEvent(open: boolean): SelectedFxOpenUiEvent { return {type: 'selectedFx:openUi', open}; }

export interface SelectedFxPresetChanged { type: 'selectedFx:preset'; preset: string }
export function SelectedFxPresetChanged(preset: string): SelectedFxPresetChanged { return {type: 'selectedFx:preset', preset}; }

// --- Track Send Events ---

export interface TrackSendNameChanged { type: 'track:send:name'; trackNumber: number; sendNumber: number; name: string }
export function TrackSendNameChanged(trackNumber: number, sendNumber: number, name: string): TrackSendNameChanged { return {type: 'track:send:name', trackNumber, sendNumber, name}; }

export interface TrackSendVolumeChanged { type: 'track:send:volume'; trackNumber: number; sendNumber: number; volume: number }
export function TrackSendVolumeChanged(trackNumber: number, sendNumber: number, volume: number): TrackSendVolumeChanged { return {type: 'track:send:volume', trackNumber, sendNumber, volume}; }

export interface TrackSendVolumeStrChanged { type: 'track:send:volumeStr'; trackNumber: number; sendNumber: number; volumeStr: string }
export function TrackSendVolumeStrChanged(trackNumber: number, sendNumber: number, volumeStr: string): TrackSendVolumeStrChanged { return {type: 'track:send:volumeStr', trackNumber, sendNumber, volumeStr}; }

export interface TrackSendPanChanged { type: 'track:send:pan'; trackNumber: number; sendNumber: number; pan: number }
export function TrackSendPanChanged(trackNumber: number, sendNumber: number, pan: number): TrackSendPanChanged { return {type: 'track:send:pan', trackNumber, sendNumber, pan}; }

export interface TrackSendPanStrChanged { type: 'track:send:panStr'; trackNumber: number; sendNumber: number; panStr: string }
export function TrackSendPanStrChanged(trackNumber: number, sendNumber: number, panStr: string): TrackSendPanStrChanged { return {type: 'track:send:panStr', trackNumber, sendNumber, panStr}; }

// --- Track Receive Events ---

export interface TrackReceiveNameChanged { type: 'track:recv:name'; trackNumber: number; receiveNumber: number; name: string }
export function TrackReceiveNameChanged(trackNumber: number, receiveNumber: number, name: string): TrackReceiveNameChanged { return {type: 'track:recv:name', trackNumber, receiveNumber, name}; }

export interface TrackReceiveVolumeChanged { type: 'track:recv:volume'; trackNumber: number; receiveNumber: number; volume: number }
export function TrackReceiveVolumeChanged(trackNumber: number, receiveNumber: number, volume: number): TrackReceiveVolumeChanged { return {type: 'track:recv:volume', trackNumber, receiveNumber, volume}; }

export interface TrackReceiveVolumeStrChanged { type: 'track:recv:volumeStr'; trackNumber: number; receiveNumber: number; volumeStr: string }
export function TrackReceiveVolumeStrChanged(trackNumber: number, receiveNumber: number, volumeStr: string): TrackReceiveVolumeStrChanged { return {type: 'track:recv:volumeStr', trackNumber, receiveNumber, volumeStr}; }

export interface TrackReceivePanChanged { type: 'track:recv:pan'; trackNumber: number; receiveNumber: number; pan: number }
export function TrackReceivePanChanged(trackNumber: number, receiveNumber: number, pan: number): TrackReceivePanChanged { return {type: 'track:recv:pan', trackNumber, receiveNumber, pan}; }

export interface TrackReceivePanStrChanged { type: 'track:recv:panStr'; trackNumber: number; receiveNumber: number; panStr: string }
export function TrackReceivePanStrChanged(trackNumber: number, receiveNumber: number, panStr: string): TrackReceivePanStrChanged { return {type: 'track:recv:panStr', trackNumber, receiveNumber, panStr}; }

// --- Selected Track Send Events ---

export interface SelectedTrackSendNameChanged { type: 'selectedTrack:send:name'; sendNumber: number; name: string }
export function SelectedTrackSendNameChanged(sendNumber: number, name: string): SelectedTrackSendNameChanged { return {type: 'selectedTrack:send:name', sendNumber, name}; }

export interface SelectedTrackSendVolumeChanged { type: 'selectedTrack:send:volume'; sendNumber: number; volume: number }
export function SelectedTrackSendVolumeChanged(sendNumber: number, volume: number): SelectedTrackSendVolumeChanged { return {type: 'selectedTrack:send:volume', sendNumber, volume}; }

export interface SelectedTrackSendVolumeStrChanged { type: 'selectedTrack:send:volumeStr'; sendNumber: number; volumeStr: string }
export function SelectedTrackSendVolumeStrChanged(sendNumber: number, volumeStr: string): SelectedTrackSendVolumeStrChanged { return {type: 'selectedTrack:send:volumeStr', sendNumber, volumeStr}; }

export interface SelectedTrackSendPanChanged { type: 'selectedTrack:send:pan'; sendNumber: number; pan: number }
export function SelectedTrackSendPanChanged(sendNumber: number, pan: number): SelectedTrackSendPanChanged { return {type: 'selectedTrack:send:pan', sendNumber, pan}; }

export interface SelectedTrackSendPanStrChanged { type: 'selectedTrack:send:panStr'; sendNumber: number; panStr: string }
export function SelectedTrackSendPanStrChanged(sendNumber: number, panStr: string): SelectedTrackSendPanStrChanged { return {type: 'selectedTrack:send:panStr', sendNumber, panStr}; }

// --- Selected Track Receive Events ---

export interface SelectedTrackReceiveNameChanged { type: 'selectedTrack:recv:name'; receiveNumber: number; name: string }
export function SelectedTrackReceiveNameChanged(receiveNumber: number, name: string): SelectedTrackReceiveNameChanged { return {type: 'selectedTrack:recv:name', receiveNumber, name}; }

export interface SelectedTrackReceiveVolumeChanged { type: 'selectedTrack:recv:volume'; receiveNumber: number; volume: number }
export function SelectedTrackReceiveVolumeChanged(receiveNumber: number, volume: number): SelectedTrackReceiveVolumeChanged { return {type: 'selectedTrack:recv:volume', receiveNumber, volume}; }

export interface SelectedTrackReceiveVolumeStrChanged { type: 'selectedTrack:recv:volumeStr'; receiveNumber: number; volumeStr: string }
export function SelectedTrackReceiveVolumeStrChanged(receiveNumber: number, volumeStr: string): SelectedTrackReceiveVolumeStrChanged { return {type: 'selectedTrack:recv:volumeStr', receiveNumber, volumeStr}; }

export interface SelectedTrackReceivePanChanged { type: 'selectedTrack:recv:pan'; receiveNumber: number; pan: number }
export function SelectedTrackReceivePanChanged(receiveNumber: number, pan: number): SelectedTrackReceivePanChanged { return {type: 'selectedTrack:recv:pan', receiveNumber, pan}; }

export interface SelectedTrackReceivePanStrChanged { type: 'selectedTrack:recv:panStr'; receiveNumber: number; panStr: string }
export function SelectedTrackReceivePanStrChanged(receiveNumber: number, panStr: string): SelectedTrackReceivePanStrChanged { return {type: 'selectedTrack:recv:panStr', receiveNumber, panStr}; }

// --- Unknown Event ---

export interface UnknownEvent { type: 'unknown'; message: OscMessage }

// --- Union ---

export type ReaperOscEvent =
  // Global
  | MetronomeEvent
  | AutoRecordArmEvent
  | AnySoloEvent
  // Transport
  | PlayEvent
  | StopEvent
  | PauseEvent
  | RecordEvent
  | RewindEvent
  | FastForwardEvent
  | RepeatEvent
  | TimeChanged
  | BeatChanged
  | FramesChanged
  | LoopStartChanged
  | LoopEndChanged
  // Track
  | TrackMuteEvent
  | TrackSoloEvent
  | TrackRecordArmEvent
  | TrackSelectEvent
  | TrackNameChanged
  | TrackPanChanged
  | TrackPan2Changed
  | TrackPanModeChanged
  | TrackVolumeChanged
  | TrackVolumeDbChanged
  | TrackVuChanged
  | TrackVuLeftChanged
  | TrackVuRightChanged
  | TrackMonitoringModeChanged
  // Track FX
  | TrackFxNameChanged
  | TrackFxBypassEvent
  | TrackFxOpenUiEvent
  | TrackFxPresetChanged
  // Selected Track
  | SelectedTrackMuteEvent
  | SelectedTrackSoloEvent
  | SelectedTrackRecordArmEvent
  | SelectedTrackSelectEvent
  | SelectedTrackNameChanged
  | SelectedTrackPanChanged
  | SelectedTrackPan2Changed
  | SelectedTrackPanModeChanged
  | SelectedTrackVolumeChanged
  | SelectedTrackVolumeDbChanged
  | SelectedTrackVuChanged
  | SelectedTrackVuLeftChanged
  | SelectedTrackVuRightChanged
  | SelectedTrackMonitoringModeChanged
  // Selected Track FX
  | SelectedTrackFxNameChanged
  | SelectedTrackFxBypassEvent
  | SelectedTrackFxOpenUiEvent
  | SelectedTrackFxPresetChanged
  // Selected FX
  | SelectedFxNameChanged
  | SelectedFxBypassEvent
  | SelectedFxOpenUiEvent
  | SelectedFxPresetChanged
  // Track Sends
  | TrackSendNameChanged
  | TrackSendVolumeChanged
  | TrackSendVolumeStrChanged
  | TrackSendPanChanged
  | TrackSendPanStrChanged
  // Track Receives
  | TrackReceiveNameChanged
  | TrackReceiveVolumeChanged
  | TrackReceiveVolumeStrChanged
  | TrackReceivePanChanged
  | TrackReceivePanStrChanged
  // Selected Track Sends
  | SelectedTrackSendNameChanged
  | SelectedTrackSendVolumeChanged
  | SelectedTrackSendVolumeStrChanged
  | SelectedTrackSendPanChanged
  | SelectedTrackSendPanStrChanged
  // Selected Track Receives
  | SelectedTrackReceiveNameChanged
  | SelectedTrackReceiveVolumeChanged
  | SelectedTrackReceiveVolumeStrChanged
  | SelectedTrackReceivePanChanged
  | SelectedTrackReceivePanStrChanged
  // Unknown
  | UnknownEvent;
