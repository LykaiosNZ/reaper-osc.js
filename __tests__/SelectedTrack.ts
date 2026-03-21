import {BoolArgument, BooleanMessage, FloatArgument, FloatMessage, IntArgument, IntegerMessage, OscMessage, StringArgument, StringMessage} from '../dist/Messages';
import {RecordMonitoringMode} from '../dist/Tracks';
import {SelectedTrack} from '../dist/SelectedTrack';

function makeTrack(): { track: SelectedTrack; sent: OscMessage[] } {
  const sent: OscMessage[] = [];
  const track = new SelectedTrack(8, message => sent.push(message));
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

describe('properties set by messages', () => {
  test.each([true, false])('mute message sets isMuted: %p', value => {
    const {track} = makeTrack();
    expect(track.receive(new BooleanMessage('/track/mute', value))).toBe(true);
    expect(track.isMuted).toBe(value);
  });

  test.each([true, false])('recarm message sets isRecordArmed: %p', value => {
    const {track} = makeTrack();
    expect(track.receive(new BooleanMessage('/track/recarm', value))).toBe(true);
    expect(track.isRecordArmed).toBe(value);
  });

  test.each([true, false])('select message sets isSelected: %p', value => {
    const {track} = makeTrack();
    expect(track.receive(new BooleanMessage('/track/select', value))).toBe(true);
    expect(track.isSelected).toBe(value);
  });

  test.each([true, false])('solo message sets isSoloed: %p', value => {
    const {track} = makeTrack();
    expect(track.receive(new BooleanMessage('/track/solo', value))).toBe(true);
    expect(track.isSoloed).toBe(value);
  });

  test('name message sets name', () => {
    const {track} = makeTrack();
    expect(track.receive(new StringMessage('/track/name', 'foo'))).toBe(true);
    expect(track.name).toBe('foo');
  });

  test('pan message sets pan', () => {
    const expected = 0.12345;
    const {track} = makeTrack();
    expect(track.receive(new FloatMessage('/track/pan', expected))).toBe(true);
    expect(track.pan).toBe(expected);
  });

  test('pan2 message sets pan2', () => {
    const expected = 0.12345;
    const {track} = makeTrack();
    expect(track.receive(new FloatMessage('/track/pan2', expected))).toBe(true);
    expect(track.pan2).toBe(expected);
  });

  test('panmode message sets panMode', () => {
    const {track} = makeTrack();
    expect(track.receive(new StringMessage('/track/panmode', 'Balance'))).toBe(true);
    expect(track.panMode).toBe('Balance');
  });

  test.each([RecordMonitoringMode.ON, RecordMonitoringMode.OFF, RecordMonitoringMode.AUTO])('monitor message sets recordMonitoring: %p', value => {
    const {track} = makeTrack();
    expect(track.receive(new IntegerMessage('/track/monitor', value))).toBe(true);
    expect(track.recordMonitoring).toBe(value);
  });

  test('volume/db message sets volumeDb', () => {
    const expected = 12;
    const {track} = makeTrack();
    expect(track.receive(new FloatMessage('/track/volume/db', expected))).toBe(true);
    expect(track.volumeDb).toBe(expected);
  });

  test('volume message sets volumeFaderPosition', () => {
    const expected = 0.12345;
    const {track} = makeTrack();
    expect(track.receive(new FloatMessage('/track/volume', expected))).toBe(true);
    expect(track.volumeFaderPosition).toBe(expected);
  });

  test('vu message sets vu', () => {
    const expected = 0.12345;
    const {track} = makeTrack();
    expect(track.receive(new FloatMessage('/track/vu', expected))).toBe(true);
    expect(track.vu).toBe(expected);
  });

  test('vu/L message sets vuLeft', () => {
    const expected = 0.12345;
    const {track} = makeTrack();
    expect(track.receive(new FloatMessage('/track/vu/L', expected))).toBe(true);
    expect(track.vuLeft).toBe(expected);
  });

  test('vu/R message sets vuRight', () => {
    const expected = 0.12345;
    const {track} = makeTrack();
    expect(track.receive(new FloatMessage('/track/vu/R', expected))).toBe(true);
    expect(track.vuRight).toBe(expected);
  });
});

describe('methods send correct messages', () => {
  test('deselect sends expected message', () => {
    const {track, sent} = makeTrack();
    track.deselect();
    expect(sent[0]).toMatchObject({address: '/track/select', args: [BoolArgument(false)]});
  });

  test('mute sends expected message', () => {
    const {track, sent} = makeTrack();
    track.mute();
    expect(sent[0]).toMatchObject({address: '/track/mute', args: [BoolArgument(true)]});
  });

  test('recordArm sends expected message', () => {
    const {track, sent} = makeTrack();
    track.recordArm();
    expect(sent[0]).toMatchObject({address: '/track/recarm', args: [BoolArgument(true)]});
  });

  test('recordDisarm sends expected message', () => {
    const {track, sent} = makeTrack();
    track.recordDisarm();
    expect(sent[0]).toMatchObject({address: '/track/recarm', args: [BoolArgument(false)]});
  });

  test('rename sends expected message and sets name', () => {
    const {track, sent} = makeTrack();
    track.rename('foo');
    expect(sent[0]).toMatchObject({address: '/track/name', args: [StringArgument('foo')]});
    expect(track.name).toBe('foo');
  });

  test('select sends expected message', () => {
    const {track, sent} = makeTrack();
    track.select();
    expect(sent[0]).toMatchObject({address: '/track/select', args: [BoolArgument(true)]});
  });

  test.each([RecordMonitoringMode.ON, RecordMonitoringMode.OFF, RecordMonitoringMode.AUTO])('setMonitoringMode sends expected message: %p', value => {
    const {track, sent} = makeTrack();
    track.setMonitoringMode(value);
    expect(sent[0]).toMatchObject({address: '/track/monitor', args: [IntArgument(value)]});
  });

  test('setPan sends expected message and sets value', () => {
    const expected = 0.12345;
    const {track, sent} = makeTrack();
    track.setPan(expected);
    expect(sent[0]).toMatchObject({address: '/track/pan', args: [FloatArgument(expected)]});
    expect(track.pan).toBe(expected);
  });

  test('setPan2 sends expected message and sets value', () => {
    const expected = 0.12345;
    const {track, sent} = makeTrack();
    track.setPan2(expected);
    expect(sent[0]).toMatchObject({address: '/track/pan2', args: [FloatArgument(expected)]});
    expect(track.pan2).toBe(expected);
  });

  test('setVolumeDb sends expected message and sets value', () => {
    const {track, sent} = makeTrack();
    track.setVolumeDb(12);
    expect(sent[0]).toMatchObject({address: '/track/volume/db', args: [FloatArgument(12)]});
    expect(track.volumeDb).toBe(12);
  });

  test('setVolumeFaderPosition sends expected message and sets value', () => {
    const expected = 0.12345;
    const {track, sent} = makeTrack();
    track.setVolumeFaderPosition(expected);
    expect(sent[0]).toMatchObject({address: '/track/volume', args: [FloatArgument(expected)]});
    expect(track.volumeFaderPosition).toBe(expected);
  });

  test('solo sends expected message', () => {
    const {track, sent} = makeTrack();
    track.solo();
    expect(sent[0]).toMatchObject({address: '/track/solo', args: [BoolArgument(true)]});
  });

  test('toggleMute sends expected message', () => {
    const {track, sent} = makeTrack();
    track.toggleMute();
    expect(sent[0]).toMatchObject({address: '/track/mute/toggle', args: []});
  });

  test('toggleRecordArm sends expected message', () => {
    const {track, sent} = makeTrack();
    track.toggleRecordArm();
    expect(sent[0]).toMatchObject({address: '/track/recarm/toggle', args: []});
  });

  test('toggleSolo sends expected message', () => {
    const {track, sent} = makeTrack();
    track.toggleSolo();
    expect(sent[0]).toMatchObject({address: '/track/solo/toggle', args: []});
  });

  test('unmute sends expected message', () => {
    const {track, sent} = makeTrack();
    track.unmute();
    expect(sent[0]).toMatchObject({address: '/track/mute', args: [BoolArgument(false)]});
  });

  test('unsolo sends expected message', () => {
    const {track, sent} = makeTrack();
    track.unsolo();
    expect(sent[0]).toMatchObject({address: '/track/solo', args: [BoolArgument(false)]});
  });
});
