import { parseInput } from '../utils';

const input = parseInput()[0];

const areCharsUnique = (str: string) => {
  const chars = new Set();
  for (const char of str) {
    if (chars.has(char)) {
      return false;
    }
    chars.add(char);
  }
  return true;
};

for (let i = 0, j = i + 4; j < input.length; i++, j++) {
  const slice = input.slice(i, j);
  if (areCharsUnique(slice)) {
    console.log(j);
    process.exit(0);
  }
}
