/**
 * Integration tests for Track Send/Receive controls.
 *
 * Prerequisites:
 *  - Reaper must be running with an OSC control surface configured (see README)
 *  - Track 1 must have at least one send configured (e.g. to a bus track)
 *  - Track 1 must have at least one receive configured (or use a bus track that receives from track 1)
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
  reaper.device.selectTrackBank(1);
  reaper.device.selectTrack(1);
  await delay(300);
  await reaper.stop();
});

beforeEach(async () => {
  reaper.device.selectTrackBank(1);
  reaper.device.selectTrack(1);
  await delay(300);
});

describe('TrackSend (track 1, send 1)', () => {
  it('should have a non-empty name after sync', async () => {
    const send = reaper.tracks[0].sends[0];

    await waitForProperty(send, 'name', () => send.name, name => name.length > 0);

    expect(send.name.length).toBeGreaterThan(0);
  });

  it('should have a volume after sync', async () => {
    const send = reaper.tracks[0].sends[0];

    await waitForProperty(send, 'volume', () => send.volume, v => v > 0);

    expect(send.volume).toBeGreaterThan(0);
    expect(send.volume).toBeLessThanOrEqual(1);
  });

  it('should have a volumeStr after sync', async () => {
    const send = reaper.tracks[0].sends[0];

    await waitForProperty(send, 'volumeStr', () => send.volumeStr, s => s.length > 0);

    expect(send.volumeStr.length).toBeGreaterThan(0);
  });

  it('should set volume and receive confirmation', async () => {
    const send = reaper.tracks[0].sends[0];
    const original = send.volume;
    const target = original > 0.5 ? 0.3 : 0.8;

    send.setVolume(target);
    await waitForProperty(send, 'volume', () => send.volume, v => Math.abs(v - target) < 0.05);

    expect(send.volume).toBeCloseTo(target, 1);

    // Restore
    send.setVolume(original);
    await delay(200);
  });

  it('should set pan and receive confirmation', async () => {
    const send = reaper.tracks[0].sends[0];

    send.setPan(0.5);
    await waitForProperty(send, 'pan', () => send.pan, p => Math.abs(p - 0.5) < 0.05);

    expect(send.pan).toBeCloseTo(0.5, 1);

    // Restore
    send.setPan(0);
    await delay(200);
  });
});

describe('SelectedTrackSend (selected track, send 1)', () => {
  it('should have a non-empty name after sync', async () => {
    const send = reaper.selectedTrack.sends[0];

    await waitForProperty(send, 'name', () => send.name, name => name.length > 0);

    expect(send.name.length).toBeGreaterThan(0);
  });

  it('should set volume and receive confirmation', async () => {
    const send = reaper.selectedTrack.sends[0];
    const original = send.volume;
    const target = original > 0.5 ? 0.3 : 0.8;

    send.setVolume(target);
    await waitForProperty(send, 'volume', () => send.volume, v => Math.abs(v - target) < 0.05);

    expect(send.volume).toBeCloseTo(target, 1);

    // Restore
    send.setVolume(original);
    await delay(200);
  });

  it('should set pan and receive confirmation', async () => {
    const send = reaper.selectedTrack.sends[0];

    send.setPan(-0.5);
    await waitForProperty(send, 'pan', () => send.pan, p => Math.abs(p - (-0.5)) < 0.05);

    expect(send.pan).toBeCloseTo(-0.5, 1);

    // Restore
    send.setPan(0);
    await delay(200);
  });
});

describe('TrackReceive (track 1, receive 1)', () => {
  it('should have a non-empty name after sync', async () => {
    const recv = reaper.tracks[0].receives[0];

    await waitForProperty(recv, 'name', () => recv.name, name => name.length > 0);

    expect(recv.name.length).toBeGreaterThan(0);
  });

  it('should have a volume after sync', async () => {
    const recv = reaper.tracks[0].receives[0];

    await waitForProperty(recv, 'volume', () => recv.volume, v => v > 0);

    expect(recv.volume).toBeGreaterThan(0);
    expect(recv.volume).toBeLessThanOrEqual(1);
  });

  it('should set volume and receive confirmation', async () => {
    const recv = reaper.tracks[0].receives[0];
    const original = recv.volume;
    const target = original > 0.5 ? 0.3 : 0.8;

    recv.setVolume(target);
    await waitForProperty(recv, 'volume', () => recv.volume, v => Math.abs(v - target) < 0.05);

    expect(recv.volume).toBeCloseTo(target, 1);

    // Restore
    recv.setVolume(original);
    await delay(200);
  });

  it('should set pan and receive confirmation', async () => {
    const recv = reaper.tracks[0].receives[0];

    recv.setPan(0.5);
    await waitForProperty(recv, 'pan', () => recv.pan, p => Math.abs(p - 0.5) < 0.05);

    expect(recv.pan).toBeCloseTo(0.5, 1);

    // Restore
    recv.setPan(0);
    await delay(200);
  });
});

describe('SelectedTrackReceive (selected track, receive 1)', () => {
  it('should have a non-empty name after sync', async () => {
    const recv = reaper.selectedTrack.receives[0];

    await waitForProperty(recv, 'name', () => recv.name, name => name.length > 0);

    expect(recv.name.length).toBeGreaterThan(0);
  });

  it('should set volume and receive confirmation', async () => {
    const recv = reaper.selectedTrack.receives[0];
    const original = recv.volume;
    const target = original > 0.5 ? 0.3 : 0.8;

    recv.setVolume(target);
    await waitForProperty(recv, 'volume', () => recv.volume, v => Math.abs(v - target) < 0.05);

    expect(recv.volume).toBeCloseTo(target, 1);

    // Restore
    recv.setVolume(original);
    await delay(200);
  });
});
