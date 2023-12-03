import { parseInput } from '../utils';

const lines = parseInput();

let sum = 0;

for (const [index, line] of lines.entries()) {
  const re = /\d+/g;
  let match: RegExpExecArray | null;

  const prevLine = lines[index - 1];
  const nextLine = lines[index + 1];
  // eslint-disable-next-line no-cond-assign
  while ((match = re.exec(line))) {
    const matchText = match[0];
    const matchIndex = match.index;
    const linesToCheckForSymbol = [prevLine, line, nextLine].filter(
      (line) => line?.trim().length,
    );
    const isAdjacentToSymbol = linesToCheckForSymbol.some((line) => {
      return /[^.0-9]/.exec(
        line.slice(
          Math.max(0, matchIndex - 1),
          matchIndex + matchText.length + 1,
        ),
      );
    });
    if (isAdjacentToSymbol) {
      sum += parseInt(matchText, 10);
    }
  }
}

console.log(sum);
