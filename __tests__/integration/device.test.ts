/**
 * Integration tests for DeviceState (track/bank/FX navigation).
 *
 * Prerequisites:
 *  - Reaper must be running with an OSC control surface configured (see README)
 *  - The project must have at least 9 tracks, each with a unique name
 *    (bank size is 8; a 9th track is needed to verify bank 2 has different content)
 */

import {Reaper} from '../../dist/Reaper';
import {createReaper, waitForReady, waitForSync, waitForProperty, delay} from './setup';

let reaper: Reaper;

beforeAll(async () => {
  reaper = createReaper();
  await waitForReady(reaper);
  await waitForSync(reaper);
});

afterAll(async () => {
  // Ensure we leave on bank 1 so subsequent test files are not affected
  reaper.device.selectTrackBank(1);
  reaper.device.selectTrack(1);
  await delay(300);
  await reaper.stop();
});

beforeEach(async () => {
  // Return to bank 1, track 1 before each test
  reaper.device.selectTrackBank(1);
  reaper.device.selectTrack(1);
  await delay(300);
});

describe('DeviceState', () => {
  describe('track selection', () => {
    it('should select a specific track and trigger a state sync', async () => {
      // Capture track 1 name (already known from sync)
      const track1Name = reaper.selectedTrack.name;
      expect(track1Name).toBeTruthy();

      // Switch to track 2 and wait for the name to change away from track 1's name
      reaper.device.selectTrack(2);
      await waitForProperty(
        reaper.selectedTrack, 'name',
        () => reaper.selectedTrack.name,
        name => name.length > 0 && name !== track1Name,
      );

      expect(reaper.selectedTrack.name).not.toBe(track1Name);
    });

    it('should navigate to the next track', async () => {
      const track1Name = reaper.selectedTrack.name;

      reaper.device.nextTrack();
      await waitForProperty(
        reaper.selectedTrack, 'name',
        () => reaper.selectedTrack.name,
        name => name !== track1Name,
      );

      expect(reaper.selectedTrack.name).not.toBe(track1Name);
    });

    it('should navigate to the previous track', async () => {
      // Capture track 1 name before switching, so we can tell when track 2 has loaded
      const track1Name = reaper.selectedTrack.name;

      reaper.device.selectTrack(2);
      await waitForProperty(
        reaper.selectedTrack, 'name',
        () => reaper.selectedTrack.name,
        name => name !== track1Name && name.length > 0,
      );
      const track2Name = reaper.selectedTrack.name;

      reaper.device.previousTrack();
      await waitForProperty(
        reaper.selectedTrack, 'name',
        () => reaper.selectedTrack.name,
        name => name !== track2Name,
      );

      expect(reaper.selectedTrack.name).not.toBe(track2Name);
    });
  });

  describe('track bank navigation', () => {
    // Note: Reaper sends track names using absolute track numbers (/track/1/name,
    // /track/2/name, etc.) regardless of which bank is active. The tracks[] array
    // therefore always reflects absolute tracks 1-8 and does not change on bank
    // navigation. Bank navigation is verified indirectly: switch bank, select a
    // track slot, and confirm selectedTrack reflects a track from the new bank.

    it('should expose a track from bank 2 after nextTrackBank + selectTrack', async () => {
      const bank1Track1Name = reaper.selectedTrack.name; // track 1

      reaper.device.nextTrackBank();
      await delay(200);
      reaper.device.selectTrack(1); // slot 1 in bank 2 = absolute track 9
      await waitForProperty(
        reaper.selectedTrack, 'name',
        () => reaper.selectedTrack.name,
        name => name !== bank1Track1Name && name.length > 0,
      );

      expect(reaper.selectedTrack.name).not.toBe(bank1Track1Name);
    });

    it('should return to bank 1 tracks after previousTrackBank', async () => {
      const bank1Track1Name = reaper.selectedTrack.name;

      // Move to bank 2
      reaper.device.nextTrackBank();
      await delay(200);
      reaper.device.selectTrack(1);
      await waitForProperty(
        reaper.selectedTrack, 'name',
        () => reaper.selectedTrack.name,
        name => name !== bank1Track1Name && name.length > 0,
      );

      // Go back to bank 1
      reaper.device.previousTrackBank();
      await delay(200);
      reaper.device.selectTrack(1);
      await waitForProperty(
        reaper.selectedTrack, 'name',
        () => reaper.selectedTrack.name,
        name => name === bank1Track1Name,
      );

      expect(reaper.selectedTrack.name).toBe(bank1Track1Name);
    });

    it('should expose a track from bank 2 after selectTrackBank(2)', async () => {
      const bank1Track1Name = reaper.selectedTrack.name;

      reaper.device.selectTrackBank(2);
      await delay(200);
      reaper.device.selectTrack(1); // slot 1 in bank 2 = absolute track 9
      await waitForProperty(
        reaper.selectedTrack, 'name',
        () => reaper.selectedTrack.name,
        name => name !== bank1Track1Name && name.length > 0,
      );

      expect(reaper.selectedTrack.name).not.toBe(bank1Track1Name);
    });
  });
});
