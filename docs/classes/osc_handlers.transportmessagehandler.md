[reaper-osc](../README.md) / [Exports](../modules.md) / [osc/Handlers](../modules/osc_handlers.md) / TransportMessageHandler

# Class: TransportMessageHandler

[osc/Handlers](../modules/osc_handlers.md).TransportMessageHandler

Routes messages to the transport

## Implements

- [*IMessageHandler*](../interfaces/osc_handlers.imessagehandler.md)

## Table of contents

### Constructors

- [constructor](osc_handlers.transportmessagehandler.md#constructor)

### Methods

- [handle](osc_handlers.transportmessagehandler.md#handle)

## Constructors

### constructor

\+ **new TransportMessageHandler**(`transport`: [*Transport*](transport.transport-1.md)): [*TransportMessageHandler*](osc_handlers.transportmessagehandler.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transport` | [*Transport*](transport.transport-1.md) |

**Returns:** [*TransportMessageHandler*](osc_handlers.transportmessagehandler.md)

Defined in: [osc/Handlers.ts:33](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Handlers.ts#L33)

## Methods

### handle

▸ **handle**(`message`: [*OscMessage*](osc_messages.oscmessage.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [*OscMessage*](osc_messages.oscmessage.md) |

**Returns:** *void*

Implementation of: [IMessageHandler](../interfaces/osc_handlers.imessagehandler.md)

Defined in: [osc/Handlers.ts:36](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Handlers.ts#L36)
