// @ts-check
'use strict';

/**
 * @enum {string}
 */
const ArgumentType = {
  INT: 'i',
  LONG: 'h',
  FLOAT: 'f',
  DOUBLE: 'd',
  STRING: 's',
  CHAR: 'c',
  BLOB: 'b',
  TRUE: 'T',
  FALSE: 'F',
  NULL: 'N',
  IMPULSE: 'I',
  COLOR: 'r',
  MIDI: 'm',
};

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

class BooleanMessage extends OscMessage {
  /**
   * @param {string} address
   * @param {boolean} value
   */
  constructor(address, value = false) {
    const args = [new OscArgument(ArgumentType.INT, value === true ? 1 : 0)];

    super(address, args);
  }
}

class StringMessage extends OscMessage {
  /**
   * @param {string} address
   * @param {string} value
   */
  constructor(address, value) {
    const args = [new OscArgument(ArgumentType.STRING, value)];

    super(address, args);
  }
}

class IntegerMessage extends OscMessage {
  /**
   * @param {string} address
   * @param {number} value
   */
  constructor(address, value) {
    const args = [new OscArgument(ArgumentType.INT, value)];

    super(address, args);
  }
}

class ToggleMessage extends OscMessage {
  /**
   * @param {string} address
   */
  constructor(address) {
    super(address + '/toggle');
  }
}

class ActionMessage extends StringMessage {
  /**
   * @param {number | string} commandId
   */
  constructor(commandId) {
    if (typeof commandId !== 'string') {
      commandId = commandId.toString();
    }

    super('/action/str', commandId);
  }
}

export {OscArgument, OscMessage, BooleanMessage, StringMessage, ToggleMessage, ActionMessage, IntegerMessage};
