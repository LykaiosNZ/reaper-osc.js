[reaper-osc](../README.md) / [Exports](../modules.md) / [Fx](../modules/fx.md) / TrackFx

# Class: TrackFx

[Fx](../modules/fx.md).TrackFx

## Hierarchy

- [*Fx*](fx.fx-1.md)

  ↳ **TrackFx**

## Table of contents

### Constructors

- [constructor](fx.trackfx.md#constructor)

### Properties

- [\_handlers](fx.trackfx.md#_handlers)
- [\_sendOscMessage](fx.trackfx.md#_sendoscmessage)
- [fxNumber](fx.trackfx.md#fxnumber)
- [oscAddress](fx.trackfx.md#oscaddress)
- [trackNumber](fx.trackfx.md#tracknumber)

### Accessors

- [isBypassed](fx.trackfx.md#isbypassed)
- [isUiOpen](fx.trackfx.md#isuiopen)
- [name](fx.trackfx.md#name)
- [onPropertyChanged](fx.trackfx.md#onpropertychanged)

### Methods

- [bypass](fx.trackfx.md#bypass)
- [closeUi](fx.trackfx.md#closeui)
- [openUi](fx.trackfx.md#openui)
- [receive](fx.trackfx.md#receive)
- [unbypass](fx.trackfx.md#unbypass)

## Constructors

### constructor

\+ **new TrackFx**(`trackNumber`: *number*, `fxNumber`: *number*, `sendOscMessage`: [*ISendOscMessage*](../interfaces/osc_messages.isendoscmessage.md)): [*TrackFx*](fx.trackfx.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `trackNumber` | *number* |
| `fxNumber` | *number* |
| `sendOscMessage` | [*ISendOscMessage*](../interfaces/osc_messages.isendoscmessage.md) |

**Returns:** [*TrackFx*](fx.trackfx.md)

Overrides: [Fx](fx.fx-1.md)

Defined in: [Fx.ts:73](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L73)

## Properties

### \_handlers

• `Protected` `Readonly` **\_handlers**: [*IMessageHandler*](../interfaces/osc_handlers.imessagehandler.md)[]

Inherited from: [Fx](fx.fx-1.md).[_handlers](fx.fx-1.md#_handlers)

Defined in: [Fx.ts:17](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L17)

___

### \_sendOscMessage

• `Protected` `Readonly` **\_sendOscMessage**: [*ISendOscMessage*](../interfaces/osc_messages.isendoscmessage.md)

Inherited from: [Fx](fx.fx-1.md).[_sendOscMessage](fx.fx-1.md#_sendoscmessage)

Defined in: [Fx.ts:23](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L23)

___

### fxNumber

• `Readonly` **fxNumber**: *number*

___

### oscAddress

• `Readonly` **oscAddress**: *string*

Inherited from: [Fx](fx.fx-1.md).[oscAddress](fx.fx-1.md#oscaddress)

___

### trackNumber

• `Readonly` **trackNumber**: *number*

## Accessors

### isBypassed

• get **isBypassed**(): *boolean*

**Returns:** *boolean*

Defined in: [Fx.ts:40](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L40)

___

### isUiOpen

• get **isUiOpen**(): *boolean*

**Returns:** *boolean*

Defined in: [Fx.ts:44](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L44)

___

### name

• get **name**(): *string*

**Returns:** *string*

Defined in: [Fx.ts:48](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L48)

___

### onPropertyChanged

• get **onPropertyChanged**(): *IEvent*<[*Fx*](fx.fx-1.md), string\>

An event that can be subscribed to for property change notifications

**Returns:** *IEvent*<[*Fx*](fx.fx-1.md), string\>

Defined in: [Fx.ts:68](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L68)

## Methods

### bypass

▸ **bypass**(): *void*

Bypass the FX

**Returns:** *void*

Inherited from: [Fx](fx.fx-1.md)

Defined in: [Fx.ts:31](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L31)

___

### closeUi

▸ **closeUi**(): *void*

Close the UI of the FX

**Returns:** *void*

Inherited from: [Fx](fx.fx-1.md)

Defined in: [Fx.ts:36](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L36)

___

### openUi

▸ **openUi**(): *void*

Open the UI of the FX

**Returns:** *void*

Inherited from: [Fx](fx.fx-1.md)

Defined in: [Fx.ts:53](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L53)

___

### receive

▸ **receive**(`message`: [*OscMessage*](osc_messages.oscmessage.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [*OscMessage*](osc_messages.oscmessage.md) |

**Returns:** *void*

Inherited from: [Fx](fx.fx-1.md)

Defined in: [Fx.ts:57](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L57)

___

### unbypass

▸ **unbypass**(): *void*

Unbypass the FX

**Returns:** *void*

Inherited from: [Fx](fx.fx-1.md)

Defined in: [Fx.ts:64](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L64)
