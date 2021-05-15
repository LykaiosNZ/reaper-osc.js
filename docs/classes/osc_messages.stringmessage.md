[reaper-osc](../README.md) / [Exports](../modules.md) / [osc/Messages](../modules/osc_messages.md) / StringMessage

# Class: StringMessage

[osc/Messages](../modules/osc_messages.md).StringMessage

## Hierarchy

- [*OscMessage*](osc_messages.oscmessage.md)

  ↳ **StringMessage**

  ↳↳ [*ActionMessage*](osc_messages.actionmessage.md)

## Table of contents

### Constructors

- [constructor](osc_messages.stringmessage.md#constructor)

### Properties

- [address](osc_messages.stringmessage.md#address)
- [addressParts](osc_messages.stringmessage.md#addressparts)
- [args](osc_messages.stringmessage.md#args)

## Constructors

### constructor

\+ **new StringMessage**(`address`: *string*, `value`: *string*): [*StringMessage*](osc_messages.stringmessage.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *string* |
| `value` | *string* |

**Returns:** [*StringMessage*](osc_messages.stringmessage.md)

Overrides: [OscMessage](osc_messages.oscmessage.md)

Defined in: [osc/Messages.ts:61](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Messages.ts#L61)

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
