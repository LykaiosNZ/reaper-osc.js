import {RecordMonitoringMode} from '../dist/Tracks';
import {SelectedTrack} from '../dist/SelectedTrack';
import {
  SetSelectedTrackMute, ToggleSelectedTrackMute,
  SetSelectedTrackSolo, ToggleSelectedTrackSolo,
  SetSelectedTrackRecordArm, ToggleSelectedTrackRecordArm,
  SetSelectedTrackSelect, SetSelectedTrackName,
  SetSelectedTrackPan, SetSelectedTrackPan2,
  SetSelectedTrackVolume, SetSelectedTrackVolumeDb,
  SetSelectedTrackMonitor,
  ReaperOscCommand,
} from '../dist/Client/Commands';
import {
  SelectedTrackMuteEvent, SelectedTrackSoloEvent, SelectedTrackRecArmEvent,
  SelectedTrackSelectEvent, SelectedTrackNameChanged,
  SelectedTrackPanChanged, SelectedTrackPan2Changed, SelectedTrackPanModeChanged,
  SelectedTrackVolumeChanged, SelectedTrackVolumeDbChanged,
  SelectedTrackVuChanged, SelectedTrackVuLeftChanged, SelectedTrackVuRightChanged,
  SelectedTrackMonitorChanged,
} from '../dist/Client/Events';

function makeTrack(): { track: SelectedTrack; sent: ReaperOscCommand[] } {
  const sent: ReaperOscCommand[] = [];
  const track = new SelectedTrack(8, command => sent.push(command));
  return {track, sent};
}

test('has correct number of fx', () => {
  const expected = 4;
  const track2 = new SelectedTrack(expected, () => null);
  expect(track2.fx.length).toBe(expected);
});

test('has selectedFx', () => {
  const {track} = makeTrack();
  expect(track.selectedFx).toBeDefined();
});

test.each([-1.1, 1.1])('setPan throws when less than -1 or greater than 1: %p', value => {
  const {track} = makeTrack();
  expect(() => track.setPan(value)).toThrow(RangeError);
});

test.each([-1.1, 1.1])('setPan2 throws when less than -1 or greater than 1: %p', value => {
  const {track} = makeTrack();
  expect(() => track.setPan2(value)).toThrow(RangeError);
});

test.each([-100.1, 12.1])('setVolumeDb throws when less than -100 or greater than 12: %p', value => {
  const {track} = makeTrack();
  expect(() => track.setVolumeDb(value)).toThrow(RangeError);
});

test.each([-0.1, 1.1])('setVolumeFaderPosition throws when less than 0 or greater than 1: %p', value => {
  const {track} = makeTrack();
  expect(() => track.setVolumeFaderPosition(value)).toThrow(RangeError);
});

describe('properties set by events', () => {
  test.each([true, false])('mute event sets isMuted: %p', value => {
    const {track} = makeTrack();
    track.handleEvent(SelectedTrackMuteEvent(value));
    expect(track.isMuted).toBe(value);
  });

  test.each([true, false])('recarm event sets isRecordArmed: %p', value => {
    const {track} = makeTrack();
    track.handleEvent(SelectedTrackRecArmEvent(value));
    expect(track.isRecordArmed).toBe(value);
  });

  test.each([true, false])('select event sets isSelected: %p', value => {
    const {track} = makeTrack();
    track.handleEvent(SelectedTrackSelectEvent(value));
    expect(track.isSelected).toBe(value);
  });

  test.each([true, false])('solo event sets isSoloed: %p', value => {
    const {track} = makeTrack();
    track.handleEvent(SelectedTrackSoloEvent(value));
    expect(track.isSoloed).toBe(value);
  });

  test('name event sets name', () => {
    const {track} = makeTrack();
    track.handleEvent(SelectedTrackNameChanged('foo'));
    expect(track.name).toBe('foo');
  });

  test('pan event sets pan', () => {
    const expected = 0.12345;
    const {track} = makeTrack();
    track.handleEvent(SelectedTrackPanChanged(expected));
    expect(track.pan).toBe(expected);
  });

  test('pan2 event sets pan2', () => {
    const expected = 0.12345;
    const {track} = makeTrack();
    track.handleEvent(SelectedTrackPan2Changed(expected));
    expect(track.pan2).toBe(expected);
  });

  test('panMode event sets panMode', () => {
    const {track} = makeTrack();
    track.handleEvent(SelectedTrackPanModeChanged('Balance'));
    expect(track.panMode).toBe('Balance');
  });

  test.each([RecordMonitoringMode.ON, RecordMonitoringMode.OFF, RecordMonitoringMode.AUTO])('monitor event sets recordMonitoring: %p', value => {
    const {track} = makeTrack();
    track.handleEvent(SelectedTrackMonitorChanged(value));
    expect(track.recordMonitoring).toBe(value);
  });

  test('volumeDb event sets volumeDb', () => {
    const expected = 12;
    const {track} = makeTrack();
    track.handleEvent(SelectedTrackVolumeDbChanged(expected));
    expect(track.volumeDb).toBe(expected);
  });

  test('volume event sets volumeFaderPosition', () => {
    const expected = 0.12345;
    const {track} = makeTrack();
    track.handleEvent(SelectedTrackVolumeChanged(expected));
    expect(track.volumeFaderPosition).toBe(expected);
  });

  test('vu event sets vu', () => {
    const expected = 0.12345;
    const {track} = makeTrack();
    track.handleEvent(SelectedTrackVuChanged(expected));
    expect(track.vu).toBe(expected);
  });

  test('vuLeft event sets vuLeft', () => {
    const expected = 0.12345;
    const {track} = makeTrack();
    track.handleEvent(SelectedTrackVuLeftChanged(expected));
    expect(track.vuLeft).toBe(expected);
  });

  test('vuRight event sets vuRight', () => {
    const expected = 0.12345;
    const {track} = makeTrack();
    track.handleEvent(SelectedTrackVuRightChanged(expected));
    expect(track.vuRight).toBe(expected);
  });
});

