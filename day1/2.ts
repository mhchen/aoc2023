import { parseInput } from '../utils';

const lines = parseInput();

const elves: number[][] = [];
let currentElf: number[] = [];
for (const line of lines) {
  if (line === '') {
    elves.push(currentElf);
    currentElf = [];
    continue;
  }
  currentElf.push(parseInt(line, 10));
}

elves.push(currentElf);

const totals: number[] = [];
for (const elf of elves) {
  totals.push(elf.reduce((a, b) => a + b, 0));
}

const sortedTotals = totals.sort((a, b) => a - b);
console.log(sortedTotals.slice(-3).reduce((a, b) => a + b, 0));
