/**
 * Integration tests for Track controls.
 *
 * Prerequisites:
 *  - Reaper must be running with an OSC control surface configured (see README)
 *  - Track 1 must exist, have a unique name (not the default "Track1"), and
 *    start unmuted, unsoloed, not record-armed, with volume at 0 dB and pan centred
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

afterEach(async () => {
  // Reset track 1 to a clean state for the next test
  const track = reaper.tracks[0];
  if (track) {
    track.unmute();
    track.unsolo();
    track.recordDisarm();
    track.setVolumeFaderPosition(0.716); // ~0 dB
    track.setPan(0);
    await delay(300);
  }
});

describe('Track', () => {
  it('should mute a track and receive confirmation', async () => {
    const track = reaper.tracks[0];

    track.mute();
    await waitForValue(track, 'isMuted', () => track.isMuted, true);

    expect(track.isMuted).toBe(true);
  });

  it('should unmute a track and receive confirmation', async () => {
    const track = reaper.tracks[0];

    track.mute();
    await waitForValue(track, 'isMuted', () => track.isMuted, true);

    track.unmute();
    await waitForValue(track, 'isMuted', () => track.isMuted, false);

    expect(track.isMuted).toBe(false);
  });

  it('should toggle mute', async () => {
    const track = reaper.tracks[0];
    const initial = track.isMuted;

    track.toggleMute();
    await waitForValue(track, 'isMuted', () => track.isMuted, !initial);

    expect(track.isMuted).toBe(!initial);

    track.toggleMute();
    await waitForValue(track, 'isMuted', () => track.isMuted, initial);
  });

  it('should solo a track and receive confirmation', async () => {
    const track = reaper.tracks[0];

    track.solo();
    await waitForValue(track, 'isSoloed', () => track.isSoloed, true);

    expect(track.isSoloed).toBe(true);
  });

  it('should unsolo a track', async () => {
    const track = reaper.tracks[0];

    track.solo();
    await waitForValue(track, 'isSoloed', () => track.isSoloed, true);

    track.unsolo();
    await waitForValue(track, 'isSoloed', () => track.isSoloed, false);

    expect(track.isSoloed).toBe(false);
  });

  it('should toggle solo', async () => {
    const track = reaper.tracks[0];
    const initial = track.isSoloed;

    track.toggleSolo();
    await waitForValue(track, 'isSoloed', () => track.isSoloed, !initial);

    expect(track.isSoloed).toBe(!initial);

    track.toggleSolo();
    await waitForValue(track, 'isSoloed', () => track.isSoloed, initial);
  });

  it('should arm a track for recording', async () => {
    const track = reaper.tracks[0];

    track.recordArm();
    await waitForValue(track, 'isRecordArmed', () => track.isRecordArmed, true);

    expect(track.isRecordArmed).toBe(true);
  });

  it('should disarm a track', async () => {
    const track = reaper.tracks[0];

    track.recordArm();
    await waitForValue(track, 'isRecordArmed', () => track.isRecordArmed, true);

    track.recordDisarm();
    await waitForValue(track, 'isRecordArmed', () => track.isRecordArmed, false);

    expect(track.isRecordArmed).toBe(false);
  });

  it('should set volume fader position', async () => {
    const track = reaper.tracks[0];
    const targetVolume = 0.5;

    track.setVolumeFaderPosition(targetVolume);
    await delay(300);

    expect(track.volumeFaderPosition).toBeCloseTo(targetVolume, 1);
  });

  it('should set pan position', async () => {
    const track = reaper.tracks[0];
    const targetPan = 0.5; // 50% right

    track.setPan(targetPan);
    await delay(300);

    expect(track.pan).toBeCloseTo(targetPan, 1);
  });

  it('should rename a track', async () => {
    const track = reaper.tracks[0];
    const originalName = track.name;
    const newName = `IntegrationTest_${Date.now()}`;

    track.rename(newName);
    expect(track.name).toBe(newName);

    track.rename(originalName);
  });

  it('should receive track name from Reaper on initial sync', async () => {
    const track = reaper.tracks[0];

    // The beforeAll delay(500) should have already received the sync burst,
    // so the name should already differ from the constructor default
    await waitForProperty(track, 'name', () => track.name, name => name !== 'Track1');

    expect(track.name).not.toBe('Track1');
  });

  it('should toggle record arm', async () => {
    const track = reaper.tracks[0];
    const initial = track.isRecordArmed;

    track.toggleRecordArm();
    await waitForValue(track, 'isRecordArmed', () => track.isRecordArmed, !initial);
    expect(track.isRecordArmed).toBe(!initial);

    track.toggleRecordArm();
    await waitForValue(track, 'isRecordArmed', () => track.isRecordArmed, initial);
  });

  it('should select and deselect a track', async () => {
    const track = reaper.tracks[0];

    track.select();
    await waitForValue(track, 'isSelected', () => track.isSelected, true);
    expect(track.isSelected).toBe(true);

    track.deselect();
    await waitForValue(track, 'isSelected', () => track.isSelected, false);
    expect(track.isSelected).toBe(false);
  });

  it('should set volume in dB and receive fader position feedback', async () => {
    const track = reaper.tracks[0];
    const originalFaderPos = track.volumeFaderPosition;

    track.setVolumeDb(-6);

    // volumeDb is set locally (Reaper doesn't echo dB back via OSC)
    expect(track.volumeDb).toBeCloseTo(-6, 0);

    // But Reaper DOES send the fader position update, so verify the round-trip
    await waitForProperty(
      track, 'volumeFaderPosition',
      () => track.volumeFaderPosition,
      pos => Math.abs(pos - originalFaderPos) > 0.01,
    );

    // -6 dB should map to a fader position noticeably below 0.716 (~0 dB)
    expect(track.volumeFaderPosition).toBeLessThan(0.716);
    expect(track.volumeFaderPosition).toBeGreaterThan(0);
  });

  it('should have VU meter values while playing', async () => {
    // Start playback so VU meters have signal
    reaper.transport.play();
    await waitForValue(reaper.transport, 'isPlaying', () => reaper.transport.isPlaying, true);

    // Wait for any VU activity on track 1
    const track = reaper.tracks[0];
    await waitForProperty(track, 'vu', () => track.vu, vu => vu > 0, 5000);

    expect(track.vu).toBeGreaterThan(0);

    reaper.transport.stop();
    await delay(200);
  });
});

describe('Master track', () => {
  it('should exist and have track number 0', () => {
    expect(reaper.master).toBeDefined();
    expect(reaper.master.trackNumber).toBe(0);
  });

  it('should receive volume state', async () => {
    // Master track should have some volume state after sync
    // Default is 0 dB which maps to fader ~0.716
    expect(reaper.master.volumeFaderPosition).toBeGreaterThanOrEqual(0);
    expect(reaper.master.volumeFaderPosition).toBeLessThanOrEqual(1);
  });

  // Master track mute is not supported via OSC — Reaper does not send feedback
  // for master mute state changes. See https://github.com/LykaiosNZ/reaper-osc.js/issues/35
  it.skip('should mute and unmute', async () => {
    const master = reaper.master;

    master.mute();
    await waitForValue(master, 'isMuted', () => master.isMuted, true);
    expect(master.isMuted).toBe(true);

    master.unmute();
    await waitForValue(master, 'isMuted', () => master.isMuted, false);
    expect(master.isMuted).toBe(false);
  });
});