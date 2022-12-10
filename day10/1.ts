import { parseInput } from '../utils';

const lines = parseInput();

type InstructionType = 'noop' | 'addx';

type Instruction = {
  type: InstructionType;
  value?: number;
};

const instructions: Instruction[] = lines.map((line) => {
  const tokens = line.split(' ');
  return {
    type: tokens[0] as InstructionType,
    value: tokens[1] ? Number(tokens[1]) : undefined,
  };
});

let cycle = 0;
let register = 1;

const signalStrengths: number[] = [];

function calculateSignalStrength() {
  return register * cycle;
}

function incrementCycle() {
  cycle++;
  if ([20, 60, 100, 140, 180, 220].includes(cycle)) {
    signalStrengths.push(calculateSignalStrength());
  }
}

for (const instruction of instructions) {
  incrementCycle();
  switch (instruction.type) {
    case 'noop':
      break;
    case 'addx':
      incrementCycle();
      register += instruction.value!;
      break;
    default:
      throw new Error('Unknown instruction');
  }
}

console.log(signalStrengths.reduce((sum, v) => sum + v, 0));
