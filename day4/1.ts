import { parseInput } from '../utils';

const lines = parseInput();

let total = 0;
for (const line of lines) {
  const [firstElf, secondElf] = line.split(',');
  const [firstElfMin, firstElfMax] = firstElf.split('-').map(Number);
  const [secondElfMin, secondElfMax] = secondElf.split('-').map(Number);
  if (
    (firstElfMin >= secondElfMin && firstElfMax <= secondElfMax) ||
    (secondElfMin >= firstElfMin && secondElfMax <= firstElfMax)
  ) {
    total += 1;
  }
}
console.log(total);
