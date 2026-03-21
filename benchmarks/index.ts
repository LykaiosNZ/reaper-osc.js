import {Bench} from 'tinybench';
import {BooleanMessage} from '../src/Messages';
import {parseMessage, ReaperOscClient} from '../src/Client/Client';
import {Reaper, ReaperConfiguration} from '../src/Reaper';

// Pre-create alternating messages so subscribed benchmarks always see a value change
const simpleMsgs = [
  new BooleanMessage('/click', true),
  new BooleanMessage('/click', false),
];

// Reaper sends 0 when bypassed, 1 when not bypassed
const fxMsgs = [
  new BooleanMessage('/track/1/fx/1/bypass', false),
  new BooleanMessage('/track/1/fx/1/bypass', true),
];

function makeClient(): ReaperOscClient {
  const config = new ReaperConfiguration();
  config.log = () => {};
  return new ReaperOscClient(config);
}

function makeReaper(client: ReaperOscClient): Reaper {
  const config = new ReaperConfiguration();
  config.log = () => {};
  return new Reaper(client, config);
}

const bench = new Bench({time: 2000});

// --- Client only ---

{
  const client = makeClient();
  client.on('message', () => {});
  let i = 0;
  bench.add('client | simple', () => {
    client.emit('message', parseMessage(simpleMsgs[i++ & 1]));
  });
}

{
  const client = makeClient();
  client.on('message', () => {});
  let i = 0;
  bench.add('client | track fx', () => {
    client.emit('message', parseMessage(fxMsgs[i++ & 1]));
  });
}

// --- Control surface, no subscription ---

{
  const client = makeClient();
  makeReaper(client);
  let i = 0;
  bench.add('surface | simple | no subscription', () => {
    client.emit('message', parseMessage(simpleMsgs[i++ & 1]));
  });
}

{
  const client = makeClient();
  makeReaper(client);
  let i = 0;
  bench.add('surface | track fx | no subscription', () => {
    client.emit('message', parseMessage(fxMsgs[i++ & 1]));
  });
}

// --- Control surface, subscribed ---

{
  const client = makeClient();
  const reaper = makeReaper(client);
  reaper.onPropertyChanged('isMetronomeEnabled', () => {});
  let i = 0;
  bench.add('surface | simple | subscribed', () => {
    client.emit('message', parseMessage(simpleMsgs[i++ & 1]));
  });
}

{
  const client = makeClient();
  const reaper = makeReaper(client);
  reaper.tracks[0].fx[0].onPropertyChanged('isBypassed', () => {});
  let i = 0;
  bench.add('surface | track fx | subscribed', () => {
    client.emit('message', parseMessage(fxMsgs[i++ & 1]));
  });
}

bench.run().then(() => {
  console.table(bench.table());
});
