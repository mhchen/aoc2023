import { parseInput } from '../utils';

const lines = parseInput();

let total = 0;
for (const line of lines) {
  const [firstElf, secondElf] = line.split(',');
  const [firstElfMin, firstElfMax] = firstElf.split('-').map(Number);
  const [secondElfMin, secondElfMax] = secondElf.split('-').map(Number);
  if (
    (firstElfMin <= secondElfMin && firstElfMax >= secondElfMin) ||
    (secondElfMin <= firstElfMin && secondElfMax >= firstElfMin)
  ) {
    total += 1;
  }
}
console.log(total);
