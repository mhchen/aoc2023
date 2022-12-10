import { Grid, parseInput } from '../utils';

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

const grid = new Grid<string>();

function renderPixel() {
  const x = cycle % 40;
  const y = Math.floor(cycle / 40);
  const isLit = x >= register - 1 && x <= register + 1;
  grid.set(x, y, isLit ? '#' : '.');
}

function incrementCycle() {
  renderPixel();
  cycle++;
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
grid.print();
