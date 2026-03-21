import {OscMessage} from './Messages';
import {Track} from './Tracks';
import {Transport} from './Transport';
import {Fx, TrackFx} from './Fx';
import {SelectedTrack} from './SelectedTrack';

/** An OSC message handler */
export interface IMessageHandler {
  /**
   *  Handle an OSC message
   * @param message The message to handle
   */
  handle(message: OscMessage): boolean;
}

/**
 * Routes messages to the appropriate track
 * @param trackSelector A function that can be used to get a track
 * */
export class TrackMessageHandler implements IMessageHandler {
  constructor(private readonly trackSelector: (trackNumber: number) => Track | null) {}

  public handle(message: OscMessage): boolean {
    if (message.addressParts[0] === 'track') {
      const trackNumber = parseInt(message.addressParts[1]);

      if (isNaN(trackNumber)) {
        return false;
      }

      const track = this.trackSelector(trackNumber);

      if (track !== null) {
        return track.receive(message);
      }
    }

    return false;
  }
}

/** Routes messages to the transport */
export class TransportMessageHandler implements IMessageHandler {
  constructor(private readonly transport: Transport) {}

  public handle(message: OscMessage): boolean {
    return this.transport.receive(message);
  }
}

/** Routes messages to the appropriate track fx */
export class TrackFxMessageHandler implements IMessageHandler {
  constructor(private readonly fxSelector: (fxNumber: number) => TrackFx | null) {}

  public handle(message: OscMessage): boolean {
    if (message.addressParts[0] === 'track' && message.addressParts[2] === 'fx') {
      const fxNumber = parseInt(message.addressParts[3]);

      if (isNaN(fxNumber)) {
        throw new Error('Expected an integer');
      }

      const fx = this.fxSelector(fxNumber);

      if (fx !== null) {
        return fx.receive(message);
      }
    }

    return false;
  }
}

/**
 * Handles an OSC message containing a single boolean value (0 or 1)
 * @param address The address of the message to handle
 * @param callback The callback to be called when a message with the specified OSC address is received
 */
export class BooleanMessageHandler implements IMessageHandler {
  private readonly _callback: (value: boolean) => void;

  constructor(public readonly address: string, callback: (value: boolean) => void) {
    this._callback = callback;
  }

  public handle(message: OscMessage): boolean {
    if (message.address === this.address) {
      const booleanValue = message.args[0]?.value === 1 ? true : false;

      this._callback(booleanValue);

      return true;
    }

    return false;
  }
}

export class IntegerMessageHandler implements IMessageHandler {
  private readonly _callback: (value: number) => void;

  constructor(public readonly address: string, callback: (value: number) => void) {
    this._callback = callback;
  }

  public handle(message: OscMessage): boolean {
    if (message.address === this.address) {
      const messageValue = message.args[0].value;

      let intValue: number;

      switch (typeof messageValue) {
        case 'number':
          intValue = messageValue;
          break;
        case 'string':
          intValue = parseInt(messageValue);

          if (isNaN(intValue)) {
            throw new Error('Expected an integer');
          }
          break;
        default:
          throw new Error('Expected an integer');
      }

      this._callback(intValue);

      return true;
    }

    return false;
  }
}

export class StringMessageHandler implements IMessageHandler {
  private readonly _callback: (value: string) => void;

  constructor(public readonly address: string, callback: (value: string) => void) {
    this.address = address;
    this._callback = callback;
  }

  public handle(message: OscMessage): boolean {
    if (message.address === this.address) {
      const messageValue = message.args[0].value;

      if (typeof messageValue !== 'string') {
        throw new Error('Expected a string');
      }

      this._callback(messageValue);

      return true;
    }

    return false;
  }
}

/**
 * Routes `/track/` (no index) messages to the device's selected track
 */
export class SelectedTrackMessageHandler implements IMessageHandler {
  constructor(private readonly selectedTrack: SelectedTrack) {}

  public handle(message: OscMessage): boolean {
    if (message.addressParts[0] === 'track' && isNaN(parseInt(message.addressParts[1]))) {
      return this.selectedTrack.receive(message);
    }

    return false;
  }
}

/**
 * Routes `/fx/` messages to an FX on the device's selected track.
 * Messages with an index (e.g. `/fx/2/name`) are routed to the indexed FX bank slot.
 * Messages without an index (e.g. `/fx/name`) are routed to the device's selected FX.
 */
export class SelectedTrackFxMessageHandler implements IMessageHandler {
  constructor(private readonly fxSelector: (fxNumber: number | null) => Fx | null) {}

  public handle(message: OscMessage): boolean {
    if (message.addressParts[0] === 'fx') {
      const fxNumber = parseInt(message.addressParts[1]);
      const fx = this.fxSelector(isNaN(fxNumber) ? null : fxNumber);

      if (fx !== null) {
        return fx.receive(message);
      }
    }

    return false;
  }
}

export class FloatMessageHandler implements IMessageHandler {
  private readonly _callback: (value: number) => void;

  constructor(public readonly address: string, callback: (value: number) => void) {
    this.address = address;
    this._callback = callback;
  }

  public handle(message: OscMessage): boolean {
    if (message.address === this.address) {
      const messageValue = message.args[0].value;

      let floatValue: number;

      switch (typeof messageValue) {
        case 'number':
          floatValue = messageValue;
          break;
        case 'string':
          floatValue = parseFloat(messageValue);

          if (isNaN(floatValue)) {
            throw new Error('Expected an integer');
          }
          break;
        default:
          throw new Error('Expected an integer');
      }

      this._callback(floatValue);

      return true;
    }

    return false;
  }
}
