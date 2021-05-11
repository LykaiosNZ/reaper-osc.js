class OscArgument {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

class OscMessage {
    constructor(address, args = []) {
        this.address = address;
        this.args = args;
    }
}

class BinaryMessage extends OscMessage {
    constructor(address, value = false) {
        let args = [
            new OscArgument('i', value === true ? 1 : 0)
        ];

        super(address, args);
    }
}

class StringMessage extends OscMessage {
    constructor(address, value = '') {
        let args = [
            new OscArgument('s', value)
        ]

        super(address, args);
    }
}

class ToggleMessage extends OscMessage {
    constructor(address) {
        super(address + '/toggle');
    }
}

export {
    OscArgument,
    OscMessage,
    BinaryMessage,
    StringMessage,
    ToggleMessage
}