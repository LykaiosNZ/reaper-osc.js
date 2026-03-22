import {
  MarkerNameChanged, MarkerNumberChanged, MarkerTimeChanged,
  LastMarkerNameChanged, LastMarkerNumberChanged, LastMarkerTimeChanged,
} from '../dist/Client/Events';
import {
  SetMarkerName, SetMarkerTime, SetMarkerNumber,
  ReaperOscCommand,
} from '../dist/Client/Commands';
import {Marker, LastMarker} from '../dist/Marker';

function makeMarker(slotIndex = 1): { marker: Marker; sent: ReaperOscCommand[] } {
  const sent: ReaperOscCommand[] = [];
  const marker = new Marker(slotIndex, command => sent.push(command));
  return {marker, sent};
}

describe('Marker initial state', () => {
  test('name is empty string', () => {
    const {marker} = makeMarker();
    expect(marker.name).toBe('');
  });

  test('number is empty string', () => {
    const {marker} = makeMarker();
    expect(marker.number).toBe('');
  });

  test('time is 0', () => {
    const {marker} = makeMarker();
    expect(marker.time).toBe(0);
  });
});

describe('Marker handleEvent', () => {
  test('MarkerNameChanged updates name for matching slotIndex', () => {
    const {marker} = makeMarker(2);
    marker.handleEvent(MarkerNameChanged(2, 'Intro'));
    expect(marker.name).toBe('Intro');
  });

  test('MarkerNameChanged ignores different slotIndex', () => {
    const {marker} = makeMarker(2);
    marker.handleEvent(MarkerNameChanged(3, 'Other'));
    expect(marker.name).toBe('');
  });

  test('MarkerNumberChanged updates number for matching slotIndex', () => {
    const {marker} = makeMarker(1);
    marker.handleEvent(MarkerNumberChanged(1, '5'));
    expect(marker.number).toBe('5');
  });

  test('MarkerNumberChanged ignores different slotIndex', () => {
    const {marker} = makeMarker(1);
    marker.handleEvent(MarkerNumberChanged(2, '5'));
    expect(marker.number).toBe('');
  });

  test('MarkerTimeChanged updates time for matching slotIndex', () => {
    const {marker} = makeMarker(1);
    marker.handleEvent(MarkerTimeChanged(1, 12.5));
    expect(marker.time).toBe(12.5);
  });

  test('MarkerTimeChanged ignores different slotIndex', () => {
    const {marker} = makeMarker(1);
    marker.handleEvent(MarkerTimeChanged(2, 12.5));
    expect(marker.time).toBe(0);
  });
});

describe('Marker write methods', () => {
  test('rename sends SetMarkerName using parsed number', () => {
    const {marker, sent} = makeMarker(1);
    marker.handleEvent(MarkerNumberChanged(1, '3'));
    marker.rename('Verse');
    expect(sent[0]).toMatchObject(SetMarkerName(3, 'Verse'));
  });

  test('setTime sends SetMarkerTime using parsed number', () => {
    const {marker, sent} = makeMarker(1);
    marker.handleEvent(MarkerNumberChanged(1, '2'));
    marker.setTime(8.0);
    expect(sent[0]).toMatchObject(SetMarkerTime(2, 8.0));
  });

  test('setNumber sends SetMarkerNumber using parsed number', () => {
    const {marker, sent} = makeMarker(1);
    marker.handleEvent(MarkerNumberChanged(1, '1'));
    marker.setNumber(7);
    expect(sent[0]).toMatchObject(SetMarkerNumber(1, 7));
  });
});

describe('LastMarker initial state', () => {
  test('name is empty string', () => {
    const lastMarker = new LastMarker();
    expect(lastMarker.name).toBe('');
  });

  test('number is empty string', () => {
    const lastMarker = new LastMarker();
    expect(lastMarker.number).toBe('');
  });

  test('time is 0', () => {
    const lastMarker = new LastMarker();
    expect(lastMarker.time).toBe(0);
  });
});

describe('LastMarker handleEvent', () => {
  test('LastMarkerNameChanged updates name', () => {
    const lastMarker = new LastMarker();
    lastMarker.handleEvent(LastMarkerNameChanged('Chorus'));
    expect(lastMarker.name).toBe('Chorus');
  });

  test('LastMarkerNumberChanged updates number', () => {
    const lastMarker = new LastMarker();
    lastMarker.handleEvent(LastMarkerNumberChanged('4'));
    expect(lastMarker.number).toBe('4');
  });

  test('LastMarkerTimeChanged updates time', () => {
    const lastMarker = new LastMarker();
    lastMarker.handleEvent(LastMarkerTimeChanged(30.0));
    expect(lastMarker.time).toBe(30.0);
  });
});
