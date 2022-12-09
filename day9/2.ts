import { parseInput } from '../utils';

const lines = parseInput();

type Coordinate = {
  x: number;
  y: number;
};

const coordinates: Coordinate[] = Array(10)
  .fill(undefined)
  .map(() => ({
    x: 0,
    y: 0,
  }));

const visitedCoordinates = new Set<string>(['0,0']);

function getCoordinateKey(x: number, y: number) {
  return `${x}|${y}`;
}

function move(direction: string, distance: number) {
  let { x: headX, y: headY } = coordinates[0];
  for (let i = 0; i < distance; i++) {
    switch (direction) {
      case 'R':
        headX++;
        break;
      case 'L':
        headX--;
        break;
      case 'U':
        headY++;
        break;
      case 'D':
        headY--;
        break;
      default:
        throw new Error('Unknown direction');
    }
    coordinates[0].x = headX;
    coordinates[0].y = headY;

    for (let j = 0, k = 1; k < coordinates.length; j++, k++) {
      const { x: leadX, y: leadY } = coordinates[j];
      let { x: followX, y: followY } = coordinates[k];
      if (Math.abs(leadX - followX) <= 1 && Math.abs(leadY - followY) <= 1) {
        continue;
      }
      if (followX < leadX) {
        followX++;
      } else if (followX > leadX) {
        followX--;
      }
      if (followY < leadY) {
        followY++;
      } else if (followY > leadY) {
        followY--;
      }
      coordinates[k].x = followX;
      coordinates[k].y = followY;
      if (k === 9) {
        visitedCoordinates.add(getCoordinateKey(followX, followY));
      }
    }
  }
}

for (const line of lines) {
  const tokens = line.split(' ');
  const direction = tokens[0];
  const distance = Number(tokens[1]);

  move(direction, distance);
}

console.log(visitedCoordinates.size);
