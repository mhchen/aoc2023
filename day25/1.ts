import { parseInput } from '../utils';

const lines = parseInput();

function snafuNumberToDecimal(snafuNumber: string): number {
  let total = 0;
  for (const [currentPower, digit] of snafuNumber
    .split('')
    .reverse()
    .entries()) {
    const powerUnit = 5 ** currentPower;
    if (digit === '-') {
      total -= powerUnit;
    } else if (digit === '=') {
      total -= 2 * powerUnit;
    } else {
      total += parseInt(digit, 10) * powerUnit;
    }
  }
  return total;
}

function decimalToSnafuNumber(decimal: number): string {
  const digits: string[] = [];
  let currentPower = 0;
  while (decimal) {
    const nextPower = currentPower + 1;
    const powerUnit = 5 ** nextPower;
    const digit = (decimal % powerUnit) / 5 ** currentPower;
    let toSubtract = digit * 5 ** currentPower;
    let finalDigit: string | number = digit;
    if (digit === 3) {
      toSubtract = -(2 * 5 ** currentPower);
      finalDigit = '=';
    } else if (digit === 4) {
      toSubtract = -(5 ** currentPower);
      finalDigit = '-';
    }
    digits.push(finalDigit.toString());
    decimal -= toSubtract;
    currentPower++;
  }
  return digits.reverse().join('');
}

console.log(
  decimalToSnafuNumber(
    lines.reduce((sum, line) => snafuNumberToDecimal(line) + sum, 0),
  ),
);
