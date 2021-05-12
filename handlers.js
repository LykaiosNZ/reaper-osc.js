// @ts-check
import { OscMessage } from './messages.js';
import { Track, TrackFx } from './reaper.js'

/** Base class for handling {@link OscMessage} */
class MessageHandler {
    /**
     * Handle an OSC message
     * @param {OscMessage} message 
     * @abstract
     */
    handle(message) { 
        throw new Error('not implemented');
    };
}

/**
 * A callback that can be used to obtain a track using its track number
 * @callback trackSelector
 * @param {number} trackNumber - The number of the track
 * @returns {Track | undefined}
 */

/**
 * Handles messages related to Tracks
 * @augments MessageHandler
 */
class TrackMessageHandler extends MessageHandler {
    /**
     * @param {trackSelector} trackSelector 
     */
    constructor(trackSelector) {
        super();

        /**
         * @type {trackSelector}
         * @private
         */
        this._trackSelector = trackSelector;
    }

    /**
     * @override
     */
    handle(message) {
        if (message.address.startsWith('/track')) {
            var addressParts = message.address.split('/');

            var track = this._trackSelector(addressParts[2]);

            if (track !== undefined) {
                track.handle(message);
            }
        }
    }
}

/**
 * A callback that can be used to obtain a Track FX by its number on the track
 * @callback trackFxSelector
 * @param {number} fxNumber - The number of the FX on the track
 * @returns {TrackFx | undefined}
 */

class TrackFxMessageHandler extends MessageHandler {
    /**
     * 
     * @param {trackFxSelector} fxSelector
     */
    constructor(fxSelector) {
        super();

        this._fxSelector = fxSelector;
    }

    handle(message) {
        let addressParts = message.address.split('/');

        if (addressParts[1] === 'track' && addressParts[3] === 'fx') {
            let fx = this._fxSelector(addressParts[4]);

            if (fx !== undefined) {
                fx.handle(message);
            }
        }
    }
}

class BinaryMessageHandler extends MessageHandler {
    constructor(address, callback = (booleanValue) => { }) {
        super();

        this.address = address;
        this._callback = callback;
    }

    handle(message) {
        if (message.address === this.address) {
            let booleanValue = message.args[0].value === 1 ? true : false;

            this._callback(booleanValue);
        }
    }
}

class StringMessageHandler extends MessageHandler {
    constructor(address, callback = (stringValue) => { }) {
        super();

        this.address = address;
        this._callback = callback;
    }

    handle(message) {
        if (message.address === this.address) {
            let messageValue = message.args[0].value;

            let stringValue = typeof messageValue === 'string' ? messageValue : messageValue.toString();

            this._callback(stringValue);
        }
    }
}

export {
    MessageHandler,
    TrackMessageHandler,
    TrackFxMessageHandler,
    BinaryMessageHandler,
    StringMessageHandler
}