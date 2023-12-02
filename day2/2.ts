import { parseInput } from '../utils';

const lines = parseInput();

type Game = {
  id: number;
  power: number;
};

function processGame(line: string): Game {
  const [gameToken, setsString] = line.split(': ');
  const id = parseInt(gameToken.split(' ')[1], 10);

  const sets = setsString.split('; ');
  let maxRed = 0;
  let maxGreen = 0;
  let maxBlue = 0;
  for (const set of sets) {
    const colorGroupings = set.split(', ');
    for (const grouping of colorGroupings) {
      const [countString, color] = grouping.split(' ');
      const count = parseInt(countString, 10);
      if (color === 'red') {
        maxRed = Math.max(maxRed, count);
      }
      if (color === 'green') {
        maxGreen = Math.max(maxGreen, count);
      }
      if (color === 'blue') {
        maxBlue = Math.max(maxBlue, count);
      }
    }
  }
  return {
    id,
    power: maxRed * maxGreen * maxBlue,
  };
}

console.log(lines.map(processGame).reduce((acc, game) => acc + game.power, 0));
