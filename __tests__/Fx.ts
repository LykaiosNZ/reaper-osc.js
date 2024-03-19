import {TrackFx} from '../dist/Fx';
import {BoolArgument, BooleanMessage, StringMessage} from '../dist/Messages';

test('has expected track number', () => {
  const expected = 9876;
  const track = new TrackFx(expected, 1, () => null);

  expect(track.trackNumber).toBe(expected);
});

test('has expected fx number', () => {
  const expected = 9876;
  const track = new TrackFx(1, expected, () => null);

  expect(track.fxNumber).toBe(expected);
});

describe('properties set by messages', () => {
  let trackFx: TrackFx;

  beforeEach(() => {
    trackFx = new TrackFx(1, 1, () => null);
  });

  test.each([true, false])('bypass message sets isBypassed', value => {
    const message = new BooleanMessage('/track/1/fx/1/bypass', value);

    expect(trackFx.receive(message)).toBe(true);
    // Confusingly, Reaper sends a 1 (true) for /bypass when the track is active (i.e. not bypassed)
    expect(trackFx.isBypassed).toBe(!value);
  });

  test.each([true, false])('openui message sets isUiOpen', expected => {
    const message = new BooleanMessage('/track/1/fx/1/openui', expected);

    expect(trackFx.receive(message)).toBe(true);
    expect(trackFx.isUiOpen).toBe(expected);
  });

  test('name message sets name', () => {
    const expected = 'foo';
    const message = new StringMessage('/track/1/fx/1/name', expected);

    expect(trackFx.receive(message)).toBe(true);
    expect(trackFx.name).toBe(expected);
  });

  test('preset message sets preset', () => {
    const expected = 'foo';
    const message = new StringMessage('/track/1/fx/1/preset', expected);

    expect(trackFx.receive(message)).toBe(true);
    expect(trackFx.preset).toBe(expected);
  });
});

describe('methods send expected messages', () => {
  test('bypass sends expected message', done => {
    const trackFx = new TrackFx(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/fx/1/bypass', args: [BoolArgument(false)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    trackFx.bypass();
  });

  test('closeUi sends expected message', done => {
    const trackFx = new TrackFx(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/fx/1/openui', args: [BoolArgument(false)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    trackFx.closeUi();
  });

  test('nextPreset sends expected message', done => {
    const trackFx = new TrackFx(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/fx/1/preset+', args: []});
        done();
      } catch (error) {
        done(error);
      }
    });

    trackFx.nextPreset();
  });

  test('openUi sends expected message', done => {
    const trackFx = new TrackFx(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/fx/1/openui', args: [BoolArgument(true)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    trackFx.openUi();
  });

  test('previousPreset sends expected message', done => {
    const trackFx = new TrackFx(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/fx/1/preset-', args: []});
        done();
      } catch (error) {
        done(error);
      }
    });

    trackFx.previousPreset();
  });

  test('unbypass sends expected message', done => {
    const trackFx = new TrackFx(1, 1, message => {
      try {
        expect(message).toMatchObject({address: '/track/1/fx/1/bypass', args: [BoolArgument(true)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    trackFx.unbypass();
  });
});
