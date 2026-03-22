import {
  SetScrollLeft, SetScrollRight, SetScrollUp, SetScrollDown,
  SetZoomInX, SetZoomOutX, SetZoomInY, SetZoomOutY,
  ScrollX, ScrollY, ZoomX, ZoomY,
  ReaperOscCommand,
} from '../dist/Client/Commands';
import {ViewPort} from '../dist/ViewPort';

function makeViewPort(): { viewport: ViewPort; sent: ReaperOscCommand[] } {
  const sent: ReaperOscCommand[] = [];
  const viewport = new ViewPort(command => sent.push(command));
  return {viewport, sent};
}

describe('scroll (boolean)', () => {
  test('startScrollLeft sends SetScrollLeft(true)', () => {
    const {viewport, sent} = makeViewPort();
    viewport.startScrollLeft();
    expect(sent[0]).toMatchObject(SetScrollLeft(true));
  });

  test('stopScrollLeft sends SetScrollLeft(false)', () => {
    const {viewport, sent} = makeViewPort();
    viewport.stopScrollLeft();
    expect(sent[0]).toMatchObject(SetScrollLeft(false));
  });

  test('startScrollRight sends SetScrollRight(true)', () => {
    const {viewport, sent} = makeViewPort();
    viewport.startScrollRight();
    expect(sent[0]).toMatchObject(SetScrollRight(true));
  });

  test('stopScrollRight sends SetScrollRight(false)', () => {
    const {viewport, sent} = makeViewPort();
    viewport.stopScrollRight();
    expect(sent[0]).toMatchObject(SetScrollRight(false));
  });

  test('startScrollUp sends SetScrollUp(true)', () => {
    const {viewport, sent} = makeViewPort();
    viewport.startScrollUp();
    expect(sent[0]).toMatchObject(SetScrollUp(true));
  });

  test('stopScrollUp sends SetScrollUp(false)', () => {
    const {viewport, sent} = makeViewPort();
    viewport.stopScrollUp();
    expect(sent[0]).toMatchObject(SetScrollUp(false));
  });

  test('startScrollDown sends SetScrollDown(true)', () => {
    const {viewport, sent} = makeViewPort();
    viewport.startScrollDown();
    expect(sent[0]).toMatchObject(SetScrollDown(true));
  });

  test('stopScrollDown sends SetScrollDown(false)', () => {
    const {viewport, sent} = makeViewPort();
    viewport.stopScrollDown();
    expect(sent[0]).toMatchObject(SetScrollDown(false));
  });
});

describe('zoom (boolean)', () => {
  test('startZoomInX sends SetZoomInX(true)', () => {
    const {viewport, sent} = makeViewPort();
    viewport.startZoomInX();
    expect(sent[0]).toMatchObject(SetZoomInX(true));
  });

  test('stopZoomInX sends SetZoomInX(false)', () => {
    const {viewport, sent} = makeViewPort();
    viewport.stopZoomInX();
    expect(sent[0]).toMatchObject(SetZoomInX(false));
  });

  test('startZoomOutX sends SetZoomOutX(true)', () => {
    const {viewport, sent} = makeViewPort();
    viewport.startZoomOutX();
    expect(sent[0]).toMatchObject(SetZoomOutX(true));
  });

  test('stopZoomOutX sends SetZoomOutX(false)', () => {
    const {viewport, sent} = makeViewPort();
    viewport.stopZoomOutX();
    expect(sent[0]).toMatchObject(SetZoomOutX(false));
  });

  test('startZoomInY sends SetZoomInY(true)', () => {
    const {viewport, sent} = makeViewPort();
    viewport.startZoomInY();
    expect(sent[0]).toMatchObject(SetZoomInY(true));
  });

  test('stopZoomInY sends SetZoomInY(false)', () => {
    const {viewport, sent} = makeViewPort();
    viewport.stopZoomInY();
    expect(sent[0]).toMatchObject(SetZoomInY(false));
  });

  test('startZoomOutY sends SetZoomOutY(true)', () => {
    const {viewport, sent} = makeViewPort();
    viewport.startZoomOutY();
    expect(sent[0]).toMatchObject(SetZoomOutY(true));
  });

  test('stopZoomOutY sends SetZoomOutY(false)', () => {
    const {viewport, sent} = makeViewPort();
    viewport.stopZoomOutY();
    expect(sent[0]).toMatchObject(SetZoomOutY(false));
  });
});

describe('scroll (rotary)', () => {
  test.each([-5, -1, 1, 5])('scrollX sends ScrollX(%p)', value => {
    const {viewport, sent} = makeViewPort();
    viewport.scrollX(value);
    expect(sent[0]).toMatchObject(ScrollX(value));
  });

  test.each([-5, -1, 1, 5])('scrollY sends ScrollY(%p)', value => {
    const {viewport, sent} = makeViewPort();
    viewport.scrollY(value);
    expect(sent[0]).toMatchObject(ScrollY(value));
  });
});

describe('zoom (rotary)', () => {
  test.each([-5, -1, 1, 5])('zoomX sends ZoomX(%p)', value => {
    const {viewport, sent} = makeViewPort();
    viewport.zoomX(value);
    expect(sent[0]).toMatchObject(ZoomX(value));
  });

  test.each([-5, -1, 1, 5])('zoomY sends ZoomY(%p)', value => {
    const {viewport, sent} = makeViewPort();
    viewport.zoomY(value);
    expect(sent[0]).toMatchObject(ZoomY(value));
  });
});
