[reaper-osc](../README.md) / [Exports](../modules.md) / [osc/Handlers](../modules/osc_handlers.md) / IntegerMessageHandler

# Class: IntegerMessageHandler

[osc/Handlers](../modules/osc_handlers.md).IntegerMessageHandler

## Implements

- [*IMessageHandler*](../interfaces/osc_handlers.imessagehandler.md)

## Table of contents

### Constructors

- [constructor](osc_handlers.integermessagehandler.md#constructor)

### Properties

- [\_callback](osc_handlers.integermessagehandler.md#_callback)
- [address](osc_handlers.integermessagehandler.md#address)

### Methods

- [handle](osc_handlers.integermessagehandler.md#handle)

## Constructors

### constructor

\+ **new IntegerMessageHandler**(`address`: *string*, `callback`: (`value`: *number*) => *void*): [*IntegerMessageHandler*](osc_handlers.integermessagehandler.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *string* |
| `callback` | (`value`: *number*) => *void* |

**Returns:** [*IntegerMessageHandler*](osc_handlers.integermessagehandler.md)

Defined in: [osc/Handlers.ts:79](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Handlers.ts#L79)

## Properties

### \_callback

• `Private` `Readonly` **\_callback**: (`value`: *number*) => *void*

#### Type declaration

▸ (`value`: *number*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | *number* |

**Returns:** *void*

Defined in: [osc/Handlers.ts:79](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Handlers.ts#L79)

___

### address

• `Readonly` **address**: *string*

## Methods

### handle

▸ **handle**(`message`: [*OscMessage*](osc_messages.oscmessage.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [*OscMessage*](osc_messages.oscmessage.md) |

**Returns:** *void*

Implementation of: [IMessageHandler](../interfaces/osc_handlers.imessagehandler.md)

Defined in: [osc/Handlers.ts:85](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Handlers.ts#L85)
