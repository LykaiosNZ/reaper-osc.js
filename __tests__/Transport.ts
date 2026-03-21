import {Beat, Transport} from '../dist/Transport';
import {
  Pause, Play, ToggleRecord, SetFastForward, SetRewind, Stop,
  ToggleRepeat, SetTime, SetBeat, SetFrames, SetLoopStart, SetLoopEnd,
  ReaperOscCommand,
} from '../dist/Client/Commands';
import {
  FastForwardEvent, PauseEvent, PlayEvent, RecordEvent, RepeatEvent,
  RewindEvent, StopEvent, TimeChanged, BeatChanged, FramesChanged,
  LoopStartChanged, LoopEndChanged,
} from '../dist/Client/Events';

describe('properties set by events', () => {
  let transport: Transport;

  beforeEach(() => {
    transport = new Transport(() => null);
  });

  test.each([true, false])('fastForward event sets isFastForwarding: %p', value => {
    transport.handleEvent(FastForwardEvent(value));
    expect(transport.isFastForwarding).toBe(value);
  });

  test.each([true, false])('pause event sets isPaused: %p', value => {
    transport.handleEvent(PauseEvent(value));
    expect(transport.isPaused).toBe(value);
  });

  test.each([true, false])('play event sets isPlaying: %p', value => {
    transport.handleEvent(PlayEvent(value));
    expect(transport.isPlaying).toBe(value);
  });

  test.each([true, false])('record event sets isRecording: %p', value => {
    transport.handleEvent(RecordEvent(value));
    expect(transport.isRecording).toBe(value);
  });

  test.each([true, false])('repeat event sets isRepeatEnabled: %p', value => {
    transport.handleEvent(RepeatEvent(value));
    expect(transport.isRepeatEnabled).toBe(value);
  });

  test.each([true, false])('rewind event sets isRewinding: %p', value => {
    transport.handleEvent(RewindEvent(value));
    expect(transport.isRewinding).toBe(value);
  });

  test.each([true, false])('stop event sets isStopped: %p', value => {
    transport.handleEvent(StopEvent(value));
    expect(transport.isStopped).toBe(value);
  });

  test.each([0.1, 88.456])('time event sets time: %p', value => {
    transport.handleEvent(TimeChanged(value));
    expect(transport.time).toBe(value);
  });

  test.each([new Beat(1, 1, 0), new Beat(2, 5, 45)])('beat event sets beat: %p', value => {
    const beatStr = value.toString();
    transport.handleEvent(BeatChanged(beatStr));
    expect(transport.beat).toBe(beatStr);
  });

  test('frames event sets frames', () => {
    const expected = '01:02:03:04';
    transport.handleEvent(FramesChanged(expected));
    expect(transport.frames).toBe(expected);
  });

  test('loopStart event sets loopStart', () => {
    const expected = 983.833;
    transport.handleEvent(LoopStartChanged(expected));
    expect(transport.loopStart).toBe(expected);
  });

  test('loopEnd event sets loopEnd', () => {
    const expected = 384.827;
    transport.handleEvent(LoopEndChanged(expected));
    expect(transport.loopEnd).toBe(expected);
  });
});

describe('methods send expected commands', () => {
  test('pause sends expected command', done => {
    const transport = new Transport((command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(Pause());
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
        expect(command).toMatchObject(Play());
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
        expect(command).toMatchObject(ToggleRecord());
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
        expect(command).toMatchObject(SetFastForward(true));
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
        expect(command).toMatchObject(SetRewind(true));
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
        expect(command).toMatchObject(Stop());
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
        expect(command).toMatchObject(SetFastForward(false));
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
        expect(command).toMatchObject(SetRewind(false));
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
        expect(command).toMatchObject(ToggleRepeat());
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
        expect(command).toMatchObject(SetTime(time));
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
        expect(command).toMatchObject(SetBeat(beat.toString()));
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
        expect(command).toMatchObject(SetFrames(frame));
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
        expect(command).toMatchObject(SetTime(expected));
        done();
      } catch (error) {
        done(error);
      }
    });

    // Set the current time
    transport.handleEvent(TimeChanged(currentTime));

    transport.jumpToTimeRelative(value);
  });

  test('setLoopStart sends expected command', done => {
    const time = 393.442;
    const transport = new Transport((command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetLoopStart(time));
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
        expect(command).toMatchObject(SetLoopEnd(time));
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.setLoopEnd(time);
  });
});
