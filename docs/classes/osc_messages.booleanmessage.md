[reaper-osc](../README.md) / [Exports](../modules.md) / [osc/Messages](../modules/osc_messages.md) / BooleanMessage

# Class: BooleanMessage

[osc/Messages](../modules/osc_messages.md).BooleanMessage

## Hierarchy

- [*OscMessage*](osc_messages.oscmessage.md)

  ↳ **BooleanMessage**

## Table of contents

### Constructors

- [constructor](osc_messages.booleanmessage.md#constructor)

### Properties

- [address](osc_messages.booleanmessage.md#address)
- [addressParts](osc_messages.booleanmessage.md#addressparts)
- [args](osc_messages.booleanmessage.md#args)

## Constructors

### constructor

\+ **new BooleanMessage**(`address`: *string*, `value`: *boolean*): [*BooleanMessage*](osc_messages.booleanmessage.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *string* |
| `value` | *boolean* |

**Returns:** [*BooleanMessage*](osc_messages.booleanmessage.md)

Overrides: [OscMessage](osc_messages.oscmessage.md)

Defined in: [osc/Messages.ts:67](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Messages.ts#L67)

## Properties

### address

• `Readonly` **address**: *string*

Inherited from: [OscMessage](osc_messages.oscmessage.md).[address](osc_messages.oscmessage.md#address)

Defined in: [osc/Messages.ts:50](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Messages.ts#L50)

___

### addressParts

• `Readonly` **addressParts**: *string*[]

Inherited from: [OscMessage](osc_messages.oscmessage.md).[addressParts](osc_messages.oscmessage.md#addressparts)

Defined in: [osc/Messages.ts:51](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Messages.ts#L51)

___

### args

• `Readonly` **args**: [*OscArgument*](osc_messages.oscargument.md)<unknown\>[]

Inherited from: [OscMessage](osc_messages.oscmessage.md).[args](osc_messages.oscmessage.md#args)

Defined in: [osc/Messages.ts:52](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Messages.ts#L52)
