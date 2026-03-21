import {ReaperOscCommand} from '../dist/Client/Commands';
import {DeviceState} from '../dist/Device';

function makeDevice(): { device: DeviceState; sent: ReaperOscCommand[] } {
  const sent: ReaperOscCommand[] = [];
  const device = new DeviceState(command => sent.push(command));
  return {device, sent};
}

describe('track', () => {
  test.each([1, 4, 8])('selectTrack sends expected command: %p', index => {
    const {device, sent} = makeDevice();
    device.selectTrack(index);
    expect(sent[0]).toMatchObject({type: 'device:track:select', index});
  });

  test('nextTrack sends expected command', () => {
    const {device, sent} = makeDevice();
    device.nextTrack();
    expect(sent[0]).toMatchObject({type: 'device:track:next'});
  });

  test('prevTrack sends expected command', () => {
    const {device, sent} = makeDevice();
    device.prevTrack();
    expect(sent[0]).toMatchObject({type: 'device:track:prev'});
  });
});

describe('track bank', () => {
  test.each([1, 2, 3])('selectTrackBank sends expected command: %p', index => {
    const {device, sent} = makeDevice();
    device.selectTrackBank(index);
    expect(sent[0]).toMatchObject({type: 'device:trackBank:select', index});
  });

  test('nextTrackBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.nextTrackBank();
    expect(sent[0]).toMatchObject({type: 'device:trackBank:next'});
  });

  test('prevTrackBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.prevTrackBank();
    expect(sent[0]).toMatchObject({type: 'device:trackBank:prev'});
  });
});

describe('fx', () => {
  test.each([1, 4, 8])('selectFx sends expected command: %p', index => {
    const {device, sent} = makeDevice();
    device.selectFx(index);
    expect(sent[0]).toMatchObject({type: 'device:fx:select', index});
  });

  test('nextFx sends expected command', () => {
    const {device, sent} = makeDevice();
    device.nextFx();
    expect(sent[0]).toMatchObject({type: 'device:fx:next'});
  });

  test('prevFx sends expected command', () => {
    const {device, sent} = makeDevice();
    device.prevFx();
    expect(sent[0]).toMatchObject({type: 'device:fx:prev'});
  });
});

describe('fx param bank', () => {
  test.each([1, 2])('selectFxParamBank sends expected command: %p', index => {
    const {device, sent} = makeDevice();
    device.selectFxParamBank(index);
    expect(sent[0]).toMatchObject({type: 'device:fxParamBank:select', index});
  });

  test('nextFxParamBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.nextFxParamBank();
    expect(sent[0]).toMatchObject({type: 'device:fxParamBank:next'});
  });

  test('prevFxParamBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.prevFxParamBank();
    expect(sent[0]).toMatchObject({type: 'device:fxParamBank:prev'});
  });
});

describe('marker bank', () => {
  test.each([1, 2])('selectMarkerBank sends expected command: %p', index => {
    const {device, sent} = makeDevice();
    device.selectMarkerBank(index);
    expect(sent[0]).toMatchObject({type: 'device:markerBank:select', index});
  });

  test('nextMarkerBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.nextMarkerBank();
    expect(sent[0]).toMatchObject({type: 'device:markerBank:next'});
  });

  test('prevMarkerBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.prevMarkerBank();
    expect(sent[0]).toMatchObject({type: 'device:markerBank:prev'});
  });
});

describe('region bank', () => {
  test.each([1, 2])('selectRegionBank sends expected command: %p', index => {
    const {device, sent} = makeDevice();
    device.selectRegionBank(index);
    expect(sent[0]).toMatchObject({type: 'device:regionBank:select', index});
  });

  test('nextRegionBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.nextRegionBank();
    expect(sent[0]).toMatchObject({type: 'device:regionBank:next'});
  });

  test('prevRegionBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.prevRegionBank();
    expect(sent[0]).toMatchObject({type: 'device:regionBank:prev'});
  });
});
