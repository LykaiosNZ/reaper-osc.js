/**
 * Integration tests for Marker and Region support.
 *
 * Prerequisites:
 *  - Reaper must be running with an OSC control surface configured (see README)
 *  - At least 2 markers and 1 region in the Reaper project
 *  - DEVICE_MARKER_COUNT 8 and DEVICE_REGION_COUNT 8 must be set in the
 *    Reaper OSC pattern file AND the control surface must have been reloaded
 *    (Options → Preferences → Control/OSC/web → Edit → OK or restart Reaper)
 */

import {Reaper} from '../../dist/Reaper';
import {createReaper, waitForReady, waitForSync, waitForProperty, delay} from './setup';

let reaper: Reaper;
let markerDataAvailable = false;
let regionDataAvailable = false;

beforeAll(async () => {
  reaper = createReaper();
  await waitForReady(reaper);
  await waitForSync(reaper);

  // Determine whether Reaper is sending marker/region data.
  // Requires DEVICE_MARKER_COUNT 8 / DEVICE_REGION_COUNT 8 in the pattern file
  // AND the control surface to have been reloaded after the file was updated.
  await Promise.all([
    waitForProperty(reaper.markers[0], 'name', () => reaper.markers[0].name, n => n.length > 0, 2000)
      .then(() => { markerDataAvailable = true; })
      .catch(() => {}),
    waitForProperty(reaper.regions[0], 'name', () => reaper.regions[0].name, n => n.length > 0, 2000)
      .then(() => { regionDataAvailable = true; })
      .catch(() => {}),
  ]);

  if (!markerDataAvailable) {
    console.warn(
      'No marker data received from Reaper. Marker tests will be skipped.\n' +
      '  → Ensure DEVICE_MARKER_COUNT 8 is set in the OSC pattern file\n' +
      '    and reload the control surface in Reaper.',
    );
  }
  if (!regionDataAvailable) {
    console.warn(
      'No region data received from Reaper. Region tests will be skipped.\n' +
      '  → Ensure DEVICE_REGION_COUNT 8 is set in the OSC pattern file\n' +
      '    and reload the control surface in Reaper.',
    );
  }
}, 30000);

afterAll(async () => {
  await reaper.stop();
});

// ─── Sync burst ──────────────────────────────────────────────────────────────

describe('Sync burst — markers', () => {
  it('should populate markers[0].name from sync burst', () => {
    if (!markerDataAvailable) { return; }
    expect(reaper.markers[0].name.length).toBeGreaterThan(0);
  });

  it('should populate markers[0].number from sync burst', () => {
    if (!markerDataAvailable) { return; }
    expect(reaper.markers[0].number.length).toBeGreaterThan(0);
  });

  it('should populate markers[0].time from sync burst', () => {
    if (!markerDataAvailable) { return; }
    expect(Number.isFinite(reaper.markers[0].time)).toBe(true);
  });
});

describe('Sync burst — regions', () => {
  it('should populate regions[0].name from sync burst', () => {
    if (!regionDataAvailable) { return; }
    expect(reaper.regions[0].name.length).toBeGreaterThan(0);
  });

  it('should populate regions[0].number from sync burst', () => {
    if (!regionDataAvailable) { return; }
    expect(reaper.regions[0].number.length).toBeGreaterThan(0);
  });

  it('should populate regions[0].time from sync burst', () => {
    if (!regionDataAvailable) { return; }
    expect(Number.isFinite(reaper.regions[0].time)).toBe(true);
  });

  it('should populate regions[0].length from sync burst', () => {
    if (!regionDataAvailable) { return; }
    expect(reaper.regions[0].length).toBeGreaterThan(0);
  });
});

// ─── Transport toggles ───────────────────────────────────────────────────────

