import { parseInput } from '../utils';

const lines = parseInput();

type Coordinate = {
  x: number;
  y: number;
};

const headCoordinate = {
  x: 0,
  y: 0,
};

const tailCoordinate = {
  x: 0,
  y: 0,
};

const visitedCoordinates = new Set<string>(['0,0']);

function getCoordinateKey(x: number, y: number) {
  return `${x}|${y}`;
}

function move(direction: string, distance: number) {
  let { x: headX, y: headY } = headCoordinate;
  let { x: tailX, y: tailY } = tailCoordinate;
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
    if (Math.abs(headX - tailX) <= 1 && Math.abs(headY - tailY) <= 1) {
      continue;
    }
    if (tailX < headX) {
      tailX++;
    }
    if (tailX > headX) {
      tailX--;
    }
    if (tailY < headY) {
      tailY++;
    }
    if (tailY > headY) {
      tailY--;
    }
    visitedCoordinates.add(getCoordinateKey(tailX, tailY));
  }
  headCoordinate.x = headX;
  headCoordinate.y = headY;
  tailCoordinate.x = tailX;
  tailCoordinate.y = tailY;
}

for (const line of lines) {
  const tokens = line.split(' ');
  const direction = tokens[0];
  const distance = Number(tokens[1]);

  move(direction, distance);
}
