import * as osc from 'osc';
import {OscMessage, FloatArgument} from '../dist/Messages';
import {ReaperOscClient} from '../dist/Client/Client';
import {ReaperConfiguration} from '../dist/Config';
import {ReaperOscEvent} from '../dist/Client/Events';
import {commandToOscMessage} from '../dist/Client/Commands';

// --- Test helpers ---

let testOsc: any;
let client: ReaperOscClient;

beforeEach(() => {
  testOsc = new osc.UDPPort({
    localAddress: '127.0.0.1',
    localPort: 64236,
    remoteAddress: '127.0.0.1',
    remotePort: 49587,
    broadcast: true,
    metadata: true,
  });

  const config = new ReaperConfiguration();
  config.localAddress = '127.0.0.1';
  config.localPort = 49587;
  config.remoteAddress = '127.0.0.1';
  config.remotePort = 64236;

  client = new ReaperOscClient(config);
});

afterEach(async () => {
  testOsc.close();
  await client.stop();
});

function sendFromReaper(address: string, args?: any[]): void {
  testOsc.send({address, args: args ?? []});
}

function waitForEvent(): Promise<ReaperOscEvent> {
  return new Promise(resolve => {
    client.once('message', resolve);
  });
}

async function startBoth(): Promise<void> {
  const testReady = new Promise<void>(resolve => {
    testOsc.once('ready', resolve);
  });
  testOsc.open();
  await testReady;
  await client.start();
}

// --- Lifecycle tests ---

test('should be ready after starting', async () => {
  await startBoth();
  expect(client.isReady).toBeTruthy();
});

test('should not be ready after stopping', async () => {
  await startBoth();
  await client.stop();
  expect(client.isReady).toBeFalsy();
});

test('sendRaw should throw when not ready', () => {
  expect(() => client.sendRaw(new OscMessage('/test'))).toThrow(Error);
});

// --- Event parsing tests ---

