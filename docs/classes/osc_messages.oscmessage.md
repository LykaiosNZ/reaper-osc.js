[reaper-osc](../README.md) / [Exports](../modules.md) / [osc/Messages](../modules/osc_messages.md) / OscMessage

# Class: OscMessage

[osc/Messages](../modules/osc_messages.md).OscMessage

## Hierarchy

- **OscMessage**

  ↳ [*StringMessage*](osc_messages.stringmessage.md)

  ↳ [*BooleanMessage*](osc_messages.booleanmessage.md)

  ↳ [*ToggleMessage*](osc_messages.togglemessage.md)

  ↳ [*IntegerMessage*](osc_messages.integermessage.md)

## Table of contents

### Constructors

- [constructor](osc_messages.oscmessage.md#constructor)

### Properties

- [address](osc_messages.oscmessage.md#address)
- [addressParts](osc_messages.oscmessage.md#addressparts)
- [args](osc_messages.oscmessage.md#args)

## Constructors

### constructor

\+ **new OscMessage**(`address`: *string*, `args?`: [*OscArgument*](osc_messages.oscargument.md)<unknown\>[]): [*OscMessage*](osc_messages.oscmessage.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *string* |
| `args?` | [*OscArgument*](osc_messages.oscargument.md)<unknown\>[] |

**Returns:** [*OscMessage*](osc_messages.oscmessage.md)

Defined in: [osc/Messages.ts:52](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Messages.ts#L52)

## Properties

### address

• `Readonly` **address**: *string*

Defined in: [osc/Messages.ts:50](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Messages.ts#L50)

___

### addressParts

• `Readonly` **addressParts**: *string*[]

Defined in: [osc/Messages.ts:51](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Messages.ts#L51)

___

### args

• `Readonly` **args**: [*OscArgument*](osc_messages.oscargument.md)<unknown\>[]

Defined in: [osc/Messages.ts:52](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Messages.ts#L52)
