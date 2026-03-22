/**
 * Contains classes for controlling Reaper's arrange-view scroll and zoom
 * @module
 */
import {SetScrollLeft, SetScrollRight, SetScrollUp, SetScrollDown, SetZoomInX, SetZoomOutX, SetZoomInY, SetZoomOutY, ScrollX, ScrollY, ZoomX, ZoomY, ReaperOscCommand} from './Client/Commands';

type SendCommand = (command: ReaperOscCommand) => void;

/**
 * Controls the Reaper arrange-view scroll position and zoom level.
 *
 * Two styles of command are available for each axis:
 * - **Boolean (held)**: `startScrollLeft()` / `stopScrollLeft()`, `startZoomInX()` / `stopZoomInX()`
 *   etc. — models a held button. Scrolling/zooming continues while active and stops when
 *   released, matching the behaviour of hardware controller buttons. Mirrors how
 *   {@link Transport.startRewinding} works.
 * - **Rotary**: `scrollX(value)` / `zoomX(value)` etc. — sends a single relative step to
 *   a rotary encoder address. Positive values move right/down/zoom-in; negative values move
 *   left/up/zoom-out. Larger magnitudes scroll/zoom further per message.
 *
 * Reaper does not send feedback for any scroll or zoom command, so these are fire-and-forget.
 */
export class ViewPort {
  constructor(private readonly _send: SendCommand) {}

  // ─── Scroll: boolean (held) ───────────────────────────────────────────────

  /** Start scrolling the arrange view left */
  public startScrollLeft(): void { this._send(SetScrollLeft(true)); }

  /** Stop scrolling the arrange view left */
  public stopScrollLeft(): void { this._send(SetScrollLeft(false)); }

  /** Start scrolling the arrange view right */
  public startScrollRight(): void { this._send(SetScrollRight(true)); }

  /** Stop scrolling the arrange view right */
  public stopScrollRight(): void { this._send(SetScrollRight(false)); }

  /** Start scrolling the arrange view up */
  public startScrollUp(): void { this._send(SetScrollUp(true)); }

  /** Stop scrolling the arrange view up */
  public stopScrollUp(): void { this._send(SetScrollUp(false)); }

  /** Start scrolling the arrange view down */
  public startScrollDown(): void { this._send(SetScrollDown(true)); }

  /** Stop scrolling the arrange view down */
  public stopScrollDown(): void { this._send(SetScrollDown(false)); }

  // ─── Zoom: boolean (held) ─────────────────────────────────────────────────

  /** Start zooming in horizontally (X axis) */
  public startZoomInX(): void { this._send(SetZoomInX(true)); }

  /** Stop zooming in horizontally (X axis) */
  public stopZoomInX(): void { this._send(SetZoomInX(false)); }

  /** Start zooming out horizontally (X axis) */
  public startZoomOutX(): void { this._send(SetZoomOutX(true)); }

  /** Stop zooming out horizontally (X axis) */
  public stopZoomOutX(): void { this._send(SetZoomOutX(false)); }

  /** Start zooming in vertically (Y axis) */
  public startZoomInY(): void { this._send(SetZoomInY(true)); }

  /** Stop zooming in vertically (Y axis) */
  public stopZoomInY(): void { this._send(SetZoomInY(false)); }

  /** Start zooming out vertically (Y axis) */
  public startZoomOutY(): void { this._send(SetZoomOutY(true)); }

  /** Stop zooming out vertically (Y axis) */
  public stopZoomOutY(): void { this._send(SetZoomOutY(false)); }

  // ─── Scroll/Zoom: rotary ──────────────────────────────────────────────────

  /**
   * Scroll the arrange view horizontally by a relative amount.
   * Positive values scroll right; negative values scroll left.
   * Larger magnitudes scroll further per message.
   * @param value Relative scroll amount
   */
  public scrollX(value: number): void { this._send(ScrollX(value)); }

  /**
   * Scroll the arrange view vertically by a relative amount.
   * Positive values scroll down; negative values scroll up.
   * Larger magnitudes scroll further per message.
   * @param value Relative scroll amount
   */
  public scrollY(value: number): void { this._send(ScrollY(value)); }

  /**
   * Adjust horizontal zoom by a relative amount.
   * Positive values zoom in; negative values zoom out.
   * Larger magnitudes zoom further per message.
   * @param value Relative zoom amount
   */
  public zoomX(value: number): void { this._send(ZoomX(value)); }

  /**
   * Adjust vertical zoom by a relative amount.
   * Positive values zoom in (expand track height); negative values zoom out.
   * Larger magnitudes zoom further per message.
   * @param value Relative zoom amount
   */
  public zoomY(value: number): void { this._send(ZoomY(value)); }
}