describe('event parsing', () => {
  // Global events
  test.each([
    ['/click', [{type: 'i', value: 1}], {type: 'metronome', enabled: true}],
    ['/click', [{type: 'i', value: 0}], {type: 'metronome', enabled: false}],
    ['/autorecarm', [{type: 'i', value: 1}], {type: 'autoRecArm', enabled: true}],
    ['/anysolo', [{type: 'i', value: 1}], {type: 'anySolo', active: true}],
  ] as [string, any[], ReaperOscEvent][])(
    'parses global message %s',
    async (address, args, expected) => {
      await startBoth();
      const eventPromise = waitForEvent();
      sendFromReaper(address, args);
      const event = await eventPromise;
      expect(event).toEqual(expected);
    }
  );

  // Transport events
  test.each([
    ['/play', [{type: 'i', value: 1}], {type: 'transport:play', playing: true}],
    ['/stop', [{type: 'i', value: 1}], {type: 'transport:stop', stopped: true}],
    ['/pause', [{type: 'i', value: 1}], {type: 'transport:pause', paused: true}],
    ['/record', [{type: 'i', value: 1}], {type: 'transport:record', recording: true}],
    ['/rewind', [{type: 'i', value: 0}], {type: 'transport:rewind', rewinding: false}],
    ['/forward', [{type: 'i', value: 1}], {type: 'transport:fastForward', fastForwarding: true}],
    ['/repeat', [{type: 'i', value: 1}], {type: 'transport:repeat', enabled: true}],
    ['/time', [{type: 'f', value: 120.5}], {type: 'transport:time', time: 120.5}],
    ['/beat/str', [{type: 's', value: '4.1.00'}], {type: 'transport:beat', beat: '4.1.00'}],
    ['/frames/str', [{type: 's', value: '00:02:00:15'}], {type: 'transport:frames', frames: '00:02:00:15'}],
    ['/loop/start/time', [{type: 'f', value: 10.0}], {type: 'transport:loopStart', time: 10.0}],
    ['/loop/end/time', [{type: 'f', value: 20.0}], {type: 'transport:loopEnd', time: 20.0}],
  ] as [string, any[], ReaperOscEvent][])(
    'parses transport message %s',
    async (address, args, expected) => {
      await startBoth();
      const eventPromise = waitForEvent();
      sendFromReaper(address, args);
      const event = await eventPromise;
      expect(event).toEqual(expected);
    }
  );

  // Track events
  test.each([
    ['/track/3/mute', [{type: 'i', value: 1}], {type: 'track:mute', trackNumber: 3, muted: true}],
    ['/track/3/solo', [{type: 'i', value: 0}], {type: 'track:solo', trackNumber: 3, soloed: false}],
    ['/track/1/recarm', [{type: 'i', value: 1}], {type: 'track:recarm', trackNumber: 1, armed: true}],
    ['/track/2/select', [{type: 'i', value: 1}], {type: 'track:select', trackNumber: 2, selected: true}],
    ['/track/1/name', [{type: 's', value: 'Guitar'}], {type: 'track:name', trackNumber: 1, name: 'Guitar'}],
    ['/track/1/pan', [{type: 'f', value: -0.5}], {type: 'track:pan', trackNumber: 1, pan: -0.5}],
    ['/track/1/pan2', [{type: 'f', value: 0.25}], {type: 'track:pan2', trackNumber: 1, pan2: 0.25}],
    ['/track/1/panmode', [{type: 's', value: 'Stereo Balance'}], {type: 'track:panMode', trackNumber: 1, panMode: 'Stereo Balance'}],
    ['/track/1/volume', [{type: 'f', value: 0.75}], {type: 'track:volume', trackNumber: 1, volume: 0.75}],
    ['/track/1/volume/db', [{type: 'f', value: -6.0}], {type: 'track:volumeDb', trackNumber: 1, volumeDb: -6.0}],
    ['/track/1/vu', [{type: 'f', value: 0.5}], {type: 'track:vu', trackNumber: 1, vu: 0.5}],
    ['/track/1/vu/L', [{type: 'f', value: 0.25}], {type: 'track:vuLeft', trackNumber: 1, vuLeft: 0.25}],
    ['/track/1/vu/R', [{type: 'f', value: 0.5}], {type: 'track:vuRight', trackNumber: 1, vuRight: 0.5}],
    ['/track/1/monitor', [{type: 'f', value: 2}], {type: 'track:monitor', trackNumber: 1, monitor: 2}],
  ] as [string, any[], ReaperOscEvent][])(
    'parses track message %s',
    async (address, args, expected) => {
      await startBoth();
      const eventPromise = waitForEvent();
      sendFromReaper(address, args);
      const event = await eventPromise;
      expect(event).toEqual(expected);
    }
  );

  // Track FX events
  test.each([
    ['/track/1/fx/2/name', [{type: 's', value: 'ReaEQ'}], {type: 'track:fx:name', trackNumber: 1, fxNumber: 2, name: 'ReaEQ'}],
    ['/track/1/fx/2/bypass', [{type: 'i', value: 0}], {type: 'track:fx:bypass', trackNumber: 1, fxNumber: 2, bypassed: true}],
    ['/track/1/fx/2/bypass', [{type: 'i', value: 1}], {type: 'track:fx:bypass', trackNumber: 1, fxNumber: 2, bypassed: false}],
    ['/track/1/fx/2/openui', [{type: 'i', value: 1}], {type: 'track:fx:openUi', trackNumber: 1, fxNumber: 2, open: true}],
    ['/track/1/fx/2/preset', [{type: 's', value: 'Default'}], {type: 'track:fx:preset', trackNumber: 1, fxNumber: 2, preset: 'Default'}],
  ] as [string, any[], ReaperOscEvent][])(
    'parses track FX message %s',
    async (address, args, expected) => {
      await startBoth();
      const eventPromise = waitForEvent();
      sendFromReaper(address, args);
      const event = await eventPromise;
      expect(event).toEqual(expected);
    }
  );

  // Selected track events
  test.each([
    ['/track/mute', [{type: 'i', value: 1}], {type: 'selectedTrack:mute', muted: true}],
    ['/track/solo', [{type: 'i', value: 0}], {type: 'selectedTrack:solo', soloed: false}],
    ['/track/name', [{type: 's', value: 'Bass'}], {type: 'selectedTrack:name', name: 'Bass'}],
    ['/track/volume', [{type: 'f', value: 0.75}], {type: 'selectedTrack:volume', volume: 0.75}],
  ] as [string, any[], ReaperOscEvent][])(
    'parses selected track message %s',
    async (address, args, expected) => {
      await startBoth();
      const eventPromise = waitForEvent();
      sendFromReaper(address, args);
      const event = await eventPromise;
      expect(event).toEqual(expected);
    }
  );

  // Selected track FX events
  test.each([
    ['/fx/1/name', [{type: 's', value: 'Compressor'}], {type: 'selectedTrack:fx:name', fxNumber: 1, name: 'Compressor'}],
    ['/fx/1/bypass', [{type: 'i', value: 0}], {type: 'selectedTrack:fx:bypass', fxNumber: 1, bypassed: true}],
  ] as [string, any[], ReaperOscEvent][])(
    'parses selected track FX message %s',
    async (address, args, expected) => {
      await startBoth();
      const eventPromise = waitForEvent();
      sendFromReaper(address, args);
      const event = await eventPromise;
      expect(event).toEqual(expected);
    }
  );

  // Selected FX events (device-selected, no number)
  test.each([
    ['/fx/name', [{type: 's', value: 'Delay'}], {type: 'selectedFx:name', name: 'Delay'}],
    ['/fx/bypass', [{type: 'i', value: 0}], {type: 'selectedFx:bypass', bypassed: true}],
    ['/fx/openui', [{type: 'i', value: 1}], {type: 'selectedFx:openUi', open: true}],
    ['/fx/preset', [{type: 's', value: 'Preset1'}], {type: 'selectedFx:preset', preset: 'Preset1'}],
  ] as [string, any[], ReaperOscEvent][])(
    'parses selected FX message %s',
    async (address, args, expected) => {
      await startBoth();
      const eventPromise = waitForEvent();
      sendFromReaper(address, args);
      const event = await eventPromise;
      expect(event).toEqual(expected);
    }
  );

  // Unknown message
  test('parses unknown message', async () => {
    await startBoth();
    const eventPromise = waitForEvent();
    sendFromReaper('/unknown/address', [{type: 'i', value: 42}]);
    const event = await eventPromise;
    expect(event.type).toBe('unknown');
  });

  // rawMessage event
  test('emits rawMessage with OscMessage', async () => {
    await startBoth();
    const rawPromise = new Promise<OscMessage>(resolve => {
      client.once('rawMessage', resolve);
    });
    sendFromReaper('/play', [{type: 'i', value: 1}]);
    const raw = await rawPromise;
    expect(raw.address).toBe('/play');
  });
});

