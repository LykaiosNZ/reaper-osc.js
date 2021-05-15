[reaper-osc](../README.md) / [Exports](../modules.md) / [osc/Messages](../modules/osc_messages.md) / OscArgument

# Class: OscArgument<T\>

[osc/Messages](../modules/osc_messages.md).OscArgument

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- **OscArgument**

  ↳ [*StringArgument*](osc_messages.stringargument.md)

  ↳ [*IntArgument*](osc_messages.intargument.md)

## Table of contents

### Constructors

- [constructor](osc_messages.oscargument.md#constructor)

### Properties

- [type](osc_messages.oscargument.md#type)
- [value](osc_messages.oscargument.md#value)

## Constructors

### constructor

\+ **new OscArgument**<T\>(`type`: [*OscArgumentType*](../enums/osc_messages.oscargumenttype.md), `value`: T): [*OscArgument*](osc_messages.oscargument.md)<T\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [*OscArgumentType*](../enums/osc_messages.oscargumenttype.md) |
| `value` | T |

**Returns:** [*OscArgument*](osc_messages.oscargument.md)<T\>

Defined in: [osc/Messages.ts:23](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Messages.ts#L23)

## Properties

### type

• `Readonly` **type**: [*OscArgumentType*](../enums/osc_messages.oscargumenttype.md)

Defined in: [osc/Messages.ts:22](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Messages.ts#L22)

___

### value

• `Readonly` **value**: T

Defined in: [osc/Messages.ts:23](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Messages.ts#L23)
