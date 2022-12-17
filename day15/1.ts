import { Grid, parseInput } from '../utils';

const lines = parseInput();

const grid = new Grid<string>();

function parseCoordinates(coordinates: string) {
  const [, x, y] = /x=(-?\d+), y=(-?\d+)/.exec(coordinates)!.map(Number);
  return {
    x,
    y,
  };
}

function calculateManhattanDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

let allMinX = Infinity;
let allMaxX = -Infinity;

type Sensor = {
  x: number;
  y: number;
  distance: number;
};

const sensors: Sensor[] = [];

for (const line of lines) {
  const [sensorCoordinates, beaconCoordinates] =
    /Sensor at (.*): closest beacon is at (.*)/
      .exec(line)!
      .slice(1)
      .map(parseCoordinates);
  grid.set(sensorCoordinates.x, sensorCoordinates.y, 'S');
  grid.set(beaconCoordinates.x, beaconCoordinates.y, 'B');
  const distance = calculateManhattanDistance(
    sensorCoordinates.x,
    sensorCoordinates.y,
    beaconCoordinates.x,
    beaconCoordinates.y,
  );
  const minX = sensorCoordinates.x - distance;
  const maxX = sensorCoordinates.x + distance;
  if (minX < allMinX) {
    allMinX = minX;
  }

  if (maxX > allMaxX) {
    allMaxX = maxX;
  }

  sensors.push({
    x: sensorCoordinates.x,
    y: sensorCoordinates.y,
    distance,
  });
}

function isInSensorRange(x: number, y: number) {
  return sensors.some((sensor) => {
    return (
      calculateManhattanDistance(sensor.x, sensor.y, x, y) <= sensor.distance &&
      !grid.get(x, y)
    );
  });
}

let total = 0;

for (let x = allMinX; x < allMaxX; x++) {
  if (isInSensorRange(x, 2000000)) {
    total += 1;
  }
}

console.log(total);
