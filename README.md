# reaper-osc
A Node.js library for controlling Cockos Reaper using Open Sound Control (OSC).

## Basic usage
```javascript
import { Reaper, ReaperConfiguration } from "reaper-osc";

var config = new ReaperConfiguration();

// Start listening for messages
reaper.startOsc();

// Subscribe to state changes
reaper.tracks[1].onPropertyChanged("isMuted", () => {
  console.log(
    `Track 1 was ${reaper.tracks[1].isMuted ? "muted" : "unmuted"}`
  );
});

// Wait for the port to open, then start sending commands
reaper.onReady(() => {
  reaper.transport.play();
  
  reaper.tracks[1].mute();
  reaper.tracks[1].unmute();
});
```