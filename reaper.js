// @ts-check
"use strict";
import { OscMessage, BinaryMessage, ToggleMessage, ActionMessage, StringMessage } from "./messages.js";
import { BinaryMessageHandler, StringMessageHandler, TrackMessageHandler, TrackFxMessageHandler, MessageHandler } from "./handlers.js";
import osc from 'osc';
const { UDPPort } = osc;

/**
 * @readonly
 * @enum {number}
 */
const RecordMonitorMode = {
    ON: 0,
    OFF: 1,
    AUTO: 2
}

/**
 * A callback that can be used to send an OSC message to Reaper
 * @callback sendOscMessage
 * @param {OscMessage} message - The message to send.
 */

class Track {
    /**
     * @param {number} trackNumber - The track number of this track
     * @param {number} numberOfFx  - The number of FX to initialize for this track
     * @param {sendOscMessage} sendOscMessage
     */
    constructor(trackNumber, numberOfFx, sendOscMessage) {
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

        // TODO: This is not a boolean
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
         * @type {sendOscMessage}
         * @private
         */
        this._sendOscMessage = sendOscMessage;

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
        this._setFieldAndNotifyIfChanged('name', value);
    }

    get isMuted() {
        return this._isMuted;
    }

    /** @private */
    set isMuted(value) {
        this._setFieldAndNotifyIfChanged('isMuted', value);
    }

    get isSoloed() {
        return this._isSoloed;
    }

    /** @private */
    set isSoloed(value) {
        this._setFieldAndNotifyIfChanged('isSoloed', value);
    }

    get isRecordArmed() {
        return this._isRecordArmed;
    }

    /** @private */
    set isRecordArmed(value) {
        this._setFieldAndNotifyIfChanged('isRecordArmed', value);
    }

    get isMonitoringEnabled() {
        return this._isMonitoringEnabled;
    }

    /** @private */
    set isMonitoringEnabled(value) {
        this._setFieldAndNotifyIfChanged('isMonitoringEnabled', value);
    }

    get isSelected() {
        return this._isSelected;
    }

    /** @private */
    set isSelected(value) {
        this._setFieldAndNotifyIfChanged('isSelected', value);
    }

    /**
     * Gets the base OSC address fragment for this track
     */
    get oscAddress() {
        return '/track/' + this._trackNumber;
    }

    /**
     * Renames the track
     * @param {string} name 
     */
    rename(name) {
        this._sendOscMessage(new StringMessage(this.oscAddress + '/name', name));

        // Haven't figured out why yet (possibly to do with track selection?)
        // but Reaper doesn't send an OSC message even though it does if you 
        // change the name in Reaper
        this.name = name;
    }

    /** Mutes the track */
    mute() {
        this._sendOscMessage(new BinaryMessage(this.oscAddress + '/mute', true));
    }

    /** Unmutes the track */
    unmute() {
        this._sendOscMessage(new BinaryMessage(this.oscAddress + '/mute', false));
    }

    /** Toggles mute on/off */
    toggleMute() {
        this._sendOscMessage(new ToggleMessage(this.oscAddress + '/mute'));
    }

    solo() {
        this._sendOscMessage(new BinaryMessage(this.oscAddress + '/solo', true));
    }

    unsolo() {
        this._sendOscMessage(new BinaryMessage(this.oscAddress + '/solo', false));
    }

    toggleSolo() {
        this._sendOscMessage(new ToggleMessage(this.oscAddress + '/solo'));
    }

    recordArm() {
        this._sendOscMessage(new BinaryMessage(this.oscAddress + '/recarm', true));
    }

    recordDisarm() {
        this._sendOscMessage(new BinaryMessage(this.oscAddress + '/recarm', false));
    }

    toggleRecordArm() {
        this._sendOscMessage(new ToggleMessage(this.oscAddress + '/recarm'));
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
        const fx = [];

        for (let i = 1; i <= numberOfFx; i++) {
            fx[i] = new TrackFx(this._trackNumber, i, this._sendOscMessage);
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

            // TODO: Monitor is not a bool
            new BinaryMessageHandler(this.oscAddress + '/monitor', (value) => this.isMonitoringEnabled = value),
            new BinaryMessageHandler(this.oscAddress + '/select', (value) => this.isSelected = value),
            new TrackFxMessageHandler((fxNumber) => this._fx[fxNumber])
        ]
    }

    /** 
     * @param {string} propertyName
     * @param {any} value
     * @private 
    */
    _setFieldAndNotifyIfChanged(propertyName, value) {
        const fieldName = '_' + propertyName;
        const oldValue = this[fieldName];

        this[fieldName] = value;

        if (oldValue !== value) {
            console.debug('Track state changed', { trackNumber: this.trackNumber, propertyName: propertyName, oldValue: oldValue, newValue: value });
        }
    }
}

