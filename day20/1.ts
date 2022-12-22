import { parseInput } from '../utils';

type NumberWrapper = { number: number };

const numbers: NumberWrapper[] = parseInput().map((line) => ({
  number: Number(line),
}));

const originalOrder = [...numbers];

function moveNumber(numberWrapper: NumberWrapper) {
  const { number } = numberWrapper;
  const index = numbers.indexOf(numberWrapper);
  numbers.splice(index, 1);
  const finalIndex = (index + number) % numbers.length;
  numbers.splice(finalIndex, 0, numberWrapper);
}

for (const number of originalOrder) {
  moveNumber(number);
}

function findNthAfterZero(n: number) {
  const index = numbers.findIndex(({ number }) => number === 0);
  return numbers[(index + n) % numbers.length].number;
}

console.log(
  findNthAfterZero(1000) + findNthAfterZero(2000) + findNthAfterZero(3000),
);
