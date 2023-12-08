import { parseInput } from '../utils';

const lines = parseInput();

const seedNumbers = lines[0].split(':')[1].trim().split(' ').map(Number);

const seedRanges: { start: number; range: number }[] = [];
while (seedNumbers.length) {
  const start = seedNumbers.shift()!;
  const range = seedNumbers.shift()!;
  seedRanges.push({ start, range });
}

type Entity =
  | 'seed'
  | 'soil'
  | 'fertilizer'
  | 'water'
  | 'light'
  | 'temperature'
  | 'humidity'
  | 'location';

const entityMap = new Map<
  Entity,
  { entity: Entity; sourceDestinationMap?: MapEntry[] }
>([
  ['seed', { entity: 'soil' }],
  ['soil', { entity: 'fertilizer' }],
  ['fertilizer', { entity: 'water' }],
  ['water', { entity: 'light' }],
  ['light', { entity: 'temperature' }],
  ['temperature', { entity: 'humidity' }],
  ['humidity', { entity: 'location' }],
]);

type MapEntry = {
  destinationStart: number;
  sourceStart: number;
  range: number;
};

function parseMap(source: Entity, destination: Entity) {
  const mapStart =
    lines.findIndex((line) => line === `${source}-to-${destination} map:`) + 1;
  const mapEnd = lines.findIndex(
    (line, index) => index > mapStart && line === '',
  );
  const mapLines = lines.slice(mapStart, mapEnd === -1 ? undefined : mapEnd);
  const mapEntries: MapEntry[] = mapLines
    .map((mapLine) => {
      const [destinationStart, sourceStart, range] = mapLine
        .split(' ')
        .map(Number);
      return { destinationStart, sourceStart, range };
    })
    .sort((a, b) => a.sourceStart - b.sourceStart);
  return mapEntries;
}

for (const [source, destinationEntry] of entityMap) {
  const mapEntries = parseMap(source, destinationEntry.entity);
  destinationEntry.sourceDestinationMap = mapEntries;
}

function mapSourceToDestination(
  source: number,
  sourceDestinationMap: MapEntry[],
) {
  for (const { destinationStart, sourceStart, range } of sourceDestinationMap) {
    if (source >= sourceStart && source < sourceStart + range) {
      return destinationStart + (source - sourceStart);
    }
  }
  return source;
}

let minLocation = Infinity;

for (const seedRange of seedRanges) {
  for (
    let seedNumber = seedRange.start;
    seedNumber < seedRange.start + seedRange.range;
    seedNumber++
  ) {
    let currentNumber = seedNumber;
    for (const destinationEntry of entityMap.values()) {
      const sourceDestinationMap = destinationEntry.sourceDestinationMap!;
      currentNumber = mapSourceToDestination(
        currentNumber,
        sourceDestinationMap,
      );
    }
    minLocation = Math.min(minLocation, currentNumber);
  }
}

console.log(minLocation);
