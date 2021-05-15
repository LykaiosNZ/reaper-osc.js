[reaper-osc](../README.md) / [Exports](../modules.md) / [osc/Handlers](../modules/osc_handlers.md) / BooleanMessageHandler

# Class: BooleanMessageHandler

[osc/Handlers](../modules/osc_handlers.md).BooleanMessageHandler

## Implements

- [*IMessageHandler*](../interfaces/osc_handlers.imessagehandler.md)

## Table of contents

### Constructors

- [constructor](osc_handlers.booleanmessagehandler.md#constructor)

### Properties

- [\_callback](osc_handlers.booleanmessagehandler.md#_callback)
- [address](osc_handlers.booleanmessagehandler.md#address)

### Methods

- [handle](osc_handlers.booleanmessagehandler.md#handle)

## Constructors

### constructor

\+ **new BooleanMessageHandler**(`address`: *string*, `callback`: (`value`: *boolean*) => *void*): [*BooleanMessageHandler*](osc_handlers.booleanmessagehandler.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *string* |
| `callback` | (`value`: *boolean*) => *void* |

**Returns:** [*BooleanMessageHandler*](osc_handlers.booleanmessagehandler.md)

Defined in: [osc/Handlers.ts:63](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Handlers.ts#L63)

## Properties

### \_callback

• `Private` `Readonly` **\_callback**: (`value`: *boolean*) => *void*

#### Type declaration

▸ (`value`: *boolean*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | *boolean* |

**Returns:** *void*

Defined in: [osc/Handlers.ts:63](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Handlers.ts#L63)

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

Defined in: [osc/Handlers.ts:69](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Handlers.ts#L69)
