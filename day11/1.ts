import { parseInput } from '../utils';

type Operation = (old: number) => number;

const monkeys: Monkey[] = [];

class Monkey {
  private testDivisible: number;

  private operation: Operation;

  public items: number[];

  private ifTrueMonkey: number;

  private ifFalseMonkey: number;

  public timesInspected = 0;

  constructor(
    items: number[],
    operation: Operation,
    testDivisible: number,
    ifTrueMonkey: number,
    ifFalseMonkey: number,
  ) {
    this.items = items;
    this.operation = operation;
    this.testDivisible = testDivisible;
    this.ifTrueMonkey = ifTrueMonkey;
    this.ifFalseMonkey = ifFalseMonkey;
  }

  catchItem(newItem: number): void {
    this.items.push(newItem);
  }

  tick() {
    while (this.items.length) {
      this.timesInspected++;
      const item = this.items.shift()!;
      let newItem = this.operation(item);
      newItem = Math.floor(newItem / 3);
      if (newItem % this.testDivisible === 0) {
        monkeys[this.ifTrueMonkey].catchItem(newItem);
      } else {
        monkeys[this.ifFalseMonkey].catchItem(newItem);
      }
    }
  }
}

const lines = parseInput();

const LINES_PER_MONKEY = 7;
for (let i = 0; i < lines.length; i += LINES_PER_MONKEY) {
  const [
    monkeyIndexLine,
    itemsLine,
    operationLine,
    testDivisibleLine,
    ifTrueMonkeyLine,
    ifFalseMonkeyLine,
  ] = lines.slice(i, LINES_PER_MONKEY + i);
  const currentMonkey = Number(monkeyIndexLine.split(' ')[1].replace(':', ''));
  const items = itemsLine.split(': ')[1].split(', ').map(Number);
  const funcString = operationLine.split(': ')[1].split(' = ')[1];
  const [, operandString, rightArgString] = /old (\*|\+) (\d+|old)/.exec(
    funcString,
  )!;

  const operation = (old: number) => {
    const rightArg = rightArgString === 'old' ? old : Number(rightArgString);
    if (operandString === '*') {
      return old * rightArg;
    }
    if (operandString === '+') {
      return old + rightArg;
    }
    throw new Error('Unknown operand');
  };

  const testDivisible = Number(testDivisibleLine.split(': divisible by ')[1]);
  const ifTrueMonkey = Number(ifTrueMonkeyLine.split(': throw to monkey ')[1]);
  const ifFalseMonkey = Number(
    ifFalseMonkeyLine.split(': throw to monkey ')[1],
  );

  monkeys[currentMonkey] = new Monkey(
    items,
    operation,
    testDivisible,
    ifTrueMonkey,
    ifFalseMonkey,
  );
}
for (let i = 0; i < 20; i++) {
  for (const monkey of monkeys) {
    monkey.tick();
  }
}
const allTimesInspected = monkeys.map(({ timesInspected }) => timesInspected);
allTimesInspected.sort((a, b) => b - a);
console.log(allTimesInspected[0] * allTimesInspected[1]);
