/**
 * Integration tests for ViewPort controls (scroll and zoom).
 *
 * Prerequisites:
 *  - Reaper must be running with an OSC control surface configured (see README)
 *  - The arrange view should have at least a few tracks and some content so that
 *    scrolling/zooming produces a visible change.
 *
 * Note: Reaper sends no feedback for scroll or zoom commands. These tests verify
 * that each method can be called without error and that no unexpected messages
 * are received in response. Verify visual changes in Reaper while the tests run.
 */

import {Reaper} from '../../dist/Reaper';
import {OscMessage} from '../../dist/Messages';
import {createReaper, waitForReady, delay} from './setup';

let reaper: Reaper;
const unexpectedScrollZoom: string[] = [];

beforeAll(async () => {
  reaper = createReaper();

  // Capture any scroll/zoom echoes from Reaper (expected: none)
  (reaper as any)._afterMessageReceived = (message: OscMessage) => {
    if (message.address.startsWith('/scroll') || message.address.startsWith('/zoom')) {
      unexpectedScrollZoom.push(message.address);
    }
  };

  await waitForReady(reaper);
});

afterAll(async () => {
  await reaper.stop();
});

describe('ViewPort scroll (boolean)', () => {
  it('should send startScrollLeft/stopScrollLeft without error', async () => {
    reaper.viewport.startScrollLeft();
    await delay(300);
    reaper.viewport.stopScrollLeft();
    await delay(100);
  });

  it('should send startScrollRight/stopScrollRight without error', async () => {
    reaper.viewport.startScrollRight();
    await delay(300);
    reaper.viewport.stopScrollRight();
    await delay(100);
  });

  it('should send startScrollUp/stopScrollUp without error', async () => {
    reaper.viewport.startScrollUp();
    await delay(300);
    reaper.viewport.stopScrollUp();
    await delay(100);
  });

  it('should send startScrollDown/stopScrollDown without error', async () => {
    reaper.viewport.startScrollDown();
    await delay(300);
    reaper.viewport.stopScrollDown();
    await delay(100);
  });
});

describe('ViewPort zoom (boolean)', () => {
  it('should send startZoomInX/stopZoomInX without error', async () => {
    reaper.viewport.startZoomInX();
    await delay(300);
    reaper.viewport.stopZoomInX();
    await delay(100);
    // Restore
    reaper.viewport.startZoomOutX();
    await delay(300);
    reaper.viewport.stopZoomOutX();
    await delay(100);
  });

  it('should send startZoomOutX/stopZoomOutX without error', async () => {
    reaper.viewport.startZoomOutX();
    await delay(300);
    reaper.viewport.stopZoomOutX();
    await delay(100);
    // Restore
    reaper.viewport.startZoomInX();
    await delay(300);
    reaper.viewport.stopZoomInX();
    await delay(100);
  });

  it('should send startZoomInY/stopZoomInY without error', async () => {
    reaper.viewport.startZoomInY();
    await delay(300);
    reaper.viewport.stopZoomInY();
    await delay(100);
    // Restore
    reaper.viewport.startZoomOutY();
    await delay(300);
    reaper.viewport.stopZoomOutY();
    await delay(100);
  });

  it('should send startZoomOutY/stopZoomOutY without error', async () => {
    reaper.viewport.startZoomOutY();
    await delay(300);
    reaper.viewport.stopZoomOutY();
    await delay(100);
    // Restore
    reaper.viewport.startZoomInY();
    await delay(300);
    reaper.viewport.stopZoomInY();
    await delay(100);
  });
});

describe('ViewPort scroll (rotary)', () => {
  it('should scrollX right (positive) without error', async () => {
    reaper.viewport.scrollX(3);
    await delay(100);
  });

  it('should scrollX left (negative) without error', async () => {
    reaper.viewport.scrollX(-3);
    await delay(100);
  });

  it('should scrollY down (positive) without error', async () => {
    reaper.viewport.scrollY(3);
    await delay(100);
  });

  it('should scrollY up (negative) without error', async () => {
    reaper.viewport.scrollY(-3);
    await delay(100);
  });
});

describe('ViewPort zoom (rotary)', () => {
  it('should zoomX in (positive) without error', async () => {
    reaper.viewport.zoomX(2);
    await delay(100);
    // Restore
    reaper.viewport.zoomX(-2);
    await delay(100);
  });

  it('should zoomX out (negative) without error', async () => {
    reaper.viewport.zoomX(-2);
    await delay(100);
    // Restore
    reaper.viewport.zoomX(2);
    await delay(100);
  });

  it('should zoomY in (positive) without error', async () => {
    reaper.viewport.zoomY(2);
    await delay(100);
    // Restore
    reaper.viewport.zoomY(-2);
    await delay(100);
  });

  it('should zoomY out (negative) without error', async () => {
    reaper.viewport.zoomY(-2);
    await delay(100);
    // Restore
    reaper.viewport.zoomY(2);
    await delay(100);
  });
});

describe('no unexpected feedback', () => {
  it('Reaper should not echo scroll or zoom messages', () => {
    expect(unexpectedScrollZoom).toHaveLength(0);
  });
});
