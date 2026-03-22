import {RecordMonitoringMode, Track} from '../dist/Tracks';
import {
  SetTrackMute, ToggleTrackMute, SetTrackSolo, ToggleTrackSolo,
  SetTrackRecordArm, ToggleTrackRecordArm, SetTrackSelect,
  SetTrackName, SetTrackPan, SetTrackPan2, SetTrackVolume, SetTrackVolumeDb,
  SetTrackMonitoringMode, ReaperOscCommand,
} from '../dist/Client/Commands';
import {
  TrackMuteEvent, TrackSoloEvent, TrackRecordArmEvent, TrackSelectEvent, TrackNameChanged,
  TrackPanChanged, TrackPan2Changed, TrackPanModeChanged,
  TrackVolumeChanged, TrackVolumeDbChanged,
  TrackVuChanged, TrackVuLeftChanged, TrackVuRightChanged, TrackMonitoringModeChanged,
} from '../dist/Client/Events';

test('has correct number of fx', () => {
  const expected = 8;
  const track = new Track(1, expected, 0, 0, () => null);
  expect(track.fx.length).toBe(expected);
});

test('fx are initialized with correct track and fx number', () => {
  const track = new Track(9, 4, 0, 0, () => null);

  track.fx.forEach((fx, index) => {
    expect(fx.trackNumber).toBe(track.trackNumber);
    expect(fx.fxNumber).toBe(index + 1);
  });
});

test('has correct track number', () => {
  const expected = 9874;
  const track = new Track(expected, 1, 0, 0, () => null);
  expect(track.trackNumber).toBe(expected);
});

test.each([-1.1, 1.1])('setPan throws when less than -1 or greater than 1: %p', value => {
  const track = new Track(1, 1, 0, 0,() => null);
  expect(() => track.setPan(value)).toThrow(RangeError);
});

test.each([-1.1, 1.1])('setPan2 throws when less than -1 or greater than 1: %p', value => {
  const track = new Track(1, 1, 0, 0,() => null);
  expect(() => track.setPan2(value)).toThrow(RangeError);
});

test.each([-100.1, 12.1])('setVolumeDb throws when less than -100 or greater than 12: %p', value => {
  const track = new Track(1, 1, 0, 0,() => null);
  expect(() => track.setVolumeDb(value)).toThrow(RangeError);
});

test.each([-0.1, 1.1])('setVolumeFaderPosition throws when less than 0 or greater than 1: %p', value => {
  const track = new Track(1, 1, 0, 0,() => null);
  expect(() => track.setVolumeFaderPosition(value)).toThrow(RangeError);
});

describe('properties set by events', () => {
  let track: Track;

  beforeEach(() => {
    track = new Track(1, 1, 0, 0,() => null);
  });

  test.each([true, false])('mute event sets isMuted: %p', value => {
    track.handleEvent(TrackMuteEvent(1, value));
    expect(track.isMuted).toBe(value);
  });

  test.each([true, false])('recarm event sets isRecordArmed: %p', value => {
    track.handleEvent(TrackRecordArmEvent(1, value));
    expect(track.isRecordArmed).toBe(value);
  });

  test.each([true, false])('select event sets isSelected: %p', value => {
    track.handleEvent(TrackSelectEvent(1, value));
    expect(track.isSelected).toBe(value);
  });

  test.each([true, false])('solo event sets isSoloed: %p', value => {
    track.handleEvent(TrackSoloEvent(1, value));
    expect(track.isSoloed).toBe(value);
  });

  test('name event sets name', () => {
    track.handleEvent(TrackNameChanged(1, 'foo'));
    expect(track.name).toBe('foo');
  });

  test('pan event sets pan', () => {
    const expected = 0.12345;
    track.handleEvent(TrackPanChanged(1, expected));
    expect(track.pan).toBe(expected);
  });

  test('pan2 event sets pan2', () => {
    const expected = 0.12345;
    track.handleEvent(TrackPan2Changed(1, expected));
    expect(track.pan2).toBe(expected);
  });

  test('panMode event sets panMode', () => {
    track.handleEvent(TrackPanModeChanged(1, 'foo'));
    expect(track.panMode).toBe('foo');
  });

  test.each([RecordMonitoringMode.ON, RecordMonitoringMode.OFF, RecordMonitoringMode.AUTO])('monitor event sets recordMonitoring: %p', expected => {
    track.handleEvent(TrackMonitoringModeChanged(1, expected));
    expect(track.recordMonitoring).toBe(expected);
  });

  test('volumeDb event sets volumeDb', () => {
    const expected = 12;
    track.handleEvent(TrackVolumeDbChanged(1, expected));
    expect(track.volumeDb).toBe(expected);
  });

  test('volume event sets volumeFaderPosition', () => {
    const expected = 0.12345;
    track.handleEvent(TrackVolumeChanged(1, expected));
    expect(track.volumeFaderPosition).toBe(expected);
  });

  test('vu event sets vu', () => {
    const expected = 0.12345;
    track.handleEvent(TrackVuChanged(1, expected));
    expect(track.vu).toBe(expected);
  });

  test('vuLeft event sets vuLeft', () => {
    const expected = 0.12345;
    track.handleEvent(TrackVuLeftChanged(1, expected));
    expect(track.vuLeft).toBe(expected);
  });

  test('vuRight event sets vuRight', () => {
    const expected = 0.12345;
    track.handleEvent(TrackVuRightChanged(1, expected));
    expect(track.vuRight).toBe(expected);
  });

  test('event for different track is ignored', () => {
    track.handleEvent(TrackMuteEvent(2, true));
    expect(track.isMuted).toBe(false);
  });
});

