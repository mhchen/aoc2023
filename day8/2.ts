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

let currentDirectionIndex = 0;

const nodes = [...graph.keys()].filter((node) => node.endsWith('A'));

const periods: number[] = [];

for (let node of nodes) {
  while (!node.endsWith('Z')) {
    const currentDirection = directions[currentDirectionIndex];
    node =
      currentDirection === 'L' ? graph.get(node)!.left : graph.get(node)!.right;
    currentDirectionIndex = (currentDirectionIndex + 1) % directions.length;
  }

  let period = 0;

  while (period === 0 || !node.endsWith('Z')) {
    const currentDirection = directions[currentDirectionIndex];
    node =
      currentDirection === 'L' ? graph.get(node)!.left : graph.get(node)!.right;
    currentDirectionIndex = (currentDirectionIndex + 1) % directions.length;
    period++;
  }
  periods.push(period);
}

function findPrimes(max: number) {
  const checked: Record<number, boolean> = {};
  const primes: number[] = [];
  for (let i = 2; i < max; i++) {
    checked[i] = false;
  }

  let i = 2;
  while (i < max / 2) {
    primes.push(i);
    let j = i;

    while (j < max) {
      checked[j] = true;
      j += i;
    }
    while (checked[i] === true) {
      i++;
    }
  }
  return primes;
}

const primes = findPrimes(Math.max(...periods));

function primeFactorize(period: number) {
  const primeMap = new Map<number, number>();
  let i = period;
  for (const prime of primes) {
    if (prime > period) {
      break;
    }

    while (i % prime === 0) {
      primeMap.set(prime, (primeMap.get(prime) || 0) + 1);
      i /= prime;
    }
  }
  return primeMap;
}

const primeMaps = periods.map(primeFactorize);

const allPrimes = new Set<number>();

for (const primeMap of primeMaps) {
  for (const prime of primeMap.keys()) {
    allPrimes.add(prime);
  }
}

let leastCommonMultiple = 1;
for (const prime of allPrimes) {
  const maxPower = Math.max(
    ...primeMaps.map((primeMap) => primeMap.get(prime)!).filter(Boolean),
  );
  leastCommonMultiple *= prime ** maxPower;
}
console.log(leastCommonMultiple);
