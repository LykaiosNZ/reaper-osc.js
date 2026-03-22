/**
 * Integration tests for Transport controls.
 *
 * Prerequisites:
 *  - Reaper must be running with an OSC control surface configured (see README)
 *  - A project must be open with a timeline of at least 10 seconds
 */

import {Reaper} from '../../dist/Reaper';
import {createReaper, waitForReady, waitForProperty, waitForValue, delay} from './setup';

let reaper: Reaper;

beforeAll(async () => {
  reaper = createReaper();
  await waitForReady(reaper);
});

afterAll(async () => {
  await reaper.stop();
});

afterEach(async () => {
  reaper.transport.stop();
  await delay(200);
});

describe('Transport', () => {
  it('should start playback and report isPlaying', async () => {
    reaper.transport.play();

    await waitForValue(
      reaper.transport, 'isPlaying',
      () => reaper.transport.isPlaying,
      true,
    );

    expect(reaper.transport.isPlaying).toBe(true);
  });

  it('should stop playback and report isStopped', async () => {
    reaper.transport.play();
    await waitForValue(
      reaper.transport, 'isPlaying',
      () => reaper.transport.isPlaying,
      true,
    );

    reaper.transport.stop();
    await waitForValue(
      reaper.transport, 'isStopped',
      () => reaper.transport.isStopped,
      true,
    );

    expect(reaper.transport.isStopped).toBe(true);
  });

  it('should pause playback and report isPaused', async () => {
    reaper.transport.play();
    await waitForValue(
      reaper.transport, 'isPlaying',
      () => reaper.transport.isPlaying,
      true,
    );

    reaper.transport.pause();
    await waitForValue(
      reaper.transport, 'isPaused',
      () => reaper.transport.isPaused,
      true,
    );

    expect(reaper.transport.isPaused).toBe(true);
  });

  it('should toggle record and report isRecording', async () => {
    reaper.transport.record();

    await waitForValue(
      reaper.transport, 'isRecording',
      () => reaper.transport.isRecording,
      true,
    );

    expect(reaper.transport.isRecording).toBe(true);

    reaper.transport.stop();
    await waitForValue(
      reaper.transport, 'isStopped',
      () => reaper.transport.isStopped,
      true,
    );
  });

  it('should toggle repeat and report isRepeatEnabled', async () => {
    const initialRepeat = reaper.transport.isRepeatEnabled;

    reaper.transport.toggleRepeat();
    await waitForValue(
      reaper.transport, 'isRepeatEnabled',
      () => reaper.transport.isRepeatEnabled,
      !initialRepeat,
    );

    expect(reaper.transport.isRepeatEnabled).toBe(!initialRepeat);

    reaper.transport.toggleRepeat();
    await waitForValue(
      reaper.transport, 'isRepeatEnabled',
      () => reaper.transport.isRepeatEnabled,
      initialRepeat,
    );
  });

  it('should update time when playing', async () => {
    reaper.transport.jumpToTime(0);
    await waitForProperty(
      reaper.transport, 'time',
      () => reaper.transport.time,
      t => t === 0 || t < 0.5,
    );

    reaper.transport.play();
    await waitForValue(
      reaper.transport, 'isPlaying',
      () => reaper.transport.isPlaying,
      true,
    );

    const timeAfterPlay = reaper.transport.time;

    await waitForProperty(
      reaper.transport, 'time',
      () => reaper.transport.time,
      t => t > timeAfterPlay,
    );

    expect(reaper.transport.time).toBeGreaterThan(timeAfterPlay);
  });

  it('should jump to a specific time', async () => {
    const targetTime = 10.0;

    reaper.transport.jumpToTime(targetTime);

    await waitForProperty(
      reaper.transport, 'time',
      () => reaper.transport.time,
      t => Math.abs(t - targetTime) < 1,
    );

    expect(reaper.transport.time).toBeCloseTo(targetTime, 0);
  });

  it('should report beat string while playing', async () => {
    reaper.transport.jumpToTime(0);
    await delay(200);

    reaper.transport.play();
    await waitForValue(reaper.transport, 'isPlaying', () => reaper.transport.isPlaying, true);

    // Wait for the beat to update from the default
    await waitForProperty(
      reaper.transport, 'beat',
      () => reaper.transport.beat,
      beat => beat.length > 0,
    );

    expect(reaper.transport.beat).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('should report frames string while playing', async () => {
    reaper.transport.play();
    await waitForValue(reaper.transport, 'isPlaying', () => reaper.transport.isPlaying, true);

    await waitForProperty(
      reaper.transport, 'frames',
      () => reaper.transport.frames,
      frames => frames.length > 0,
    );

    expect(reaper.transport.frames).toMatch(/^\d+:\d+:\d+:\d+$/);
  });

  it('should jump to a relative time offset', async () => {
    reaper.transport.jumpToTime(5);
    await waitForProperty(
      reaper.transport, 'time',
      () => reaper.transport.time,
      t => Math.abs(t - 5) < 1,
    );

    reaper.transport.jumpToTimeRelative(5);
    await waitForProperty(
      reaper.transport, 'time',
      () => reaper.transport.time,
      t => Math.abs(t - 10) < 1.5,
    );

    expect(reaper.transport.time).toBeCloseTo(10, 0);
  });

  it('should set and report loop start', async () => {
    const initial = reaper.transport.loopStart;
    // Pick a target that differs from the current value so we always get a change event
    const target = Math.abs(initial - 2.0) < 0.5 ? 4.0 : 2.0;

    // Reaper silently adjusts loopEnd instead of loopStart when loopStart >= loopEnd.
    // Ensure loopEnd is large enough to accept any loopStart we set.
    if (reaper.transport.loopEnd < target + 1) {
      reaper.transport.setLoopEnd(30.0);
      await waitForProperty(
        reaper.transport, 'loopEnd',
        () => reaper.transport.loopEnd,
        t => t >= 29.5,
      );
    }

    reaper.transport.setLoopStart(target);
    await waitForProperty(
      reaper.transport, 'loopStart',
      () => reaper.transport.loopStart,
      t => Math.abs(t - target) < 0.5,
    );

    expect(reaper.transport.loopStart).toBeCloseTo(target, 0);

    // Restore
    reaper.transport.setLoopStart(initial);
    await delay(200);
  });

  it('should set and report loop end', async () => {
    const initial = reaper.transport.loopEnd;
    // Pick a target that differs from the current value so we always get a change event
    const target = Math.abs(initial - 20.0) < 0.5 ? 10.0 : 20.0;

    reaper.transport.setLoopEnd(target);
    await waitForProperty(
      reaper.transport, 'loopEnd',
      () => reaper.transport.loopEnd,
      t => Math.abs(t - target) < 0.5,
    );

    expect(reaper.transport.loopEnd).toBeCloseTo(target, 0);

    // Restore
    reaper.transport.setLoopEnd(initial);
    await delay(200);
  });

  it('should fast-forward and report isFastForwarding', async () => {
    reaper.transport.startFastForwarding();
    await waitForValue(
      reaper.transport, 'isFastForwarding',
      () => reaper.transport.isFastForwarding,
      true,
    );

    expect(reaper.transport.isFastForwarding).toBe(true);

    reaper.transport.stopFastForwarding();
    await waitForValue(
      reaper.transport, 'isFastForwarding',
      () => reaper.transport.isFastForwarding,
      false,
    );
  });

  it('should rewind and report isRewinding', async () => {
    // Jump forward first so there is room to rewind
    reaper.transport.jumpToTime(15);
    await delay(200);

    reaper.transport.startRewinding();
    await waitForValue(
      reaper.transport, 'isRewinding',
      () => reaper.transport.isRewinding,
      true,
    );

    expect(reaper.transport.isRewinding).toBe(true);

    reaper.transport.stopRewinding();
    await waitForValue(
      reaper.transport, 'isRewinding',
      () => reaper.transport.isRewinding,
      false,
    );
  });
});
