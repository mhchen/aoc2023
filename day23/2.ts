import {
  Coordinate,
  coordinatesToString,
  Grid,
  parseInputIntoGrid,
  stringToCoordinates,
} from '../utils';

type GridItem = '.' | '#';

const originalGrid = parseInputIntoGrid<GridItem>();

type Direction = 'N' | 'S' | 'E' | 'W';

type Proposals = Map<string, Direction>;
type ProposedCounts = Map<string, number>;

function getNewCoordinates(coordinates: Coordinate, direction: Direction) {
  const newCoordinates = { ...coordinates };
  switch (direction) {
    case 'N':
      newCoordinates.y--;
      break;
    case 'S':
      newCoordinates.y++;
      break;
    case 'W':
      newCoordinates.x--;
      break;
    case 'E':
      newCoordinates.x++;
      break;
    default:
  }
  return newCoordinates;
}

type ProposalDeterminers = {
  direction: Direction;
  neighborFinders: NeighborFinder[];
}[];

function determineProposals(
  grid: Grid<GridItem>,
  proposalDeterminers: ProposalDeterminers,
): {
  proposals: Proposals;
  proposedCounts: ProposedCounts;
  elfCoordinates: Coordinate[];
} {
  const elfCoordinates: Coordinate[] = [];
  const proposals: Proposals = new Map();
  const proposedCounts: ProposedCounts = new Map();
  for (const coordinates of grid) {
    const { x, y, value } = coordinates;
    if (value !== '#') {
      continue;
    }
    elfCoordinates.push({ x, y });

    const hasCompany = [...grid.adjacent(x, y)].some((adjacent) => {
      return adjacent.value === '#';
    });
    if (!hasCompany) {
      continue;
    }

    for (const { direction, neighborFinders } of proposalDeterminers) {
      if (neighborFinders.some((finder) => finder(coordinates) === '#')) {
        continue;
      }
      const newCoordinates = getNewCoordinates(coordinates, direction);
      const newCoordinatesKey = coordinatesToString(newCoordinates);
      proposedCounts.set(
        newCoordinatesKey,
        (proposedCounts.get(newCoordinatesKey) || 0) + 1,
      );
      proposals.set(coordinatesToString(coordinates), direction);
      break;
    }
  }
  return {
    proposals,
    proposedCounts,
    elfCoordinates,
  };
}

let currentGrid = originalGrid;

type NeighborFinder = (coordinates: Coordinate) => GridItem | undefined;
const nwNeighborFinder = ({ x, y }: Coordinate) =>
  currentGrid.get(x - 1, y - 1);
const nNeighborFinder = ({ x, y }: Coordinate) => currentGrid.get(x, y - 1);
const neNeighborFinder = ({ x, y }: Coordinate) =>
  currentGrid.get(x + 1, y - 1);
const wNeighborFinder = ({ x, y }: Coordinate) => currentGrid.get(x - 1, y);
const eNeighborFinder = ({ x, y }: Coordinate) => currentGrid.get(x + 1, y);
const swNeighborFinder = ({ x, y }: Coordinate) =>
  currentGrid.get(x - 1, y + 1);
const sNeighborFinder = ({ x, y }: Coordinate) => currentGrid.get(x, y + 1);
const seNeighborFinder = ({ x, y }: Coordinate) =>
  currentGrid.get(x + 1, y + 1);

const proposalDeterminers: ProposalDeterminers = [
  {
    direction: 'N',
    neighborFinders: [nwNeighborFinder, nNeighborFinder, neNeighborFinder],
  },
  {
    direction: 'S',
    neighborFinders: [swNeighborFinder, sNeighborFinder, seNeighborFinder],
  },
  {
    direction: 'W',
    neighborFinders: [swNeighborFinder, wNeighborFinder, nwNeighborFinder],
  },
  {
    direction: 'E',
    neighborFinders: [seNeighborFinder, eNeighborFinder, neNeighborFinder],
  },
];
let i = 1;
while (true) {
  let hasMoved = false;
  const { proposals, proposedCounts, elfCoordinates } = determineProposals(
    currentGrid,
    proposalDeterminers,
  );
  const newGrid = new Grid<GridItem>();
  for (const coordinates of elfCoordinates) {
    const coordinatesKey = coordinatesToString(coordinates);
    const direction = proposals.get(coordinatesKey);
    if (!direction) {
      newGrid.set(coordinates.x, coordinates.y, '#');
      continue;
    }
    const newCoordinates = getNewCoordinates(coordinates, direction);
    if (proposedCounts.get(coordinatesToString(newCoordinates))! === 1) {
      hasMoved = true;
      newGrid.set(newCoordinates.x, newCoordinates.y, '#');
    } else {
      newGrid.set(coordinates.x, coordinates.y, '#');
    }
  }
  currentGrid = newGrid;
  proposalDeterminers.push(proposalDeterminers.shift()!);
  if (!hasMoved) {
    break;
  }
  i++;
}

console.log(i);
