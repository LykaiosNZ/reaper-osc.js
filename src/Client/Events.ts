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
export interface AutoRecordArmEvent { type: 'autoRecArm'; enabled: boolean }
export interface AnySoloEvent { type: 'anySolo'; active: boolean }

// --- Transport Events ---

export interface PlayEvent { type: 'transport:play'; playing: boolean }
export interface StopEvent { type: 'transport:stop'; stopped: boolean }
export interface PauseEvent { type: 'transport:pause'; paused: boolean }
export interface RecordEvent { type: 'transport:record'; recording: boolean }
export interface RewindEvent { type: 'transport:rewind'; rewinding: boolean }
export interface FastForwardEvent { type: 'transport:fastForward'; fastForwarding: boolean }
export interface RepeatEvent { type: 'transport:repeat'; enabled: boolean }
export interface TimeChanged { type: 'transport:time'; time: number }
export interface BeatChanged { type: 'transport:beat'; beat: string }
export interface FramesChanged { type: 'transport:frames'; frames: string }
export interface LoopStartChanged { type: 'transport:loopStart'; time: number }
export interface LoopEndChanged { type: 'transport:loopEnd'; time: number }

// --- Track Events ---

export interface TrackMuteEvent { type: 'track:mute'; trackNumber: number; muted: boolean }
export interface TrackSoloEvent { type: 'track:solo'; trackNumber: number; soloed: boolean }
export interface TrackRecArmEvent { type: 'track:recarm'; trackNumber: number; armed: boolean }
export interface TrackSelectEvent { type: 'track:select'; trackNumber: number; selected: boolean }
export interface TrackNameChanged { type: 'track:name'; trackNumber: number; name: string }
export interface TrackPanChanged { type: 'track:pan'; trackNumber: number; pan: number }
export interface TrackPan2Changed { type: 'track:pan2'; trackNumber: number; pan2: number }
export interface TrackPanModeChanged { type: 'track:panMode'; trackNumber: number; panMode: string }
export interface TrackVolumeChanged { type: 'track:volume'; trackNumber: number; volume: number }
export interface TrackVolumeDbChanged { type: 'track:volumeDb'; trackNumber: number; volumeDb: number }
export interface TrackVuChanged { type: 'track:vu'; trackNumber: number; vu: number }
export interface TrackVuLeftChanged { type: 'track:vuLeft'; trackNumber: number; vuLeft: number }
export interface TrackVuRightChanged { type: 'track:vuRight'; trackNumber: number; vuRight: number }
export interface TrackMonitorChanged { type: 'track:monitor'; trackNumber: number; monitor: RecordMonitoringMode }

// --- Track FX Events ---

export interface TrackFxNameChanged { type: 'track:fx:name'; trackNumber: number; fxNumber: number; name: string }
export interface TrackFxBypassEvent { type: 'track:fx:bypass'; trackNumber: number; fxNumber: number; bypassed: boolean }
export interface TrackFxOpenUiEvent { type: 'track:fx:openUi'; trackNumber: number; fxNumber: number; open: boolean }
export interface TrackFxPresetChanged { type: 'track:fx:preset'; trackNumber: number; fxNumber: number; preset: string }

// --- Selected Track Events ---

export interface SelectedTrackMuteEvent { type: 'selectedTrack:mute'; muted: boolean }
export interface SelectedTrackSoloEvent { type: 'selectedTrack:solo'; soloed: boolean }
export interface SelectedTrackRecArmEvent { type: 'selectedTrack:recarm'; armed: boolean }
export interface SelectedTrackSelectEvent { type: 'selectedTrack:select'; selected: boolean }
export interface SelectedTrackNameChanged { type: 'selectedTrack:name'; name: string }
export interface SelectedTrackPanChanged { type: 'selectedTrack:pan'; pan: number }
export interface SelectedTrackPan2Changed { type: 'selectedTrack:pan2'; pan2: number }
export interface SelectedTrackPanModeChanged { type: 'selectedTrack:panMode'; panMode: string }
export interface SelectedTrackVolumeChanged { type: 'selectedTrack:volume'; volume: number }
export interface SelectedTrackVolumeDbChanged { type: 'selectedTrack:volumeDb'; volumeDb: number }
export interface SelectedTrackVuChanged { type: 'selectedTrack:vu'; vu: number }
export interface SelectedTrackVuLeftChanged { type: 'selectedTrack:vuLeft'; vuLeft: number }
export interface SelectedTrackVuRightChanged { type: 'selectedTrack:vuRight'; vuRight: number }
export interface SelectedTrackMonitorChanged { type: 'selectedTrack:monitor'; monitor: RecordMonitoringMode }

// --- Selected Track FX Events ---

export interface SelectedTrackFxNameChanged { type: 'selectedTrack:fx:name'; fxNumber: number; name: string }
export interface SelectedTrackFxBypassEvent { type: 'selectedTrack:fx:bypass'; fxNumber: number; bypassed: boolean }
export interface SelectedTrackFxOpenUiEvent { type: 'selectedTrack:fx:openUi'; fxNumber: number; open: boolean }
export interface SelectedTrackFxPresetChanged { type: 'selectedTrack:fx:preset'; fxNumber: number; preset: string }

// --- Selected FX Events ---

export interface SelectedFxNameChanged { type: 'selectedFx:name'; name: string }
export interface SelectedFxBypassEvent { type: 'selectedFx:bypass'; bypassed: boolean }
export interface SelectedFxOpenUiEvent { type: 'selectedFx:openUi'; open: boolean }
export interface SelectedFxPresetChanged { type: 'selectedFx:preset'; preset: string }

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
  | TrackRecArmEvent
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
  | TrackMonitorChanged
  // Track FX
  | TrackFxNameChanged
  | TrackFxBypassEvent
  | TrackFxOpenUiEvent
  | TrackFxPresetChanged
  // Selected Track
  | SelectedTrackMuteEvent
  | SelectedTrackSoloEvent
  | SelectedTrackRecArmEvent
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
  | SelectedTrackMonitorChanged
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
  // Unknown
  | UnknownEvent;
