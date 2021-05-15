/** 
 * Contains classes for controlling Reaper's transport
 * @module
 */

import {IEvent} from 'ste-events';
import {INotifyPropertyChanged, notify, notifyOnPropertyChanged} from './notify/Notify';
import {BooleanMessageHandler, IMessageHandler} from './osc/Handlers';
import {BooleanMessage, ISendOscMessage, OscMessage} from './osc/Messages';

@notifyOnPropertyChanged
export class Transport implements INotifyPropertyChanged<Transport> {
  @notify<Transport>('isFastForwarding')
  private _isFastForwarding = false;

  @notify<Transport>('isPlaying')
  private _isPlaying = false;

  @notify<Transport>('isRecording')
  private _isRecording = false;

  @notify<Transport>('isRepeatEnabled')
  private _isRepeatEnabled = false;

  @notify<Transport>('isRewinding')
  private _isRewinding = false;

  @notify<Transport>('isStopped')
  private _isStopped = false;

  private readonly _handlers: IMessageHandler[] = [
    new BooleanMessageHandler('/repeat', value => (this._isRepeatEnabled = value)),
    new BooleanMessageHandler('/record', value => (this._isRecording = value)),
    new BooleanMessageHandler('/stop', value => (this._isStopped = value)),
    new BooleanMessageHandler('/play', value => (this._isPlaying = value)),
    new BooleanMessageHandler('/rewind', value => (this._isRewinding = value)),
    new BooleanMessageHandler('/forward', value => (this._isFastForwarding = value)),
  ];

  private readonly _sendOscMessage: ISendOscMessage;

  constructor(sendOscMessage: ISendOscMessage) {
    this._sendOscMessage = sendOscMessage;
  }

  public get isPlaying(): boolean {
    return this._isPlaying;
  }

  public get isStopped(): boolean {
    return this._isStopped;
  }

  public get isRecording(): boolean {
    return this._isRecording;
  }

  public get isRewinding(): boolean {
    return this._isRewinding;
  }

  public get isFastForwarding(): boolean {
    return this._isFastForwarding;
  }

  public get isRepeatEnabled(): boolean {
    return this._isRepeatEnabled;
  }

  /** Toggle pause */
  public pause(): void {
    this._sendOscMessage(new OscMessage('/pause'));
  }

  /** Toggle play */
  public play(): void {
    this._sendOscMessage(new OscMessage('/play'));
  }

  // Receive an OSC message
  public receive(message: OscMessage): void {
    this._handlers.forEach(handler => {
      handler.handle(message);
    });
  }

  /** Toggle recording */
  public record(): void {
    this._sendOscMessage(new OscMessage('/record'));
  }

  /** Start fast fowarding. Will continue until stopped */
  public startFastForwarding(): void {
    this._sendOscMessage(new BooleanMessage('/forward', true));
  }

  /** Start rewinding. Will continue until stopped */
  public startRewinding(): void {
    this._sendOscMessage(new BooleanMessage('/rewind', true));
  }

  /** Stop playback or recording */
  public stop(): void {
    this._sendOscMessage(new OscMessage('/stop'));
  }

  /** Stop fast forwarding */
  public stopFastForwarding(): void {
    this._sendOscMessage(new BooleanMessage('/foward', false));
  }

  /** Stop rewinding */
  public stopRewinding(): void {
    this._sendOscMessage(new BooleanMessage('/rewind', false));
  }

  /** Toggle repeat on or off */
  public toggleRepeat(): void {
    this._sendOscMessage(new OscMessage('/repeaer'));
  }

  public get onPropertyChanged(): IEvent<Transport, string> {
    throw new Error('not implemented');
  }
}
