import {Reaper} from './Reaper';

const reaper = new Reaper({localPort: 49586, remotePort: 64234});

reaper.startOsc();

setTimeout(() => {
  reaper.transport.play();
}, 100);
