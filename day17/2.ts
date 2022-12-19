/* eslint-disable no-param-reassign */
import { Coordinate, Grid, parseInput } from '../utils';

const jets = parseInput()[0].split('');

type Rock = 'horizontalBar' | 'cross' | 'L' | 'verticalBar' | 'box';

const ROCKS: Rock[] = ['horizontalBar', 'cross', 'L', 'verticalBar', 'box'];

type GridState = {
  jetIndex: number;
  rockIndex: number;
  maxY: number;
};

function initializeGridState(): GridState {
  return {
    jetIndex: 0,
    rockIndex: 0,
    maxY: -1,
  };
}

const MAX_X = 6;

function dropRock(grid: Grid<string>, gridState: GridState) {
  const rock = ROCKS[gridState.rockIndex];
  gridState.rockIndex = (gridState.rockIndex + 1) % ROCKS.length;
  let rockCoordinates: Coordinate[];
  const startingY = gridState.maxY + 4;

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
    const jet = jets[gridState.jetIndex];
    gridState.jetIndex = (gridState.jetIndex + 1) % jets.length;
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
        if (y > gridState.maxY) {
          gridState.maxY = y;
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
  return grid.maxY;
}
function simulate(rockCount: number, grid: Grid<string>, gridState: GridState) {
  const currentY = grid.maxY;
  for (let i = 0; i < rockCount; i++) {
    dropRock(grid, gridState);
  }
  const afterY = grid.maxY;
  return afterY - currentY;
}

function stringifyGridRows(grid: Grid<string>) {
  const rows: string[] = [];
  for (let y = grid.maxY; y >= Math.max(grid.maxY - 40, grid.minY); y--) {
    const row: string[] = [];
    for (let x = grid.minX; x <= grid.maxX; x++) {
      row.push(grid.get(x, y) || '.');
    }
    rows.push(row.join(''));
  }
  return rows.join('$');
}

function getCacheKey(grid: Grid<string>, gridState: GridState) {
  return `${stringifyGridRows(grid)}|${gridState.jetIndex}|${
    gridState.rockIndex
  }`;
}

function detectCycleLength() {
  let i = 0;
  const grid = new Grid<string>();
  const gridState = initializeGridState();
  const stateToIMap = new Map<string, { i: number; gridState: GridState }>([
    [getCacheKey(grid, gridState), { i, gridState: { ...gridState } }],
  ]);

  while (true) {
    dropRock(grid, gridState);
    i++;
    const cacheKey = getCacheKey(grid, gridState);
    if (stateToIMap.has(cacheKey)) {
      const { i: initialI, gridState: initialGridState } =
        stateToIMap.get(cacheKey)!;
      const cycleLength = i - initialI;
      const maxYAtInitial = initialGridState.maxY;
      return {
        initialI,
        maxYAtInitial,
        grid,
        yPerCycle: gridState.maxY - maxYAtInitial,
        cycleLength,
        gridState,
      };
    }
    stateToIMap.set(cacheKey, {
      i,
      gridState: { ...gridState },
    });
  }
}

const target = 1000000000000;

const cycleLengthParams = detectCycleLength();
const totalCycles = Math.floor(
  (target - cycleLengthParams.initialI) / cycleLengthParams.cycleLength,
);
console.log(totalCycles);
console.log({
  maxYAtInitial: cycleLengthParams.maxYAtInitial,
  totalCycles,
  yPerCycle: cycleLengthParams.yPerCycle,
});
const maxY =
  cycleLengthParams.maxYAtInitial + totalCycles * cycleLengthParams.yPerCycle;
const remainingRocks =
  target -
  cycleLengthParams.initialI -
  totalCycles * cycleLengthParams.cycleLength;
console.log(remainingRocks);
console.log(maxY);
// const gridState = {
// ...cycleLengthParams.gridState,
// maxY,
// };
const difference = simulate(remainingRocks, cycleLengthParams.grid, {
  ...cycleLengthParams.gridState,
});
console.log(maxY + difference + 1);
