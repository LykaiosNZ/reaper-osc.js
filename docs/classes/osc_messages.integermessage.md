[reaper-osc](../README.md) / [Exports](../modules.md) / [osc/Messages](../modules/osc_messages.md) / IntegerMessage

# Class: IntegerMessage

[osc/Messages](../modules/osc_messages.md).IntegerMessage

## Hierarchy

- [*OscMessage*](osc_messages.oscmessage.md)

  ↳ **IntegerMessage**

## Table of contents

### Constructors

- [constructor](osc_messages.integermessage.md#constructor)

### Properties

- [address](osc_messages.integermessage.md#address)
- [addressParts](osc_messages.integermessage.md#addressparts)
- [args](osc_messages.integermessage.md#args)

## Constructors

### constructor

\+ **new IntegerMessage**(`address`: *string*, `value`: *number*): [*IntegerMessage*](osc_messages.integermessage.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *string* |
| `value` | *number* |

**Returns:** [*IntegerMessage*](osc_messages.integermessage.md)

Overrides: [OscMessage](osc_messages.oscmessage.md)

Defined in: [osc/Messages.ts:91](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Messages.ts#L91)

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