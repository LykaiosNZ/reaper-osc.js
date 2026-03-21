import {Beat, Transport} from '../dist/Transport';
import {ReaperOscCommand} from '../dist/Client/Commands';

describe('properties set by events', () => {
  let transport: Transport;

  beforeEach(() => {
    transport = new Transport(() => null);
  });

  test.each([true, false])('fastForward event sets isFastForwarding: %p', value => {
    transport.handleEvent({type: 'transport:fastForward', fastForwarding: value});
    expect(transport.isFastForwarding).toBe(value);
  });

  test.each([true, false])('pause event sets isPaused: %p', value => {
    transport.handleEvent({type: 'transport:pause', paused: value});
    expect(transport.isPaused).toBe(value);
  });

  test.each([true, false])('play event sets isPlaying: %p', value => {
    transport.handleEvent({type: 'transport:play', playing: value});
    expect(transport.isPlaying).toBe(value);
  });

  test.each([true, false])('record event sets isRecording: %p', value => {
    transport.handleEvent({type: 'transport:record', recording: value});
    expect(transport.isRecording).toBe(value);
  });

  test.each([true, false])('repeat event sets isRepeatEnabled: %p', value => {
    transport.handleEvent({type: 'transport:repeat', enabled: value});
    expect(transport.isRepeatEnabled).toBe(value);
  });

  test.each([true, false])('rewind event sets isRewinding: %p', value => {
    transport.handleEvent({type: 'transport:rewind', rewinding: value});
    expect(transport.isRewinding).toBe(value);
  });

  test.each([true, false])('stop event sets isStopped: %p', value => {
    transport.handleEvent({type: 'transport:stop', stopped: value});
    expect(transport.isStopped).toBe(value);
  });

  test.each([0.1, 88.456])('time event sets time: %p', value => {
    transport.handleEvent({type: 'transport:time', time: value});
    expect(transport.time).toBe(value);
  });

  test.each([new Beat(1, 1, 0), new Beat(2, 5, 45)])('beat event sets beat: %p', value => {
    const beatStr = value.toString();
    transport.handleEvent({type: 'transport:beat', beat: beatStr});
    expect(transport.beat).toBe(beatStr);
  });

  test('frames event sets frames', () => {
    const expected = '01:02:03:04';
    transport.handleEvent({type: 'transport:frames', frames: expected});
    expect(transport.frames).toBe(expected);
  });

  test('loopStart event sets loopStart', () => {
    const expected = 983.833;
    transport.handleEvent({type: 'transport:loopStart', time: expected});
    expect(transport.loopStart).toBe(expected);
  });

  test('loopEnd event sets loopEnd', () => {
    const expected = 384.827;
    transport.handleEvent({type: 'transport:loopEnd', time: expected});
    expect(transport.loopEnd).toBe(expected);
  });
});

describe('methods send expected commands', () => {
  test('pause sends expected command', done => {
    const transport = new Transport((command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'transport:pause'});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.pause();
  });

  test('play sends expected command', done => {
    const transport = new Transport((command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'transport:play'});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.play();
  });

  test('record sends expected command', done => {
    const transport = new Transport((command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'transport:record'});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.record();
  });

  test('startFastForwarding sends expected command', done => {
    const transport = new Transport((command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'transport:fastForward', fastForwarding: true});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.startFastForwarding();
  });

  test('startRewinding sends expected command', done => {
    const transport = new Transport((command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'transport:rewind', rewinding: true});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.startRewinding();
  });

  test('stop sends expected command', done => {
    const transport = new Transport((command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'transport:stop'});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.stop();
  });

  test('stopFastForwarding sends expected command', done => {
    const transport = new Transport((command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'transport:fastForward', fastForwarding: false});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.stopFastForwarding();
  });

  test('stopRewinding sends expected command', done => {
    const transport = new Transport((command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'transport:rewind', rewinding: false});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.stopRewinding();
  });

  test('toggleRepeat sends expected command', done => {
    const transport = new Transport((command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'transport:repeat:toggle'});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.toggleRepeat();
  });

  test('jumpToTime sends expected command', done => {
    const time = 93.49;
    const transport = new Transport((command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'transport:time', time});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.jumpToTime(time);
  });

  test('jumpToBeat sends expected command', done => {
    const beat = new Beat(3, 6, 99);
    const transport = new Transport((command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'transport:beat', beat: beat.toString()});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.jumpToBeat(beat);
  });

  test('jumpToFrame sends expected command', done => {
    const frame = '01:02:03:04';
    const transport = new Transport((command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'transport:frames', frames: frame});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.jumpToFrame(frame);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  test.each([-1, 1])('jumpToTimeRelative sends expected command: %p', (value, done: any) => {
    const currentTime = 60;
    const expected = currentTime + value;

    const transport = new Transport((command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'transport:time', time: expected});
        done();
      } catch (error) {
        done(error);
      }
    });

    // Set the current time
    transport.handleEvent({type: 'transport:time', time: currentTime});

    transport.jumpToTimeRelative(value);
  });

  test('setLoopStart sends expected command', done => {
    const time = 393.442;
    const transport = new Transport((command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'transport:loopStart', time});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.setLoopStart(time);
  });

  test('setLoopEnd sends expected command', done => {
    const time = 948.382;
    const transport = new Transport((command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject({type: 'transport:loopEnd', time});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.setLoopEnd(time);
  });
});
