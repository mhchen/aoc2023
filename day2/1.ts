import { parseInput } from '../utils';

const myToScore: Record<string, number> = {
  X: 1,
  Y: 2,
  Z: 3,
};

const lines = parseInput();
let total = 0;
for (const line of lines) {
  const [opponent, my] = line.split(' ');
  let score = myToScore[my];
  if (opponent === 'A') {
    if (my === 'X') {
      score += 3;
    } else if (my === 'Y') {
      score += 6;
    }
  }
  if (opponent === 'B') {
    if (my === 'Y') {
      score += 3;
    } else if (my === 'Z') {
      score += 6;
    }
  }
  if (opponent === 'C') {
    if (my === 'Z') {
      score += 3;
    } else if (my === 'X') {
      score += 6;
    }
  }

  total += score;
}
console.log(total);
