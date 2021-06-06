# reaper-osc
A Node.js library for controlling Cockos Reaper using Open Sound Control (OSC). 

## API Reference
You can find the API documentation [here](https://lykaiosnz.github.io/reaper-osc.js/)

## Basic usage
```javascript
import { Reaper } from "reaper-osc";

var reaper = new Reaper();

// Start listening for messages
reaper.startOsc();

// Subscribe to state changes
reaper.tracks[0].onPropertyChanged("isMuted", () => {
  console.log(
    `Track 1 was ${reaper.tracks[1].isMuted ? "muted" : "unmuted"}`
  );
});

// Wait for the port to open, then start sending commands
reaper.onReady(() => {
  reaper.transport.play();
  
  reaper.tracks[0].mute();
  reaper.tracks[0].unmute();
});
```