import {BoolArgument, BooleanMessage, OscMessage} from '../dist/Messages';
import {Transport} from '../dist/Transport';

describe('message handling', () => {
  test.each([true, false])('forward message sets isFastForwarding: %p', value => {
    const transport = new Transport(() => {
      return;
    });
    const message = new BooleanMessage('/forward', value);

    transport.receive(message);

    expect(transport.isFastForwarding).toBe(value);
  });

  test.each([true, false])('play message sets isPlaying: %p', value => {
    const transport = new Transport(() => {
      return;
    });
    const message = new BooleanMessage('/play', value);

    transport.receive(message);

    expect(transport.isPlaying).toBe(value);
  });

  test.each([true, false])('record message sets isRecording: %p', value => {
    const transport = new Transport(() => {
      return;
    });
    const message = new BooleanMessage('/record', value);

    transport.receive(message);

    expect(transport.isRecording).toBe(value);
  });

  test.each([true, false])('repeat message sets isRepeatEnabled: %p', value => {
    const transport = new Transport(() => {
      return;
    });
    const message = new BooleanMessage('/repeat', value);

    transport.receive(message);

    expect(transport.isRepeatEnabled).toBe(value);
  });

  test.each([true, false])('rewind message sets isRewinding: %p', value => {
    const transport = new Transport(() => {
      return;
    });
    const message = new BooleanMessage('/rewind', value);

    transport.receive(message);

    expect(transport.isRewinding).toBe(value);
  });

  test.each([true, false])('stop message sets isStopped: %p', value => {
    const transport = new Transport(() => {
      return;
    });
    const message = new BooleanMessage('/stop', value);

    transport.receive(message);

    expect(transport.isStopped).toBe(value);
  });
});

describe('methods', () => {
  test('pause sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/pause', args: []});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.pause();
  });

  test('play sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/play', args: []});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.play();
  });

  test('record sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/record', args: []});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.record();
  });

  test('startFastForwarding sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/forward', args: [new BoolArgument(true)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.startFastForwarding();
  });

  test('startRewinding sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/rewind', args: [new BoolArgument(true)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.startRewinding();
  });

  test('stop sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/stop', args: []});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.stop();
  });

  test('stopFastForwarding sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/forward', args: [new BoolArgument(false)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.stopFastForwarding();
  });

  test('stopRewinding sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/rewind', args: [new BoolArgument(false)]});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.stopRewinding();
  });

  test('toggleRepeat sends expected message', done => {
    const transport = new Transport((message: OscMessage) => {
      try {
        expect(message).toMatchObject({address: '/repeat', args: []});
        done();
      } catch (error) {
        done(error);
      }
    });

    transport.toggleRepeat();
  });
});
