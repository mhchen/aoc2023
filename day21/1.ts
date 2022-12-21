import { clearLine } from 'readline';
import { parseInput } from '../utils';

const lines = parseInput();

type Operator = '+' | '*' | '-' | '/';

type MonkeyOperation = {
  operator: Operator;
  firstMonkeyName: string;
  secondMonkeyName: string;
};

type MonkeyValue = number | MonkeyOperation;

const monkeyMap = new Map<string, MonkeyValue>();

for (const line of lines) {
  const [name, monkeyValue] = line.split(': ');
  const monkeyValueNumber = parseInt(monkeyValue, 10);
  if (!Number.isNaN(monkeyValueNumber)) {
    monkeyMap.set(name, monkeyValueNumber);
    continue;
  }

  const [firstMonkeyName, operator, secondMonkeyName] = monkeyValue.split(' ');
  monkeyMap.set(name, {
    operator: operator as Operator,
    firstMonkeyName,
    secondMonkeyName,
  });
}
function evaluateMonkeyValue(name: string): number {
  const monkeyValue = monkeyMap.get(name)!;
  if (typeof monkeyValue === 'number') {
    return monkeyValue;
  }

  const { operator, firstMonkeyName, secondMonkeyName } = monkeyValue;
  return eval(
    `${evaluateMonkeyValue(firstMonkeyName)} ${operator} ${evaluateMonkeyValue(
      secondMonkeyName,
    )}`,
  ) as number;
}

console.log(evaluateMonkeyValue('jntz'));
