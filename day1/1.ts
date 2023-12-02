import { parseInput } from '../utils';

const input = parseInput();
const calculateScoreForLine = (line: string) => {
  let firstDigit: string | undefined;
  let lastDigit: string | undefined;
  for (const char of line) {
    if (!Number.isNaN(Number(char))) {
      if (!firstDigit) {
        firstDigit = char;
      }
      lastDigit = char;
    }
  }

  return Number(`${firstDigit as string}${lastDigit as string}`);
};

console.log(input.reduce((acc, line) => acc + calculateScoreForLine(line), 0));