describe('methods send expected commands', () => {
  test('deselect sends expected command', done => {
    const track = new Track(1, 1, 0, 0,(command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackSelect(1, false));
        done();
      } catch (error) {
        done(error);
      }
    });

    track.deselect();
  });

  test('mute sends expected command', done => {
    const track = new Track(1, 1, 0, 0,(command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackMute(1, true));
        done();
      } catch (error) {
        done(error);
      }
    });

    track.mute();
  });

  test('recordArm sends expected command', done => {
    const track = new Track(1, 1, 0, 0,(command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackRecordArm(1, true));
        done();
      } catch (error) {
        done(error);
      }
    });

    track.recordArm();
  });

  test('recordDisarm sends expected command', done => {
    const track = new Track(1, 1, 0, 0,(command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackRecordArm(1, false));
        done();
      } catch (error) {
        done(error);
      }
    });

    track.recordDisarm();
  });

  test('rename sends expected command and sets name', done => {
    const expected = 'foo';
    const track = new Track(1, 1, 0, 0,(command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackName(1, expected));
        done();
      } catch (error) {
        done(error);
      }
    });

    track.rename(expected);
    expect(track.name).toBe(expected);
  });

  test('select sends expected command', done => {
    const track = new Track(1, 1, 0, 0,(command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackSelect(1, true));
        done();
      } catch (error) {
        done(error);
      }
    });

    track.select();
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  test.each([RecordMonitoringMode.ON, RecordMonitoringMode.OFF, RecordMonitoringMode.AUTO])(
    'setMonitoringMode sends expected command: %p',
    (expected, done: any) => {
      const track = new Track(1, 1, 0, 0,(command: ReaperOscCommand) => {
        try {
          expect(command).toMatchObject(SetTrackMonitoringMode(1, expected));
          done();
        } catch (error) {
          done(error);
        }
      });

      track.setMonitoringMode(expected);
    },
  );

  test('setPan sends expected command and sets value', done => {
    const expected = 0.12345;
    const track = new Track(1, 1, 0, 0,(command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackPan(1, expected));
        done();
      } catch (error) {
        done(error);
      }
    });

    track.setPan(expected);
    expect(track.pan).toBe(expected);
  });

  test('setPan2 sends expected command and sets value', done => {
    const expected = 0.12345;
    const track = new Track(1, 1, 0, 0,(command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackPan2(1, expected));
        done();
      } catch (error) {
        done(error);
      }
    });

    track.setPan2(expected);
    expect(track.pan2).toBe(expected);
  });

  test('setVolumeDb sends expected command and sets value', done => {
    const expected = 12;
    const track = new Track(1, 1, 0, 0,(command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackVolumeDb(1, expected));
        done();
      } catch (error) {
        done(error);
      }
    });

    track.setVolumeDb(expected);
    expect(track.volumeDb).toBe(expected);
  });

  test('setVolumeFaderPosition sends expected command and sets value', done => {
    const expected = 0.12345;
    const track = new Track(1, 1, 0, 0,(command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackVolume(1, expected));
        done();
      } catch (error) {
        done(error);
      }
    });

    track.setVolumeFaderPosition(expected);
    expect(track.volumeFaderPosition).toBe(expected);
  });

  test('solo sends expected command', done => {
    const track = new Track(1, 1, 0, 0,(command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackSolo(1, true));
        done();
      } catch (error) {
        done(error);
      }
    });

    track.solo();
  });

  test('toggleMute sends expected command', done => {
    const track = new Track(1, 1, 0, 0,(command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(ToggleTrackMute(1));
        done();
      } catch (error) {
        done(error);
      }
    });

    track.toggleMute();
  });

  test('toggleRecordArm sends expected command', done => {
    const track = new Track(1, 1, 0, 0,(command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(ToggleTrackRecordArm(1));
        done();
      } catch (error) {
        done(error);
      }
    });

    track.toggleRecordArm();
  });

  test('toggleSolo sends expected command', done => {
    const track = new Track(1, 1, 0, 0,(command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(ToggleTrackSolo(1));
        done();
      } catch (error) {
        done(error);
      }
    });

    track.toggleSolo();
  });

  test('unmute sends expected command', done => {
    const track = new Track(1, 1, 0, 0,(command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackMute(1, false));
        done();
      } catch (error) {
        done(error);
      }
    });

    track.unmute();
  });

  test('unsolo sends expected command', done => {
    const track = new Track(1, 1, 0, 0,(command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackSolo(1, false));
        done();
      } catch (error) {
        done(error);
      }
    });

    track.unsolo();
  });
});
