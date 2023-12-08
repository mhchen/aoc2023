import { parseInput } from '../utils';

const [timeLine, distanceLine] = parseInput();

const times = timeLine.split(':')[1].trim().split(/\s+/).map(Number);
const distances = distanceLine.split(':')[1].trim().split(/\s+/).map(Number);

const allPossibilities: number[] = [];

for (const [index, time] of times.entries()) {
  const distance = distances[index];
  let possibilities = 0;
  for (let timeHeld = 1; timeHeld < time; timeHeld++) {
    const remainingTime = time - timeHeld;
    const distanceTraveled = remainingTime * timeHeld;
    if (distanceTraveled > distance) {
      possibilities += 1;
    }
  }
  allPossibilities.push(possibilities);
}

console.log(allPossibilities.reduce((acc, curr) => acc * curr, 1));
