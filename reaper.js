import { OscMessage, BinaryMessage, ToggleMessage } from "./messages.js";
import { BinaryMessageHandler, StringMessageHandler, TrackMessageHandler, TrackFxMessageHandler } from "./handlers.js";
import osc from 'osc';
const { UDPPort } = osc;

class Track {
    constructor(trackNumber, numberOfFx, sendMessage) {
        this.trackNumber = trackNumber;
        this.name = 'Track ' + trackNumber;
        this.isMuted = false;
        this.isSoloed = false;
        this.isRecordArmed = false;
        this.isMonitoringEnabled = false;
        this.isSelected = false;
        this.fx = this._initFx(numberOfFx);

        this._sendMessage = sendMessage;
        this._handlers = this._initHandlers();
    }

    get oscAddress() {
        return '/track/' + this.trackNumber;
    }

    mute() {
        let message = new BinaryMessage(this.oscAddress + '/mute', true);
        this._sendMessage(message);
    }

    unmute() {
        let message = new BinaryMessage(this.oscAddress + '/mute', false);
        this._sendMessage(message);
    }

    toggleMute() {
        let message = new ToggleMessage(this.oscAddress + '/mute');
        this._sendMessage(message);
    }

    handle(message) {
        this._handlers.forEach((handler, index) => {
            handler.handle(message);
        });
    }

    _initFx(numberOfFx) {
        let fx = [];

        for (let i = 1; i <= numberOfFx; i++) {
            fx[i] = new TrackFx(this.trackNumber, i);
        }

        return fx;
    }

    _initHandlers() {
        return [
            new StringMessageHandler(this.oscAddress + '/name', (value) => this._setPropertyValue('name', value)),
            new BinaryMessageHandler(this.oscAddress + '/mute', (value) => this._setPropertyValue('isMuted', value)),
            new BinaryMessageHandler(this.oscAddress + '/solo', (value) => this._setPropertyValue('isSoloed', value)),
            new BinaryMessageHandler(this.oscAddress + '/recarm', (value) => this._setPropertyValue('isRecordArmed', value)),
            new BinaryMessageHandler(this.oscAddress + '/monitor', (value) => this._setPropertyValue('isMonitoringEnabled', value)),
            new BinaryMessageHandler(this.oscAddress + '/select', (value) => this._setPropertyValue('isSelected', value)),
            new TrackFxMessageHandler((fxNumber) => this.fx[fxNumber])
        ]
    }

    _setPropertyValue(propertyName, value) {
        if (this[propertyName] !== value) {
            console.debug('Track property changed', { trackNumber: this.trackNumber, propertyName: propertyName, oldValue: this[propertyName], newValue: value });
            this[propertyName] = value;
        }
    }
}

class TrackFx {
    constructor(trackNumber, fxNumber, sendMessage = (message) => { }) {
        this.trackNumber = trackNumber;
        this.fxNumber = fxNumber;
        this.name = 'FX ' + fxNumber;
        this.isBypassed = false;
        this.isUiOpen = false;

        this._sendMessage = sendMessage;
        this._handlers = this._initHandlers();
    }

    get oscAddress() {
        return '/track/' + this.trackNumber + '/fx/' + this.fxNumber;
    }

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
    constructor({ localAddress = '0.0.0.0', localPort = 9000, reaperAddress = '127.0.0.1', reaperPort = 8000 }) {
        this.localAddress = localAddress;
        this.localPort = localPort;
        this.reaperAddress = reaperAddress;
        this.reaperPort = reaperPort;
        this.numberOfTracks = 8;
        this.numberOfTrackFx = 8;
    }
}

class Reaper {
    constructor(config = new ReaperConfig()) {
        this._config = config;
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