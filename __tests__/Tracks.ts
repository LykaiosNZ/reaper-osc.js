/* eslint-disable @typescript-eslint/no-explicit-any */
import {BoolArgument, BooleanMessage, FloatArgument, FloatMessage, IntArgument, IntegerMessage, StringArgument, StringMessage} from '../dist/Messages';
import {RecordMonitoringMode, Track} from '../dist/Tracks';

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

describe('properties set by messages', () => {
  let track: Track;

  beforeEach(() => {
    track = new Track(1, 1, () => null);
  });

  test.each([true, false])('mute message sets isMuted', value => {
    const message = new BooleanMessage('/track/1/mute', value);

    expect(track.receive(message)).toBe(true);
    expect(track.isMuted).toBe(value);
  });

  test.each([true, false])('recarm message sets isRecordArmed', value => {
    const message = new BooleanMessage('/track/1/recarm', value);

    expect(track.receive(message)).toBe(true);
    expect(track.isRecordArmed).toBe(value);
  });

  test.each([true, false])('select message sets isSelected', value => {
    const message = new BooleanMessage('/track/1/select', value);

    expect(track.receive(message)).toBe(true);
    expect(track.isSelected).toBe(value);
  });

  test.each([true, false])('solo message sets isSoloed', value => {
    const message = new BooleanMessage('/track/1/solo', value);

    expect(track.receive(message)).toBe(true);
    expect(track.isSoloed).toBe(value);
  });

  test('name message sets name', () => {
    const expected = 'foo';
    const message = new StringMessage('/track/1/name', expected);

    expect(track.receive(message)).toBe(true);
    expect(track.name).toBe(expected);
  });

  test('pan message sets pan', () => {
    const expected = 0.12345;
    const message = new FloatMessage('/track/1/pan', expected);

    expect(track.receive(message)).toBe(true);
    expect(track.pan).toBe(expected);
  });

  test('pan2 message sets pan2', () => {
    const expected = 0.12345;
    const message = new FloatMessage('/track/1/pan2', expected);

    expect(track.receive(message)).toBe(true);
    expect(track.pan2).toBe(expected);
  });

  test('panmode message sets panMode', () => {
    const expected = 'foo';
    const message = new StringMessage('/track/1/panmode', expected);

    expect(track.receive(message)).toBe(true);
    expect(track.panMode).toBe(expected);
  });

  test.each([RecordMonitoringMode.ON, RecordMonitoringMode.OFF, RecordMonitoringMode.AUTO])('monitor message sets recordMonitoring: %p', expected => {
    const message = new IntegerMessage('/track/1/monitor', expected);

    expect(track.receive(message)).toBe(true);
    expect(track.recordMonitoring).toBe(expected);
  });

  test('volume/db message sets volumeDb', () => {
    const expected = 12;
    const message = new FloatMessage('/track/1/volume/db', expected);

    expect(track.receive(message)).toBe(true);
    expect(track.volumeDb).toBe(expected);
  });

  test('volume message sets volumeFaderPosition', () => {
    const expected = 0.12345;
    const message = new FloatMessage('/track/1/volume', expected);

    expect(track.receive(message)).toBe(true);
    expect(track.volumeFaderPosition).toBe(expected);
  });

  test('vu message sets vu', () => {
    const expected = 0.12345;
    const message = new FloatMessage('/track/1/vu', expected);

    expect(track.receive(message)).toBe(true);
    expect(track.vu).toBe(expected);
  });

  test('vu/L message sets vuLeft', () => {
    const expected = 0.12345;
    const message = new FloatMessage('/track/1/vu/L', expected);

    expect(track.receive(message)).toBe(true);
    expect(track.vuLeft).toBe(expected);
  });

  test('vu/R message sets vuRight', () => {
    const expected = 0.12345;
    const message = new FloatMessage('/track/1/vu/R', expected);

    expect(track.receive(message)).toBe(true);
    expect(track.vuRight).toBe(expected);
  });
});

describe('methods send correct messages', () => {
  test('deselect sends expected message', done => {
    const track = new Track(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/select', args: [BoolArgument(false)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.deselect();
  });

  test('mute sends expected message', done => {
    const track = new Track(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/mute', args: [BoolArgument(true)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.mute();
  });

  test('recordArm sends expected message', done => {
    const track = new Track(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/recarm', args: [BoolArgument(true)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.recordArm();
  });

  test('recordDisarm sends expected message', done => {
    const track = new Track(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/recarm', args: [BoolArgument(false)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.recordDisarm();
  });

  test('rename sends expected message and sets name', done => {
    const expected = 'foo';
    const track = new Track(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/name', args: [StringArgument(expected)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.rename(expected);
    expect(track.name).toBe(expected);
  });

  test('select sends expected message', done => {
    const track = new Track(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/select', args: [BoolArgument(true)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.select();
  });

  test.each([RecordMonitoringMode.ON, RecordMonitoringMode.OFF, RecordMonitoringMode.AUTO])(
    'setMonitoringMode sends expected message: %p',
    (expected, done: any) => {
      const track = new Track(1, 1, message => {
        try {
          expect(message).toMatchObject({address: '/track/1/monitor', args: [IntArgument(expected)]});
          done();
        } catch (error) {
          done(error);
        }
      });

      track.setMonitoringMode(expected);
    },
  );

  test('setPan sends expected message and sets value', done => {
    const expected = 0.12345;
    const track = new Track(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/pan', args: [FloatArgument(expected)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.setPan(expected);
    expect(track.pan).toBe(expected);
  });

  test('setPan2 sends expected message and sets value', done => {
    const expected = 0.12345;
    const track = new Track(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/pan2', args: [FloatArgument(expected)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.setPan2(expected);
    expect(track.pan2).toBe(expected);
  });

  test('setVolumeDb sends expected message and sets value', done => {
    const expected = 12;
    const track = new Track(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/volume/db', args: [FloatArgument(expected)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.setVolumeDb(expected);
    expect(track.volumeDb).toBe(expected);
  });

  test('setVolumeFaderPosition sends expected message and sets value', done => {
    const expected = 0.12345;
    const track = new Track(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/volume', args: [FloatArgument(expected)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.setVolumeFaderPosition(expected);
    expect(track.volumeFaderPosition).toBe(expected);
  });

  test('solo sends expected message', done => {
    const track = new Track(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/solo', args: [BoolArgument(true)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.solo();
  });

  test('toggleMute sends expected message', done => {
    const track = new Track(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/mute/toggle'});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.toggleMute();
  });

  test('toggleRecordArm sends expected message', done => {
    const track = new Track(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/recarm/toggle'});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.toggleRecordArm();
  });

  test('toggleSolo sends expected message', done => {
    const track = new Track(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/solo/toggle'});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.toggleSolo();
  });

  test('unmute sends expected message', done => {
    const track = new Track(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/mute', args: [BoolArgument(false)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.unmute();
  });

  test('unsolo sends expected message', done => {
    const track = new Track(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/solo', args: [BoolArgument(false)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    track.unsolo();
  });
});
