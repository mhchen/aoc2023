import { parseInput } from '../utils';

const lines = parseInput();

type Cube = {
  x: number;
  y: number;
  z: number;
};

let maxX = -Infinity;
let minX = Infinity;
let maxY = -Infinity;
let minY = Infinity;
let maxZ = -Infinity;
let minZ = Infinity;

const cubes = new Set<string>(
  lines.map((line) => {
    const [x, y, z] = line.split(',').map(Number);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    minZ = Math.min(minZ, z);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    maxZ = Math.max(maxZ, z);
    return `${x},${y},${z}`;
  }),
);

maxX++;
maxY++;
maxZ++;
minX--;
minY--;
minZ--;

function getNeighbors({ x, y, z }: Cube): Cube[] {
  return [
    { x: x + 1, y, z },
    { x: x - 1, y, z },
    { x, y: y + 1, z },
    { x, y: y - 1, z },
    { x, y, z: z + 1 },
    { x, y, z: z - 1 },
  ];
}
const neighborMap = new Map<string, { isReachable: boolean; count: number }>();

function cubeToString(cube: Cube): string {
  return `${cube.x},${cube.y},${cube.z}`;
}

for (const cube of cubes.values()) {
  const [x, y, z] = cube.split(',').map(Number);
  for (const neighbor of getNeighbors({ x, y, z })) {
    if (neighborMap.has(cubeToString(neighbor))) {
      neighborMap.get(cubeToString(neighbor))!.count++;
    } else {
      neighborMap.set(cubeToString(neighbor), {
        isReachable: false,
        count: 1,
      });
    }
  }
}

const visited = new Set<string>();
const queue: string[] = [`${maxX},${maxY},${maxZ}`];
function floodFill(): void {
  while (queue.length) {
    const coordinates = queue.pop()!;
    const [x, y, z] = coordinates.split(',').map(Number);
    visited.add(coordinates);
    if (neighborMap.has(coordinates)) {
      neighborMap.get(coordinates)!.isReachable = true;
    }
    for (const neighbor of getNeighbors({ x, y, z })) {
      const neighborString = cubeToString(neighbor);
      if (
        !visited.has(neighborString) &&
        !cubes.has(neighborString) &&
        neighbor.x <= maxX &&
        neighbor.x >= minX &&
        neighbor.y <= maxY &&
        neighbor.y >= minY &&
        neighbor.z <= maxZ &&
        neighbor.z >= minZ
      ) {
        queue.push(neighborString);
      }
    }
  }
}

floodFill();

console.log(
  [...neighborMap.values()]
    .filter(({ isReachable }) => isReachable)
    .reduce((sum, { count }) => sum + count, 0),
);
