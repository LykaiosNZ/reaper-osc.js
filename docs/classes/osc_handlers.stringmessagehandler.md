[reaper-osc](../README.md) / [Exports](../modules.md) / [osc/Handlers](../modules/osc_handlers.md) / StringMessageHandler

# Class: StringMessageHandler

[osc/Handlers](../modules/osc_handlers.md).StringMessageHandler

## Implements

- [*IMessageHandler*](../interfaces/osc_handlers.imessagehandler.md)

## Table of contents

### Constructors

- [constructor](osc_handlers.stringmessagehandler.md#constructor)

### Properties

- [\_callback](osc_handlers.stringmessagehandler.md#_callback)
- [address](osc_handlers.stringmessagehandler.md#address)

### Methods

- [handle](osc_handlers.stringmessagehandler.md#handle)

## Constructors

### constructor

\+ **new StringMessageHandler**(`address`: *string*, `callback`: (`value`: *string*) => *void*): [*StringMessageHandler*](osc_handlers.stringmessagehandler.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *string* |
| `callback` | (`value`: *string*) => *void* |

**Returns:** [*StringMessageHandler*](osc_handlers.stringmessagehandler.md)

Defined in: [osc/Handlers.ts:112](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Handlers.ts#L112)

## Properties

### \_callback

• `Private` `Readonly` **\_callback**: (`value`: *string*) => *void*

#### Type declaration

▸ (`value`: *string*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | *string* |

**Returns:** *void*

Defined in: [osc/Handlers.ts:112](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Handlers.ts#L112)

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

Defined in: [osc/Handlers.ts:119](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Handlers.ts#L119)
