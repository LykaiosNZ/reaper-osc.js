// @ts-check
import { OscMessage, BinaryMessage, ToggleMessage } from "./messages.js";
import { BinaryMessageHandler, StringMessageHandler, TrackMessageHandler, TrackFxMessageHandler, MessageHandler } from "./handlers.js";
import osc from 'osc';
const { UDPPort } = osc;

/**
 * A callback that can be used to send an OSC message to Reaper
 * @callback sendMessage
 * @param {OscMessage} message - The message to send.
 */

class Track {
    /**
     * @param {number} trackNumber - The track number of this track
     * @param {number} numberOfFx  - The number of FX to initialize for this track
     * @param {sendMessage} sendMessage
     */
    constructor(trackNumber, numberOfFx, sendMessage) {
        /**
         * @type {number}
         * @private
         * @readonly
         */
        this._trackNumber = trackNumber;

        /**
         * @type {string}
         * @private
         */
        this._name = 'Track ' + trackNumber;

        /**
         * @type {boolean}
         * @private
         */
        this._isMuted = false;

        /**
         * @type {boolean}
         * @private
         */
        this._isSoloed = false;

        /**
         * @type {boolean}
         * @private
         */
        this._isRecordArmed = false;

        /**
         * @type {boolean}
         * @private
         */
        this._isMonitoringEnabled = false;

        /**
         * @type {boolean}
         * @private
         */
        this._isSelected = false;

        /**
         * @type {TrackFx[]}
         * @private
         */
        this._fx = this._initFx(numberOfFx);

        /**
         * @type {sendMessage}
         * @private
         */
        this._sendMessage = sendMessage;

        /**
         * @type {MessageHandler[]}
         * @private
         */
        this._handlers = this._initHandlers();
    }

    get trackNumber() {
        return this._trackNumber;
    }

    get name() {
        return this._name;
    }

    /** @private */
    set name(value) {
        let oldValue = this._name;
        this._name = value;
        this._notifyIfPropertyChanged('name', oldValue, value);
    }

    get isMuted() {
        return this._isMuted;
    }

    /** @private */
    set isMuted(value) {
        let oldValue = this._isMuted;
        this._isMuted = value;
        this._notifyIfPropertyChanged('isMuted', oldValue, value);
    }

    get isSoloed() {
        return this._isSoloed;
    }

    /** @private */
    set isSoloed(value) {
        this._isSoloed = value;
    }

    get isRecordArmed() {
        return this._isRecordArmed;
    }

    /** @private */
    set isRecordArmed(value) {
        this._isRecordArmed = value;
    }

    get isMonitoringEnabled() {
        return this._isMonitoringEnabled;
    }

    /** @private */
    set isMonitoringEnabled(value) {
        this._isMonitoringEnabled = value;
    }

    get isSelected() {
        return this._isSelected;
    }

    /** @private */
    set isSelected(value) {
        this._isSelected = value;
    }

    /**
     * Gets the base OSC address fragment for this track
     */
    get oscAddress() {
        return '/track/' + this._trackNumber;
    }

    /**
     * Mutes the track
     */
    mute() {
        let message = new BinaryMessage(this.oscAddress + '/mute', true);
        this._sendMessage(message);
    }

    /**
     * Unmutes the track
     */
    unmute() {
        let message = new BinaryMessage(this.oscAddress + '/mute', false);
        this._sendMessage(message);
    }

    /**
     * Toggles the mute status of the track
     */
    toggleMute() {
        let message = new ToggleMessage(this.oscAddress + '/mute');
        this._sendMessage(message);
    }

    /**
     * Handles an OSC message
     * @param {OscMessage} message - The message to handle
     */
    handle(message) {
        this._handlers.forEach((handler, index) => {
            handler.handle(message);
        });
    }

    /** @private */
    _initFx(numberOfFx) {
        let fx = [];

        for (let i = 1; i <= numberOfFx; i++) {
            fx[i] = new TrackFx(this._trackNumber, i, this._sendMessage);
        }

        return fx;
    }

    /** @private */
    _initHandlers() {
        return [
            new StringMessageHandler(this.oscAddress + '/name', (value) => this.name = value),
            new BinaryMessageHandler(this.oscAddress + '/mute', (value) => this.isMuted = value),
            new BinaryMessageHandler(this.oscAddress + '/solo', (value) => this.isSoloed = value),
            new BinaryMessageHandler(this.oscAddress + '/recarm', (value) => this.isRecordArmed = value),
            new BinaryMessageHandler(this.oscAddress + '/monitor', (value) => this.isMonitoringEnabled = value),
            new BinaryMessageHandler(this.oscAddress + '/select', (value) => this.isSelected = value),
            new TrackFxMessageHandler((fxNumber) => this._fx[fxNumber])
        ]
    }

    /** @private */
    _notifyIfPropertyChanged(propertyName, oldValue, newValue) {
        if (oldValue !== newValue) {
            console.debug('Track property changed', { trackNumber: this._trackNumber, propertyName: propertyName, oldValue: oldValue, newValue: newValue });
        }
    }
}

class TrackFx {
    /**
     * @param {number} trackNumber - The number of the track that this FX belongs to
     * @param {number} fxNumber - The number of this FX
     * @param {sendMessage} sendMessage 
     */
    constructor(trackNumber, fxNumber, sendMessage) {
        /**
         * @type {number}
         */
        this.trackNumber = trackNumber;

        /**
         * @type {number}
         */
        this.fxNumber = fxNumber;

        /**
         * @type {string}
         */
        this.name = 'FX ' + fxNumber;

        /**
         * @type {boolean}
         */
        this.isBypassed = false;

        /**
         * @type {boolean}
         */
        this.isUiOpen = false;

        /**
         * @type {sendMessage}
         */
        this._sendMessage = sendMessage;

        /**
         * @type {MessageHandler[]}
         */
        this._handlers = this._initHandlers();
    }

