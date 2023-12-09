import { parseInput } from '../utils';

const lines = parseInput();

type Direction = 'R' | 'L';

const directions: Direction[] = lines[0].split('') as Direction[];

const graphLines = lines.slice(2);

const graph = new Map<string, { left: string; right: string }>();

for (const graphLine of graphLines) {
  const [node, edgesString] = graphLine.split(' = ');
  const [left, right] = edgesString
    .replace('(', '')
    .replace(')', '')
    .split(', ');
  graph.set(node, {
    left,
    right,
  });
}

let current = 'AAA';
let currentDirectionIndex = 0;
let steps = 0;

while (current !== 'ZZZ') {
  const currentDirection = directions[currentDirectionIndex];
  if (currentDirection === 'L') {
    current = graph.get(current)!.left;
  } else {
    current = graph.get(current)!.right;
  }
  currentDirectionIndex = (currentDirectionIndex + 1) % directions.length;
  steps++;
}

console.log(steps);
