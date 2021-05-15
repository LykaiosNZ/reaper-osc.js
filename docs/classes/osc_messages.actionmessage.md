[reaper-osc](../README.md) / [Exports](../modules.md) / [osc/Messages](../modules/osc_messages.md) / ActionMessage

# Class: ActionMessage

[osc/Messages](../modules/osc_messages.md).ActionMessage

## Hierarchy

- [*StringMessage*](osc_messages.stringmessage.md)

  ↳ **ActionMessage**

## Table of contents

### Constructors

- [constructor](osc_messages.actionmessage.md#constructor)

### Properties

- [address](osc_messages.actionmessage.md#address)
- [addressParts](osc_messages.actionmessage.md#addressparts)
- [args](osc_messages.actionmessage.md#args)

## Constructors

### constructor

\+ **new ActionMessage**(`commandId`: *string* \| *number*): [*ActionMessage*](osc_messages.actionmessage.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandId` | *string* \| *number* |

**Returns:** [*ActionMessage*](osc_messages.actionmessage.md)

Overrides: [StringMessage](osc_messages.stringmessage.md)

Defined in: [osc/Messages.ts:75](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Messages.ts#L75)

## Properties

### address

• `Readonly` **address**: *string*

Inherited from: [StringMessage](osc_messages.stringmessage.md).[address](osc_messages.stringmessage.md#address)

Defined in: [osc/Messages.ts:50](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Messages.ts#L50)

___

### addressParts

• `Readonly` **addressParts**: *string*[]

Inherited from: [StringMessage](osc_messages.stringmessage.md).[addressParts](osc_messages.stringmessage.md#addressparts)

Defined in: [osc/Messages.ts:51](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Messages.ts#L51)

___

### args

• `Readonly` **args**: [*OscArgument*](osc_messages.oscargument.md)<unknown\>[]

Inherited from: [StringMessage](osc_messages.stringmessage.md).[args](osc_messages.stringmessage.md#args)

Defined in: [osc/Messages.ts:52](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Messages.ts#L52)
