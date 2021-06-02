export interface ISendOscMessage {
  (message: OscMessage): void;
}

export enum OscArgumentType {
  /** 32-bit Integer */
  INT = 'i',
  /** 64-bit Integer */
  LONG = 'h',
  /** 32-bit Floating Point */
  FLOAT = 'f',
  /** 64-bit Floating Point */
  DOUBLE = 'd',
  /** String */
  STRING = 's',
  /** Single Character */
  CHAR = 'c',
  /** Binary blob */
  BLOB = 'b',
  /** True. No bytes are allocated in the argument data */
  TRUE = 'T',
  /** False. No bytes are allocated in the argument data */
  FALSE = 'F',
  /** Null. No bytes are allocated in the argument data */
  NULL = 'N',
  /** Impulse aka bang. Used for event triggers. No bytes are allocated in the argument data */
  IMPULSE = 'I',
  COLOR = 'r',
  MIDI = 'm',
}

export class OscArgument<T> {
  public readonly type: OscArgumentType;
  public readonly value: T;

  constructor(type: OscArgumentType, value: T) {
    this.type = type;
    this.value = value;
  }
}

export class StringArgument extends OscArgument<string> {
  constructor(value: string) {
    super(OscArgumentType.STRING, value);
  }
}

export class IntArgument extends OscArgument<number> {
  constructor(value: number) {
    super(OscArgumentType.INT, value);
  }
}

export class BoolArgument extends IntArgument {
  constructor(value: boolean) {
    super(value ? 1 : 0);
  }
}

export class OscMessage {
  public readonly address: string;
  public readonly addressParts: string[];
  public readonly args: OscArgument<unknown>[];

  constructor(address: string, args?: OscArgument<unknown>[]) {
    this.address = address;
    this.args = args ?? [];
    this.addressParts = address.split('/');
  }
}

export class StringMessage extends OscMessage {
  constructor(address: string, value: string) {
    super(address, [new StringArgument(value)]);
  }
}

export class BooleanMessage extends OscMessage {
  constructor(address: string, value: boolean) {
    const args = [new BoolArgument(value)];

    super(address, args);
  }
}

export class ActionMessage extends StringMessage {
  constructor(commandId: string | number) {
    if (typeof commandId === 'number') {
      commandId = commandId.toString();
    }

    super('/action/str', commandId);
  }
}

export class ToggleMessage extends OscMessage {
  constructor(address: string) {
    super(address + '/toggle');
  }
}

export class IntegerMessage extends OscMessage {
  constructor(address: string, value: number) {
    const args = [new OscArgument(OscArgumentType.INT, value)];

    super(address, args);
  }
}