class TrackFx {
    /**
     * @param {number} trackNumber - The number of the track that this FX belongs to
     * @param {number} fxNumber - The number of this FX
     * @param {sendOscMessage} sendOscMessage 
     */
    constructor(trackNumber, fxNumber, sendOscMessage) {
        /**
         * @type {number}
         */
        this._trackNumber = trackNumber;

        /**
         * @type {number}
         */
        this._fxNumber = fxNumber;

        /**
         * @type {string}
         */
        this._name = 'FX ' + fxNumber;

        /**
         * @type {boolean}
         */
        this._isBypassed = false;

        /**
         * @type {boolean}
         */
        this._isUiOpen = false;

        /**
         * @type {sendOscMessage}
         */
        this._sendOscMessage = sendOscMessage;

        /**
         * @type {MessageHandler[]}
         */
        this._handlers = this._initHandlers();
    }

    get trackNumber() {
        return this._trackNumber;
    }

    get fxNumber() {
        return this._fxNumber;
    }

    get name() {
        return this._name;
    }

    /** @private */
    set name(value) {
        this._setFieldAndNotifyIfChanged('name', value);
    }

    get isBypassed() {
        return this._isBypassed;
    }

    /** @private */
    set isBypassed(value) {
        this._setFieldAndNotifyIfChanged('isBypassed', value);
    }

    get isUiOpen() {
        return this._isUiOpen;
    }

    /** @private */
    set isUiOpen(value) {
        this._setFieldAndNotifyIfChanged('isUiOpen', value);
    }

    /** Gets the base OSC address fragment for this track */
    get oscAddress() {
        return '/track/' + this._trackNumber + '/fx/' + this._fxNumber;
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
    _initHandlers() {
        return [
            new StringMessageHandler(this.oscAddress + '/name', (value) => this.name = value),
            new BinaryMessageHandler(this.oscAddress + '/bypass', (value) => this.isBypassed = !value), // Reaper sends 0/false when the track is bypassed
            new BinaryMessageHandler(this.oscAddress + '/openui', (value) => this.isUiOpen = value)
        ]
    }

    /** 
     * @param {string} propertyName
     * @param {any} value
     * @private 
    */
    _setFieldAndNotifyIfChanged(propertyName, value) {
        const fieldName = '_' + propertyName;
        const oldValue = this[fieldName];

        this[fieldName] = value;

        if (oldValue !== value) {
            console.debug('Track FX state changed', { trackNumber: this._trackNumber, fxNumber: this._fxNumber, propertyName: propertyName, oldValue: oldValue, newValue: value });
        }
    }
}

/**
 * Configuration for connecting to Reaper
 */
class ReaperConfig {
    constructor() {
        /**
         * @type {string}
         * @readonly
         */
        this.localAddress = '0.0.0.0';

        /**
         * @type {number}
         */
        this.localPort = 9000;

        /**
         * @type {string}
         */
        this.remoteAddress = '127.0.0.1';

        /**
         * @type {number}
         */
        this.remotePort = 8000;

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
        this._isReady = false;

        // Transport
        /** 
         * @type {boolean}
         * @private
         */
        this._isPlaying = false;

        /** 
         * @type {boolean}
         * @private
         */
        this._isStopped = true;

        /** 
         * @type {boolean}
         * @private
         */
        this._isRecording = false;

        /** 
         * @type {boolean}
         * @private
         */
        this._isRewinding = false;

        /** 
         * @type {boolean}
         * @private
         */
        this._isFastForwarding = false;

        /** 
         * @type {boolean}
         * @private
         */
        this._isRepeatEnabled = false;

        /** 
         * @type {boolean}
         * @private
         */
        this._isMetronomeEnabled = false;

        /** 
         * @type {Track[]}
         * @private
         */
        this._tracks = this._initTracks();

        /** 
         * @type {UDPPort}
         * @private
         */
        this._osc = this._initOsc();

        /** 
         * @type {MessageHandler[]}
         * @private
         */
        this._handlers = this._initHandlers();
    }

    get isReady() {
        return this._isReady;
    }

    /** @private */
    set isReady(value) {
        this._setFieldAndNotifyIfChanged('isReady', value);
    }

    get isPlaying() {
        return this._isPlaying;
    }

    /** @private */
    set isPlaying(value) {
        this._setFieldAndNotifyIfChanged('isPlaying', value);
    }

    get isStopped() {
        return this._isStopped;
    }

    /** @private */
    set isStopped(value) {
        this._setFieldAndNotifyIfChanged('isStopped', value);
    }

    get isRecording() {
        return this._isRecording;
    }

    /** @private */
    set isRecording(value) {
        this._setFieldAndNotifyIfChanged('isRecording', value);
    }

    get isRewinding() {
        return this._isRewinding;
    }

    /** @private */
    set isRewinding(value) {
        this._setFieldAndNotifyIfChanged('isRewinding', value);
    }

    get isFastForwarding() {
        return this._isFastForwarding;
    }

    /** @private */
    set isFastForwarding(value) {
        this._setFieldAndNotifyIfChanged('isFastForwarding', value);
    }

