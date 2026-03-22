# reaper-osc

A Node.js library for controlling [Cockos Reaper](https://www.reaper.fm/) via [Open Sound Control (OSC)](http://opensoundcontrol.org/).

**[API Reference →](https://lykaiosnz.github.io/reaper-osc.js/)**

---

## Installation

```sh
npm install reaper-osc
# or
yarn add reaper-osc
```

---

## Reaper setup

You need to add an OSC control surface in Reaper before the library can communicate with it.

1. Open **Options → Preferences → Control/OSC/Web**
2. Click **Add** and choose **OSC (Open Sound Control)**
3. Configure the surface:

| Setting | Value |
|---|---|
| Mode | Configure device IP + local port |
| Device IP | IP address of the machine running your Node app |
| Device port | Port your app will listen on (e.g. `9000`) |
| Local listen port | Port Reaper will listen on for commands (e.g. `8000`) |
| Pattern config file | `reaper-osc-js.ReaperOSC` (copy from the `patterns/` directory) |

The pattern file in `patterns/reaper-osc-js.ReaperOSC` configures what Reaper sends and receives. Copy it to Reaper's OSC patterns directory (usually `<Reaper resource path>/OSC/`), then select it in the surface settings. After copying or editing the file, click **Edit → OK** to reload it.

---

## Configuration

The `ReaperConfiguration` class holds all connection settings. Every property has a sensible default so you only need to set what differs from your setup.

```js
import { Reaper, ReaperConfiguration } from 'reaper-osc';

const config = new ReaperConfiguration();
config.remoteAddress = '192.168.1.10'; // IP of the Reaper machine (default: 127.0.0.1)
config.remotePort = 8000;              // Reaper's OSC listen port (default: 8000)
config.localPort = 9000;              // Port this app listens on (default: 9000)
config.numberOfTracks = 8;            // Tracks per bank (default: 8, must match pattern file)
config.numberOfMarkers = 8;           // Markers per bank (default: 8)
config.numberOfRegions = 8;           // Regions per bank (default: 8)

const reaper = new Reaper(config);
```

If you modify the number of tracks, markers, regions etc. you will need to modify your pattern file accordingly.

---

## Getting current state

OSC is UDP, so there is no connection handshake Reaper does not automatically send state when your app starts. You have to ask for it:

```js
await reaper.start();

// Ask Reaper to send the current values for all OSC messages
reaper.refreshControlSurfaces();

// Wait for the messages to arrive before reading state
setTimeout(() => {
  console.log(reaper.tracks[0].name);       // 'Drums'
  console.log(reaper.transport.isPlaying);  // false
}, 1000);
```

Reaper does broadcast its full state on startup.

---

## Control surface API

The `Reaper` class is the main entry point. It maintains a stateful model of Reaper's transport, tracks, markers, and more, kept up to date as messages arrive.

### Transport

```js
// Playback
reaper.transport.play();
reaper.transport.stop();
reaper.transport.pause();

// Seek
reaper.transport.jumpToTime(30.5);          // jump to 30.5 seconds
reaper.transport.jumpToTimeRelative(-5);    // rewind 5 seconds from current position

// Loop
reaper.transport.setLoopStart(10.0);
reaper.transport.setLoopEnd(30.0);
reaper.transport.toggleRepeat();

// Markers and regions
reaper.transport.gotoMarker(2);             // jump to user-assigned marker number 2
reaper.transport.gotoRegion(1);             // jump to user-assigned region number 1
reaper.transport.toggleRewindByMarker();

// Read state
console.log(reaper.transport.time);         // current position in seconds
console.log(reaper.transport.isPlaying);
console.log(reaper.transport.isRepeatEnabled);
console.log(reaper.transport.lastMarker.name);
```

### Tracks

`reaper.tracks` is a zero-indexed array of `Track` objects, one per bank slot. Bank slot 1 → `reaper.tracks[0]`, bank slot 8 → `reaper.tracks[7]`.

```js
const track = reaper.tracks[0]; // bank slot 1

// Read state
console.log(track.name);            // 'Vocals'
console.log(track.isMuted);
console.log(track.volumeDb);

// Commands
track.mute();
track.unmute();
track.solo();
track.unsolo();
track.setVolume(0.716);             // fader position (0–1), ~0.716 = 0 dB
track.setVolumeDb(0);
track.setPan(-0.5);                 // -1 (full left) to +1 (full right)
track.setName('Lead Vox');

// FX
track.fx[0].bypass();
track.fx[0].nextPreset();
console.log(track.fx[0].name);
```

### Markers and regions

`reaper.markers` and `reaper.regions` are zero-indexed arrays of bank slots.

```js
const marker = reaper.markers[0];   // first slot in the current marker bank

console.log(marker.name);           // 'Verse 1'
console.log(marker.number);         // '1' (user-assigned number, as a string)
console.log(marker.time);           // 4.5 (seconds)

marker.rename('Intro');

const region = reaper.regions[0];
console.log(region.name);
console.log(region.length);         // duration in seconds
region.rename('Part A');
region.setLength(16.0);
```

### Subscribing to state changes

Every stateful object implements `onPropertyChanged`. The callback fires whenever that property changes, and returns an unsubscribe function.

```js
// Log whenever track 1's mute state changes
const unsubscribe = reaper.tracks[0].onPropertyChanged('isMuted', () => {
  console.log(`Track 1 muted: ${reaper.tracks[0].isMuted}`);
});

// Stop listening later
unsubscribe();
```

### More tracks and bank navigation

By default the library gives you 8 track slots matching Reaper's default bank size. Use `reaper.device` to navigate banks, which will trigger Reaper to send the state for the new bank:

```js
// Move to the next bank of 8 tracks
reaper.device.nextTrackBank();

// Or jump directly to bank 2 (tracks 9–16 with a bank size of 8)
reaper.device.selectTrackBank(2);
```

The same bank navigation is available for markers and regions via `reaper.device.nextMarkerBank()`, `reaper.device.selectMarkerBank(n)`, etc.

---

## Low-level OSC client

`ReaperOscClient` is the stateless layer underneath `Reaper`. It translates raw OSC messages into typed events and accepts typed commands. Use it directly if you need full control or want to handle Reaper events without the stateful model.

### Receiving events

```js
import { ReaperOscClient } from 'reaper-osc';

const client = new ReaperOscClient();
await client.start();

client.on('message', event => {
  switch (event.type) {
    case 'transport:play':
      console.log('Playing:', event.playing);
      break;
    case 'track:mute':
      console.log(`Track ${event.trackNumber} muted: ${event.muted}`);
      break;
    case 'track:volume':
      console.log(`Track ${event.trackNumber} volume: ${event.volume}`);
      break;
  }
});
```

### Sending commands

```js
import { Play, Stop, SetTrackMute, SetTrackVolume } from 'reaper-osc';

client.send(Play());
client.send(Stop());
client.send(SetTrackMute(1, true));     // mute track 1
client.send(SetTrackVolume(1, 0.716)); // set track 1 volume (fader position)
```

### Raw messages

For anything not covered by the typed commands, you can send a raw OSC message:

```js
import { OscMessage } from 'reaper-osc';

// Trigger a Reaper action by command ID
client.sendRaw(new OscMessage('/action/str', [{ type: 's', value: '41743' }]));
```

Or via the `Reaper` class shorthand:

```js
reaper.triggerAction(41743);           // refresh control surfaces
reaper.triggerAction('_SWS_AWMPLAYREC'); // SWS extension actions work too
```

---

## API reference

Full API documentation (all classes, properties, and methods) is at **https://lykaiosnz.github.io/reaper-osc.js/**.
