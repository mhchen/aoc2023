import { parseInput } from '../utils';

const lines = parseInput();

const hands = lines.map((line) => {
  const [hand, bidString] = line.split(' ');
  return {
    hand,
    bid: Number(bidString),
  };
});

type HandRank =
  | 'highcard'
  | 'pair'
  | 'twopair'
  | 'threeofakind'
  | 'fullhouse'
  | 'fourofakind'
  | 'fiveofakind';

const handRankToHandStrength = new Map<HandRank, number>([
  ['highcard', 1],
  ['pair', 2],
  ['twopair', 3],
  ['threeofakind', 4],
  ['fullhouse', 5],
  ['fourofakind', 6],
  ['fiveofakind', 7],
]);

function calculateHandRank(hand: string): HandRank {
  const cardCounts = new Map<string, number>();
  for (const card of hand.split('')) {
    cardCounts.set(card, (cardCounts.get(card) || 0) + 1);
  }

  const sortedCounts = [...cardCounts.values()].sort((a, b) => b - a);
  const firstNumber = sortedCounts[0];
  if (firstNumber === 5) {
    return 'fiveofakind';
  }
  if (firstNumber === 4) {
    return 'fourofakind';
  }
  if (firstNumber === 3) {
    if (sortedCounts[1] === 2) {
      return 'fullhouse';
    }
    return 'threeofakind';
  }
  if (firstNumber === 2) {
    if (sortedCounts[1] === 2) {
      return 'twopair';
    }
    return 'pair';
  }
  return 'highcard';
}

const cardToCardStrength = new Map<string, number>([
  ['1', 1],
  ['2', 2],
  ['3', 3],
  ['4', 4],
  ['5', 5],
  ['6', 6],
  ['7', 7],
  ['8', 8],
  ['9', 9],
  ['T', 10],
  ['J', 11],
  ['Q', 12],
  ['K', 13],
  ['A', 14],
]);

function getHandStrength(hand: string): number {
  return handRankToHandStrength.get(calculateHandRank(hand))!;
}

hands.sort((a, b) => {
  const aHandStrength = getHandStrength(a.hand);
  const bHandStrength = getHandStrength(b.hand);

  if (aHandStrength < bHandStrength) {
    return -1;
  }
  if (aHandStrength > bHandStrength) {
    return 1;
  }

  for (const [index, aCard] of a.hand.split('').entries()) {
    const bCard = b.hand[index];
    const aCardStrength = cardToCardStrength.get(aCard)!;
    const bCardStrength = cardToCardStrength.get(bCard)!;
    if (aCardStrength < bCardStrength) {
      return -1;
    }
    if (aCardStrength > bCardStrength) {
      return 1;
    }
  }
  return 0;
});

const finalScore = hands.reduce(
  (acc, { bid }, index) => acc + bid * (index + 1),
  0,
);
console.log(finalScore);