    get isRepeatEnabled() {
        return this._isRepeatEnabled;
    }

    /** @private */
    set isRepeatEnabled(value) {
        this._setFieldAndNotifyIfChanged('isRepeatEnabled', value);
    }

    get isMetronomeEnabled() {
        return this._isMetronomeEnabled;
    }

    /** @private */
    set isMetronomeEnabled(value) {
        this._setFieldAndNotifyIfChanged('isMetronomeEnabled', value);
    }

    get tracks() {
        return this._tracks;
    }

    /** Start listening for OSC messages */
    startOsc() {
        this._osc.open();
    }

    /** Stop listening for OSC messages */
    stopOsc() {
        this._osc.close();
        this._isReady = false;
    }

    /**
     * Send a custom OSC message
     * @param {OscMessage} message 
     */
    sendOscMessage(message) {
        if (!this._isReady) {
            console.error("Can't send while OSC is not ready");
            return;
        }

        this._osc.send(message);

        console.debug('OSC message sent', message);
    }

    /** Toggles play */
    play() {
        this.sendOscMessage(new OscMessage('/play'));
    }

    /** Toggles pause */
    pause() {
        this.sendOscMessage(new OscMessage('/pause'));
    }

    /** Stops playback or recording */
    stop() {
        this.sendOscMessage(new OscMessage('/stop'));
    }

    /** Toggles recording */
    record() {
        this.sendOscMessage(new OscMessage('/record'));
    }

    /** Starts rewinding. Will continue until stopped */
    startRewinding() {
        this.sendOscMessage(new BinaryMessage('/rewind', true));
    }

    /** Stop rewinding */
    stopRewinding() {
        this.sendOscMessage(new BinaryMessage('/rewind', false));
    }

    /** Starts fast fowarding. Will continue until stopped */
    startFastForwarding() {
        this.sendOscMessage(new BinaryMessage('/forward', true));
    }

    /** Stop fast forwarding */
    stopFastForwarding() {
        this.sendOscMessage(new BinaryMessage('/foward', false));
    }

    /** Toggles the metronome on or off */
    toggleMetronome() {
        this.sendOscMessage(new OscMessage('/click'));
    }

    /** Toggles repeat on or off */
    toggleRepeat() {
        this.sendOscMessage(new OscMessage('/repeaer'));
    }

    /** 
     * Triggers the action 'Control surface: Refresh all surfaces' (Command ID: 41743) 
     * 
     * */
    refreshControlSurfaces() {
        this.sendOscMessage(new ActionMessage(41743));
    }

    /**
     * Gets a track by its track number
     * @param {number} trackNumber 
     * @returns {?Track}
     */
    getTrack(trackNumber) {
        return this._tracks[trackNumber];
    }

    /** @private */
    _initTracks() {
        const tracks = [];

        for (let i = 1; i <= this._config.numberOfTracks; i++) {
            tracks[i] = new Track(i, this._config.numberOfTrackFx, (message) => this.sendOscMessage(message));
        }

        return tracks;
    }

    /** @private */
    _initOsc() {
        const port = new UDPPort({
            localAddress: this._config.localAddress,
            localPort: this._config.localPort,
            remoteAddress: this._config.remoteAddress,
            remotePort: this._config.remotePort,
            broadcast: true,
            metadata: true
        });

        port.on('ready', () => {
            console.debug('OSC ready', { localAddress: this._config.localAddress, localPort: this._config.localPort, remoteAddress: this._config.remoteAddress, remotePort: this._config.remotePort });
            this._isReady = true;
        });

        port.on('error', (err) => {
            console.error('OSC error received', err);
        });

        port.on('message', (message) => {
            console.debug('OSC message received', message);

            this._handlers.forEach((handler, index) => {
                handler.handle(message);
            });
        })

        return port;
    }

    /** @private */
    _initHandlers() {
        return [
            new BinaryMessageHandler('/click', (value) => this.isMetronomeEnabled = value),
            new BinaryMessageHandler('/repeat', (value) => this.isRepeatEnabled = value),
            new BinaryMessageHandler('/record', (value) => this.isRecording = value),
            new BinaryMessageHandler('/stop', (value) => this.isStopped = value),
            new BinaryMessageHandler('/play', (value) => this.isPlaying = value),
            new BinaryMessageHandler('/rewind', (value) => this.isRewinding = value),
            new BinaryMessageHandler('/forward', (value) => this.isFastForwarding = value),
            new TrackMessageHandler((trackNumber) => this._tracks[trackNumber])
        ];
    }

    /** 
     * @param {string} propertyName
     * @param {any} value
     * @private 
    */
    _setFieldAndNotifyIfChanged(propertyName, value) {
        const fieldName = '_' + propertyName;
        const oldValue = this[fieldName];

        this[fieldName] = value;

        if (oldValue !== value) {
            console.debug('Reaper state changed', { propertyName: propertyName, oldValue: oldValue, newValue: value });
        }
    }
}

export { Reaper, ReaperConfig, Track, TrackFx };