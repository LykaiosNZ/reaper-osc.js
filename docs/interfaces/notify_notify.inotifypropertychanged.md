[reaper-osc](../README.md) / [Exports](../modules.md) / [notify/Notify](../modules/notify_notify.md) / INotifyPropertyChanged

# Interface: INotifyPropertyChanged<T\>

[notify/Notify](../modules/notify_notify.md).INotifyPropertyChanged

Allows a subscriber to be notified of changes to the object's properties

## Type parameters

| Name |
| :------ |
| `T` |

## Implemented by

- [*Fx*](../classes/fx.fx-1.md)
- [*Reaper*](../classes/reaper.reaper-1.md)
- [*Track*](../classes/tracks.track.md)
- [*Transport*](../classes/transport.transport-1.md)

## Table of contents

### Properties

- [onPropertyChanged](notify_notify.inotifypropertychanged.md#onpropertychanged)

## Properties

### onPropertyChanged

• **onPropertyChanged**: *IEvent*<T, string\>

An event that can be subscribed to for property change notifications

Defined in: [notify/Notify.ts:10](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/notify/Notify.ts#L10)
