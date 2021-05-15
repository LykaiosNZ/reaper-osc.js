/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {EventDispatcher, IEvent} from 'ste-events';

/** Allows a subscriber to be notified of changes to the object's properties */
export interface INotifyPropertyChanged<T> {
  /** An event that can be subscribed to for property change notifications */
  onPropertyChanged: IEvent<T, string>;
}

/**
 * Changes to the property will cause an event containing the name of the property to be fired by {@link INotifyPropertyChanged.onPropertyChanged}.
 * Initializing the property will trigger the event.
 *
 * @remarks
 * Requires {@link notifyOnPropertyChanged} decorator on the class
 *
 * @param overrideName Use to specify a different property name in the event. Useful for notifying changes to a get-only property from a change to a private backing file
 */
export function notify<T>(overrideName?: keyof T) {
  return (target: Object, propertyKey: string): void => {
    // Create a new prop to hold the value
    const valueKey = `_${propertyKey}Notify`;

    // Replace the decorated prop with getter/setter that handles the notifications
    Object.defineProperty(target, valueKey, {
      set(value) {
        // Unfortunately property decorators are applied before class ones, so check here
        if (this._propertyChanged === undefined) {
          throw new Error('Class does not have notifyOnPropertyChanged decorator applied.');
        }

        const oldValue = this[propertyKey];

        if (value === oldValue) {
          return;
        }

        this[valueKey] = value;

        const propertyName = overrideName ? overrideName : propertyKey;

        this._propertyChanged.dispatch(this, propertyName);
      },
      get() {
        return this[valueKey];
      },
    });
  };
}

/**
 * Adds an implementation of {@link INotifyPropertyChanged.onPropertyChanged} to the class.
 *
 * @remarks
 * Use in conjunction with {@link INotifyPropertyChanged} and decorating properties with {@link notify}
 */
export function notifyOnPropertyChanged<T extends {new (...args: any[]): {}}>(constructor: T): T {
  return class extends constructor {
    private readonly _propertyChanged = new EventDispatcher<T, string>();

    public get onPropertyChanged() {
      return this._propertyChanged.asEvent();
    }
  };
}
