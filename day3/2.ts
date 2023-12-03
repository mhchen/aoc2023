import { parseInput } from '../utils';

const lines = parseInput();

type Coordinate = {
  x: number;
  y: number;
};

const coordinateToString = ({ x, y }: Coordinate) => {
  return `${x},${y}`;
};

const gearAdjacencies = new Map<string, number[]>();

for (const [index, line] of lines.entries()) {
  const re = /\d+/g;
  let match: RegExpExecArray | null;

  const prevLine = lines[index - 1];
  const nextLine = lines[index + 1];
  // eslint-disable-next-line no-cond-assign
  while ((match = re.exec(line))) {
    const matchText = match[0];
    const matchIndex = match.index;
    const linesToCheckForGear = [
      { index: index - 1, line: prevLine },
      { index, line },
      { index: index + 1, line: nextLine },
    ].filter(({ line }) => line?.trim().length);
    const gearPositions: Coordinate[] = [];

    for (const {
      line: lineToCheck,
      index: maybeGearLineIndex,
    } of linesToCheckForGear) {
      let gearMatch: RegExpExecArray | null;
      const re = /\*/g;
      // eslint-disable-next-line no-cond-assign
      while ((gearMatch = re.exec(lineToCheck))) {
        if (
          gearMatch &&
          gearMatch.index >= matchIndex - 1 &&
          gearMatch.index <= matchIndex + matchText.length
        ) {
          gearPositions.push({
            x: gearMatch.index,
            y: maybeGearLineIndex,
          });
        }
      }
    }

    for (const { x, y } of gearPositions) {
      const gearCoordinate = coordinateToString({
        x,
        y,
      });
      if (!gearAdjacencies.has(gearCoordinate)) {
        gearAdjacencies.set(gearCoordinate, []);
      }
      gearAdjacencies.get(gearCoordinate)!.push(parseInt(matchText, 10));
    }
  }
}

console.log(
  [...gearAdjacencies.entries()]
    .filter(([, numbers]) => numbers.length === 2)
    .reduce((acc, [, numbers]) => {
      const [first, second] = numbers;
      return acc + first * second;
    }, 0),
);
