import { parseInput } from '../utils';

const lines = parseInput();

type Operator = '+' | '*' | '-' | '/' | '=';

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
    operator: name === 'root' ? '=' : (operator as Operator),
    firstMonkeyName,
    secondMonkeyName,
  });
}

function performOperation(
  firstValue: number,
  operator: Operator,
  secondValue: number,
) {
  switch (operator) {
    case '+':
      return firstValue + secondValue;
    case '-':
      return firstValue - secondValue;
    case '*':
      return firstValue * secondValue;
    case '/':
      return firstValue / secondValue;
    default:
      throw new Error(`Invalid operator ${operator}`);
  }
}

type MonkeyWithHasHuman = {
  name: string;
  value: number;
  hasHuman: boolean;
};

const finalMonkeyMap = new Map<string, MonkeyWithHasHuman>();

function evaluateMonkeyValue(name: string): MonkeyWithHasHuman {
  const monkeyValue = monkeyMap.get(name)!;
  let monkeyWithHasHuman: MonkeyWithHasHuman;
  if (name === 'humn') {
    monkeyWithHasHuman = {
      name,
      value: 0,
      hasHuman: true,
    };
  } else if (typeof monkeyValue === 'number') {
    monkeyWithHasHuman = {
      name,
      value: monkeyValue,
      hasHuman: false,
    };
  } else {
    const { operator, firstMonkeyName, secondMonkeyName } = monkeyValue;

    const firstMonkeyValue = evaluateMonkeyValue(firstMonkeyName);
    const secondMonkeyValue = evaluateMonkeyValue(secondMonkeyName);
    monkeyWithHasHuman = {
      name,
      value: performOperation(
        firstMonkeyValue.value,
        operator,
        secondMonkeyValue.value,
      ),
      hasHuman: firstMonkeyValue.hasHuman || secondMonkeyValue.hasHuman,
    };
  }
  finalMonkeyMap.set(name, monkeyWithHasHuman);

  if (!monkeyWithHasHuman.hasHuman) {
    monkeyMap.set(name, monkeyWithHasHuman.value);
  }

  return monkeyWithHasHuman;
}

const { firstMonkeyName, secondMonkeyName } = monkeyMap.get(
  'root',
)! as MonkeyOperation;
const rootMonkeys = [
  evaluateMonkeyValue(firstMonkeyName),
  evaluateMonkeyValue(secondMonkeyName),
];

const hasHumanMonkey = rootMonkeys.find((monkey) => monkey.hasHuman)!;
const otherMonkey = rootMonkeys.find((monkey) => !monkey.hasHuman)!;

const targetValue = otherMonkey.value;
console.log(rootMonkeys);

function findHumanValue(startMonkeyName: string, target: number): number {
  if (startMonkeyName === 'humn') {
    return target;
  }
  const monkey = monkeyMap.get(startMonkeyName)!;
  if (typeof monkey === 'number') {
    throw new Error('Whoops');
  }
  const { operator, firstMonkeyName, secondMonkeyName } = monkey;
  const firstMonkeyValue = finalMonkeyMap.get(firstMonkeyName)!;
  const secondMonkeyValue = finalMonkeyMap.get(secondMonkeyName)!;
  if (firstMonkeyValue.hasHuman) {
    let newTarget: number;
    if (operator === '/') {
      newTarget = secondMonkeyValue.value * target;
    } else if (operator === '*') {
      newTarget = target / secondMonkeyValue.value;
    } else if (operator === '+') {
      newTarget = target - secondMonkeyValue.value;
    } else {
      newTarget = secondMonkeyValue.value + target;
    }
    return findHumanValue(firstMonkeyName, newTarget);
  }
  if (!secondMonkeyValue.hasHuman) {
    throw new Error('Whoops whoops');
  }
  let newTarget: number;
  if (operator === '/') {
    newTarget = firstMonkeyValue.value / target;
  } else if (operator === '*') {
    newTarget = target / firstMonkeyValue.value;
  } else if (operator === '+') {
    newTarget = target - firstMonkeyValue.value;
  } else {
    newTarget = -(target - firstMonkeyValue.value);
  }
  return findHumanValue(secondMonkeyName, newTarget);
}

console.log(findHumanValue(hasHumanMonkey.name, targetValue));
