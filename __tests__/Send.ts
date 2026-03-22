import {TrackSend, SelectedTrackSend} from '../dist/Send';
import {
  SetTrackSendVolume, SetTrackSendPan,
  SetSelectedTrackSendVolume, SetSelectedTrackSendPan,
  ReaperOscCommand,
} from '../dist/Client/Commands';
import {
  TrackSendNameChanged, TrackSendVolumeChanged, TrackSendVolumeStrChanged,
  TrackSendPanChanged, TrackSendPanStrChanged,
  SelectedTrackSendNameChanged, SelectedTrackSendVolumeChanged, SelectedTrackSendVolumeStrChanged,
  SelectedTrackSendPanChanged, SelectedTrackSendPanStrChanged,
} from '../dist/Client/Events';

// ─── TrackSend ───────────────────────────────────────────────────────────────

test('TrackSend has expected track number', () => {
  expect(new TrackSend(9876, 1, () => null).trackNumber).toBe(9876);
});

test('TrackSend has expected send number', () => {
  expect(new TrackSend(1, 9876, () => null).sendNumber).toBe(9876);
});

describe('TrackSend properties set by events', () => {
  let send: TrackSend;

  beforeEach(() => {
    send = new TrackSend(1, 1, () => null);
  });

  test('name event sets name', () => {
    send.handleEvent(TrackSendNameChanged(1, 1, 'Reverb Bus'));
    expect(send.name).toBe('Reverb Bus');
  });

  test('volume event sets volume', () => {
    send.handleEvent(TrackSendVolumeChanged(1, 1, 0.75));
    expect(send.volume).toBeCloseTo(0.75);
  });

  test('volumeStr event sets volumeStr', () => {
    send.handleEvent(TrackSendVolumeStrChanged(1, 1, '-6.00 dB'));
    expect(send.volumeStr).toBe('-6.00 dB');
  });

  test('pan event sets pan', () => {
    send.handleEvent(TrackSendPanChanged(1, 1, 0.5));
    expect(send.pan).toBeCloseTo(0.5);
  });

  test('panStr event sets panStr', () => {
    send.handleEvent(TrackSendPanStrChanged(1, 1, '50%R'));
    expect(send.panStr).toBe('50%R');
  });

  test('event for different track is ignored', () => {
    send.handleEvent(TrackSendNameChanged(2, 1, 'other'));
    expect(send.name).toBe('');
  });

  test('event for different send number is ignored', () => {
    send.handleEvent(TrackSendNameChanged(1, 2, 'other'));
    expect(send.name).toBe('');
  });
});

describe('TrackSend methods send expected commands', () => {
  test('setVolume sends expected command', done => {
    const send = new TrackSend(1, 2, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackSendVolume(1, 2, 0.5));
        done();
      } catch (error) { done(error); }
    });
    send.setVolume(0.5);
  });

  test('setPan sends expected command', done => {
    const send = new TrackSend(1, 2, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackSendPan(1, 2, -0.5));
        done();
      } catch (error) { done(error); }
    });
    send.setPan(-0.5);
  });

  test('setVolume throws on out-of-range value', () => {
    const send = new TrackSend(1, 1, () => null);
    expect(() => send.setVolume(-0.1)).toThrow(RangeError);
    expect(() => send.setVolume(1.1)).toThrow(RangeError);
  });

  test('setPan throws on out-of-range value', () => {
    const send = new TrackSend(1, 1, () => null);
    expect(() => send.setPan(-1.1)).toThrow(RangeError);
    expect(() => send.setPan(1.1)).toThrow(RangeError);
  });
});

// ─── SelectedTrackSend ───────────────────────────────────────────────────────

test('SelectedTrackSend has expected send number', () => {
  expect(new SelectedTrackSend(9876, () => null).sendNumber).toBe(9876);
});

describe('SelectedTrackSend properties set by events', () => {
  let send: SelectedTrackSend;

  beforeEach(() => {
    send = new SelectedTrackSend(1, () => null);
  });

  test('name event sets name', () => {
    send.handleEvent(SelectedTrackSendNameChanged(1, 'Reverb Bus'));
    expect(send.name).toBe('Reverb Bus');
  });

  test('volume event sets volume', () => {
    send.handleEvent(SelectedTrackSendVolumeChanged(1, 0.75));
    expect(send.volume).toBeCloseTo(0.75);
  });

  test('volumeStr event sets volumeStr', () => {
    send.handleEvent(SelectedTrackSendVolumeStrChanged(1, '-6.00 dB'));
    expect(send.volumeStr).toBe('-6.00 dB');
  });

  test('pan event sets pan', () => {
    send.handleEvent(SelectedTrackSendPanChanged(1, 0.5));
    expect(send.pan).toBeCloseTo(0.5);
  });

  test('panStr event sets panStr', () => {
    send.handleEvent(SelectedTrackSendPanStrChanged(1, '50%R'));
    expect(send.panStr).toBe('50%R');
  });

  test('event for different send number is ignored', () => {
    send.handleEvent(SelectedTrackSendNameChanged(2, 'other'));
    expect(send.name).toBe('');
  });
});

describe('SelectedTrackSend methods send expected commands', () => {
  test('setVolume sends expected command', done => {
    const send = new SelectedTrackSend(2, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetSelectedTrackSendVolume(2, 0.5));
        done();
      } catch (error) { done(error); }
    });
    send.setVolume(0.5);
  });

  test('setPan sends expected command', done => {
    const send = new SelectedTrackSend(2, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetSelectedTrackSendPan(2, -0.5));
        done();
      } catch (error) { done(error); }
    });
    send.setPan(-0.5);
  });

  test('setVolume throws on out-of-range value', () => {
    const send = new SelectedTrackSend(1, () => null);
    expect(() => send.setVolume(-0.1)).toThrow(RangeError);
    expect(() => send.setVolume(1.1)).toThrow(RangeError);
  });

  test('setPan throws on out-of-range value', () => {
    const send = new SelectedTrackSend(1, () => null);
    expect(() => send.setPan(-1.1)).toThrow(RangeError);
    expect(() => send.setPan(1.1)).toThrow(RangeError);
  });
});
