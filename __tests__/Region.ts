import {
  RegionNameChanged, RegionNumberChanged, RegionTimeChanged, RegionLengthChanged,
  LastRegionNameChanged, LastRegionNumberChanged, LastRegionTimeChanged, LastRegionLengthChanged,
} from '../dist/Client/Events';
import {
  SetRegionName, SetRegionTime, SetRegionLength, SetRegionNumber,
  ReaperOscCommand,
} from '../dist/Client/Commands';
import {Region, LastRegion} from '../dist/Region';

function makeRegion(slotIndex = 1): { region: Region; sent: ReaperOscCommand[] } {
  const sent: ReaperOscCommand[] = [];
  const region = new Region(slotIndex, command => sent.push(command));
  return {region, sent};
}

describe('Region initial state', () => {
  test('name is empty string', () => {
    const {region} = makeRegion();
    expect(region.name).toBe('');
  });

  test('number is empty string', () => {
    const {region} = makeRegion();
    expect(region.number).toBe('');
  });

  test('time is 0', () => {
    const {region} = makeRegion();
    expect(region.time).toBe(0);
  });

  test('length is 0', () => {
    const {region} = makeRegion();
    expect(region.length).toBe(0);
  });
});

describe('Region handleEvent', () => {
  test('RegionNameChanged updates name for matching slotIndex', () => {
    const {region} = makeRegion(1);
    region.handleEvent(RegionNameChanged(1, 'Part A'));
    expect(region.name).toBe('Part A');
  });

  test('RegionNameChanged ignores different slotIndex', () => {
    const {region} = makeRegion(1);
    region.handleEvent(RegionNameChanged(2, 'Part B'));
    expect(region.name).toBe('');
  });

  test('RegionNumberChanged updates number for matching slotIndex', () => {
    const {region} = makeRegion(2);
    region.handleEvent(RegionNumberChanged(2, '3'));
    expect(region.number).toBe('3');
  });

  test('RegionNumberChanged ignores different slotIndex', () => {
    const {region} = makeRegion(2);
    region.handleEvent(RegionNumberChanged(1, '3'));
    expect(region.number).toBe('');
  });

  test('RegionTimeChanged updates time for matching slotIndex', () => {
    const {region} = makeRegion(1);
    region.handleEvent(RegionTimeChanged(1, 4.0));
    expect(region.time).toBe(4.0);
  });

  test('RegionTimeChanged ignores different slotIndex', () => {
    const {region} = makeRegion(1);
    region.handleEvent(RegionTimeChanged(2, 4.0));
    expect(region.time).toBe(0);
  });

  test('RegionLengthChanged updates length for matching slotIndex', () => {
    const {region} = makeRegion(1);
    region.handleEvent(RegionLengthChanged(1, 8.0));
    expect(region.length).toBe(8.0);
  });

  test('RegionLengthChanged ignores different slotIndex', () => {
    const {region} = makeRegion(1);
    region.handleEvent(RegionLengthChanged(2, 8.0));
    expect(region.length).toBe(0);
  });
});

describe('Region write methods', () => {
  test('rename sends SetRegionName using parsed number', () => {
    const {region, sent} = makeRegion(1);
    region.handleEvent(RegionNumberChanged(1, '2'));
    region.rename('Bridge');
    expect(sent[0]).toMatchObject(SetRegionName(2, 'Bridge'));
  });

  test('setTime sends SetRegionTime using parsed number', () => {
    const {region, sent} = makeRegion(1);
    region.handleEvent(RegionNumberChanged(1, '1'));
    region.setTime(16.0);
    expect(sent[0]).toMatchObject(SetRegionTime(1, 16.0));
  });

  test('setLength sends SetRegionLength using parsed number', () => {
    const {region, sent} = makeRegion(1);
    region.handleEvent(RegionNumberChanged(1, '1'));
    region.setLength(12.0);
    expect(sent[0]).toMatchObject(SetRegionLength(1, 12.0));
  });

  test('setNumber sends SetRegionNumber using parsed number', () => {
    const {region, sent} = makeRegion(1);
    region.handleEvent(RegionNumberChanged(1, '1'));
    region.setNumber(5);
    expect(sent[0]).toMatchObject(SetRegionNumber(1, 5));
  });
});

describe('LastRegion initial state', () => {
  test('name is empty string', () => {
    const lastRegion = new LastRegion();
    expect(lastRegion.name).toBe('');
  });

  test('number is empty string', () => {
    const lastRegion = new LastRegion();
    expect(lastRegion.number).toBe('');
  });

  test('time is 0', () => {
    const lastRegion = new LastRegion();
    expect(lastRegion.time).toBe(0);
  });

  test('length is 0', () => {
    const lastRegion = new LastRegion();
    expect(lastRegion.length).toBe(0);
  });
});

describe('LastRegion handleEvent', () => {
  test('LastRegionNameChanged updates name', () => {
    const lastRegion = new LastRegion();
    lastRegion.handleEvent(LastRegionNameChanged('Verse'));
    expect(lastRegion.name).toBe('Verse');
  });

  test('LastRegionNumberChanged updates number', () => {
    const lastRegion = new LastRegion();
    lastRegion.handleEvent(LastRegionNumberChanged('2'));
    expect(lastRegion.number).toBe('2');
  });

  test('LastRegionTimeChanged updates time', () => {
    const lastRegion = new LastRegion();
    lastRegion.handleEvent(LastRegionTimeChanged(20.0));
    expect(lastRegion.time).toBe(20.0);
  });

  test('LastRegionLengthChanged updates length', () => {
    const lastRegion = new LastRegion();
    lastRegion.handleEvent(LastRegionLengthChanged(16.0));
    expect(lastRegion.length).toBe(16.0);
  });
});
