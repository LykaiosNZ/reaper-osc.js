[reaper-osc](../README.md) / [Exports](../modules.md) / [Reaper](../modules/reaper.md) / Reaper

# Class: Reaper

[Reaper](../modules/reaper.md).Reaper

Allows control of an instance of Reaper via OSC.

**`example`**
// Create an instance of Reaper using default settings
const reaper = new Reaper();
// Start OSC
reaper.startOsc();
// Give the port a chance to open, then tell Reaper to start playback
setTimeout(() => {reaper.transport.play();}, 100);

**`decorator`** `notifyOnPropertyChanged`

## Implements

- [*INotifyPropertyChanged*](../interfaces/notify_notify.inotifypropertychanged.md)<[*Reaper*](reaper.reaper-1.md)\>

## Table of contents

### Constructors

- [constructor](reaper.reaper-1.md#constructor)

### Properties

- [\_handlers](reaper.reaper-1.md#_handlers)
- [\_isMetronomeEnabled](reaper.reaper-1.md#_ismetronomeenabled)
- [\_isReady](reaper.reaper-1.md#_isready)
- [\_osc](reaper.reaper-1.md#_osc)
- [\_tracks](reaper.reaper-1.md#_tracks)
- [\_transport](reaper.reaper-1.md#_transport)

### Accessors

- [isMetronomeEnabled](reaper.reaper-1.md#ismetronomeenabled)
- [isReady](reaper.reaper-1.md#isready)
- [onPropertyChanged](reaper.reaper-1.md#onpropertychanged)
- [tracks](reaper.reaper-1.md#tracks)
- [transport](reaper.reaper-1.md#transport)

### Methods

- [initHandlers](reaper.reaper-1.md#inithandlers)
- [initOsc](reaper.reaper-1.md#initosc)
- [refreshControlSurfaces](reaper.reaper-1.md#refreshcontrolsurfaces)
- [sendOscMessage](reaper.reaper-1.md#sendoscmessage)
- [startOsc](reaper.reaper-1.md#startosc)
- [stopOsc](reaper.reaper-1.md#stoposc)
- [toggleMetronome](reaper.reaper-1.md#togglemetronome)
- [triggerAction](reaper.reaper-1.md#triggeraction)

## Constructors

### constructor

\+ **new Reaper**(`__namedParameters`: [*ReaperConfiguration*](../interfaces/reaper.reaperconfiguration.md)): [*Reaper*](reaper.reaper-1.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [*ReaperConfiguration*](../interfaces/reaper.reaperconfiguration.md) |

**Returns:** [*Reaper*](reaper.reaper-1.md)

Defined in: [Reaper.ts:43](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L43)

## Properties

### \_handlers

• `Private` `Readonly` **\_handlers**: [*IMessageHandler*](../interfaces/osc_handlers.imessagehandler.md)[]= []

Defined in: [Reaper.ts:36](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L36)

___

### \_isMetronomeEnabled

• `Private` **\_isMetronomeEnabled**: *boolean*= false

Defined in: [Reaper.ts:31](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L31)

___

### \_isReady

• `Private` **\_isReady**: *boolean*= false

Defined in: [Reaper.ts:34](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L34)

___

### \_osc

• `Private` `Readonly` **\_osc**: *any*

Defined in: [Reaper.ts:40](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L40)

___

### \_tracks

• `Private` `Readonly` **\_tracks**: [*Track*](tracks.track.md)[]= []

Defined in: [Reaper.ts:42](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L42)

___

### \_transport

• `Private` `Readonly` **\_transport**: [*Transport*](transport.transport-1.md)

Defined in: [Reaper.ts:43](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L43)

## Accessors

### isMetronomeEnabled

• get **isMetronomeEnabled**(): *boolean*

**Returns:** *boolean*

Defined in: [Reaper.ts:70](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L70)

___

### isReady

• get **isReady**(): *boolean*

**Returns:** *boolean*

Defined in: [Reaper.ts:74](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L74)

___

### onPropertyChanged

• get **onPropertyChanged**(): *IEvent*<[*Reaper*](reaper.reaper-1.md), string\>

An event that can be subscribed to for property change notifications

**Returns:** *IEvent*<[*Reaper*](reaper.reaper-1.md), string\>

Implementation of: [INotifyPropertyChanged](../interfaces/notify_notify.inotifypropertychanged.md).[onPropertyChanged](../interfaces/notify_notify.inotifypropertychanged.md#onpropertychanged)

Defined in: [Reaper.ts:78](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L78)

___

### tracks

• get **tracks**(): readonly [*Track*](tracks.track.md)[]

**Returns:** readonly [*Track*](tracks.track.md)[]

Defined in: [Reaper.ts:117](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L117)

___

### transport

• get **transport**(): [*Transport*](transport.transport-1.md)

**Returns:** [*Transport*](transport.transport-1.md)

Defined in: [Reaper.ts:121](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L121)

## Methods

### initHandlers

▸ `Private` **initHandlers**(): *void*

**Returns:** *void*

Defined in: [Reaper.ts:139](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L139)

___

### initOsc

▸ `Private` **initOsc**(): *void*

**Returns:** *void*

Defined in: [Reaper.ts:147](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L147)

___

### refreshControlSurfaces

▸ **refreshControlSurfaces**(): *void*

Triggers the action 'Control surface: Refresh all surfaces' (Command ID: 41743)

**Returns:** *void*

Defined in: [Reaper.ts:85](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L85)

___

### sendOscMessage

▸ **sendOscMessage**(`message`: [*OscMessage*](osc_messages.oscmessage.md)): *void*

Send a message to Reaper via OSC

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [*OscMessage*](osc_messages.oscmessage.md) |

**Returns:** *void*

Defined in: [Reaper.ts:90](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L90)

___

### startOsc

▸ **startOsc**(): *void*

Start listening for OSC messages

**Returns:** *void*

Defined in: [Reaper.ts:102](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L102)

___

### stopOsc

▸ **stopOsc**(): *void*

Stop listening for OSC messages

**Returns:** *void*

Defined in: [Reaper.ts:107](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L107)

___

### toggleMetronome

▸ **toggleMetronome**(): *void*

Toggle the metronome on or off

**Returns:** *void*

Defined in: [Reaper.ts:113](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L113)

___

### triggerAction

▸ **triggerAction**(`commandId`: *string* \| *number*): *void*

Trigger a Reaper action

**`example`**
// Trigger action 'Track: Toggle mute for master track'
reaper.triggerAction(14);

**`example`**
// Trigger SWS Extension action 'SWS: Set all master track outputs muted'
reaper.triggerAction('_XEN_SET_MAS_SENDALLMUTE');

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandId` | *string* \| *number* |

**Returns:** *void*

Defined in: [Reaper.ts:135](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Reaper.ts#L135)
