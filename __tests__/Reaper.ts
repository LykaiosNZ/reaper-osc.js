import * as osc from 'osc';
import {BooleanMessage, FloatArgument, IntegerMessage, OscArgument, OscMessage, StringArgument, StringMessage} from '../dist/Messages';
import {Reaper, ReaperConfiguration} from '../dist/Reaper';

let testOsc: any;
let reaper: Reaper;

beforeEach(() => {
  testOsc = setUpOsc();
  reaper = setUpReaper();
});

afterEach(done => {
  testOsc.close();
  reaper.stopOsc();

  setTimeout(() => done(), 10);
});

test('should be ready after onReady fires', done => {
  reaper.onReady(() => {
    expect(reaper.isReady).toBeTruthy();
    done();
  });

  reaper.startOsc();
});

test('has expected number of tracks', () => {
  expect(reaper.tracks.length).toBe(8);
});

test('tracks are numbered correctly', () => {
  reaper.tracks.forEach((track, index) => {
    expect(track.trackNumber).toBe(index + 1);
  });
});

test('has master track with track number 0', () => {
  expect(reaper.master.trackNumber).toBe(0);
});

test('sendOscMessage should throw when not ready', () => {
  expect(() => reaper.sendOscMessage(new StringMessage('/test', 'foo'))).toThrow(Error);
});

test.each([-1, 128])('triggerAction should throw when value is less than 0 or greater than 127', value => {
  expect(() => reaper.triggerAction(1, value)).toThrow(RangeError);
});

describe('properties set by messages', () => {
  test.each([true, false])('click message sets isMetronomeEnabled: %p', (value, done: any) => {
    reaper.startOsc();
    testOsc.open();

    const message = new BooleanMessage('/click', value);

    testOsc.send(message);

    setTimeout(() => {
      expect(reaper.isMetronomeEnabled).toBe(value);
      done();
    }, 10);
  });
});

describe('methods send expected messages', () => {
  test('toggleMetronome sends expected message', done => {
    expectOscMessage(() => reaper.toggleMetronome(), {address: '/click', args: []}, done);
  });

  test('refreshControlSurfaces sends expected message', done => {
    expectOscMessage(() => reaper.refreshControlSurfaces(), {address: '/action/str', args: [new StringArgument('41743')]}, done);
  });

  test.each(['foo', 1234])('triggerAction sends expected message: %p', (commandId, done: any) => {
    expectOscMessage(() => reaper.triggerAction(commandId), {address: '/action/str', args: [new StringArgument(commandId.toString())]}, done);
  });

  test('triggerAction sends expected additional args', done => {
    const commandId = 'foo';
    const value = 127;
    const expectedArgs = [new StringArgument(commandId.toString()), new FloatArgument(value)];
    expectOscMessage(() => reaper.triggerAction(commandId, value), {address: '/action/str', args: expectedArgs}, done);
  });

  test.each([new StringMessage('/string', 'foo'), new IntegerMessage('/int', 1234)])('sendOscMessage sends expected message: %p', (message, done: any) => {
    expectOscMessage(() => reaper.sendOscMessage(message), {address: message.address, args: message.args}, done);
  });
});

function expectOscMessage(fn: () => void, expected: {address: string; args: OscArgument<unknown>[]}, done: jest.DoneCallback) {
  testOsc.on('message', (message: OscMessage) => {
    try {
      expect(message).toMatchObject(expected);
      done();
    } catch (error) {
      done(error);
    }
  });

  reaper.onReady(() => {
    fn();
  });

  reaper.startOsc();
  testOsc.open();
}

function setUpOsc() {
  const testPort = new osc.UDPPort({
    localAddress: '127.0.0.1',
    localPort: 64235,
    remoteAddress: '127.0.0.1',
    remotePort: 49586,
    broadcast: true,
    metadata: true,
  });

  return testPort;
}

function setUpReaper() {
  const config = new ReaperConfiguration();

  config.localAddress = '127.0.0.1';
  config.localPort = 49586;
  config.remoteAddress = '127.0.0.1';
  config.remotePort = 64235;

  return new Reaper(config);
}
