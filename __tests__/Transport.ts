/* eslint-disable @typescript-eslint/no-explicit-any */
import exp from 'constants';
import {BoolArgument, BooleanMessage, FloatArgument, FloatMessage, OscMessage, StringArgument, StringMessage} from '../dist/Messages';
import {Beat, Transport} from '../dist/Transport';

describe('properties set by messages', () => {
  let transport : Transport;

  beforeEach(() => {
    transport =  new Transport(() => null);
  });

  test.each([true, false])('forward message sets isFastForwarding: %p', value => {
    const message = new BooleanMessage('/forward', value);

    transport.receive(message);

    expect(transport.isFastForwarding).toBe(value);
  });

  test.each([true, false])('play message sets isPlaying: %p', value => {
    const message = new BooleanMessage('/play', value);

    transport.receive(message);

    expect(transport.isPlaying).toBe(value);
  });

  test.each([true, false])('record message sets isRecording: %p', value => {
    const message = new BooleanMessage('/record', value);

    transport.receive(message);

    expect(transport.isRecording).toBe(value);
  });

  test.each([true, false])('repeat message sets isRepeatEnabled: %p', value => {
    const message = new BooleanMessage('/repeat', value);

    transport.receive(message);

    expect(transport.isRepeatEnabled).toBe(value);
  });

  test.each([true, false])('rewind message sets isRewinding: %p', value => {
    const message = new BooleanMessage('/rewind', value);

    transport.receive(message);

    expect(transport.isRewinding).toBe(value);
  });

  test.each([true, false])('stop message sets isStopped: %p', value => {
    const message = new BooleanMessage('/stop', value);

    transport.receive(message);

    expect(transport.isStopped).toBe(value);
  });

  test.each([0.1, 88.456])('time message sets time: %p', value => {
    const message = new FloatMessage('/time', value);

    transport.receive(message);

    expect(transport.time).toBe(value);
  });


  test.each([new Beat(1, 1, 0), new Beat(2,5,45)])('beat message sets beat: %p', value => {
    const beatStr = value.toString();
    const message = new StringMessage('/beat/str', beatStr)

    transport.receive(message);

    expect(transport.beat).toBe(beatStr);
  });

  test('frame message sets frame', () => {
    const expected = '01:02:03:04'
    const message = new StringMessage('/frames/str', expected)

    transport.receive(message);

    expect(transport.frames).toBe(expected)
  });

  test('loop start message sets loopStart', () => {
    const expected = 983.833;
    const message = new FloatMessage('/loop/start/time', expected);

    transport.receive(message);

    expect(transport.loopStart).toBe(expected);
  });

  test('loop end message sets loopEnd', () => {
    const expected = 384.827;
    const message = new FloatMessage('/loop/end/time', expected);

    transport.receive(message);

    expect(transport.loopEnd).toBe(expected);
  });
});

describe('methods send expected messages', () => {
  test('pause sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/pause', args: []});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.pause();
  });

  test('play sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/play', args: []});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.play();
  });

  test('record sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/record', args: []});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.record();
  });

  test('startFastForwarding sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/forward', args: [BoolArgument(true)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.startFastForwarding();
  });

  test('startRewinding sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/rewind', args: [BoolArgument(true)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.startRewinding();
  });

  test('stop sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/stop', args: []});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.stop();
  });

  test('stopFastForwarding sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/forward', args: [BoolArgument(false)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.stopFastForwarding();
  });

  test('stopRewinding sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/rewind', args: [BoolArgument(false)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.stopRewinding();
  });

  test('toggleRepeat sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/repeat', args: []});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.toggleRepeat();
  });

  test('jumpToTime sends expected message', done => {
    const time = 93.49
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/time', args: [FloatArgument(time)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.jumpToTime(time);
  });

  test('jumpToBeat sends expected message', done => {
    const beat = new Beat(3,6,99);
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/beat/str', args: [StringArgument(beat.toString())]});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.jumpToBeat(beat);
  });

  test('jumpToFrame sends expected message', done => {
    const frame = '01:02:03:04';
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/frames/str', args: [StringArgument(frame)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.jumpToFrame(frame);
  });

  test.each([-1, 1])('jumpToTimeRelative sends expected message: %p', (value, done: any) => {
    const currentTime = 60;
    const expected = currentTime + value;

    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/time', args: [FloatArgument(expected)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    // Set the current time
    transport.receive(new FloatMessage('/time', currentTime));

    transport.jumpToTimeRelative(value);
  });

  test('setLoopStart sends expected message', done => {
    const time = 393.442
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/loop/start/time', args: [FloatArgument(time)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.setLoopStart(time);
  });

  test('setLoopStart sends expected message', done => {
    const time = 948.382
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/loop/end/time', args: [FloatArgument(time)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.setLoopEnd(time);
  });
});
