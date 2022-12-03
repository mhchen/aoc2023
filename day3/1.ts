import { parseInput } from '../utils';

const lines = parseInput();

const alphabetString = 'abcdefghijklmnopqrstuvwxyz';
const alphabet = alphabetString.split('');
const uppercaseAlphabet = alphabetString.toUpperCase().split('');
const convertCharToPriority = (char: string) => {
  let index = alphabet.indexOf(char);
  if (index > -1) {
    return index + 1;
  }

  index = uppercaseAlphabet.indexOf(char);
  if (index === -1) {
    throw new Error(`Unrecognized char ${char}`);
  }
  return index + 27;
};

let total = 0;

for (const line of lines) {
  const halfLength = line.length / 2;
  const firstHalf = line.slice(0, halfLength);
  const secondHalf = line.slice(halfLength);

  const firstHalfSet = new Set(firstHalf.split(''));
  for (const char of secondHalf) {
    if (firstHalfSet.has(char)) {
      total += convertCharToPriority(char);
      break;
    }
  }
}
console.log(total);
