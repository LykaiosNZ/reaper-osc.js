import {RecordMonitoringMode, Track} from '../dist/Tracks';
import {ReaperOscCommand} from '../dist/Client/Commands';

test('has correct number of fx', () => {
  const expected = 8;
  const track = new Track(1, expected, () => null);
  expect(track.fx.length).toBe(expected);
});

test('fx are initialized with correct track and fx number', () => {
  const track = new Track(9, 4, () => null);

  track.fx.forEach((fx, index) => {
    expect(fx.trackNumber).toBe(track.trackNumber);
    expect(fx.fxNumber).toBe(index + 1);
  });
});

test('has correct track number', () => {
  const expected = 9874;
  const track = new Track(expected, 1, () => null);
  expect(track.trackNumber).toBe(expected);
});

test.each([-1.1, 1.1])('setPan throws when less than -1 or greater than 1: %p', value => {
  const track = new Track(1, 1, () => null);
  expect(() => track.setPan(value)).toThrow(RangeError);
});

test.each([-1.1, 1.1])('setPan2 throws when less than -1 or greater than 1: %p', value => {
  const track = new Track(1, 1, () => null);
  expect(() => track.setPan2(value)).toThrow(RangeError);
});

test.each([-100.1, 12.1])('setVolumeDb throws when less than -100 or greater than 12: %p', value => {
  const track = new Track(1, 1, () => null);
  expect(() => track.setVolumeDb(value)).toThrow(RangeError);
});

test.each([-0.1, 1.1])('setVolumeFaderPosition throws when less than 0 or greater than 1: %p', value => {
  const track = new Track(1, 1, () => null);
  expect(() => track.setVolumeFaderPosition(value)).toThrow(RangeError);
});

describe('properties set by events', () => {
  let track: Track;

  beforeEach(() => {
    track = new Track(1, 1, () => null);
  });

  test.each([true, false])('mute event sets isMuted: %p', value => {
    track.handleEvent({type: 'track:mute', trackNumber: 1, muted: value});
    expect(track.isMuted).toBe(value);
  });

  test.each([true, false])('recarm event sets isRecordArmed: %p', value => {
    track.handleEvent({type: 'track:recarm', trackNumber: 1, armed: value});
    expect(track.isRecordArmed).toBe(value);
  });

  test.each([true, false])('select event sets isSelected: %p', value => {
    track.handleEvent({type: 'track:select', trackNumber: 1, selected: value});
    expect(track.isSelected).toBe(value);
  });

  test.each([true, false])('solo event sets isSoloed: %p', value => {
    track.handleEvent({type: 'track:solo', trackNumber: 1, soloed: value});
    expect(track.isSoloed).toBe(value);
  });

  test('name event sets name', () => {
    track.handleEvent({type: 'track:name', trackNumber: 1, name: 'foo'});
    expect(track.name).toBe('foo');
  });

  test('pan event sets pan', () => {
    const expected = 0.12345;
    track.handleEvent({type: 'track:pan', trackNumber: 1, pan: expected});
    expect(track.pan).toBe(expected);
  });

  test('pan2 event sets pan2', () => {
    const expected = 0.12345;
    track.handleEvent({type: 'track:pan2', trackNumber: 1, pan2: expected});
    expect(track.pan2).toBe(expected);
  });

  test('panMode event sets panMode', () => {
    track.handleEvent({type: 'track:panMode', trackNumber: 1, panMode: 'foo'});
    expect(track.panMode).toBe('foo');
  });

  test.each([RecordMonitoringMode.ON, RecordMonitoringMode.OFF, RecordMonitoringMode.AUTO])('monitor event sets recordMonitoring: %p', expected => {
    track.handleEvent({type: 'track:monitor', trackNumber: 1, monitor: expected});
    expect(track.recordMonitoring).toBe(expected);
  });

  test('volumeDb event sets volumeDb', () => {
    const expected = 12;
    track.handleEvent({type: 'track:volumeDb', trackNumber: 1, volumeDb: expected});
    expect(track.volumeDb).toBe(expected);
  });

  test('volume event sets volumeFaderPosition', () => {
    const expected = 0.12345;
    track.handleEvent({type: 'track:volume', trackNumber: 1, volume: expected});
    expect(track.volumeFaderPosition).toBe(expected);
  });

  test('vu event sets vu', () => {
    const expected = 0.12345;
    track.handleEvent({type: 'track:vu', trackNumber: 1, vu: expected});
    expect(track.vu).toBe(expected);
  });

  test('vuLeft event sets vuLeft', () => {
    const expected = 0.12345;
    track.handleEvent({type: 'track:vuLeft', trackNumber: 1, vuLeft: expected});
    expect(track.vuLeft).toBe(expected);
  });

  test('vuRight event sets vuRight', () => {
    const expected = 0.12345;
    track.handleEvent({type: 'track:vuRight', trackNumber: 1, vuRight: expected});
    expect(track.vuRight).toBe(expected);
  });

  test('event for different track is ignored', () => {
    track.handleEvent({type: 'track:mute', trackNumber: 2, muted: true});
    expect(track.isMuted).toBe(false);
  });
});

describe('methods send expected commands', () => {
  test('deselect sends expected command', done => {
    const track = new Track(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'track:select', trackNumber: 1, selected: false});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.deselect();
  });

  test('mute sends expected command', done => {
    const track = new Track(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'track:mute', trackNumber: 1, muted: true});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.mute();
  });

  test('recordArm sends expected command', done => {
    const track = new Track(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'track:recarm', trackNumber: 1, armed: true});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.recordArm();
  });

  test('recordDisarm sends expected command', done => {
    const track = new Track(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'track:recarm', trackNumber: 1, armed: false});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.recordDisarm();
  });

  test('rename sends expected command and sets name', done => {
    const expected = 'foo';
    const track = new Track(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'track:name', trackNumber: 1, name: expected});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.rename(expected);
    expect(track.name).toBe(expected);
  });

  test('select sends expected command', done => {
    const track = new Track(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'track:select', trackNumber: 1, selected: true});
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
      const track = new Track(1, 1, (command: ReaperOscCommand) => {
        try {
          expect(command).toMatchObject({type: 'track:monitor', trackNumber: 1, monitor: expected});
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
    const track = new Track(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'track:pan', trackNumber: 1, pan: expected});
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
    const track = new Track(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'track:pan2', trackNumber: 1, pan2: expected});
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
    const track = new Track(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'track:volumeDb', trackNumber: 1, volumeDb: expected});
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
    const track = new Track(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'track:volume', trackNumber: 1, volume: expected});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.setVolumeFaderPosition(expected);
    expect(track.volumeFaderPosition).toBe(expected);
  });

  test('solo sends expected command', done => {
    const track = new Track(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'track:solo', trackNumber: 1, soloed: true});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.solo();
  });

  test('toggleMute sends expected command', done => {
    const track = new Track(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'track:mute:toggle', trackNumber: 1});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.toggleMute();
  });

  test('toggleRecordArm sends expected command', done => {
    const track = new Track(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'track:recarm:toggle', trackNumber: 1});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.toggleRecordArm();
  });

  test('toggleSolo sends expected command', done => {
    const track = new Track(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'track:solo:toggle', trackNumber: 1});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.toggleSolo();
  });

  test('unmute sends expected command', done => {
    const track = new Track(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'track:mute', trackNumber: 1, muted: false});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.unmute();
  });

  test('unsolo sends expected command', done => {
    const track = new Track(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'track:solo', trackNumber: 1, soloed: false});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.unsolo();
  });
});
