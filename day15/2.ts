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
let allMinY = Infinity;
let allMaxY = -Infinity;

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
  const minY = sensorCoordinates.y - distance;
  const maxX = sensorCoordinates.x + distance;
  const maxY = sensorCoordinates.y + distance;
  if (minX < allMinX) {
    allMinX = minX;
  }

  if (maxX > allMaxX) {
    allMaxX = maxX;
  }

  if (minY < allMinY) {
    allMinY = minY;
  }

  if (maxY > allMaxY) {
    allMaxY = maxY;
  }

  sensors.push({
    x: sensorCoordinates.x,
    y: sensorCoordinates.y,
    distance,
  });
}

const MAX = 4000000;

function isPotential(x: number, y: number) {
  return x <= MAX && y <= MAX && x >= 0 && y >= 0;
}

function isInSensorRange(x: number, y: number) {
  return sensors.some((sensor) => {
    return (
      calculateManhattanDistance(sensor.x, sensor.y, x, y) <= sensor.distance
    );
  });
}

function calculateDistressBeaconTile() {
  for (const sensor of sensors) {
    let x = sensor.x + sensor.distance + 1;
    let { y } = sensor;
    while (x > sensor.x) {
      if (isPotential(x, y) && !isInSensorRange(x, y)) {
        return { x, y };
      }
      y++;
      x--;
    }
    while (y > sensor.y) {
      if (isPotential(x, y) && !isInSensorRange(x, y)) {
        return { x, y };
      }
      y--;
      x--;
    }
    while (x < sensor.x) {
      if (isPotential(x, y) && !isInSensorRange(x, y)) {
        return { x, y };
      }
      y--;
      x++;
    }
    while (y < sensor.y) {
      if (isPotential(x, y) && !isInSensorRange(x, y)) {
        return { x, y };
      }
      y++;
      x++;
    }
  }
  throw new Error('No tile found');
}

const { x, y } = calculateDistressBeaconTile();
console.log(x * MAX + y);
