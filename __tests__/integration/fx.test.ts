/**
 * Integration tests for FX controls (TrackFx and SelectedTrackFxSlot).
 *
 * Prerequisites:
 *  - Reaper must be running with an OSC control surface configured (see README)
 *  - Track 1 must have at least one FX plugin loaded in FX slot 1
 *  - The FX plugin in slot 1 must have at least 2 presets (for preset navigation tests)
 *  - Track 1 must have at least 2 FX plugins loaded (for device FX navigation tests)
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
  // Ensure bank 1 / track 1 selected for subsequent test files
  reaper.device.selectTrackBank(1);
  reaper.device.selectTrack(1);
  await delay(300);
  await reaper.stop();
});

beforeEach(async () => {
  // Return to bank 1, track 1 and unbypass FX 1 before each test
  reaper.device.selectTrackBank(1);
  reaper.device.selectTrack(1);
  await delay(300);

  const fx = reaper.tracks[0].fx[0];
  if (fx) {
    fx.unbypass();
    fx.closeUi();
    await delay(300);
  }
});

describe('TrackFx (track 1, FX slot 1)', () => {
  it('should have a non-default FX name after sync', async () => {
    const fx = reaper.tracks[0].fx[0];

    // After the sync burst, the FX name should have been populated by Reaper
    // with the actual plugin name (not the constructor default "Fx 1")
    await waitForProperty(fx, 'name', () => fx.name, name => name !== 'Fx 1' && name.length > 0);

    expect(fx.name).not.toBe('Fx 1');
    expect(fx.name.length).toBeGreaterThan(0);
  });

  it('should bypass the FX and receive confirmation', async () => {
    const fx = reaper.tracks[0].fx[0];

    fx.bypass();
    await waitForValue(fx, 'isBypassed', () => fx.isBypassed, true);

    expect(fx.isBypassed).toBe(true);
  });

  it('should unbypass the FX and receive confirmation', async () => {
    const fx = reaper.tracks[0].fx[0];

    fx.bypass();
    await waitForValue(fx, 'isBypassed', () => fx.isBypassed, true);

    fx.unbypass();
    await waitForValue(fx, 'isBypassed', () => fx.isBypassed, false);

    expect(fx.isBypassed).toBe(false);
  });

  it('should open the FX UI and receive confirmation', async () => {
    const fx = reaper.tracks[0].fx[0];

    fx.openUi();
    await waitForValue(fx, 'isUiOpen', () => fx.isUiOpen, true);

    expect(fx.isUiOpen).toBe(true);

    // Clean up: close the UI
    fx.closeUi();
    await waitForValue(fx, 'isUiOpen', () => fx.isUiOpen, false);
  });

  it('should close the FX UI and receive confirmation', async () => {
    const fx = reaper.tracks[0].fx[0];

    fx.openUi();
    await waitForValue(fx, 'isUiOpen', () => fx.isUiOpen, true);

    fx.closeUi();
    await waitForValue(fx, 'isUiOpen', () => fx.isUiOpen, false);

    expect(fx.isUiOpen).toBe(false);
  });

  // Note: Reaper does not send /track/N/fx/M/preset feedback after preset changes on
  // track-level FX — only the selected track FX (/fx/preset) gets preset name updates.
  // Preset navigation on TrackFx is therefore send-only; preset name tests live in the
  // SelectedTrackFxSlot suite below where feedback is available.
});

describe('SelectedTrackFxSlot (selected track, FX slot 1)', () => {
  it('should have a non-default FX name after selecting track 1', async () => {
    const fx = reaper.selectedTrack.fx[0];

    await waitForProperty(fx, 'name', () => fx.name, name => name !== 'Fx 1' && name.length > 0);

    expect(fx.name).not.toBe('Fx 1');
    expect(fx.name.length).toBeGreaterThan(0);
  });

  it('should bypass the selected track FX and receive confirmation', async () => {
    const fx = reaper.selectedTrack.fx[0];

    fx.bypass();
    await waitForValue(fx, 'isBypassed', () => fx.isBypassed, true);

    expect(fx.isBypassed).toBe(true);

    // Clean up
    fx.unbypass();
    await delay(300);
  });

  it('should unbypass the selected track FX and receive confirmation', async () => {
    const fx = reaper.selectedTrack.fx[0];

    fx.bypass();
    await waitForValue(fx, 'isBypassed', () => fx.isBypassed, true);

    fx.unbypass();
    await waitForValue(fx, 'isBypassed', () => fx.isBypassed, false);

    expect(fx.isBypassed).toBe(false);
  });

  // Note: After nextPreset()/previousPreset() on SelectedTrackFxSlot, Reaper sends
  // /fx/preset (no slot number) in response — this updates DeviceSelectedFx (selectedFx),
  // NOT SelectedTrackFxSlot (fx[0]). So we select FX slot 1 on the device first and then
  // watch selectedFx for the preset change.
  it('should navigate to next preset and update preset name', async () => {
    reaper.device.selectFx(1);
    await delay(300);
    const selectedFx = reaper.selectedTrack.selectedFx;
    const initialPreset = selectedFx.preset;

    reaper.selectedTrack.fx[0].nextPreset();
    await waitForProperty(selectedFx, 'preset', () => selectedFx.preset, p => p !== initialPreset && p.length > 0);

    expect(selectedFx.preset).not.toBe(initialPreset);

    // Navigate back to restore state
    reaper.selectedTrack.fx[0].previousPreset();
    await waitForProperty(selectedFx, 'preset', () => selectedFx.preset, p => p === initialPreset);
  });

  it('should navigate to previous preset', async () => {
    reaper.device.selectFx(1);
    await delay(300);
    const selectedFx = reaper.selectedTrack.selectedFx;
    const initialPreset = selectedFx.preset;

    // Move forward first so there is somewhere to go back to
    reaper.selectedTrack.fx[0].nextPreset();
    await waitForProperty(selectedFx, 'preset', () => selectedFx.preset, p => p !== initialPreset && p.length > 0);
    const afterNext = selectedFx.preset;

    reaper.selectedTrack.fx[0].previousPreset();
    await waitForProperty(selectedFx, 'preset', () => selectedFx.preset, p => p !== afterNext && p.length > 0);

    expect(selectedFx.preset).not.toBe(afterNext);
  });

  it('should open and close the selected track FX UI', async () => {
    const fx = reaper.selectedTrack.fx[0];

    fx.openUi();
    await waitForValue(fx, 'isUiOpen', () => fx.isUiOpen, true);
    expect(fx.isUiOpen).toBe(true);

    fx.closeUi();
    await waitForValue(fx, 'isUiOpen', () => fx.isUiOpen, false);
    expect(fx.isUiOpen).toBe(false);
  });
});

describe('DeviceSelectedFx (device-focused FX)', () => {
  beforeEach(async () => {
    // Select FX 1 on the device so selectedFx points to it
    reaper.device.selectFx(1);
    await delay(300);
  });

  it('should have a name after selecting an FX slot', async () => {
    const fx = reaper.selectedTrack.selectedFx;

    await waitForProperty(fx, 'name', () => fx.name, name => name !== 'Selected FX' && name.length > 0);

    expect(fx.name).not.toBe('Selected FX');
    expect(fx.name.length).toBeGreaterThan(0);
  });

  it('should bypass the device-selected FX and receive confirmation', async () => {
    const fx = reaper.selectedTrack.selectedFx;

    fx.bypass();
    await waitForValue(fx, 'isBypassed', () => fx.isBypassed, true);

    expect(fx.isBypassed).toBe(true);

    fx.unbypass();
    await delay(300);
  });

  it('should unbypass the device-selected FX and receive confirmation', async () => {
    const fx = reaper.selectedTrack.selectedFx;

    fx.bypass();
    await waitForValue(fx, 'isBypassed', () => fx.isBypassed, true);

    fx.unbypass();
    await waitForValue(fx, 'isBypassed', () => fx.isBypassed, false);

    expect(fx.isBypassed).toBe(false);
  });

  it('should open and close the device-selected FX UI', async () => {
    const fx = reaper.selectedTrack.selectedFx;

    fx.openUi();
    await waitForValue(fx, 'isUiOpen', () => fx.isUiOpen, true);
    expect(fx.isUiOpen).toBe(true);

    fx.closeUi();
    await waitForValue(fx, 'isUiOpen', () => fx.isUiOpen, false);
    expect(fx.isUiOpen).toBe(false);
  });
});

describe('Device FX navigation', () => {
  it('should update selectedFx name after selectFx', async () => {
    reaper.device.selectFx(1);
    await waitForProperty(
      reaper.selectedTrack.selectedFx, 'name',
      () => reaper.selectedTrack.selectedFx.name,
      name => name !== 'Selected FX' && name.length > 0,
    );

    expect(reaper.selectedTrack.selectedFx.name.length).toBeGreaterThan(0);
  });

  it('should change device-selected FX after nextFx', async () => {
    reaper.device.selectFx(1);
    await delay(300);
    const initialName = reaper.selectedTrack.selectedFx.name;

    reaper.device.nextFx();
    await waitForProperty(
      reaper.selectedTrack.selectedFx, 'name',
      () => reaper.selectedTrack.selectedFx.name,
      name => name !== initialName,
    );

    expect(reaper.selectedTrack.selectedFx.name).not.toBe(initialName);

    // Return to FX 1
    reaper.device.selectFx(1);
    await delay(300);
  });

  it('should change device-selected FX after previousFx', async () => {
    // Start on FX 2 so previousFx has somewhere to go
    reaper.device.selectFx(2);
    await delay(300);
    const fx2Name = reaper.selectedTrack.selectedFx.name;

    reaper.device.previousFx();
    await waitForProperty(
      reaper.selectedTrack.selectedFx, 'name',
      () => reaper.selectedTrack.selectedFx.name,
      name => name !== fx2Name,
    );

    expect(reaper.selectedTrack.selectedFx.name).not.toBe(fx2Name);
  });

  // No observable feedback property for parameter banks — verify command sends without error
  it('should navigate FX parameter banks without error', () => {
    expect(() => reaper.device.selectFxParameterBank(1)).not.toThrow();
    expect(() => reaper.device.nextFxParameterBank()).not.toThrow();
    expect(() => reaper.device.previousFxParameterBank()).not.toThrow();
  });
});
