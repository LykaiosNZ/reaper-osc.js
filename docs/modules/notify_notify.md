[reaper-osc](../README.md) / [Exports](../modules.md) / notify/Notify

# Module: notify/Notify

## Table of contents

### Interfaces

- [INotifyPropertyChanged](../interfaces/notify_notify.inotifypropertychanged.md)

### Functions

- [notify](notify_notify.md#notify)
- [notifyOnPropertyChanged](notify_notify.md#notifyonpropertychanged)

## Functions

### notify

▸ **notify**<T\>(`overrideName?`: keyof T): *function*

Changes to the property will cause an event containing the name of the property to be fired by [INotifyPropertyChanged.onPropertyChanged](../interfaces/notify_notify.inotifypropertychanged.md#onpropertychanged).
Initializing the property will trigger the event.

**`remarks`**
Requires [notifyOnPropertyChanged](notify_notify.md#notifyonpropertychanged) decorator on the class

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `overrideName?` | keyof T | Use to specify a different property name in the event. Useful for notifying changes to a get-only property from a change to a private backing file |

**Returns:** (`target`: *any*, `propertyKey`: *string*) => *void*

Defined in: [notify/Notify.ts:22](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/notify/Notify.ts#L22)

___

### notifyOnPropertyChanged

▸ **notifyOnPropertyChanged**<T\>(`constructor`: T): T

Adds an implementation of [INotifyPropertyChanged.onPropertyChanged](../interfaces/notify_notify.inotifypropertychanged.md#onpropertychanged) to the class.

**`remarks`**
Use in conjunction with [INotifyPropertyChanged](../interfaces/notify_notify.inotifypropertychanged.md) and decorating properties with [notify](notify_notify.md#notify)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | (...`args`: *any*[]) => {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `constructor` | T |

**Returns:** T

Defined in: [notify/Notify.ts:60](https://github.com/LykaiosNZ/reaper-osc.js/blob/7ba97a3/src/notify/Notify.ts#L60)
