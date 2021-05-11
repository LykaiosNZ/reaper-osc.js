class MessageHandler {
    handle(message) { };
}

class TrackMessageHandler extends MessageHandler {
    constructor(trackSelector = (trackNumber) => { }) {
        super();

        this._trackSelector = trackSelector;
    }

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

class TrackFxMessageHandler extends MessageHandler {
    constructor(fxSelector = (fxNumber) => { }) {
        super();

        this._fxSelector = fxSelector;
    }

    handle(message) {
        let addressParts = message.address.split('/');

        if (addressParts[1] === 'track' && addressParts[3] === 'fx') {
            console.debug('fx message', message);
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