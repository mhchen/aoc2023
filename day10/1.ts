import { Coordinate, parseInputIntoGrid } from '../utils';

type Direction = 'N' | 'E' | 'S' | 'W';

type Space = '.' | '|' | '-' | 'L' | 'J' | 'F' | '7' | 'S';

const spaceDirectionsMap: Record<Space, Direction[]> = {
  '.': [],
  '|': ['N', 'S'],
  '-': ['E', 'W'],
  L: ['N', 'E'],
  J: ['N', 'W'],
  F: ['S', 'E'],
  7: ['S', 'W'],
  S: [],
};

const grid = parseInputIntoGrid<Space>();

let start: { x: number; y: number } | undefined;
for (const { x, y, value } of grid) {
  if (value === 'S') {
    start = { x, y };
  }
}

if (!start) {
  throw new Error('No start found');
}

type Node = {
  x: number;
  y: number;
  value: Space;
};

function findNextCoordinate(
  coordinate: Coordinate,
  direction: Direction,
): Coordinate {
  switch (direction) {
    case 'N':
      return { x: coordinate.x, y: coordinate.y - 1 };
    case 'E':
      return { x: coordinate.x + 1, y: coordinate.y };
    case 'S':
      return { x: coordinate.x, y: coordinate.y + 1 };
    case 'W':
      return { x: coordinate.x - 1, y: coordinate.y };
    default:
      throw new Error('Invalid direction');
  }
}

function findFirstNodes(): Node[] {
  if (!start) {
    throw new Error('No start found');
  }
  const firstNodes: Node[] = [];
  for (const direction of ['N', 'E', 'S', 'W'] as Direction[]) {
    const nextCoordinate = findNextCoordinate(start, direction);
    const nextSpace = grid.get(nextCoordinate.x, nextCoordinate.y);
    if (
      (direction === 'N' &&
        (nextSpace === '|' || nextSpace === '7' || nextSpace === 'F')) ||
      (direction === 'E' &&
        (nextSpace === '-' || nextSpace === '7' || nextSpace === 'J')) ||
      (direction === 'W' &&
        (nextSpace === '-' || nextSpace === 'L' || nextSpace === 'F')) ||
      (direction === 'S' &&
        (nextSpace === '|' || nextSpace === 'L' || nextSpace === 'J'))
    ) {
      firstNodes.push({
        x: nextCoordinate.x,
        y: nextCoordinate.y,
        value: nextSpace,
      });
    }
  }
  return firstNodes;
}

let step = 1;

const currentNodes = findFirstNodes();
function coordinateToVisitedKey(coordinate: Coordinate): string {
  return `${coordinate.x},${coordinate.y}`;
}
const visited = new Set<string>([coordinateToVisitedKey(start)]);
if (currentNodes.length !== 2) {
  throw new Error('Wrong # of first nodes');
}

while (true) {
  const visitedKeys: string[] = [];
  if (
    currentNodes[0].x === currentNodes[1].x &&
    currentNodes[0].y === currentNodes[1].y
  ) {
    break;
  }

  for (const [index, node] of currentNodes.entries()) {
    const directions = spaceDirectionsMap[node.value];
    for (const direction of directions) {
      const nextCoordinate = findNextCoordinate(node, direction);
      if (visited.has(coordinateToVisitedKey(nextCoordinate))) {
        continue;
      }
      const nextSpace = grid.get(nextCoordinate.x, nextCoordinate.y)!;
      currentNodes[index] = {
        x: nextCoordinate.x,
        y: nextCoordinate.y,
        value: nextSpace,
      };
    }
    visitedKeys.push(coordinateToVisitedKey(node));
  }
  for (const visitedKey of visitedKeys) {
    visited.add(visitedKey);
  }
  step++;
}

console.log(step);
