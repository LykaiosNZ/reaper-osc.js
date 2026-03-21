import * as osc from 'osc';
import {OscMessage, FloatArgument} from '../dist/Messages';
import {ReaperOscClient} from '../dist/Client/Client';
import {ReaperConfiguration} from '../dist/Config';
import {
  ReaperOscEvent,
  MetronomeEvent, AutoRecordArmEvent, AnySoloEvent,
  PlayEvent, StopEvent, PauseEvent, RecordEvent, RewindEvent, FastForwardEvent, RepeatEvent,
  TimeChanged, BeatChanged, FramesChanged, LoopStartChanged, LoopEndChanged,
  TrackMuteEvent, TrackSoloEvent, TrackRecArmEvent, TrackSelectEvent, TrackNameChanged,
  TrackPanChanged, TrackPan2Changed, TrackPanModeChanged,
  TrackVolumeChanged, TrackVolumeDbChanged, TrackVuChanged, TrackVuLeftChanged, TrackVuRightChanged,
  TrackMonitorChanged,
  TrackFxNameChanged, TrackFxBypassEvent, TrackFxOpenUiEvent, TrackFxPresetChanged,
  SelectedTrackMuteEvent, SelectedTrackSoloEvent, SelectedTrackNameChanged, SelectedTrackVolumeChanged,
  SelectedTrackFxNameChanged, SelectedTrackFxBypassEvent,
  SelectedFxNameChanged, SelectedFxBypassEvent, SelectedFxOpenUiEvent, SelectedFxPresetChanged,
} from '../dist/Client/Events';
import {
  commandToOscMessage,
  ToggleMetronome, ToggleAutoRecordArm, ResetSolos, TriggerAction,
  Play, Stop, Pause, SetRewind, ToggleRepeat, SetTime, SetFrames, SetLoopStart, SetLoopEnd,
  SetTrackMute, ToggleTrackMute, SetTrackVolume, SetTrackVolumeDb, SetTrackName, SetTrackMonitor,
  SetTrackFxBypass, SetTrackFxOpenUi, NextTrackFxPreset, PrevTrackFxPreset,
  SetSelectedTrackMute, ToggleSelectedTrackMute, SetSelectedTrackVolume,
  SetSelectedTrackFxBypass,
  SetSelectedFxBypass, NextSelectedFxPreset,
  SelectDeviceTrack, NextDeviceTrack, SelectDeviceTrackBank,
  SelectDeviceFx, NextDeviceFxParamBank, SelectDeviceMarkerBank, PreviousDeviceRegionBank,
  RawMessage,
} from '../dist/Client/Commands';

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
    ['/click', [{type: 'i', value: 1}], MetronomeEvent(true)],
    ['/click', [{type: 'i', value: 0}], MetronomeEvent(false)],
    ['/autorecarm', [{type: 'i', value: 1}], AutoRecordArmEvent(true)],
    ['/anysolo', [{type: 'i', value: 1}], AnySoloEvent(true)],
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
    ['/play', [{type: 'i', value: 1}], PlayEvent(true)],
    ['/stop', [{type: 'i', value: 1}], StopEvent(true)],
    ['/pause', [{type: 'i', value: 1}], PauseEvent(true)],
    ['/record', [{type: 'i', value: 1}], RecordEvent(true)],
    ['/rewind', [{type: 'i', value: 0}], RewindEvent(false)],
    ['/forward', [{type: 'i', value: 1}], FastForwardEvent(true)],
    ['/repeat', [{type: 'i', value: 1}], RepeatEvent(true)],
    ['/time', [{type: 'f', value: 120.5}], TimeChanged(120.5)],
    ['/beat/str', [{type: 's', value: '4.1.00'}], BeatChanged('4.1.00')],
    ['/frames/str', [{type: 's', value: '00:02:00:15'}], FramesChanged('00:02:00:15')],
    ['/loop/start/time', [{type: 'f', value: 10.0}], LoopStartChanged(10.0)],
    ['/loop/end/time', [{type: 'f', value: 20.0}], LoopEndChanged(20.0)],
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
    ['/track/3/mute', [{type: 'i', value: 1}], TrackMuteEvent(3, true)],
    ['/track/3/solo', [{type: 'i', value: 0}], TrackSoloEvent(3, false)],
    ['/track/1/recarm', [{type: 'i', value: 1}], TrackRecArmEvent(1, true)],
    ['/track/2/select', [{type: 'i', value: 1}], TrackSelectEvent(2, true)],
    ['/track/1/name', [{type: 's', value: 'Guitar'}], TrackNameChanged(1, 'Guitar')],
    ['/track/1/pan', [{type: 'f', value: -0.5}], TrackPanChanged(1, -0.5)],
    ['/track/1/pan2', [{type: 'f', value: 0.25}], TrackPan2Changed(1, 0.25)],
    ['/track/1/panmode', [{type: 's', value: 'Stereo Balance'}], TrackPanModeChanged(1, 'Stereo Balance')],
    ['/track/1/volume', [{type: 'f', value: 0.75}], TrackVolumeChanged(1, 0.75)],
    ['/track/1/volume/db', [{type: 'f', value: -6.0}], TrackVolumeDbChanged(1, -6.0)],
    ['/track/1/vu', [{type: 'f', value: 0.5}], TrackVuChanged(1, 0.5)],
    ['/track/1/vu/L', [{type: 'f', value: 0.25}], TrackVuLeftChanged(1, 0.25)],
    ['/track/1/vu/R', [{type: 'f', value: 0.5}], TrackVuRightChanged(1, 0.5)],
    ['/track/1/monitor', [{type: 'f', value: 2}], TrackMonitorChanged(1, 2)],
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
    ['/track/1/fx/2/name', [{type: 's', value: 'ReaEQ'}], TrackFxNameChanged(1, 2, 'ReaEQ')],
    ['/track/1/fx/2/bypass', [{type: 'i', value: 0}], TrackFxBypassEvent(1, 2, true)],
    ['/track/1/fx/2/bypass', [{type: 'i', value: 1}], TrackFxBypassEvent(1, 2, false)],
    ['/track/1/fx/2/openui', [{type: 'i', value: 1}], TrackFxOpenUiEvent(1, 2, true)],
    ['/track/1/fx/2/preset', [{type: 's', value: 'Default'}], TrackFxPresetChanged(1, 2, 'Default')],
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
    ['/track/mute', [{type: 'i', value: 1}], SelectedTrackMuteEvent(true)],
    ['/track/solo', [{type: 'i', value: 0}], SelectedTrackSoloEvent(false)],
    ['/track/name', [{type: 's', value: 'Bass'}], SelectedTrackNameChanged('Bass')],
    ['/track/volume', [{type: 'f', value: 0.75}], SelectedTrackVolumeChanged(0.75)],
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
    ['/fx/1/name', [{type: 's', value: 'Compressor'}], SelectedTrackFxNameChanged(1, 'Compressor')],
    ['/fx/1/bypass', [{type: 'i', value: 0}], SelectedTrackFxBypassEvent(1, true)],
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
    ['/fx/name', [{type: 's', value: 'Delay'}], SelectedFxNameChanged('Delay')],
    ['/fx/bypass', [{type: 'i', value: 0}], SelectedFxBypassEvent(true)],
    ['/fx/openui', [{type: 'i', value: 1}], SelectedFxOpenUiEvent(true)],
    ['/fx/preset', [{type: 's', value: 'Preset1'}], SelectedFxPresetChanged('Preset1')],
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
    const msg = commandToOscMessage(ToggleMetronome());
    expect(msg.address).toBe('/click');
  });

  test('autoRecArm:toggle', () => {
    const msg = commandToOscMessage(ToggleAutoRecordArm());
    expect(msg.address).toBe('/autorecarm');
  });

  test('soloReset', () => {
    const msg = commandToOscMessage(ResetSolos());
    expect(msg.address).toBe('/soloreset');
  });

  test('action with number command ID', () => {
    const msg = commandToOscMessage(TriggerAction(41743));
    expect(msg.address).toBe('/action/str');
    expect(msg.args[0]?.value).toBe('41743');
  });

  test('action with string command ID and value', () => {
    const msg = commandToOscMessage(TriggerAction('_S&M_TEST', 3));
    expect(msg.address).toBe('/action/str');
    expect(msg.args[0]?.value).toBe('_S&M_TEST');
    expect(msg.args[1]?.value).toBe(3);
  });

  // Transport commands
  test('transport:play', () => {
    const msg = commandToOscMessage(Play());
    expect(msg.address).toBe('/play');
  });

  test('transport:stop', () => {
    const msg = commandToOscMessage(Stop());
    expect(msg.address).toBe('/stop');
  });

  test('transport:rewind with value', () => {
    const msg = commandToOscMessage(SetRewind(true));
    expect(msg.address).toBe('/rewind');
    expect(msg.args[0]?.value).toBe(1);
  });

  test('transport:time', () => {
    const msg = commandToOscMessage(SetTime(60.5));
    expect(msg.address).toBe('/time');
    expect(msg.args[0]?.value).toBe(60.5);
  });

  test('transport:repeat:toggle', () => {
    const msg = commandToOscMessage(ToggleRepeat());
    expect(msg.address).toBe('/repeat');
  });

  test('transport:loopStart', () => {
    const msg = commandToOscMessage(SetLoopStart(10.0));
    expect(msg.address).toBe('/loop/start/time');
  });

  test('transport:loopEnd', () => {
    const msg = commandToOscMessage(SetLoopEnd(20.0));
    expect(msg.address).toBe('/loop/end/time');
  });

  // Track commands
  test('track:mute', () => {
    const msg = commandToOscMessage(SetTrackMute(3, true));
    expect(msg.address).toBe('/track/3/mute');
    expect(msg.args[0]?.value).toBe(1);
  });

  test('track:mute:toggle', () => {
    const msg = commandToOscMessage(ToggleTrackMute(3));
    expect(msg.address).toBe('/track/3/mute/toggle');
  });

  test('track:volume', () => {
    const msg = commandToOscMessage(SetTrackVolume(1, 0.75));
    expect(msg.address).toBe('/track/1/volume');
    expect(msg.args[0]?.value).toBe(0.75);
  });

  test('track:volumeDb', () => {
    const msg = commandToOscMessage(SetTrackVolumeDb(1, -6.0));
    expect(msg.address).toBe('/track/1/volume/db');
  });

  test('track:name', () => {
    const msg = commandToOscMessage(SetTrackName(1, 'Guitar'));
    expect(msg.address).toBe('/track/1/name');
    expect(msg.args[0]?.value).toBe('Guitar');
  });

  test('track:monitor', () => {
    const msg = commandToOscMessage(SetTrackMonitor(1, 2));
    expect(msg.address).toBe('/track/1/monitor');
    expect(msg.args[0]?.value).toBe(2);
  });

  // Track FX commands (bypass inverted)
  test('track:fx:bypass sends inverted value', () => {
    const msg = commandToOscMessage(SetTrackFxBypass(1, 2, true));
    expect(msg.address).toBe('/track/1/fx/2/bypass');
    expect(msg.args[0]?.value).toBe(0); // inverted: bypassed=true → 0 on wire
  });

  test('track:fx:openUi', () => {
    const msg = commandToOscMessage(SetTrackFxOpenUi(1, 2, true));
    expect(msg.address).toBe('/track/1/fx/2/openui');
  });

  test('track:fx:preset:next', () => {
    const msg = commandToOscMessage(NextTrackFxPreset(1, 2));
    expect(msg.address).toBe('/track/1/fx/2/preset+');
  });

  test('track:fx:preset:prev', () => {
    const msg = commandToOscMessage(PrevTrackFxPreset(1, 2));
    expect(msg.address).toBe('/track/1/fx/2/preset-');
  });

  // Selected track commands
  test('selectedTrack:mute', () => {
    const msg = commandToOscMessage(SetSelectedTrackMute(true));
    expect(msg.address).toBe('/track/mute');
  });

  test('selectedTrack:mute:toggle', () => {
    const msg = commandToOscMessage(ToggleSelectedTrackMute());
    expect(msg.address).toBe('/track/mute/toggle');
  });

  test('selectedTrack:volume', () => {
    const msg = commandToOscMessage(SetSelectedTrackVolume(0.5));
    expect(msg.address).toBe('/track/volume');
  });

  // Selected track FX commands (bypass inverted)
  test('selectedTrack:fx:bypass sends inverted value', () => {
    const msg = commandToOscMessage(SetSelectedTrackFxBypass(1, true));
    expect(msg.address).toBe('/fx/1/bypass');
    expect(msg.args[0]?.value).toBe(0);
  });

  // Selected FX commands (bypass inverted)
  test('selectedFx:bypass sends inverted value', () => {
    const msg = commandToOscMessage(SetSelectedFxBypass(true));
    expect(msg.address).toBe('/fx/bypass');
    expect(msg.args[0]?.value).toBe(0);
  });

  test('selectedFx:preset:next', () => {
    const msg = commandToOscMessage(NextSelectedFxPreset());
    expect(msg.address).toBe('/fx/preset+');
  });

  // Device navigation commands
  test('device:track:select', () => {
    const msg = commandToOscMessage(SelectDeviceTrack(3));
    expect(msg.address).toBe('/device/track/select/3');
  });

  test('device:track:next', () => {
    const msg = commandToOscMessage(NextDeviceTrack());
    expect(msg.address).toBe('/device/track/+');
  });

  test('device:trackBank:select', () => {
    const msg = commandToOscMessage(SelectDeviceTrackBank(2));
    expect(msg.address).toBe('/device/track/bank/select/2');
  });

  test('device:fx:select', () => {
    const msg = commandToOscMessage(SelectDeviceFx(1));
    expect(msg.address).toBe('/device/fx/select/1');
  });

  test('device:fxParamBank:next', () => {
    const msg = commandToOscMessage(NextDeviceFxParamBank());
    expect(msg.address).toBe('/device/fxparam/bank/+');
  });

  test('device:markerBank:select', () => {
    const msg = commandToOscMessage(SelectDeviceMarkerBank(5));
    expect(msg.address).toBe('/device/marker/bank/select/5');
  });

  test('device:regionBank:prev', () => {
    const msg = commandToOscMessage(PreviousDeviceRegionBank());
    expect(msg.address).toBe('/device/region/bank/-');
  });

  // Raw command
  test('raw command passes through', () => {
    const rawMsg = new OscMessage('/custom/address', [FloatArgument(42.0)]);
    const msg = commandToOscMessage(RawMessage(rawMsg));
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

    client.send(Play());

    const received = await receivedPromise;
    expect(received.address).toBe('/play');
  });
});
