/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {SimpleEventDispatcher} from 'ste-simple-events';

/** Allows a subscriber to be notified of changes to the object's properties */
export interface INotifyPropertyChanged {
  /**
   * An event that can be subscribed to for property change notifications
   * @param property The name of the property to subscribe to
   * @param callback A callback to be called when the state of the specified property changes
   * @returns A function that unsubscribes the event handler
   */
  onPropertyChanged(property: string, callback: () => void): () => void;
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
    Object.defineProperty(target, propertyKey, {
      set(value) {
        const oldValue = this[propertyKey];

        if (value === oldValue) {
          return;
        }

        this[valueKey] = value;

        if (this._propertyChanged === undefined) {
          return;
        }

        const propertyName = overrideName ? overrideName : propertyKey;

        this._propertyChanged.dispatch(propertyName);
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
    private readonly _propertyChanged = new SimpleEventDispatcher<string>();

    public onPropertyChanged(property: string, callback: () => void): () => void {
      return this._propertyChanged.sub(prop => {
        if (property === prop) {
          callback();
        }
      });
    }
  };
}
