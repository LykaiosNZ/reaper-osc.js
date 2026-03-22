/**
 * Integration tests for the Reaper class (lifecycle, global controls).
 *
 * Prerequisites:
 *  - Reaper must be running with an OSC control surface configured (see README)
 */

import {Reaper} from '../../dist/Reaper';
import {createReaper, waitForReady, waitForSync, waitForProperty, waitForValue, delay} from './setup';

// ---------------------------------------------------------------------------
// Lifecycle tests — each test manages its own client so start()/stop() can
// be tested in isolation. These run serially (runInBand) so only one client
// is bound at a time.
// ---------------------------------------------------------------------------
describe('Reaper lifecycle', () => {
  let reaper: Reaper;

  afterEach(async () => {
    if (reaper.isReady) {
      await reaper.stop();
    }
  });

  it('should be ready after start()', async () => {
    reaper = createReaper();
    await waitForReady(reaper);
    expect(reaper.isReady).toBe(true);
  });

  it('should not be ready after stop()', async () => {
    reaper = createReaper();
    await waitForReady(reaper);
    await reaper.stop();
    expect(reaper.isReady).toBe(false);
  });

  it('should receive track state from Reaper after starting', async () => {
    reaper = createReaper();
    await waitForReady(reaper);
    await waitForSync(reaper);

    expect(reaper.tracks[0].name).not.toBe('Track' + reaper.tracks[0].trackNumber);
  });

  it('should have a master track', async () => {
    reaper = createReaper();
    await waitForReady(reaper);
    expect(reaper.master).toBeDefined();
    expect(reaper.master.trackNumber).toBe(0);
  });

  it('should have a transport', async () => {
    reaper = createReaper();
    await waitForReady(reaper);
    expect(reaper.transport).toBeDefined();
  });

  it('should have a device', async () => {
    reaper = createReaper();
    await waitForReady(reaper);
    expect(reaper.device).toBeDefined();
  });

  it('should have a selectedTrack', async () => {
    reaper = createReaper();
    await waitForReady(reaper);
    expect(reaper.selectedTrack).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Global controls — share a single client across all tests in this block.
// ---------------------------------------------------------------------------
describe('Reaper global controls', () => {
  let reaper: Reaper;

  beforeAll(async () => {
    reaper = createReaper();
    await waitForReady(reaper);
    await waitForSync(reaper);
  });

  afterAll(async () => {
    await reaper.stop();
  });

  it('should toggle metronome', async () => {
    const initial = reaper.isMetronomeEnabled;

    reaper.toggleMetronome();
    await waitForValue(reaper, 'isMetronomeEnabled', () => reaper.isMetronomeEnabled, !initial);
    expect(reaper.isMetronomeEnabled).toBe(!initial);

    reaper.toggleMetronome();
    await waitForValue(reaper, 'isMetronomeEnabled', () => reaper.isMetronomeEnabled, initial);
  });

  it('should toggle auto-record-arm', async () => {
    const initial = reaper.isAutoRecordArmEnabled;

    reaper.toggleAutoRecordArm();
    await waitForValue(reaper, 'isAutoRecordArmEnabled', () => reaper.isAutoRecordArmEnabled, !initial);
    expect(reaper.isAutoRecordArmEnabled).toBe(!initial);

    reaper.toggleAutoRecordArm();
    await waitForValue(reaper, 'isAutoRecordArmEnabled', () => reaper.isAutoRecordArmEnabled, initial);
  });

  it('should report isAnySoloed after soloing a track', async () => {
    const track = reaper.tracks[0];

    track.unsolo();
    await delay(300);

    track.solo();
    await waitForValue(reaper, 'isAnySoloed', () => reaper.isAnySoloed, true);
    expect(reaper.isAnySoloed).toBe(true);

    track.unsolo();
    await waitForValue(reaper, 'isAnySoloed', () => reaper.isAnySoloed, false);
  });

  it('should reset solos via soloReset', async () => {
    const track = reaper.tracks[0];

    track.solo();
    await waitForValue(reaper, 'isAnySoloed', () => reaper.isAnySoloed, true);

    reaper.soloReset();
    await waitForValue(reaper, 'isAnySoloed', () => reaper.isAnySoloed, false);

    expect(reaper.isAnySoloed).toBe(false);
  });

  it('should trigger refreshControlSurfaces without error', () => {
    expect(() => reaper.refreshControlSurfaces()).not.toThrow();
  });
});
