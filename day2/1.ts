import { parseInput } from '../utils';

const lines = parseInput();

type Game = {
  id: number;
  isPossible: boolean;
};

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

function processGame(line: string): Game {
  const [gameToken, setsString] = line.split(': ');
  const id = parseInt(gameToken.split(' ')[1], 10);

  let isPossible = true;
  const sets = setsString.split('; ');
  for (const set of sets) {
    const colorGroupings = set.split(', ');
    for (const grouping of colorGroupings) {
      const [countString, color] = grouping.split(' ');
      const count = parseInt(countString, 10);
      if (
        (color === 'red' && count > MAX_RED) ||
        (color === 'green' && count > MAX_GREEN) ||
        (color === 'blue' && count > MAX_BLUE)
      ) {
        isPossible = false;
      }
    }
  }
  return {
    id,
    isPossible,
  };
}

console.log(
  lines
    .map(processGame)
    .filter((game) => game.isPossible)
    .reduce((acc, game) => acc + game.id, 0),
);
