import { Coordinate, Grid, parseInput } from '../utils';

const jets = parseInput()[0].split('');
let jetIndex = 0;

type Rock = 'horizontalBar' | 'cross' | 'L' | 'verticalBar' | 'box';

const ROCKS: Rock[] = ['horizontalBar', 'cross', 'L', 'verticalBar', 'box'];
let currentRockIndex = 0;

const grid = new Grid<string>();

const MAX_X = 6;

let currentMaxY = -1;

function printGridWithTempCoordinates(coordinates: Coordinate[]) {
  const newGrid = grid.clone();
  for (const { x, y } of coordinates) {
    newGrid.set(x, y, '@');
  }
  newGrid.print();
}

function dropRock() {
  const rock = ROCKS[currentRockIndex++ % ROCKS.length];
  let rockCoordinates: Coordinate[];
  const startingY = currentMaxY + 4;

  switch (rock) {
    case 'horizontalBar':
      rockCoordinates = [
        {
          x: 2,
          y: startingY,
        },
        {
          x: 3,
          y: startingY,
        },
        {
          x: 4,
          y: startingY,
        },
        {
          x: 5,
          y: startingY,
        },
      ];
      break;
    case 'cross':
      rockCoordinates = [
        {
          x: 2,
          y: startingY + 1,
        },
        {
          x: 3,
          y: startingY + 1,
        },
        {
          x: 4,
          y: startingY + 1,
        },
        {
          x: 3,
          y: startingY + 2,
        },
        {
          x: 3,
          y: startingY,
        },
      ];
      break;
    case 'L':
      rockCoordinates = [
        {
          x: 2,
          y: startingY,
        },
        {
          x: 3,
          y: startingY,
        },
        {
          x: 4,
          y: startingY,
        },
        {
          x: 4,
          y: startingY + 1,
        },
        {
          x: 4,
          y: startingY + 2,
        },
      ];
      break;
    case 'verticalBar':
      rockCoordinates = [
        {
          x: 2,
          y: startingY,
        },
        {
          x: 2,
          y: startingY + 1,
        },
        {
          x: 2,
          y: startingY + 2,
        },
        {
          x: 2,
          y: startingY + 3,
        },
      ];
      break;
    case 'box':
      rockCoordinates = [
        {
          x: 2,
          y: startingY,
        },
        {
          x: 2,
          y: startingY + 1,
        },

        {
          x: 3,
          y: startingY,
        },
        {
          x: 3,
          y: startingY + 1,
        },
      ];
      break;
    default:
      throw new Error();
  }

  while (true) {
    const jet = jets[jetIndex++ % jets.length];
    if (jet === '>') {
      const willCollide = rockCoordinates.some(({ x, y }) => {
        const newX = x + 1;
        return newX > MAX_X || grid.get(newX, y) === '#';
      });
      if (!willCollide) {
        for (const coordinate of rockCoordinates) {
          coordinate.x += 1;
        }
      }
    } else {
      const willCollide = rockCoordinates.some(({ x, y }) => {
        const newX = x - 1;
        return newX < 0 || grid.get(newX, y) === '#';
      });
      if (!willCollide) {
        for (const coordinate of rockCoordinates) {
          coordinate.x -= 1;
        }
      }
    }

    const willCollide = rockCoordinates.some(({ x, y }) => {
      const newY = y - 1;
      return newY < 0 || grid.get(x, newY) === '#';
    });
    if (willCollide) {
      for (const { x, y } of rockCoordinates) {
        if (y > currentMaxY) {
          currentMaxY = y;
        }
        grid.set(x, y, '#');
      }
      break;
    } else {
      for (const coordinate of rockCoordinates) {
        coordinate.y -= 1;
      }
    }
  }
}

for (let i = 0; i < 2022; i++) {
  dropRock();
}
grid.print();
console.log(currentMaxY + 1);
