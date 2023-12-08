import { parseInput } from '../utils';

const lines = parseInput();

function calculateScore(line: string) {
  const allNumbersString = line.split(':')[1];
  const [winningNumbersString, numbersString] = allNumbersString.split('|');
  const winningNumbers = new Set(
    winningNumbersString.trim().split(/\s+/).map(Number),
  );
  const numbers = numbersString.trim().split(/\s+/).map(Number);
  let score = 0;
  for (const number of numbers) {
    if (winningNumbers.has(number)) {
      if (score === 0) {
        score = 1;
      } else {
        score *= 2;
      }
    }
  }
  return score;
}

console.log(
  lines.map(calculateScore).reduce((acc, score) => {
    return acc + score;
  }, 0),
);
