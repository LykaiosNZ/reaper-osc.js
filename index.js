// @ts-check
"use strict";

import { Reaper, ReaperConfig } from './reaper.js';

var config = new ReaperConfig();

config.localPort = 49586;
config.remotePort = 64234;

var reaper = new Reaper(config);
reaper.startOsc();

setTimeout(() =>{
    reaper.tracks[2].rename('Test');

    setTimeout(() =>{
        reaper.tracks[2].rename('Test1');
    }, 2000);
}, 2000);


// setTimeout(() => {
//     reaper.play();
// }, 10000);