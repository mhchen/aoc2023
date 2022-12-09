import { Grid, parseInput } from '../utils';

const lines = parseInput();

const grid = new Grid<number>();
for (const [y, line] of lines.entries()) {
  for (const [x, char] of line.split('').entries()) {
    grid.set(x, y, Number(char));
  }
}

function getCoordinateKey(x: number, y: number) {
  return `${x}-${y}`;
}

type Direction = 'top' | 'bottom' | 'left' | 'right';

const maxHeightMap = new Map<Direction, Map<string, number>>();
maxHeightMap.set('top', new Map());
maxHeightMap.set('bottom', new Map());
maxHeightMap.set('left', new Map());
maxHeightMap.set('right', new Map());

function calculateMaxHeight(
  x: number,
  y: number,
  direction: Direction,
): number {
  const key = getCoordinateKey(x, y);
  if (maxHeightMap.get(direction)!.has(key)) {
    return maxHeightMap.get(direction)!.get(key)!;
  }

  const current = grid.get(x, y)!;
  let newX = x;
  let newY = y;
  if (direction === 'left') {
    newX = x - 1;
  } else if (direction === 'right') {
    newX = x + 1;
  } else if (direction === 'top') {
    newY = y - 1;
  } else if (direction === 'bottom') {
    newY = y + 1;
  }

  const next = grid.get(newX, newY);
  if (next == null) {
    maxHeightMap.get(direction)!.set(key, current);
    return current;
  }

  const nextMaxHeight = calculateMaxHeight(newX, newY, direction);
  const maxHeight = Math.max(current, nextMaxHeight);

  maxHeightMap.get(direction)!.set(key, maxHeight);
  return maxHeight;
}

function calculateVisibility(
  x: number,
  y: number,
  direction: Direction,
): boolean {
  const current = grid.get(x, y)!;

  let newX = x;
  let newY = y;
  if (direction === 'left') {
    newX = x - 1;
  } else if (direction === 'right') {
    newX = x + 1;
  } else if (direction === 'top') {
    newY = y - 1;
  } else if (direction === 'bottom') {
    newY = y + 1;
  }

  const next = grid.get(newX, newY);
  const isVisible =
    next == null || calculateMaxHeight(newX, newY, direction) < current;

  return isVisible;
}

for (let x = 0; x < grid.maxX; x++) {
  let y = 0;
  calculateVisibility(x, y, 'bottom');
  y = grid.maxY;
  calculateVisibility(x, y, 'top');
}

for (let y = 0; y < grid.maxY; y++) {
  let x = 0;
  calculateVisibility(x, y, 'right');
  x = grid.maxX;
  calculateVisibility(x, y, 'left');
}

let visibleCount = 0;
for (const { x, y } of grid) {
  const visibleLeft = calculateVisibility(x, y, 'left');
  const visibleRight = calculateVisibility(x, y, 'right');
  const visibleTop = calculateVisibility(x, y, 'top');
  const visibleBottom = calculateVisibility(x, y, 'bottom');

  const isVisible = visibleLeft || visibleRight || visibleTop || visibleBottom;
  if (isVisible) {
    visibleCount++;
  }
}

console.log(visibleCount);
