[reaper-osc](../README.md) / [Exports](../modules.md) / [osc/Handlers](../modules/osc_handlers.md) / TrackMessageHandler

# Class: TrackMessageHandler

[osc/Handlers](../modules/osc_handlers.md).TrackMessageHandler

Routes messages to the appropriate track

## Implements

- [*IMessageHandler*](../interfaces/osc_handlers.imessagehandler.md)

## Table of contents

### Constructors

- [constructor](osc_handlers.trackmessagehandler.md#constructor)

### Methods

- [handle](osc_handlers.trackmessagehandler.md#handle)

## Constructors

### constructor

\+ **new TrackMessageHandler**(`trackSelector`: (`trackNumber`: *number*) => ``null`` \| [*Track*](tracks.track.md)): [*TrackMessageHandler*](osc_handlers.trackmessagehandler.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `trackSelector` | (`trackNumber`: *number*) => ``null`` \| [*Track*](tracks.track.md) |

**Returns:** [*TrackMessageHandler*](osc_handlers.trackmessagehandler.md)

Defined in: [osc/Handlers.ts:11](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Handlers.ts#L11)

## Methods

### handle

▸ **handle**(`message`: [*OscMessage*](osc_messages.oscmessage.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [*OscMessage*](osc_messages.oscmessage.md) |

**Returns:** *void*

Implementation of: [IMessageHandler](../interfaces/osc_handlers.imessagehandler.md)

Defined in: [osc/Handlers.ts:14](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/osc/Handlers.ts#L14)
