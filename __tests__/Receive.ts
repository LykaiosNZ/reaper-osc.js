import {TrackReceive, SelectedTrackReceive} from '../dist/Receive';
import {
  SetTrackReceiveVolume, SetTrackReceivePan,
  SetSelectedTrackReceiveVolume, SetSelectedTrackReceivePan,
  ReaperOscCommand,
} from '../dist/Client/Commands';
import {
  TrackReceiveNameChanged, TrackReceiveVolumeChanged, TrackReceiveVolumeStrChanged,
  TrackReceivePanChanged, TrackReceivePanStrChanged,
  SelectedTrackReceiveNameChanged, SelectedTrackReceiveVolumeChanged, SelectedTrackReceiveVolumeStrChanged,
  SelectedTrackReceivePanChanged, SelectedTrackReceivePanStrChanged,
} from '../dist/Client/Events';

// ─── TrackReceive ─────────────────────────────────────────────────────────────

test('TrackReceive has expected track number', () => {
  expect(new TrackReceive(9876, 1, () => null).trackNumber).toBe(9876);
});

test('TrackReceive has expected receive number', () => {
  expect(new TrackReceive(1, 9876, () => null).receiveNumber).toBe(9876);
});

describe('TrackReceive properties set by events', () => {
  let recv: TrackReceive;

  beforeEach(() => {
    recv = new TrackReceive(1, 1, () => null);
  });

  test('name event sets name', () => {
    recv.handleEvent(TrackReceiveNameChanged(1, 1, 'Drum Bus'));
    expect(recv.name).toBe('Drum Bus');
  });

  test('volume event sets volume', () => {
    recv.handleEvent(TrackReceiveVolumeChanged(1, 1, 0.75));
    expect(recv.volume).toBeCloseTo(0.75);
  });

  test('volumeStr event sets volumeStr', () => {
    recv.handleEvent(TrackReceiveVolumeStrChanged(1, 1, '-6.00 dB'));
    expect(recv.volumeStr).toBe('-6.00 dB');
  });

  test('pan event sets pan', () => {
    recv.handleEvent(TrackReceivePanChanged(1, 1, -0.5));
    expect(recv.pan).toBeCloseTo(-0.5);
  });

  test('panStr event sets panStr', () => {
    recv.handleEvent(TrackReceivePanStrChanged(1, 1, '50%L'));
    expect(recv.panStr).toBe('50%L');
  });

  test('event for different track is ignored', () => {
    recv.handleEvent(TrackReceiveNameChanged(2, 1, 'other'));
    expect(recv.name).toBe('');
  });

  test('event for different receive number is ignored', () => {
    recv.handleEvent(TrackReceiveNameChanged(1, 2, 'other'));
    expect(recv.name).toBe('');
  });
});

describe('TrackReceive methods send expected commands', () => {
  test('setVolume sends expected command', done => {
    const recv = new TrackReceive(1, 2, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackReceiveVolume(1, 2, 0.5));
        done();
      } catch (error) { done(error); }
    });
    recv.setVolume(0.5);
  });

  test('setPan sends expected command', done => {
    const recv = new TrackReceive(1, 2, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackReceivePan(1, 2, 0.5));
        done();
      } catch (error) { done(error); }
    });
    recv.setPan(0.5);
  });

  test('setVolume throws on out-of-range value', () => {
    const recv = new TrackReceive(1, 1, () => null);
    expect(() => recv.setVolume(-0.1)).toThrow(RangeError);
    expect(() => recv.setVolume(1.1)).toThrow(RangeError);
  });

  test('setPan throws on out-of-range value', () => {
    const recv = new TrackReceive(1, 1, () => null);
    expect(() => recv.setPan(-1.1)).toThrow(RangeError);
    expect(() => recv.setPan(1.1)).toThrow(RangeError);
  });
});

// ─── SelectedTrackReceive ─────────────────────────────────────────────────────

test('SelectedTrackReceive has expected receive number', () => {
  expect(new SelectedTrackReceive(9876, () => null).receiveNumber).toBe(9876);
});

describe('SelectedTrackReceive properties set by events', () => {
  let recv: SelectedTrackReceive;

  beforeEach(() => {
    recv = new SelectedTrackReceive(1, () => null);
  });

  test('name event sets name', () => {
    recv.handleEvent(SelectedTrackReceiveNameChanged(1, 'Drum Bus'));
    expect(recv.name).toBe('Drum Bus');
  });

  test('volume event sets volume', () => {
    recv.handleEvent(SelectedTrackReceiveVolumeChanged(1, 0.75));
    expect(recv.volume).toBeCloseTo(0.75);
  });

  test('volumeStr event sets volumeStr', () => {
    recv.handleEvent(SelectedTrackReceiveVolumeStrChanged(1, '-6.00 dB'));
    expect(recv.volumeStr).toBe('-6.00 dB');
  });

  test('pan event sets pan', () => {
    recv.handleEvent(SelectedTrackReceivePanChanged(1, -0.5));
    expect(recv.pan).toBeCloseTo(-0.5);
  });

  test('panStr event sets panStr', () => {
    recv.handleEvent(SelectedTrackReceivePanStrChanged(1, '50%L'));
    expect(recv.panStr).toBe('50%L');
  });

  test('event for different receive number is ignored', () => {
    recv.handleEvent(SelectedTrackReceiveNameChanged(2, 'other'));
    expect(recv.name).toBe('');
  });
});

describe('SelectedTrackReceive methods send expected commands', () => {
  test('setVolume sends expected command', done => {
    const recv = new SelectedTrackReceive(2, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetSelectedTrackReceiveVolume(2, 0.5));
        done();
      } catch (error) { done(error); }
    });
    recv.setVolume(0.5);
  });

  test('setPan sends expected command', done => {
    const recv = new SelectedTrackReceive(2, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetSelectedTrackReceivePan(2, 0.5));
        done();
      } catch (error) { done(error); }
    });
    recv.setPan(0.5);
  });

  test('setVolume throws on out-of-range value', () => {
    const recv = new SelectedTrackReceive(1, () => null);
    expect(() => recv.setVolume(-0.1)).toThrow(RangeError);
    expect(() => recv.setVolume(1.1)).toThrow(RangeError);
  });

  test('setPan throws on out-of-range value', () => {
    const recv = new SelectedTrackReceive(1, () => null);
    expect(() => recv.setPan(-1.1)).toThrow(RangeError);
    expect(() => recv.setPan(1.1)).toThrow(RangeError);
  });
});
