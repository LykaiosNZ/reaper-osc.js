import {
  SelectDeviceTrack, NextDeviceTrack, PrevDeviceTrack,
  SelectDeviceTrackBank, NextDeviceTrackBank, PrevDeviceTrackBank,
  SelectDeviceFx, NextDeviceFx, PrevDeviceFx,
  SelectDeviceFxParamBank, NextDeviceFxParamBank, PrevDeviceFxParamBank,
  SelectDeviceMarkerBank, NextDeviceMarkerBank, PrevDeviceMarkerBank,
  SelectDeviceRegionBank, NextDeviceRegionBank, PreviousDeviceRegionBank,
  ReaperOscCommand,
} from '../dist/Client/Commands';
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
    expect(sent[0]).toMatchObject(SelectDeviceTrack(index));
  });

  test('nextTrack sends expected command', () => {
    const {device, sent} = makeDevice();
    device.nextTrack();
    expect(sent[0]).toMatchObject(NextDeviceTrack());
  });

  test('prevTrack sends expected command', () => {
    const {device, sent} = makeDevice();
    device.prevTrack();
    expect(sent[0]).toMatchObject(PrevDeviceTrack());
  });
});

describe('track bank', () => {
  test.each([1, 2, 3])('selectTrackBank sends expected command: %p', index => {
    const {device, sent} = makeDevice();
    device.selectTrackBank(index);
    expect(sent[0]).toMatchObject(SelectDeviceTrackBank(index));
  });

  test('nextTrackBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.nextTrackBank();
    expect(sent[0]).toMatchObject(NextDeviceTrackBank());
  });

  test('prevTrackBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.prevTrackBank();
    expect(sent[0]).toMatchObject(PrevDeviceTrackBank());
  });
});

describe('fx', () => {
  test.each([1, 4, 8])('selectFx sends expected command: %p', index => {
    const {device, sent} = makeDevice();
    device.selectFx(index);
    expect(sent[0]).toMatchObject(SelectDeviceFx(index));
  });

  test('nextFx sends expected command', () => {
    const {device, sent} = makeDevice();
    device.nextFx();
    expect(sent[0]).toMatchObject(NextDeviceFx());
  });

  test('prevFx sends expected command', () => {
    const {device, sent} = makeDevice();
    device.prevFx();
    expect(sent[0]).toMatchObject(PrevDeviceFx());
  });
});

describe('fx param bank', () => {
  test.each([1, 2])('selectFxParamBank sends expected command: %p', index => {
    const {device, sent} = makeDevice();
    device.selectFxParamBank(index);
    expect(sent[0]).toMatchObject(SelectDeviceFxParamBank(index));
  });

  test('nextFxParamBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.nextFxParamBank();
    expect(sent[0]).toMatchObject(NextDeviceFxParamBank());
  });

  test('prevFxParamBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.prevFxParamBank();
    expect(sent[0]).toMatchObject(PrevDeviceFxParamBank());
  });
});

describe('marker bank', () => {
  test.each([1, 2])('selectMarkerBank sends expected command: %p', index => {
    const {device, sent} = makeDevice();
    device.selectMarkerBank(index);
    expect(sent[0]).toMatchObject(SelectDeviceMarkerBank(index));
  });

  test('nextMarkerBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.nextMarkerBank();
    expect(sent[0]).toMatchObject(NextDeviceMarkerBank());
  });

  test('prevMarkerBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.prevMarkerBank();
    expect(sent[0]).toMatchObject(PrevDeviceMarkerBank());
  });
});

describe('region bank', () => {
  test.each([1, 2])('selectRegionBank sends expected command: %p', index => {
    const {device, sent} = makeDevice();
    device.selectRegionBank(index);
    expect(sent[0]).toMatchObject(SelectDeviceRegionBank(index));
  });

  test('nextRegionBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.nextRegionBank();
    expect(sent[0]).toMatchObject(NextDeviceRegionBank());
  });

  test('prevRegionBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.prevRegionBank();
    expect(sent[0]).toMatchObject(PreviousDeviceRegionBank());
  });
});
