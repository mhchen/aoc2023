import { Grid, parseInput } from '../utils';

const lines = parseInput();
const grid = new Grid<string>();
let highestY = 0;

function set(x: number, y: number, value: string) {
  grid.set(x, y, value);
  if (y > highestY) {
    highestY = y;
  }
}
for (const line of lines) {
  const coordinatesList = line.split(' -> ');
  for (const [i, coordinates] of coordinatesList.entries()) {
    let [x, y] = coordinates.split(',').map(Number);
    const nextCoordinates = coordinatesList[i + 1];
    if (!nextCoordinates) {
      break;
    }

    const [nextX, nextY] = nextCoordinates.split(',').map(Number);
    if (x === nextX) {
      if (y < nextY) {
        while (y < nextY) {
          set(x, y, '#');
          y++;
        }
      } else {
        while (y > nextY) {
          set(x, y, '#');
          y--;
        }
      }
    } else if (y === nextY) {
      if (x < nextX) {
        while (x < nextX) {
          set(x, y, '#');
          x++;
        }
      } else {
        while (x > nextX) {
          set(x, y, '#');
          x--;
        }
      }
    }
    set(x, y, '#');
  }
}

function isBlocked(x: number, y: number) {
  return grid.get(x, y) === '#' || grid.get(x, y) === 'o';
}

const pour = () => {
  let x = 500;
  let y = 0;

  while (true) {
    if (y > highestY) {
      return false;
    }
    if (!isBlocked(x, y + 1)) {
      y += 1;
      continue;
    }
    if (!isBlocked(x - 1, y + 1)) {
      x -= 1;
      y += 1;
      continue;
    }
    if (!isBlocked(x + 1, y + 1)) {
      x += 1;
      y += 1;
      continue;
    }
    grid.set(x, y, 'o');
    return true;
  }
};

let i = 0;
while (true) {
  const hasPoured = pour();
  if (!hasPoured) {
    break;
  }
  i++;
}
console.log(i);
