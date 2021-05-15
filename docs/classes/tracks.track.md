[reaper-osc](../README.md) / [Exports](../modules.md) / [Tracks](../modules/tracks.md) / Track

# Class: Track

[Tracks](../modules/tracks.md).Track

## Implements

- [*INotifyPropertyChanged*](../interfaces/notify_notify.inotifypropertychanged.md)<[*Track*](tracks.track.md)\>

## Table of contents

### Constructors

- [constructor](tracks.track.md#constructor)

### Properties

- [\_fx](tracks.track.md#_fx)
- [\_handlers](tracks.track.md#_handlers)
- [\_isMuted](tracks.track.md#_ismuted)
- [\_isRecordArmed](tracks.track.md#_isrecordarmed)
- [\_isSelected](tracks.track.md#_isselected)
- [\_isSoloed](tracks.track.md#_issoloed)
- [\_name](tracks.track.md#_name)
- [\_recordMonitoring](tracks.track.md#_recordmonitoring)
- [\_sendOscMessage](tracks.track.md#_sendoscmessage)
- [trackNumber](tracks.track.md#tracknumber)

### Accessors

- [fx](tracks.track.md#fx)
- [isMuted](tracks.track.md#ismuted)
- [isRecordArmed](tracks.track.md#isrecordarmed)
- [isSelected](tracks.track.md#isselected)
- [isSoloed](tracks.track.md#issoloed)
- [name](tracks.track.md#name)
- [onPropertyChanged](tracks.track.md#onpropertychanged)
- [oscAddress](tracks.track.md#oscaddress)
- [recordMonitoring](tracks.track.md#recordmonitoring)

### Methods

- [deselect](tracks.track.md#deselect)
- [initHandlers](tracks.track.md#inithandlers)
- [mute](tracks.track.md#mute)
- [receive](tracks.track.md#receive)
- [recordArm](tracks.track.md#recordarm)
- [recordDisarm](tracks.track.md#recorddisarm)
- [rename](tracks.track.md#rename)
- [select](tracks.track.md#select)
- [setMonitoringMode](tracks.track.md#setmonitoringmode)
- [solo](tracks.track.md#solo)
- [toggleMute](tracks.track.md#togglemute)
- [toggleRecordArm](tracks.track.md#togglerecordarm)
- [toggleSolo](tracks.track.md#togglesolo)
- [unmute](tracks.track.md#unmute)
- [unsolo](tracks.track.md#unsolo)

## Constructors

### constructor

\+ **new Track**(`trackNumber`: *number*, `numberOfFx`: *number*, `sendOscMessage`: [*ISendOscMessage*](../interfaces/osc_messages.isendoscmessage.md)): [*Track*](tracks.track.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `trackNumber` | *number* |
| `numberOfFx` | *number* |
| `sendOscMessage` | [*ISendOscMessage*](../interfaces/osc_messages.isendoscmessage.md) |

**Returns:** [*Track*](tracks.track.md)

Defined in: [Tracks.ts:29](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L29)

## Properties

### \_fx

• `Private` `Readonly` **\_fx**: [*TrackFx*](fx.trackfx.md)[]= []

Defined in: [Tracks.ts:27](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L27)

___

### \_handlers

• `Private` `Readonly` **\_handlers**: [*IMessageHandler*](../interfaces/osc_handlers.imessagehandler.md)[]= []

Defined in: [Tracks.ts:28](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L28)

___

### \_isMuted

• `Private` **\_isMuted**: *boolean*= false

Defined in: [Tracks.ts:10](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L10)

___

### \_isRecordArmed

• `Private` **\_isRecordArmed**: *boolean*= false

Defined in: [Tracks.ts:13](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L13)

___

### \_isSelected

• `Private` **\_isSelected**: *boolean*= false

Defined in: [Tracks.ts:16](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L16)

___

### \_isSoloed

• `Private` **\_isSoloed**: *boolean*= false

Defined in: [Tracks.ts:19](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L19)

___

### \_name

• `Private` **\_name**: *string*

Defined in: [Tracks.ts:22](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L22)

___

### \_recordMonitoring

• `Private` **\_recordMonitoring**: [*RecordMonitoringMode*](../enums/tracks.recordmonitoringmode.md)

Defined in: [Tracks.ts:25](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L25)

___

### \_sendOscMessage

• `Private` `Readonly` **\_sendOscMessage**: [*ISendOscMessage*](../interfaces/osc_messages.isendoscmessage.md)

Defined in: [Tracks.ts:29](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L29)

___

### trackNumber

• `Readonly` **trackNumber**: *number*

## Accessors

### fx

• get **fx**(): [*TrackFx*](fx.trackfx.md)[]

**Returns:** [*TrackFx*](fx.trackfx.md)[]

Defined in: [Tracks.ts:46](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L46)

___

### isMuted

• get **isMuted**(): *boolean*

**Returns:** *boolean*

Defined in: [Tracks.ts:50](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L50)

___

### isRecordArmed

• get **isRecordArmed**(): *boolean*

**Returns:** *boolean*

Defined in: [Tracks.ts:54](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L54)

___

### isSelected

• get **isSelected**(): *boolean*

**Returns:** *boolean*

Defined in: [Tracks.ts:58](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L58)

___

### isSoloed

• get **isSoloed**(): *boolean*

**Returns:** *boolean*

Defined in: [Tracks.ts:62](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L62)

___

### name

• get **name**(): *string*

**Returns:** *string*

Defined in: [Tracks.ts:71](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L71)

___

### onPropertyChanged

• get **onPropertyChanged**(): *IEvent*<[*Track*](tracks.track.md), string\>

An event that can be subscribed to for property change notifications

**Returns:** *IEvent*<[*Track*](tracks.track.md), string\>

Implementation of: [INotifyPropertyChanged](../interfaces/notify_notify.inotifypropertychanged.md).[onPropertyChanged](../interfaces/notify_notify.inotifypropertychanged.md#onpropertychanged)

Defined in: [Tracks.ts:75](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L75)

___

### oscAddress

• get **oscAddress**(): *string*

**Returns:** *string*

Defined in: [Tracks.ts:79](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L79)

___

### recordMonitoring

• get **recordMonitoring**(): [*RecordMonitoringMode*](../enums/tracks.recordmonitoringmode.md)

**Returns:** [*RecordMonitoringMode*](../enums/tracks.recordmonitoringmode.md)

Defined in: [Tracks.ts:94](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L94)

## Methods

### deselect

▸ **deselect**(): *void*

Deselect the track

**Returns:** *void*

Defined in: [Tracks.ts:42](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L42)

___

### initHandlers

▸ `Private` **initHandlers**(): *void*

**Returns:** *void*

Defined in: [Tracks.ts:162](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L162)

___

### mute

▸ **mute**(): *void*

Mute the track

**Returns:** *void*

Defined in: [Tracks.ts:67](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L67)

___

### receive

▸ **receive**(`message`: [*OscMessage*](osc_messages.oscmessage.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [*OscMessage*](osc_messages.oscmessage.md) |

**Returns:** *void*

Defined in: [Tracks.ts:83](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L83)

___

### recordArm

▸ **recordArm**(): *void*

Arm the track for recording

**Returns:** *void*

Defined in: [Tracks.ts:90](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L90)

___

### recordDisarm

▸ **recordDisarm**(): *void*

Disarm track recording

**Returns:** *void*

Defined in: [Tracks.ts:99](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L99)

___

### rename

▸ **rename**(`name`: *string*): *void*

Renames the track

**`example`**
// Change the track name to 'Guitar'
track.rename('Guitar');

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | *string* | The new name of the track |

**Returns:** *void*

Defined in: [Tracks.ts:110](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L110)

___

### select

▸ **select**(): *void*

Select the track

**Returns:** *void*

Defined in: [Tracks.ts:120](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L120)

___

### setMonitoringMode

▸ **setMonitoringMode**(`value`: [*RecordMonitoringMode*](../enums/tracks.recordmonitoringmode.md)): *void*

Set the record monitoring mode

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [*RecordMonitoringMode*](../enums/tracks.recordmonitoringmode.md) |

**Returns:** *void*

Defined in: [Tracks.ts:128](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L128)

___

### solo

▸ **solo**(): *void*

Solo the track

**Returns:** *void*

Defined in: [Tracks.ts:133](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L133)

___

### toggleMute

▸ **toggleMute**(): *void*

Toggle mute on/off

**Returns:** *void*

Defined in: [Tracks.ts:138](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L138)

___

### toggleRecordArm

▸ **toggleRecordArm**(): *void*

Toggle record arm on/off

**Returns:** *void*

Defined in: [Tracks.ts:143](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L143)

___

### toggleSolo

▸ **toggleSolo**(): *void*

Toggle solo on/off

**Returns:** *void*

Defined in: [Tracks.ts:148](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L148)

___

### unmute

▸ **unmute**(): *void*

Unmute the track

**Returns:** *void*

Defined in: [Tracks.ts:153](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L153)

___

### unsolo

▸ **unsolo**(): *void*

Unsolo the track

**Returns:** *void*

Defined in: [Tracks.ts:158](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Tracks.ts#L158)
