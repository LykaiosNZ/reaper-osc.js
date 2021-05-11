// @ts-check
import { Reaper, ReaperConfig } from './reaper.js';

var config = new ReaperConfig();

config.localPort = 49586;
config.reaperPort = 64234;

var reaper = new Reaper(config);

reaper.connect();

setTimeout(() =>{
    reaper.startRewind();
}, 100);


setTimeout(() => {
    reaper.stopRewind();
}, 2000);