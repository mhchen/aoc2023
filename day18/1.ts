import { parseInput } from '../utils';

const lines = parseInput();

type Cube = {
  x: number;
  y: number;
  z: number;
};

const cubes = new Set<string>(
  lines.map((line) => {
    const [x, y, z] = line.split(',').map(Number);
    return `${x},${y},${z}`;
  }),
);

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

let total = 0;
for (const cube of cubes.values()) {
  const [x, y, z] = cube.split(',').map(Number);
  for (const neighbor of getNeighbors({ x, y, z })) {
    if (!cubes.has(`${neighbor.x},${neighbor.y},${neighbor.z}`)) {
      total++;
    }
  }
}
console.log(total);
