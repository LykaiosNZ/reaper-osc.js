// @ts-check
'use strict';

import {OscMessage} from './messages.js';
import {Track, TrackFx} from './reaper.js';

/** Base class for handling {@link OscMessage}s */
class MessageHandler {
  /**
   * Handle an OSC message
   * @param {OscMessage} message
   * @abstract
   */
  handle(message) {
    throw new Error('not implemented');
  }
}

/**
 * A callback that can be used to obtain a track using its track number
 * @callback trackSelector
 * @param {number} trackNumber - The number of the track
 * @returns {?Track}
 */

/**
 * Routes messages for tracks to the appropriate track
 */
class TrackMessageHandler extends MessageHandler {
  /**
   * @param {trackSelector} trackSelector
   */
  constructor(trackSelector) {
    super();

    /**
     * @type {trackSelector}
     * @readonly
     * @private
     */
    this._trackSelector = trackSelector;
  }

  /**
   * @param {OscMessage} message
   * @override
   */
  handle(message) {
    if (message.addressParts[1] === 'track') {
      const trackNumber = parseInt(message.addressParts[2]);

      // If NaN, probably means that it's a message for the selected track - ignore
      if (isNaN(trackNumber)) {
        return;
      }

      const track = this._trackSelector(trackNumber);

      if (track !== null) {
        track.handle(message);
      }
    }
  }
}

/**
 * A callback that can be used to obtain a Track FX by its number on the track
 * @callback trackFxSelector
 * @param {number} fxNumber - The number of the FX on the track
 * @returns {?TrackFx}
 */

/**
 * Routes messages for a track FX to the appropriate FX
 */
class TrackFxMessageHandler extends MessageHandler {
  /**
   * @param {trackFxSelector} fxSelector
   */
  constructor(fxSelector) {
    super();

    /**
     * @type {trackFxSelector}
     * @readonly
     * @private
     */
    this._fxSelector = fxSelector;
  }

  /**
   * @param {OscMessage} message
   * @override
   */
  handle(message) {
    if (message.addressParts[1] === 'track' && message.addressParts[3] === 'fx') {
      const fxNumber = parseInt(message.addressParts[4]);

      if (isNaN(fxNumber)) {
        throw new Error('Expected an integer');
      }

      const fx = this._fxSelector(fxNumber);

      if (fx !== null) {
        fx.handle(message);
      }
    }
  }
}

/**
 * @callback handleBool
 * @param {boolean} value
 * @returns {void}
 */

class BooleanMessageHandler extends MessageHandler {
  /**
   *
   * @param {string} address
   * @param {handleBool} callback
   */
  constructor(address, callback) {
    super();

    /**
     * @type {string}
     * @readonly
     * */
    this.address = address;

    /**
     * @type {handleBool}
     * @readonly
     * @private
     */
    this._callback = callback;
  }

  /**
   * @inheritdoc
   * @param {OscMessage} message
   * @todo // TODO Add a check that the argument value is exactly 1 or 0
   */
  handle(message) {
    if (message.address === this.address) {
      const booleanValue = message.args[0].value === 1 ? true : false;

      this._callback(booleanValue);
    }
  }
}

/**
 * @callback handleInt
 * @param {number} value
 * @returns {void}
 */

class IntegerMessageHandler extends MessageHandler {
  /**
   * @param {string} address
   * @param {handleInt} callback
   */
  constructor(address, callback) {
    super();

    /**
     * @type {string}
     * @readonly
     */
    this.address = address;

    /**
     * @type {handleInt}
     * @readonly
     * @private
     */
    this._callback = callback;
  }

  /**
   * @inheritdoc
   * @param {OscMessage} message
   * @override
   */
  handle(message) {
    if (message.address === this.address) {
      const messageValue = message.args[0].value;

      let intValue;

      if (typeof messageValue === 'number') {
        intValue = messageValue;
      } else {
        intValue = parseInt(messageValue);

        if (isNaN(intValue)) {
          throw new Error('Expected an integer');
        }
      }

      this._callback(intValue);
    }
  }
}

/**
 * @callback handleString
 * @param {string} value
 * @returns {void}
 */
class StringMessageHandler extends MessageHandler {
  /**
   * @param {string} address
   * @param {handleString} callback
   */
  constructor(address, callback) {
    super();

    this.address = address;
    this._callback = callback;
  }

  /**
   * @inheritdoc
   * @param {OscMessage} message
   * @override
   */
  handle(message) {
    if (message.address === this.address) {
      let messageValue = message.args[0].value;

      let stringValue = typeof messageValue === 'string' ? messageValue : messageValue.toString();

      this._callback(stringValue);
    }
  }
}

export {MessageHandler, TrackMessageHandler, TrackFxMessageHandler, BooleanMessageHandler, StringMessageHandler, IntegerMessageHandler};
