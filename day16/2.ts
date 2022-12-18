import { parseInput } from '../utils';

const lines = parseInput();

type Node = {
  name: string;
  flowRate: number;
  isOpen: boolean;
  neighborNames: string[];
};

const nodeMap: Map<string, Node> = new Map();

for (const line of lines) {
  const [, sourceValve, flowRateString, destinationValves] =
    /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.*)/.exec(
      line,
    )!;
  const sourceNode: Node = {
    name: sourceValve,
    flowRate: parseInt(flowRateString, 10),
    isOpen: false,
    neighborNames: destinationValves.split(', '),
  };
  nodeMap.set(sourceValve, sourceNode);
}

type DistanceMapEntry = { distance: number; node: Node };
const valveNameDistances = new Map<string, Map<string, DistanceMapEntry>>();

for (const sourceValve of nodeMap.values()) {
  let current = sourceValve;
  const unvisited = new Set(nodeMap.values());
  unvisited.delete(current);
  const distanceMap = new Map<string, DistanceMapEntry>();
  for (const valveName of nodeMap.keys()) {
    const node = nodeMap.get(valveName)!;
    const distance = valveName === current.name ? 0 : Infinity;
    distanceMap.set(valveName, {
      node,
      distance,
    });
  }

  while (unvisited.size) {
    const neighbors = current.neighborNames.map((name) => nodeMap.get(name)!);
    const currentDistance = distanceMap.get(current.name)!.distance;
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor)) {
        continue;
      }

      const distance = currentDistance + 1;
      const distanceMapEntry = distanceMap.get(neighbor.name)!;
      if (distance < distanceMapEntry.distance) {
        distanceMapEntry.distance = distance;
      }
    }
    let minDistanceMapEntry: DistanceMapEntry = {
      node: current,
      distance: Infinity,
    };
    for (const distanceMapEntry of distanceMap.values()) {
      if (!unvisited.has(distanceMapEntry.node)) {
        continue;
      }
      const { distance } = distanceMapEntry;
      if (distance < minDistanceMapEntry.distance) {
        minDistanceMapEntry = distanceMapEntry;
      }
    }
    current = minDistanceMapEntry.node;
    unvisited.delete(minDistanceMapEntry.node);
  }
  const finalDistanceMap = new Map(
    [...distanceMap.entries()]
      .filter(([, distanceMapEntry]) => {
        return distanceMapEntry.node.flowRate;
      })
      .map(([distance, distanceMapEntry]) => [distance, distanceMapEntry]),
  );

  valveNameDistances.set(sourceValve.name, finalDistanceMap);
}
const start = nodeMap.get('AA')!;

function traverse(
  node: Node,
  remainingTime = 26,
  currentTotal = 0,
  unvisited?: Set<Node>,
  trail: Node[] = [],
) {
  trail.push(node);
  if (!unvisited) {
    // eslint-disable-next-line no-param-reassign
    unvisited = new Set(nodeMap.values());
  }

  if (!unvisited.size) {
    return {
      trail,
      total: currentTotal,
    };
  }

  const distanceMap = valveNameDistances.get(node.name)!;
  const pressureTotals: { trail: Node[]; total: number }[] = [];
  for (const unvisitedNode of unvisited) {
    const distanceMapEntry = distanceMap.get(unvisitedNode.name);
    if (!distanceMapEntry) {
      continue;
    }

    const newUnvisited = new Set(unvisited);
    newUnvisited.delete(distanceMapEntry.node);

    const newRemainingTimeAfterOpening =
      remainingTime - distanceMapEntry.distance - 1;
    const newPressureTotal =
      newRemainingTimeAfterOpening * distanceMapEntry.node.flowRate;
    if (newPressureTotal <= 0) {
      continue;
    }
    pressureTotals.push(
      traverse(
        unvisitedNode,
        newRemainingTimeAfterOpening,
        currentTotal + newPressureTotal,
        newUnvisited,
        [...trail],
      ),
    );
  }
  let maxTotal = -Infinity;
  let maxTrail!: Node[];
  for (const { trail, total } of pressureTotals) {
    if (total > maxTotal) {
      maxTrail = trail;
      maxTotal = total;
    }
  }
  if (maxTrail) {
    return {
      total: maxTotal,
      trail: maxTrail,
    };
  }
  return {
    trail,
    total: currentTotal,
  };
}

const firstRun = traverse(start);
const unvisited = new Set(nodeMap.values());
for (const node of firstRun.trail) {
  unvisited.delete(node);
}

const secondRun = traverse(start, 26, 0, unvisited);

console.log(firstRun.total + secondRun.total);
