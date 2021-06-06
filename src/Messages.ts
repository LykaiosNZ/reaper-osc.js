export interface ISendOscMessage {
  (message: OscMessage): void;
}

export enum OscArgumentType {
  INT = 'i',
  LONG = 'h',
  FLOAT = 'f',
  DOUBLE = 'd',
  STRING = 's',
  CHAR = 'c',
  BLOB = 'b',
  TRUE = 'T',
  FALSE = 'F',
  NULL = 'N',
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

export class FloatArgument extends OscArgument<number> {
  constructor(value: number) {
    super(OscArgumentType.FLOAT, value);
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
    const args = [new IntArgument(value)];

    super(address, args);
  }
}

export class FloatMessage extends OscMessage {
  constructor(address: string, value: number) {
    const args = [new FloatArgument(value)];

    super(address, args);
  }
}
