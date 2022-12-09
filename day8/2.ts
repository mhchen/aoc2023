import { Grid, parseInput } from '../utils';

const lines = parseInput();

const grid = new Grid<number>();
for (const [y, line] of lines.entries()) {
  for (const [x, char] of line.split('').entries()) {
    grid.set(x, y, Number(char));
  }
}

type Direction = 'top' | 'bottom' | 'left' | 'right';

function calculateViewScoreForDirection(
  x: number,
  y: number,
  direction: Direction,
) {
  const current = grid.get(x, y)!;
  let score = 0;
  if (direction === 'top') {
    let newY = y - 1;
    while (grid.get(x, newY)) {
      score += 1;
      if (grid.get(x, newY)! >= current) {
        break;
      }
      newY -= 1;
    }
    return score;
  }
  if (direction === 'bottom') {
    let newY = y + 1;
    while (grid.get(x, newY)) {
      score += 1;
      if (grid.get(x, newY)! >= current) {
        break;
      }
      newY += 1;
    }
    return score;
  }
  if (direction === 'left') {
    let newX = x - 1;
    while (grid.get(newX, y)) {
      score += 1;
      if (grid.get(newX, y)! >= current) {
        break;
      }
      newX -= 1;
    }
    return score;
  }
  if (direction === 'right') {
    let newX = x + 1;
    while (grid.get(newX, y)) {
      score += 1;
      if (grid.get(newX, y)! >= current) {
        break;
      }
      newX += 1;
    }
    return score;
  }
  throw new Error('invalid direction');
}

function calculateViewScore(x: number, y: number) {
  const leftViewScore = calculateViewScoreForDirection(x, y, 'left');
  const rightViewScore = calculateViewScoreForDirection(x, y, 'right');
  const topViewScore = calculateViewScoreForDirection(x, y, 'top');
  const bottomViewScore = calculateViewScoreForDirection(x, y, 'bottom');
  return leftViewScore * rightViewScore * topViewScore * bottomViewScore;
}

const viewScores: number[] = [];
for (const { x, y } of grid) {
  viewScores.push(calculateViewScore(x, y));
  // if (calculateViewScore(x, y) >= 178000) {
  // console.log({ x, y });
  // }
}

console.log(Math.max(...viewScores));
