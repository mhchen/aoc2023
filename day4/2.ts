import { parseInput } from '../utils';

const lines = parseInput();

const gameIdToScores = new Map<number, number>();

const inventory = new Map<number, number>();
let usedCardCount = 0;

function countWinningCards(line: string) {
  const [gameIdString, allNumbersString] = line.split(':');
  const gameId = Number(/\d+/.exec(gameIdString)![0]);
  const [winningNumbersString, numbersString] = allNumbersString.split('|');
  const winningNumbers = new Set(
    winningNumbersString.trim().split(/\s+/).map(Number),
  );
  const numbers = numbersString.trim().split(/\s+/).map(Number);
  let score = 0;
  for (const number of numbers) {
    if (winningNumbers.has(number)) {
      score++;
    }
  }
  gameIdToScores.set(gameId, score);
  inventory.set(gameId, 1);
}

for (const line of lines) {
  countWinningCards(line);
}

while (inventory.size > 0) {
  const iterator = inventory.entries();
  const next = iterator.next();
  if (next.done) {
    break;
  }

  const [gameId, cardCount] = next.value;
  let winningCards = gameIdToScores.get(gameId)!;

  let currentGameId = gameId;
  while (winningCards > 0) {
    currentGameId++;
    inventory.set(currentGameId, inventory.get(currentGameId)! + cardCount);
    winningCards--;
  }
  usedCardCount += cardCount;
  inventory.delete(gameId);
}

console.log(usedCardCount);
