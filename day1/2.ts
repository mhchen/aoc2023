import { parseInput } from '../utils';

const digitsAsWords = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

function lookUpDigit(restOfWord: string) {
  for (const [word, digit] of Object.entries(digitsAsWords)) {
    if (restOfWord.startsWith(word)) {
      return digit;
    }
  }
}

const input = parseInput();
const calculateScoreForLine = (line: string) => {
  let firstDigit: string | undefined;
  let lastDigit: string | undefined;
  for (const [index, char] of line.split('').entries()) {
    if (!Number.isNaN(Number(char))) {
      if (!firstDigit) {
        firstDigit = char;
      }
      lastDigit = char;
    }
    const maybeDigit = lookUpDigit(line.slice(index));
    if (maybeDigit) {
      if (!firstDigit) {
        firstDigit = String(maybeDigit);
      }
      lastDigit = String(maybeDigit);
    }
  }

  return Number(`${firstDigit as string}${lastDigit as string}`);
};

console.log(input.reduce((acc, line) => acc + calculateScoreForLine(line), 0));