describe('transport.isRewindByMarker', () => {
  it('should be populated after sync burst', () => {
    expect(typeof reaper.transport.isRewindByMarker).toBe('boolean');
  });

  it('should toggle with toggleRewindByMarker()', async () => {
    const before = reaper.transport.isRewindByMarker;
    reaper.transport.toggleRewindByMarker();
    await waitForProperty(
      reaper.transport, 'isRewindByMarker',
      () => reaper.transport.isRewindByMarker,
      v => v !== before,
    );
    expect(reaper.transport.isRewindByMarker).toBe(!before);
    // Restore
    reaper.transport.toggleRewindByMarker();
    await delay(300);
  });
});

describe('transport.isSetLoop', () => {
  it('should be populated after sync burst', () => {
    expect(typeof reaper.transport.isSetLoop).toBe('boolean');
  });

  it('should toggle with toggleSetLoop()', async () => {
    const before = reaper.transport.isSetLoop;
    reaper.transport.toggleSetLoop();
    await waitForProperty(
      reaper.transport, 'isSetLoop',
      () => reaper.transport.isSetLoop,
      v => v !== before,
    );
    expect(reaper.transport.isSetLoop).toBe(!before);
    // Restore
    reaper.transport.toggleSetLoop();
    await delay(300);
  });
});

// ─── Navigation ──────────────────────────────────────────────────────────────

describe('transport.gotoMarker', () => {
  it('should move transport time to the marker', async () => {
    if (!markerDataAvailable || !reaper.markers[0].number) { return; }
    const markerNumber = parseInt(reaper.markers[0].number);
    const markerTime = reaper.markers[0].time;
    reaper.transport.gotoMarker(markerNumber);
    await waitForProperty(
      reaper.transport, 'time',
      () => reaper.transport.time,
      t => Math.abs(t - markerTime) < 0.5,
    );
    expect(reaper.transport.time).toBeCloseTo(markerTime, 0);
  });
});

describe('transport.gotoRegion', () => {
  it('should move transport time to the region start', async () => {
    if (!regionDataAvailable || !reaper.regions[0].number) { return; }
    const regionNumber = parseInt(reaper.regions[0].number);
    const regionTime = reaper.regions[0].time;
    reaper.transport.gotoRegion(regionNumber);
    await waitForProperty(
      reaper.transport, 'time',
      () => reaper.transport.time,
      t => Math.abs(t - regionTime) < 0.5,
    );
    expect(reaper.transport.time).toBeCloseTo(regionTime, 0);
  });
});

// ─── lastMarker / lastRegion ──────────────────────────────────────────────────

describe('transport.lastMarker', () => {
  it('should be defined with correct property types', () => {
    expect(reaper.transport.lastMarker).toBeDefined();
    expect(typeof reaper.transport.lastMarker.name).toBe('string');
    expect(typeof reaper.transport.lastMarker.number).toBe('string');
    expect(Number.isFinite(reaper.transport.lastMarker.time)).toBe(true);
  });
});

describe('transport.lastRegion', () => {
  it('should be defined with correct property types', () => {
    expect(reaper.transport.lastRegion).toBeDefined();
    expect(typeof reaper.transport.lastRegion.name).toBe('string');
    expect(typeof reaper.transport.lastRegion.number).toBe('string');
    expect(Number.isFinite(reaper.transport.lastRegion.time)).toBe(true);
    expect(Number.isFinite(reaper.transport.lastRegion.length)).toBe(true);
  });
});

// ─── Write-by-ID ─────────────────────────────────────────────────────────────

describe('markers[0].rename', () => {
  it('should update the marker name', async () => {
    if (!markerDataAvailable || !reaper.markers[0].number) { return; }
    const originalName = reaper.markers[0].name;
    const newName = `TestRename_${Date.now()}`;
    reaper.markers[0].rename(newName);

    // Request a sync to get the updated name back
    await delay(300);
    reaper.refreshControlSurfaces();
    await waitForProperty(
      reaper.markers[0], 'name',
      () => reaper.markers[0].name,
      n => n === newName,
    );
    expect(reaper.markers[0].name).toBe(newName);

    // Restore
    reaper.markers[0].rename(originalName);
    await delay(500);
  });
});
