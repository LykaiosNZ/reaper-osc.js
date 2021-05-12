// @ts-check
import { Reaper, ReaperConfig } from './reaper.js';

var config = new ReaperConfig();

config.localPort = 49586;
config.remotePort = 64234;

var reaper = new Reaper(config);
reaper.startOsc();

setTimeout(() =>{
    reaper.stop();
}, 100);


setTimeout(() => {
    reaper.play();
}, 10000);