describe('methods send expected commands', () => {
  test('deselect sends expected command', () => {
    const {track, sent} = makeTrack();
    track.deselect();
    expect(sent[0]).toMatchObject(SetSelectedTrackSelect(false));
  });

  test('mute sends expected command', () => {
    const {track, sent} = makeTrack();
    track.mute();
    expect(sent[0]).toMatchObject(SetSelectedTrackMute(true));
  });

  test('recordArm sends expected command', () => {
    const {track, sent} = makeTrack();
    track.recordArm();
    expect(sent[0]).toMatchObject(SetSelectedTrackRecordArm(true));
  });

  test('recordDisarm sends expected command', () => {
    const {track, sent} = makeTrack();
    track.recordDisarm();
    expect(sent[0]).toMatchObject(SetSelectedTrackRecordArm(false));
  });

  test('rename sends expected command and sets name', () => {
    const {track, sent} = makeTrack();
    track.rename('foo');
    expect(sent[0]).toMatchObject(SetSelectedTrackName('foo'));
    expect(track.name).toBe('foo');
  });

  test('select sends expected command', () => {
    const {track, sent} = makeTrack();
    track.select();
    expect(sent[0]).toMatchObject(SetSelectedTrackSelect(true));
  });

  test.each([RecordMonitoringMode.ON, RecordMonitoringMode.OFF, RecordMonitoringMode.AUTO])('setMonitoringMode sends expected command: %p', value => {
    const {track, sent} = makeTrack();
    track.setMonitoringMode(value);
    expect(sent[0]).toMatchObject(SetSelectedTrackMonitor(value));
  });

  test('setPan sends expected command and sets value', () => {
    const expected = 0.12345;
    const {track, sent} = makeTrack();
    track.setPan(expected);
    expect(sent[0]).toMatchObject(SetSelectedTrackPan(expected));
    expect(track.pan).toBe(expected);
  });

  test('setPan2 sends expected command and sets value', () => {
    const expected = 0.12345;
    const {track, sent} = makeTrack();
    track.setPan2(expected);
    expect(sent[0]).toMatchObject(SetSelectedTrackPan2(expected));
    expect(track.pan2).toBe(expected);
  });

  test('setVolumeDb sends expected command and sets value', () => {
    const {track, sent} = makeTrack();
    track.setVolumeDb(12);
    expect(sent[0]).toMatchObject(SetSelectedTrackVolumeDb(12));
    expect(track.volumeDb).toBe(12);
  });

  test('setVolumeFaderPosition sends expected command and sets value', () => {
    const expected = 0.12345;
    const {track, sent} = makeTrack();
    track.setVolumeFaderPosition(expected);
    expect(sent[0]).toMatchObject(SetSelectedTrackVolume(expected));
    expect(track.volumeFaderPosition).toBe(expected);
  });

  test('solo sends expected command', () => {
    const {track, sent} = makeTrack();
    track.solo();
    expect(sent[0]).toMatchObject(SetSelectedTrackSolo(true));
  });

  test('toggleMute sends expected command', () => {
    const {track, sent} = makeTrack();
    track.toggleMute();
    expect(sent[0]).toMatchObject(ToggleSelectedTrackMute());
  });

  test('toggleRecordArm sends expected command', () => {
    const {track, sent} = makeTrack();
    track.toggleRecordArm();
    expect(sent[0]).toMatchObject(ToggleSelectedTrackRecordArm());
  });

  test('toggleSolo sends expected command', () => {
    const {track, sent} = makeTrack();
    track.toggleSolo();
    expect(sent[0]).toMatchObject(ToggleSelectedTrackSolo());
  });

  test('unmute sends expected command', () => {
    const {track, sent} = makeTrack();
    track.unmute();
    expect(sent[0]).toMatchObject(SetSelectedTrackMute(false));
  });

  test('unsolo sends expected command', () => {
    const {track, sent} = makeTrack();
    track.unsolo();
    expect(sent[0]).toMatchObject(SetSelectedTrackSolo(false));
  });
});
