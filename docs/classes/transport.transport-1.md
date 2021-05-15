[reaper-osc](../README.md) / [Exports](../modules.md) / [Transport](../modules/transport.md) / Transport

# Class: Transport

[Transport](../modules/transport.md).Transport

## Implements

- [*INotifyPropertyChanged*](../interfaces/notify_notify.inotifypropertychanged.md)<[*Transport*](transport.transport-1.md)\>

## Table of contents

### Constructors

- [constructor](transport.transport-1.md#constructor)

### Properties

- [\_handlers](transport.transport-1.md#_handlers)
- [\_isFastForwarding](transport.transport-1.md#_isfastforwarding)
- [\_isPlaying](transport.transport-1.md#_isplaying)
- [\_isRecording](transport.transport-1.md#_isrecording)
- [\_isRepeatEnabled](transport.transport-1.md#_isrepeatenabled)
- [\_isRewinding](transport.transport-1.md#_isrewinding)
- [\_isStopped](transport.transport-1.md#_isstopped)
- [\_sendOscMessage](transport.transport-1.md#_sendoscmessage)

### Accessors

- [isFastForwarding](transport.transport-1.md#isfastforwarding)
- [isPlaying](transport.transport-1.md#isplaying)
- [isRecording](transport.transport-1.md#isrecording)
- [isRepeatEnabled](transport.transport-1.md#isrepeatenabled)
- [isRewinding](transport.transport-1.md#isrewinding)
- [isStopped](transport.transport-1.md#isstopped)
- [onPropertyChanged](transport.transport-1.md#onpropertychanged)

### Methods

- [pause](transport.transport-1.md#pause)
- [play](transport.transport-1.md#play)
- [receive](transport.transport-1.md#receive)
- [record](transport.transport-1.md#record)
- [startFastForwarding](transport.transport-1.md#startfastforwarding)
- [startRewinding](transport.transport-1.md#startrewinding)
- [stop](transport.transport-1.md#stop)
- [stopFastForwarding](transport.transport-1.md#stopfastforwarding)
- [stopRewinding](transport.transport-1.md#stoprewinding)
- [toggleRepeat](transport.transport-1.md#togglerepeat)

## Constructors

### constructor

\+ **new Transport**(`sendOscMessage`: [*ISendOscMessage*](../interfaces/osc_messages.isendoscmessage.md)): [*Transport*](transport.transport-1.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `sendOscMessage` | [*ISendOscMessage*](../interfaces/osc_messages.isendoscmessage.md) |

**Returns:** [*Transport*](transport.transport-1.md)

Defined in: [Transport.ts:35](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L35)

## Properties

### \_handlers

• `Private` `Readonly` **\_handlers**: [*IMessageHandler*](../interfaces/osc_handlers.imessagehandler.md)[]

Defined in: [Transport.ts:26](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L26)

___

### \_isFastForwarding

• `Private` **\_isFastForwarding**: *boolean*= false

Defined in: [Transport.ts:9](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L9)

___

### \_isPlaying

• `Private` **\_isPlaying**: *boolean*= false

Defined in: [Transport.ts:12](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L12)

___

### \_isRecording

• `Private` **\_isRecording**: *boolean*= false

Defined in: [Transport.ts:15](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L15)

___

### \_isRepeatEnabled

• `Private` **\_isRepeatEnabled**: *boolean*= false

Defined in: [Transport.ts:18](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L18)

___

### \_isRewinding

• `Private` **\_isRewinding**: *boolean*= false

Defined in: [Transport.ts:21](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L21)

___

### \_isStopped

• `Private` **\_isStopped**: *boolean*= false

Defined in: [Transport.ts:24](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L24)

___

### \_sendOscMessage

• `Private` `Readonly` **\_sendOscMessage**: [*ISendOscMessage*](../interfaces/osc_messages.isendoscmessage.md)

Defined in: [Transport.ts:35](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L35)

## Accessors

### isFastForwarding

• get **isFastForwarding**(): *boolean*

**Returns:** *boolean*

Defined in: [Transport.ts:57](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L57)

___

### isPlaying

• get **isPlaying**(): *boolean*

**Returns:** *boolean*

Defined in: [Transport.ts:41](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L41)

___

### isRecording

• get **isRecording**(): *boolean*

**Returns:** *boolean*

Defined in: [Transport.ts:49](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L49)

___

### isRepeatEnabled

• get **isRepeatEnabled**(): *boolean*

**Returns:** *boolean*

Defined in: [Transport.ts:61](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L61)

___

### isRewinding

• get **isRewinding**(): *boolean*

**Returns:** *boolean*

Defined in: [Transport.ts:53](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L53)

___

### isStopped

• get **isStopped**(): *boolean*

**Returns:** *boolean*

Defined in: [Transport.ts:45](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L45)

___

### onPropertyChanged

• get **onPropertyChanged**(): *IEvent*<[*Transport*](transport.transport-1.md), string\>

An event that can be subscribed to for property change notifications

**Returns:** *IEvent*<[*Transport*](transport.transport-1.md), string\>

Implementation of: [INotifyPropertyChanged](../interfaces/notify_notify.inotifypropertychanged.md).[onPropertyChanged](../interfaces/notify_notify.inotifypropertychanged.md#onpropertychanged)

Defined in: [Transport.ts:117](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L117)

## Methods

### pause

▸ **pause**(): *void*

Toggle pause

**Returns:** *void*

Defined in: [Transport.ts:66](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L66)

___

### play

▸ **play**(): *void*

Toggle play

**Returns:** *void*

Defined in: [Transport.ts:71](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L71)

___

### receive

▸ **receive**(`message`: [*OscMessage*](osc_messages.oscmessage.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [*OscMessage*](osc_messages.oscmessage.md) |

**Returns:** *void*

Defined in: [Transport.ts:76](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L76)

___

### record

▸ **record**(): *void*

Toggle recording

**Returns:** *void*

Defined in: [Transport.ts:83](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L83)

___

### startFastForwarding

▸ **startFastForwarding**(): *void*

Start fast fowarding. Will continue until stopped

**Returns:** *void*

Defined in: [Transport.ts:88](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L88)

___

### startRewinding

▸ **startRewinding**(): *void*

Start rewinding. Will continue until stopped

**Returns:** *void*

Defined in: [Transport.ts:93](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L93)

___

### stop

▸ **stop**(): *void*

Stop playback or recording

**Returns:** *void*

Defined in: [Transport.ts:98](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L98)

___

### stopFastForwarding

▸ **stopFastForwarding**(): *void*

Stop fast forwarding

**Returns:** *void*

Defined in: [Transport.ts:103](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L103)

___

### stopRewinding

▸ **stopRewinding**(): *void*

Stop rewinding

**Returns:** *void*

Defined in: [Transport.ts:108](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L108)

___

### toggleRepeat

▸ **toggleRepeat**(): *void*

Toggle repeat on or off

**Returns:** *void*

Defined in: [Transport.ts:113](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/Transport.ts#L113)
