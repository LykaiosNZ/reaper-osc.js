[reaper-osc](../README.md) / [Exports](../modules.md) / [osc/Handlers](../modules/osc_handlers.md) / TrackFxMessageHandler

# Class: TrackFxMessageHandler

[osc/Handlers](../modules/osc_handlers.md).TrackFxMessageHandler

Routes messages to the appropriate track fx

## Implements

- [*IMessageHandler*](../interfaces/osc_handlers.imessagehandler.md)

## Table of contents

### Constructors

- [constructor](osc_handlers.trackfxmessagehandler.md#constructor)

### Methods

- [handle](osc_handlers.trackfxmessagehandler.md#handle)

## Constructors

### constructor

\+ **new TrackFxMessageHandler**(`fxSelector`: (`fxNumber`: *number*) => [*TrackFx*](fx.trackfx.md)): [*TrackFxMessageHandler*](osc_handlers.trackfxmessagehandler.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `fxSelector` | (`fxNumber`: *number*) => [*TrackFx*](fx.trackfx.md) |

**Returns:** [*TrackFxMessageHandler*](osc_handlers.trackfxmessagehandler.md)

Defined in: [osc/Handlers.ts:42](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Handlers.ts#L42)

## Methods

### handle

▸ **handle**(`message`: [*OscMessage*](osc_messages.oscmessage.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [*OscMessage*](osc_messages.oscmessage.md) |

**Returns:** *void*

Implementation of: [IMessageHandler](../interfaces/osc_handlers.imessagehandler.md)

Defined in: [osc/Handlers.ts:45](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Handlers.ts#L45)
