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

const groups: string[][] = [];

for (let i = 0; i < lines.length; i += 3) {
  groups.push(lines.slice(i, i + 3));
}

let total = 0;

for (const group of groups) {
  const firstSet = new Set(group[0]);
  const secondSet = new Set(group[1]);
  const thirdSet = new Set(group[2]);

  let intersection = new Set([...firstSet].filter((x) => secondSet.has(x)));
  intersection = new Set([...intersection].filter((x) => thirdSet.has(x)));
  const [char] = intersection;
  total += convertCharToPriority(char);
}

console.log(total);
