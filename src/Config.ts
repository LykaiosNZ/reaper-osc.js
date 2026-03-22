/**
 * Configuration types shared across the library
 * @module
 */
import {OscMessage} from './Messages';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Logger = (level: LogLevel, message: string, ...optionalParams: any[]) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ConsoleLogger(level: LogLevel, message: string, ...optionalParams: any[]): void {
  switch (level) {
    case 'debug': {
      console.debug(message, optionalParams);
      break;
    }
    case 'info': {
      console.log(message, optionalParams);
      break;
    }
    case 'warn': {
      console.warn(message, optionalParams);
      break;
    }
    case 'error': {
      console.error(message, optionalParams);
      break;
    }
  }
}

export class ReaperConfiguration {
  afterMessageReceived: ((message: OscMessage, handled: boolean) => void) | null = null;
  /** The address to listen for Reaper OSC messages on */
  localAddress = '127.0.0.1';
  /** The port to listen for Reaper OSC messages on */
  localPort = 9000;
  /** Function for logging messages. Defaults to logging to console */
  log: Logger = ConsoleLogger;
  /** Number of FX per track */
  numberOfFx = 8;
  /** Number of sends per track */
  numberOfSends = 4;
  /** Number of receives per track */
  numberOfReceives = 4;
  /** Number of tracks per bank */
  numberOfTracks = 8;
  /** The address to send Reaper OSC messages to */
  remoteAddress = '127.0.0.1';
  /** The port to send Reaper OSC messages to */
  remotePort = 8000;
}