// --- Command translation tests (pure unit tests, no OSC) ---

describe('commandToOscMessage', () => {
  // Global commands
  test('metronome:toggle', () => {
    const msg = commandToOscMessage({type: 'metronome:toggle'});
    expect(msg.address).toBe('/click');
  });

  test('autoRecArm:toggle', () => {
    const msg = commandToOscMessage({type: 'autoRecArm:toggle'});
    expect(msg.address).toBe('/autorecarm');
  });

  test('soloReset', () => {
    const msg = commandToOscMessage({type: 'soloReset'});
    expect(msg.address).toBe('/soloreset');
  });

  test('action with number command ID', () => {
    const msg = commandToOscMessage({type: 'action', commandId: 41743});
    expect(msg.address).toBe('/action/str');
    expect(msg.args[0]?.value).toBe('41743');
  });

  test('action with string command ID and value', () => {
    const msg = commandToOscMessage({type: 'action', commandId: '_S&M_TEST', value: 3});
    expect(msg.address).toBe('/action/str');
    expect(msg.args[0]?.value).toBe('_S&M_TEST');
    expect(msg.args[1]?.value).toBe(3);
  });

  // Transport commands
  test('transport:play', () => {
    const msg = commandToOscMessage({type: 'transport:play'});
    expect(msg.address).toBe('/play');
  });

  test('transport:stop', () => {
    const msg = commandToOscMessage({type: 'transport:stop'});
    expect(msg.address).toBe('/stop');
  });

  test('transport:rewind with value', () => {
    const msg = commandToOscMessage({type: 'transport:rewind', rewinding: true});
    expect(msg.address).toBe('/rewind');
    expect(msg.args[0]?.value).toBe(1);
  });

  test('transport:time', () => {
    const msg = commandToOscMessage({type: 'transport:time', time: 60.5});
    expect(msg.address).toBe('/time');
    expect(msg.args[0]?.value).toBe(60.5);
  });

  test('transport:repeat:toggle', () => {
    const msg = commandToOscMessage({type: 'transport:repeat:toggle'});
    expect(msg.address).toBe('/repeat');
  });

  test('transport:loopStart', () => {
    const msg = commandToOscMessage({type: 'transport:loopStart', time: 10.0});
    expect(msg.address).toBe('/loop/start/time');
  });

  test('transport:loopEnd', () => {
    const msg = commandToOscMessage({type: 'transport:loopEnd', time: 20.0});
    expect(msg.address).toBe('/loop/end/time');
  });

  // Track commands
  test('track:mute', () => {
    const msg = commandToOscMessage({type: 'track:mute', trackNumber: 3, muted: true});
    expect(msg.address).toBe('/track/3/mute');
    expect(msg.args[0]?.value).toBe(1);
  });

  test('track:mute:toggle', () => {
    const msg = commandToOscMessage({type: 'track:mute:toggle', trackNumber: 3});
    expect(msg.address).toBe('/track/3/mute/toggle');
  });

  test('track:volume', () => {
    const msg = commandToOscMessage({type: 'track:volume', trackNumber: 1, volume: 0.75});
    expect(msg.address).toBe('/track/1/volume');
    expect(msg.args[0]?.value).toBe(0.75);
  });

  test('track:volumeDb', () => {
    const msg = commandToOscMessage({type: 'track:volumeDb', trackNumber: 1, volumeDb: -6.0});
    expect(msg.address).toBe('/track/1/volume/db');
  });

  test('track:name', () => {
    const msg = commandToOscMessage({type: 'track:name', trackNumber: 1, name: 'Guitar'});
    expect(msg.address).toBe('/track/1/name');
    expect(msg.args[0]?.value).toBe('Guitar');
  });

  test('track:monitor', () => {
    const msg = commandToOscMessage({type: 'track:monitor', trackNumber: 1, monitor: 2});
    expect(msg.address).toBe('/track/1/monitor');
    expect(msg.args[0]?.value).toBe(2);
  });

  // Track FX commands (bypass inverted)
  test('track:fx:bypass sends inverted value', () => {
    const msg = commandToOscMessage({type: 'track:fx:bypass', trackNumber: 1, fxNumber: 2, bypassed: true});
    expect(msg.address).toBe('/track/1/fx/2/bypass');
    expect(msg.args[0]?.value).toBe(0); // inverted: bypassed=true → 0 on wire
  });

  test('track:fx:openUi', () => {
    const msg = commandToOscMessage({type: 'track:fx:openUi', trackNumber: 1, fxNumber: 2, open: true});
    expect(msg.address).toBe('/track/1/fx/2/openui');
  });

  test('track:fx:preset:next', () => {
    const msg = commandToOscMessage({type: 'track:fx:preset:next', trackNumber: 1, fxNumber: 2});
    expect(msg.address).toBe('/track/1/fx/2/preset+');
  });

  test('track:fx:preset:prev', () => {
    const msg = commandToOscMessage({type: 'track:fx:preset:prev', trackNumber: 1, fxNumber: 2});
    expect(msg.address).toBe('/track/1/fx/2/preset-');
  });

  // Selected track commands
  test('selectedTrack:mute', () => {
    const msg = commandToOscMessage({type: 'selectedTrack:mute', muted: true});
    expect(msg.address).toBe('/track/mute');
  });

  test('selectedTrack:mute:toggle', () => {
    const msg = commandToOscMessage({type: 'selectedTrack:mute:toggle'});
    expect(msg.address).toBe('/track/mute/toggle');
  });

  test('selectedTrack:volume', () => {
    const msg = commandToOscMessage({type: 'selectedTrack:volume', volume: 0.5});
    expect(msg.address).toBe('/track/volume');
  });

  // Selected track FX commands (bypass inverted)
  test('selectedTrack:fx:bypass sends inverted value', () => {
    const msg = commandToOscMessage({type: 'selectedTrack:fx:bypass', fxNumber: 1, bypassed: true});
    expect(msg.address).toBe('/fx/1/bypass');
    expect(msg.args[0]?.value).toBe(0);
  });

  // Selected FX commands (bypass inverted)
  test('selectedFx:bypass sends inverted value', () => {
    const msg = commandToOscMessage({type: 'selectedFx:bypass', bypassed: true});
    expect(msg.address).toBe('/fx/bypass');
    expect(msg.args[0]?.value).toBe(0);
  });

  test('selectedFx:preset:next', () => {
    const msg = commandToOscMessage({type: 'selectedFx:preset:next'});
    expect(msg.address).toBe('/fx/preset+');
  });

  // Device navigation commands
  test('device:track:select', () => {
    const msg = commandToOscMessage({type: 'device:track:select', index: 3});
    expect(msg.address).toBe('/device/track/select/3');
  });

  test('device:track:next', () => {
    const msg = commandToOscMessage({type: 'device:track:next'});
    expect(msg.address).toBe('/device/track/+');
  });

  test('device:trackBank:select', () => {
    const msg = commandToOscMessage({type: 'device:trackBank:select', index: 2});
    expect(msg.address).toBe('/device/track/bank/select/2');
  });

  test('device:fx:select', () => {
    const msg = commandToOscMessage({type: 'device:fx:select', index: 1});
    expect(msg.address).toBe('/device/fx/select/1');
  });

  test('device:fxParamBank:next', () => {
    const msg = commandToOscMessage({type: 'device:fxParamBank:next'});
    expect(msg.address).toBe('/device/fxparam/bank/+');
  });

  test('device:markerBank:select', () => {
    const msg = commandToOscMessage({type: 'device:markerBank:select', index: 5});
    expect(msg.address).toBe('/device/marker/bank/select/5');
  });

  test('device:regionBank:prev', () => {
    const msg = commandToOscMessage({type: 'device:regionBank:prev'});
    expect(msg.address).toBe('/device/region/bank/-');
  });

  // Raw command
  test('raw command passes through', () => {
    const rawMsg = new OscMessage('/custom/address', [FloatArgument(42.0)]);
    const msg = commandToOscMessage({type: 'raw', message: rawMsg});
    expect(msg).toBe(rawMsg);
  });
});

// --- Send command integration test ---

describe('send', () => {
  test('sends typed command as OSC message', async () => {
    await startBoth();

    const receivedPromise = new Promise<any>(resolve => {
      testOsc.once('message', (msg: any) => resolve(msg));
    });

    client.send({type: 'transport:play'});

    const received = await receivedPromise;
    expect(received.address).toBe('/play');
  });
});
