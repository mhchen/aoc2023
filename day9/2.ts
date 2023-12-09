import { parseInput } from '../utils';

const lines = parseInput();

function findDifferences(sequence: number[]) {
  const differences: number[] = [];
  for (let i = 0; i < sequence.length - 1; i++) {
    differences.push(sequence[i + 1] - sequence[i]);
  }
  return differences;
}

function findPrevious(originalSequence: number[]) {
  let sequence = originalSequence;
  const sequences: number[][] = [sequence];
  while (!sequence.every((n) => n === 0)) {
    sequence = findDifferences(sequence);
    sequences.push(sequence);
  }
  let toSubtract = 0;

  for (let i = sequences.length - 1; i >= 0; i--) {
    const sequence = sequences[i];
    const newToSubtract = sequence[0] - toSubtract;
    toSubtract = newToSubtract;
  }
  return toSubtract;
}

const prevs: number[] = [];
for (const line of lines) {
  const sequence = line.split(/\s+/).map(Number);
  prevs.push(findPrevious(sequence));
}

console.log(prevs.reduce((acc, i) => acc + i, 0));
