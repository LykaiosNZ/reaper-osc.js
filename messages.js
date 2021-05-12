// @ts-check
"use strict";

/**
 * @enum {string}
 */
const ArgumentType = {
    /** 
     * Binary argument, either 0 or 1. The device sets or clears the state when 
     * sending the message. Can be used to emulate switches or momentary controls.
     * 
     * @link https://github.com/Ultraschall/ultraschall-portable/blob/5977dda184593ed630aaef2b45294584c4ffe113/Plugins/Default.ReaperOSC#L127
     * @readonly 
     * */
    BINARY: 'b',

    /** @readonly */
    FLOAT: 'f',

    /** @readonly */
    INTEGER: 'i',

    /** 
     * Normalized floating-point argument. 0 means the minimum value, and 1 means the 
     * maximum value.  This can be used for continous controls like sliders and knobs.
     * 
     * @link https://github.com/Ultraschall/ultraschall-portable/blob/5977dda184593ed630aaef2b45294584c4ffe113/Plugins/Default.ReaperOSC#L101
     * @readonly */
    NORMALIZED: 'n',

    /** @readonly */
    ROTARY: 'r',

    /** @readonly */
    STRING: 's',

    /** @readonly */
    TRIGGER: 't',
}

/** An argument of an OSC message */
class OscArgument {
    /**
     * @param {ArgumentType} type - The type of message being passed
     * @param {*} value - The argument value
     */
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

/** An OSC message */
class OscMessage {
    /** 
     * @param {string} address - The OSC Address Pattern of the message
     * @param {OscArgument[]=} args - (optional) An array containing the arguments for the message
     */
    constructor(address, args) {
        /**
         * @type {string}
         * @readonly
         */
        this.address = address;

        /**
         * @type {OscArgument[]=}
         * @readonly
         */
        this.args = args;

        /**
         * @type {string[]}
         * @readonly
         */
        this.addressParts = address.split('/');
    }
}

class BinaryMessage extends OscMessage {
    constructor(address, value = false) {
        const args = [
            new OscArgument('i', value === true ? 1 : 0)
        ];

        super(address, args);
    }
}

class StringMessage extends OscMessage {
    constructor(address, value = '') {
        const args = [
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

class ActionMessage extends OscMessage {
    constructor(actionId) {
        super('/action/' + actionId);
    }
}

export {
    OscArgument,
    OscMessage,
    BinaryMessage,
    StringMessage,
    ToggleMessage,
    ActionMessage
}