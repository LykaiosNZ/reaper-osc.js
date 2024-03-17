# reaper-osc

A Node.js library for controlling Cockos Reaper using Open Sound Control (OSC).

## API Reference

You can find the API documentation [here](https://lykaiosnz.github.io/reaper-osc.js/)

## Installation

Yarn: `yarn add reaper-osc`
npm: `npm i reaper-osc`

## Basic usage

```javascript
import {Reaper} from 'reaper-osc';

var reaper = new Reaper();

// Start listening for messages
await reaper.start()

// Subscribe to state changes
reaper.tracks[0].onPropertyChanged('isMuted', () => {
  console.log(`Track 1 was ${reaper.tracks[0].isMuted ? 'muted' : 'unmuted'}`);
});

reaper.transport.play();
reaper.tracks[0].mute();
reaper.tracks[0].unmute();
```