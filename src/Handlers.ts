import {OscMessage} from './Messages';
import {Track} from './Tracks';
import {Transport} from './Transport';
import {TrackFx} from './Fx';

export interface IMessageHandler {
  handle(message: OscMessage): void;
}

/** Routes messages to the appropriate track */
export class TrackMessageHandler implements IMessageHandler {
  constructor(private readonly trackSelector: (trackNumber: number) => Track | null) {}

  public handle(message: OscMessage): void {
    if (message.addressParts[1] === 'track') {
      const trackNumber = parseInt(message.addressParts[2]);

      // If NaN, probably means that it's a message for the selected track - ignore
      if (isNaN(trackNumber)) {
        return;
      }

      const track = this.trackSelector(trackNumber);

      if (track !== null) {
        track.receive(message);
      }
    }
  }
}

/** Routes messages to the transport */
export class TransportMessageHandler implements IMessageHandler {
  constructor(private readonly transport: Transport) {}

  public handle(message: OscMessage): void {
    this.transport.receive(message);
  }
}

/** Routes messages to the appropriate track fx */
export class TrackFxMessageHandler implements IMessageHandler {
  constructor(private readonly fxSelector: (fxNumber: number) => TrackFx) {}

  public handle(message: OscMessage): void {
    if (message.addressParts[1] === 'track' && message.addressParts[3] === 'fx') {
      const fxNumber = parseInt(message.addressParts[4]);

      if (isNaN(fxNumber)) {
        throw new Error('Expected an integer');
      }

      const fx = this.fxSelector(fxNumber);

      if (fx !== null) {
        fx.receive(message);
      }
    }
  }
}

export class BooleanMessageHandler implements IMessageHandler {
  private readonly _callback: (value: boolean) => void;

  constructor(public readonly address: string, callback: (value: boolean) => void) {
    this._callback = callback;
  }

  public handle(message: OscMessage): void {
    if (message.address === this.address) {
      const booleanValue = message.args[0]?.value === 1 ? true : false;

      this._callback(booleanValue);
    }
  }
}

export class IntegerMessageHandler implements IMessageHandler {
  private readonly _callback: (value: number) => void;

  constructor(public readonly address: string, callback: (value: number) => void) {
    this._callback = callback;
  }

  public handle(message: OscMessage): void {
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
    }
  }
}

export class StringMessageHandler implements IMessageHandler {
  private readonly _callback: (value: string) => void;

  constructor(public readonly address: string, callback: (value: string) => void) {
    this.address = address;
    this._callback = callback;
  }

  public handle(message: OscMessage): void {
    if (message.address === this.address) {
      const messageValue = message.args[0].value;

      if (typeof messageValue !== 'string') {
        throw new Error('Expected a string');
      }

      this._callback(messageValue);
    }
  }
}