    /** Gets the base OSC address fragment for this track */
    get oscAddress() {
        return '/track/' + this.trackNumber + '/fx/' + this.fxNumber;
    }

    /**
     * Handles an OSC message
     * @param {OscMessage} message - The message to handle
     */
    handle(message) {
        this._handlers.forEach((handler, index) => {
            handler.handle(message);
        });
    }

    _initHandlers() {
        return [
            new StringMessageHandler(this.oscAddress + '/name', (value) => this._setPropertyValue('name', value)),
            new BinaryMessageHandler(this.oscAddress + '/bypass', (value) => this._setPropertyValue('isBypassed', !value)), // Reaper sends 0/false when the track is bypassed
            new BinaryMessageHandler(this.oscAddress + '/openui', (value) => this._setPropertyValue('isUiOpen', value))
        ]
    }

    _setPropertyValue(propertyName, value) {
        if (this[propertyName] !== value) {
            console.debug('Track FX property changed', { trackNumber: this.trackNumber, fxNumber: this.fxNumber, propertyName: propertyName, oldValue: this[propertyName], newValue: value });
            this[propertyName] = value;
        }
    }
}

class ReaperConfig {
    /**
     * Configuration for connecting to Reaper
     */
    constructor() {
        /**
         * @type {string}
         */
        this.localAddress = '0.0.0.0';

        /**
         * @type {number}
         */
        this.localPort = 9000;

        /**
         * @type {string}
         */
        this.reaperAddress = '127.0.0.1';

        /**
         * @type {number}
         */
        this.reaperPort = 8000;

        /**
         * @type {number}
         */
        this.numberOfTracks = 8;

        /**
         * @type {number}
         */
        this.numberOfTrackFx = 8;
    }
}

class Reaper {
    /**
     * An OSC client for Cockos Reaper
     * @param {ReaperConfig} config - Configuration
     */
    constructor(config = new ReaperConfig()) {
        /** 
         * @readonly
         * @private
         */
        this._config = config;

        /** @type {boolean} */
        this.isConnected = false;

        // Transport
        this.isPlaying = false;
        this.isStopped = false;
        this.isRecording = false;
        this.isRewinding = false;
        this.isForwarding = false;
        this.isRepeatEnabled = false;
        this.isMetronomeEnabled = false;

        this.tracks = this._initTracks();

        // OSC
        this._osc = this._initOsc();
        this._handlers = this._initHandlers();
    }

    connect() {
        this._osc.open();
    }

    disconnect() {
        this._osc.close();
        this.isConnected = false;
    }

    sendMessage(message) {
        if (!this.isConnected) {
            console.error("Can't send while disconnected");
            return;
        }

        this._osc.send(message);
    }

    // Public methods
    play() {
        this.sendMessage(new OscMessage('/play'));
    }

    pause() {
        this.sendMessage(new OscMessage('/pause'));
    }

    record() {
        this.sendMessage(new OscMessage('/record'));
    }

    startRewind() {
        this.sendMessage(new BinaryMessage('/rewind', true));
    }

    stopRewind() {
        this.sendMessage(new BinaryMessage('/rewind', false));
    }

    stop() {
        this.sendMessage(new OscMessage('/stop'));
    }

    // Private methods
    _initTracks() {
        let tracks = [];

        for (let i = 1; i <= this._config.numberOfTracks; i++) {
            let track = new Track(i, this._config.numberOfTrackFx, (message) => this.sendMessage(message));

            tracks[i] = track;
        }

        return tracks;
    }

    _initOsc() {
        let port = new UDPPort({
            localAddress: this._config.localAddress,
            localPort: this._config.localPort,
            remoteAddress: this._config.reaperAddress,
            remotePort: this._config.reaperPort,
            broadcast: true,
            metadata: true
        });

        port.on('ready', () => {
            console.debug('OSC Connected to reaper', { reaperAddress: this._config.reaperAddress, reaperPort: this._config.reaperPort });
            this.isConnected = true;
        });

        port.on('error', (err) => {
            console.error('OSC Error received from reaper', err);
        });

        port.on('message', (message) => {
            this._handlers.forEach((handler, index) => {
                handler.handle(message);
            });
        })

        return port;
    }

    _initHandlers() {
        return [
            new BinaryMessageHandler('/click', (messageValue) => this._setPropertyValue('isMetronomeEnabled', messageValue)),
            new BinaryMessageHandler('/repeat', (messageValue) => this._setPropertyValue('isRepeatEnabled', messageValue)),
            new BinaryMessageHandler('/record', (messageValue) => this._setPropertyValue('isRecording', messageValue)),
            new BinaryMessageHandler('/stop', (messageValue) => this._setPropertyValue('isStopped', messageValue)),
            new BinaryMessageHandler('/play', (messageValue) => this._setPropertyValue('isPlaying', messageValue)),
            new BinaryMessageHandler('/rewind', (messageValue) => this._setPropertyValue('isRewinding', messageValue)),
            new BinaryMessageHandler('/forward', (messageValue) => this._setPropertyValue('isForwarding', messageValue)),
            new TrackMessageHandler((trackNumber) => this.tracks[trackNumber])
        ];
    }

    _setPropertyValue(propertyName, value) {
        if (this[propertyName] !== value) {
            console.log('Reaper property changed', { propertyName: propertyName, oldValue: this[propertyName], newValue: value });
            this[propertyName] = value;
        }
    }
}

export { Reaper, ReaperConfig, Track, TrackFx };