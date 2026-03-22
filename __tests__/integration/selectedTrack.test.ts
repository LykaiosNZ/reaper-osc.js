/**
 * Integration tests for SelectedTrack (device-focused track).
 *
 * Prerequisites:
 *  - Reaper must be running with an OSC control surface configured (see README)
 *  - The project must have at least 2 tracks with unique names
 */

import {Reaper} from '../../dist/Reaper';
import {createReaper, waitForReady, waitForSync, waitForProperty, waitForValue, delay} from './setup';

let reaper: Reaper;

beforeAll(async () => {
  reaper = createReaper();
  await waitForReady(reaper);
  await waitForSync(reaper);
});

afterAll(async () => {
  await reaper.stop();
});

beforeEach(async () => {
  // Ensure we start each test on bank 1, track 1 in a clean state
  reaper.device.selectTrackBank(1);
  reaper.device.selectTrack(1);
  await waitForProperty(
    reaper.selectedTrack, 'name',
    () => reaper.selectedTrack.name,
    name => name.length > 0,
  );
  const st = reaper.selectedTrack;
  st.unmute();
  st.unsolo();
  st.recordDisarm();
  st.setPan(0);
  st.setVolumeFaderPosition(0.716);
  await delay(300);
});

describe('SelectedTrack', () => {
  it('should receive the selected track name after device.selectTrack', async () => {
    expect(reaper.selectedTrack.name).toBeTruthy();
  });

  it('should mute the selected track', async () => {
    const st = reaper.selectedTrack;

    st.mute();
    await waitForValue(st, 'isMuted', () => st.isMuted, true);

    expect(st.isMuted).toBe(true);
  });

  it('should unmute the selected track', async () => {
    const st = reaper.selectedTrack;

    st.mute();
    await waitForValue(st, 'isMuted', () => st.isMuted, true);

    st.unmute();
    await waitForValue(st, 'isMuted', () => st.isMuted, false);

    expect(st.isMuted).toBe(false);
  });

  it('should solo the selected track', async () => {
    const st = reaper.selectedTrack;

    st.solo();
    await waitForValue(st, 'isSoloed', () => st.isSoloed, true);

    expect(st.isSoloed).toBe(true);
  });

  it('should unsolo the selected track', async () => {
    const st = reaper.selectedTrack;

    st.solo();
    await waitForValue(st, 'isSoloed', () => st.isSoloed, true);

    st.unsolo();
    await waitForValue(st, 'isSoloed', () => st.isSoloed, false);

    expect(st.isSoloed).toBe(false);
  });

  it('should arm the selected track for recording', async () => {
    const st = reaper.selectedTrack;

    st.recordArm();
    await waitForValue(st, 'isRecordArmed', () => st.isRecordArmed, true);

    expect(st.isRecordArmed).toBe(true);
  });

  it('should disarm the selected track', async () => {
    const st = reaper.selectedTrack;

    st.recordArm();
    await waitForValue(st, 'isRecordArmed', () => st.isRecordArmed, true);

    st.recordDisarm();
    await waitForValue(st, 'isRecordArmed', () => st.isRecordArmed, false);

    expect(st.isRecordArmed).toBe(false);
  });

  it('should set volume fader position on selected track', async () => {
    const st = reaper.selectedTrack;
    const target = 0.5;

    st.setVolumeFaderPosition(target);
    await delay(300);

    expect(st.volumeFaderPosition).toBeCloseTo(target, 1);
  });

  it('should set pan on selected track', async () => {
    const st = reaper.selectedTrack;
    const target = -0.5; // 50% left

    st.setPan(target);
    await delay(300);

    expect(st.pan).toBeCloseTo(target, 1);
  });

  it('should rename the selected track', async () => {
    const st = reaper.selectedTrack;
    const originalName = st.name;
    const newName = `SelTrackTest_${Date.now()}`;

    st.rename(newName);
    expect(st.name).toBe(newName);

    st.rename(originalName);
  });

  it('should update state when switching to a different track', async () => {
    // beforeEach already confirmed we're on track 1 with a non-empty name
    const track1Name = reaper.selectedTrack.name;
    const uniqueName = `__test_track1_${Date.now()}`;
    reaper.selectedTrack.rename(uniqueName);

    // Switch to track 2 — selected track state should update
    reaper.device.selectTrack(2);
    await waitForProperty(
      reaper.selectedTrack, 'name',
      () => reaper.selectedTrack.name,
      name => name !== uniqueName,
      5000,
    );

    expect(reaper.selectedTrack.name).not.toBe(uniqueName);

    // Restore track 1's original name
    reaper.device.selectTrack(1);
    await waitForProperty(
      reaper.selectedTrack, 'name',
      () => reaper.selectedTrack.name,
      name => name === uniqueName,
    );
    reaper.selectedTrack.rename(track1Name);
    await delay(300);
  });
});
