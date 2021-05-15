[reaper-osc](../README.md) / [Exports](../modules.md) / [Fx](../modules/fx.md) / Fx

# Class: Fx

[Fx](../modules/fx.md).Fx

## Hierarchy

- **Fx**

  ↳ [*TrackFx*](fx.trackfx.md)

## Implements

- [*INotifyPropertyChanged*](../interfaces/notify_notify.inotifypropertychanged.md)<[*Fx*](fx.fx-1.md)\>

## Table of contents

### Constructors

- [constructor](fx.fx-1.md#constructor)

### Properties

- [\_handlers](fx.fx-1.md#_handlers)
- [\_isBypassed](fx.fx-1.md#_isbypassed)
- [\_isUiOpen](fx.fx-1.md#_isuiopen)
- [\_name](fx.fx-1.md#_name)
- [\_sendOscMessage](fx.fx-1.md#_sendoscmessage)
- [oscAddress](fx.fx-1.md#oscaddress)

### Accessors

- [isBypassed](fx.fx-1.md#isbypassed)
- [isUiOpen](fx.fx-1.md#isuiopen)
- [name](fx.fx-1.md#name)
- [onPropertyChanged](fx.fx-1.md#onpropertychanged)

### Methods

- [bypass](fx.fx-1.md#bypass)
- [closeUi](fx.fx-1.md#closeui)
- [openUi](fx.fx-1.md#openui)
- [receive](fx.fx-1.md#receive)
- [unbypass](fx.fx-1.md#unbypass)

## Constructors

### constructor

\+ **new Fx**(`name`: *string*, `oscAddress`: *string*, `sendOscMessage`: [*ISendOscMessage*](../interfaces/osc_messages.isendoscmessage.md)): [*Fx*](fx.fx-1.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | *string* |
| `oscAddress` | *string* |
| `sendOscMessage` | [*ISendOscMessage*](../interfaces/osc_messages.isendoscmessage.md) |

**Returns:** [*Fx*](fx.fx-1.md)

Defined in: [Fx.ts:23](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L23)

## Properties

### \_handlers

• `Protected` `Readonly` **\_handlers**: [*IMessageHandler*](../interfaces/osc_handlers.imessagehandler.md)[]

Defined in: [Fx.ts:17](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L17)

___

### \_isBypassed

• `Private` **\_isBypassed**: *boolean*= false

Defined in: [Fx.ts:9](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L9)

___

### \_isUiOpen

• `Private` **\_isUiOpen**: *boolean*= false

Defined in: [Fx.ts:12](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L12)

___

### \_name

• `Private` **\_name**: *string*

Defined in: [Fx.ts:15](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L15)

___

### \_sendOscMessage

• `Protected` `Readonly` **\_sendOscMessage**: [*ISendOscMessage*](../interfaces/osc_messages.isendoscmessage.md)

Defined in: [Fx.ts:23](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L23)

___

### oscAddress

• `Readonly` **oscAddress**: *string*

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

Implementation of: [INotifyPropertyChanged](../interfaces/notify_notify.inotifypropertychanged.md).[onPropertyChanged](../interfaces/notify_notify.inotifypropertychanged.md#onpropertychanged)

Defined in: [Fx.ts:68](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L68)

## Methods

### bypass

▸ **bypass**(): *void*

Bypass the FX

**Returns:** *void*

Defined in: [Fx.ts:31](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L31)

___

### closeUi

▸ **closeUi**(): *void*

Close the UI of the FX

**Returns:** *void*

Defined in: [Fx.ts:36](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L36)

___

### openUi

▸ **openUi**(): *void*

Open the UI of the FX

**Returns:** *void*

Defined in: [Fx.ts:53](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L53)

___

### receive

▸ **receive**(`message`: [*OscMessage*](osc_messages.oscmessage.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [*OscMessage*](osc_messages.oscmessage.md) |

**Returns:** *void*

Defined in: [Fx.ts:57](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L57)

___

### unbypass

▸ **unbypass**(): *void*

Unbypass the FX

**Returns:** *void*

Defined in: [Fx.ts:64](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Fx.ts#L64)
