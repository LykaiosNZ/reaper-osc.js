/**
 * Shared helpers for integration tests.
 *
 * Prerequisites:
 *  - Reaper must be running and reachable from this machine
 *  - An OSC control surface must be configured in Reaper (see __tests__/integration/README.md)
 *
 * Configuration (via environment variables):
 *  - REAPER_REMOTE_ADDRESS  IP address of the Reaper machine (default: 127.0.0.1)
 *  - REAPER_REMOTE_PORT     Port Reaper listens on for OSC commands (default: 8000)
 *  - REAPER_LOCAL_PORT      Port this client listens on for OSC feedback (default: 9000)
 */

import {Reaper, ReaperConfiguration} from '../../dist/Reaper';
import {INotifyPropertyChanged} from '../../dist/Notify';

/** Default timeout (ms) for waiting on property changes from Reaper */
const DEFAULT_PROPERTY_TIMEOUT = 5000;

/**
 * Create a Reaper instance configured for integration testing.
 * Connection parameters are read from environment variables with sensible defaults.
 */
export function createReaper(): Reaper {
  const config = new ReaperConfiguration();
  config.localAddress = '0.0.0.0';
  config.localPort = parseInt(process.env.REAPER_LOCAL_PORT ?? '9000', 10);
  config.remoteAddress = process.env.REAPER_REMOTE_ADDRESS ?? '127.0.0.1';
  config.remotePort = parseInt(process.env.REAPER_REMOTE_PORT ?? '8000', 10);
  return new Reaper(config);
}

/**
 * Start the Reaper instance and wait for the UDP socket to be bound.
 * Note: with UDP there is no connection handshake. Use waitForSync() after
 * this to request a state burst from Reaper.
 */
export async function waitForReady(reaper: Reaper): Promise<void> {
  await reaper.start();
  if (!reaper.isReady) {
    throw new Error('Reaper OSC client did not become ready after start()');
  }
}

/**
 * Trigger a control surface refresh (Reaper action 41743) and wait for Reaper
 * to send back the initial state burst. Resolves once track 1's name has been
 * populated, which indicates the burst has arrived.
 *
 * This must be called before any test that reads state from Reaper, because
 * with UDP there is no automatic sync — Reaper only sends a burst on startup
 * or when explicitly requested.
 */
export async function waitForSync(reaper: Reaper, timeout: number = DEFAULT_PROPERTY_TIMEOUT): Promise<void> {
  const track = reaper.tracks[0];
  reaper.refreshControlSurfaces();
  // Wait for track 1's name — this arrives early in the burst.
  await waitForProperty(track, 'name', () => track.name, name => name.length > 0 && name !== ('Track' + track.trackNumber), timeout);
  // The sync burst from Reaper is large (all tracks × all FX × all parameters).
  // Wait for the last track's name to arrive as a sentinel for burst completion,
  // so that subsequent commands don't race with late-arriving burst messages.
  const lastTrack = reaper.tracks[reaper.tracks.length - 1];
  await waitForProperty(lastTrack, 'name', () => lastTrack.name, name => name.length > 0, timeout);
}

/**
 * Wait for a property on an INotifyPropertyChanged object to satisfy a predicate.
 * Resolves with void once the predicate returns true.
 * Rejects if the timeout is exceeded.
 *
 * @param target The observable object
 * @param property The property name to watch
 * @param currentValue A function that returns the current value of the property
 * @param predicate A function that returns true when the desired state is reached
 * @param timeout Maximum time to wait (ms)
 */
export function waitForProperty<T>(
  target: INotifyPropertyChanged,
  property: string,
  currentValue: () => T,
  predicate: (value: T) => boolean,
  timeout: number = DEFAULT_PROPERTY_TIMEOUT,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // Check if already satisfied
    if (predicate(currentValue())) {
      resolve();
      return;
    }

    let unsubscribe: (() => void) | null = null;
    const timer = setTimeout(() => {
      if (unsubscribe) unsubscribe();
      reject(new Error(
        `Timed out waiting for "${property}" to satisfy predicate (current: ${JSON.stringify(currentValue())}, timeout: ${timeout}ms)`,
      ));
    }, timeout);

    unsubscribe = target.onPropertyChanged(property, () => {
      if (predicate(currentValue())) {
        clearTimeout(timer);
        if (unsubscribe) unsubscribe();
        resolve();
      }
    });
  });
}

/**
 * Wait for a property to reach a specific value.
 */
export function waitForValue<T>(
  target: INotifyPropertyChanged,
  property: string,
  currentValue: () => T,
  expected: T,
  timeout?: number,
): Promise<void> {
  return waitForProperty(target, property, currentValue, v => v === expected, timeout);
}

/**
 * Small delay to allow Reaper to process a command before we check state.
 * Use sparingly — prefer waitForProperty/waitForValue instead.
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
