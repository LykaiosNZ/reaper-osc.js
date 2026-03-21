import {TrackFx} from '../dist/Fx';
import {
  SetTrackFxBypass, SetTrackFxOpenUi, NextTrackFxPreset, PreviousTrackFxPreset,
  ReaperOscCommand,
} from '../dist/Client/Commands';
import {
  TrackFxNameChanged, TrackFxBypassEvent, TrackFxOpenUiEvent, TrackFxPresetChanged,
} from '../dist/Client/Events';

test('has expected track number', () => {
  const expected = 9876;
  const trackFx = new TrackFx(expected, 1, () => null);

  expect(trackFx.trackNumber).toBe(expected);
});

test('has expected fx number', () => {
  const expected = 9876;
  const trackFx = new TrackFx(1, expected, () => null);

  expect(trackFx.fxNumber).toBe(expected);
});

describe('properties set by events', () => {
  let trackFx: TrackFx;

  beforeEach(() => {
    trackFx = new TrackFx(1, 1, () => null);
  });

  test.each([true, false])('bypass event sets isBypassed: %p', value => {
    // Confusingly, Reaper sends a 1 (true) for /bypass when the track is active (i.e. not bypassed)
    // The client parser inverts this, so the event.bypassed already reflects the library convention
    trackFx.handleEvent(TrackFxBypassEvent(1, 1, value));
    expect(trackFx.isBypassed).toBe(value);
  });

  test.each([true, false])('openUi event sets isUiOpen: %p', value => {
    trackFx.handleEvent(TrackFxOpenUiEvent(1, 1, value));
    expect(trackFx.isUiOpen).toBe(value);
  });

  test('name event sets name', () => {
    const expected = 'foo';
    trackFx.handleEvent(TrackFxNameChanged(1, 1, expected));
    expect(trackFx.name).toBe(expected);
  });

  test('preset event sets preset', () => {
    const expected = 'foo';
    trackFx.handleEvent(TrackFxPresetChanged(1, 1, expected));
    expect(trackFx.preset).toBe(expected);
  });

  test('event for different track is ignored', () => {
    trackFx.handleEvent(TrackFxNameChanged(2, 1, 'other'));
    expect(trackFx.name).toBe('Fx 1');
  });

  test('event for different fx number is ignored', () => {
    trackFx.handleEvent(TrackFxNameChanged(1, 2, 'other'));
    expect(trackFx.name).toBe('Fx 1');
  });
});

describe('methods send expected commands', () => {
  test('bypass sends expected command', done => {
    const trackFx = new TrackFx(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackFxBypass(1, 1, true));
        done();
      } catch (error) {
        done(error);
      }
    });

    trackFx.bypass();
  });

  test('closeUi sends expected command', done => {
    const trackFx = new TrackFx(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackFxOpenUi(1, 1, false));
        done();
      } catch (error) {
        done(error);
      }
    });

    trackFx.closeUi();
  });

  test('nextPreset sends expected command', done => {
    const trackFx = new TrackFx(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(NextTrackFxPreset(1, 1));
        done();
      } catch (error) {
        done(error);
      }
    });

    trackFx.nextPreset();
  });

  test('openUi sends expected command', done => {
    const trackFx = new TrackFx(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackFxOpenUi(1, 1, true));
        done();
      } catch (error) {
        done(error);
      }
    });

    trackFx.openUi();
  });

  test('previousPreset sends expected command', done => {
    const trackFx = new TrackFx(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(PreviousTrackFxPreset(1, 1));
        done();
      } catch (error) {
        done(error);
      }
    });

    trackFx.previousPreset();
  });

  test('unbypass sends expected command', done => {
    const trackFx = new TrackFx(1, 1, (command: ReaperOscCommand) => {
      try {
        expect(command).toMatchObject(SetTrackFxBypass(1, 1, false));
        done();
      } catch (error) {
        done(error);
      }
    });

    trackFx.unbypass();
  });
});
