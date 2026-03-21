import {
  SelectDeviceTrack, NextDeviceTrack, PreviousDeviceTrack,
  SelectDeviceTrackBank, NextDeviceTrackBank, PreviousDeviceTrackBank,
  SelectDeviceFx, NextDeviceFx, PreviousDeviceFx,
  SelectDeviceFxParameterBank, NextDeviceFxParameterBank, PreviousDeviceFxParameterBank,
  SelectDeviceMarkerBank, NextDeviceMarkerBank, PreviousDeviceMarkerBank,
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

  test('previousTrack sends expected command', () => {
    const {device, sent} = makeDevice();
    device.previousTrack();
    expect(sent[0]).toMatchObject(PreviousDeviceTrack());
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

  test('previousTrackBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.previousTrackBank();
    expect(sent[0]).toMatchObject(PreviousDeviceTrackBank());
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

  test('previousFx sends expected command', () => {
    const {device, sent} = makeDevice();
    device.previousFx();
    expect(sent[0]).toMatchObject(PreviousDeviceFx());
  });
});

describe('fx parameter bank', () => {
  test.each([1, 2])('selectFxParameterBank sends expected command: %p', index => {
    const {device, sent} = makeDevice();
    device.selectFxParameterBank(index);
    expect(sent[0]).toMatchObject(SelectDeviceFxParameterBank(index));
  });

  test('nextFxParameterBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.nextFxParameterBank();
    expect(sent[0]).toMatchObject(NextDeviceFxParameterBank());
  });

  test('previousFxParameterBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.previousFxParameterBank();
    expect(sent[0]).toMatchObject(PreviousDeviceFxParameterBank());
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

  test('previousMarkerBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.previousMarkerBank();
    expect(sent[0]).toMatchObject(PreviousDeviceMarkerBank());
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

  test('previousRegionBank sends expected command', () => {
    const {device, sent} = makeDevice();
    device.previousRegionBank();
    expect(sent[0]).toMatchObject(PreviousDeviceRegionBank());
  });
});
