import {OscMessage} from '../dist/Messages';
import {DeviceState} from '../dist/Device';

function makeDevice(): { device: DeviceState; sent: OscMessage[] } {
  const sent: OscMessage[] = [];
  const device = new DeviceState(message => sent.push(message));
  return {device, sent};
}

describe('track', () => {
  test.each([1, 4, 8])('selectTrack sends expected message: %p', index => {
    const {device, sent} = makeDevice();
    device.selectTrack(index);
    expect(sent[0]).toMatchObject({address: `/device/track/select/${index}`, args: []});
  });

  test('nextTrack sends expected message', () => {
    const {device, sent} = makeDevice();
    device.nextTrack();
    expect(sent[0]).toMatchObject({address: '/device/track/+', args: []});
  });

  test('prevTrack sends expected message', () => {
    const {device, sent} = makeDevice();
    device.prevTrack();
    expect(sent[0]).toMatchObject({address: '/device/track/-', args: []});
  });
});

describe('track bank', () => {
  test.each([1, 2, 3])('selectTrackBank sends expected message: %p', index => {
    const {device, sent} = makeDevice();
    device.selectTrackBank(index);
    expect(sent[0]).toMatchObject({address: `/device/track/bank/select/${index}`, args: []});
  });

  test('nextTrackBank sends expected message', () => {
    const {device, sent} = makeDevice();
    device.nextTrackBank();
    expect(sent[0]).toMatchObject({address: '/device/track/bank/+', args: []});
  });

  test('prevTrackBank sends expected message', () => {
    const {device, sent} = makeDevice();
    device.prevTrackBank();
    expect(sent[0]).toMatchObject({address: '/device/track/bank/-', args: []});
  });
});

describe('fx', () => {
  test.each([1, 4, 8])('selectFx sends expected message: %p', index => {
    const {device, sent} = makeDevice();
    device.selectFx(index);
    expect(sent[0]).toMatchObject({address: `/device/fx/select/${index}`, args: []});
  });

  test('nextFx sends expected message', () => {
    const {device, sent} = makeDevice();
    device.nextFx();
    expect(sent[0]).toMatchObject({address: '/device/fx/+', args: []});
  });

  test('prevFx sends expected message', () => {
    const {device, sent} = makeDevice();
    device.prevFx();
    expect(sent[0]).toMatchObject({address: '/device/fx/-', args: []});
  });
});

describe('fx param bank', () => {
  test.each([1, 2])('selectFxParamBank sends expected message: %p', index => {
    const {device, sent} = makeDevice();
    device.selectFxParamBank(index);
    expect(sent[0]).toMatchObject({address: `/device/fxparam/bank/select/${index}`, args: []});
  });

  test('nextFxParamBank sends expected message', () => {
    const {device, sent} = makeDevice();
    device.nextFxParamBank();
    expect(sent[0]).toMatchObject({address: '/device/fxparam/bank/+', args: []});
  });

  test('prevFxParamBank sends expected message', () => {
    const {device, sent} = makeDevice();
    device.prevFxParamBank();
    expect(sent[0]).toMatchObject({address: '/device/fxparam/bank/-', args: []});
  });
});

describe('marker bank', () => {
  test.each([1, 2])('selectMarkerBank sends expected message: %p', index => {
    const {device, sent} = makeDevice();
    device.selectMarkerBank(index);
    expect(sent[0]).toMatchObject({address: `/device/marker/bank/select/${index}`, args: []});
  });

  test('nextMarkerBank sends expected message', () => {
    const {device, sent} = makeDevice();
    device.nextMarkerBank();
    expect(sent[0]).toMatchObject({address: '/device/marker/bank/+', args: []});
  });

  test('prevMarkerBank sends expected message', () => {
    const {device, sent} = makeDevice();
    device.prevMarkerBank();
    expect(sent[0]).toMatchObject({address: '/device/marker/bank/-', args: []});
  });
});

describe('region bank', () => {
  test.each([1, 2])('selectRegionBank sends expected message: %p', index => {
    const {device, sent} = makeDevice();
    device.selectRegionBank(index);
    expect(sent[0]).toMatchObject({address: `/device/region/bank/select/${index}`, args: []});
  });

  test('nextRegionBank sends expected message', () => {
    const {device, sent} = makeDevice();
    device.nextRegionBank();
    expect(sent[0]).toMatchObject({address: '/device/region/bank/+', args: []});
  });

  test('prevRegionBank sends expected message', () => {
    const {device, sent} = makeDevice();
    device.prevRegionBank();
    expect(sent[0]).toMatchObject({address: '/device/region/bank/-', args: []});
  });
});
