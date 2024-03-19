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

export interface OscArgument<T> {
  readonly type: OscArgumentType;
  value: T;
}

export type SomeOscArgument = StringArgument | IntArgument | FloatArgument

export interface StringArgument extends OscArgument<string> {
  type: OscArgumentType.STRING
  readonly value: string
}

export interface IntArgument extends OscArgument<number> {
  type: OscArgumentType.INT
  readonly value: number
}

export interface FloatArgument extends OscArgument<number> {
  type: OscArgumentType.FLOAT
  readonly value: number
}

export const StringArgument = (value: string) : StringArgument => ({type: OscArgumentType.STRING, value: value})
export const IntArgument = (value: number) : IntArgument => ({type: OscArgumentType.INT, value: value})
export const FloatArgument = (value: number) : FloatArgument => ({type: OscArgumentType.FLOAT, value: value})
export const BoolArgument = (value: boolean) : IntArgument => ({type: OscArgumentType.INT, value: value ? 1 : 0})

export type RawOscMessage = {
  readonly address: string
  readonly args?: SomeOscArgument[]
}

export class OscMessage {
  public readonly address: string;
  public readonly addressParts: string[];
  public readonly args: SomeOscArgument[];

  constructor(address: string, args?: SomeOscArgument[]) {
    this.address = address;
    this.args = args ?? [];
    this.addressParts = address.split('/').slice(1);
  }
}

export class StringMessage extends OscMessage {
  constructor(address: string, value: string) {
    super(address, [StringArgument(value)]);
  }
}

export class BooleanMessage extends OscMessage {
  constructor(address: string, value: boolean) {
    const args: SomeOscArgument[] = [BoolArgument(value)];

    super(address, args);
  }
}

export class ActionMessage extends OscMessage {
  constructor(commandId: string | number, value: number | null = null) {
    if (typeof commandId === 'number') {
      commandId = commandId.toString();
    }

    const args: SomeOscArgument[] = [StringArgument(commandId)];

    if (value !== null) {
      args.push(FloatArgument(value));
    }

    super('/action/str', args);
  }
}

export class ToggleMessage extends OscMessage {
  constructor(address: string) {
    super(address + '/toggle');
  }
}

export class IntegerMessage extends OscMessage {
  constructor(address: string, value: number) {
    const args: SomeOscArgument[] = [IntArgument(value)];

    super(address, args);
  }
}

export class FloatMessage extends OscMessage {
  constructor(address: string, value: number) {
    const args: SomeOscArgument[] = [FloatArgument(value)];

    super(address, args);
  }
}
