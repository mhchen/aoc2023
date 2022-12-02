import { parseInput } from '../utils';

enum Move {
  Rock = 'A',
  Paper = 'B',
  Scissors = 'C',
}

const moveToScore: Record<Move, number> = {
  [Move.Rock]: 1,
  [Move.Paper]: 2,
  [Move.Scissors]: 3,
};

enum Outcome {
  Win = 'Z',
  Draw = 'Y',
  Lose = 'X',
}

const outcomeToScore: Record<Outcome, number> = {
  [Outcome.Lose]: 0,
  [Outcome.Draw]: 3,
  [Outcome.Win]: 6,
};

const lines = parseInput();
let total = 0;
for (const line of lines) {
  const [opponent, my] = line.split(' ');
  if (opponent === Move.Rock) {
    if (my === Outcome.Win) {
      total += moveToScore[Move.Paper];
    } else if (my === Outcome.Lose) {
      total += moveToScore[Move.Scissors];
    } else {
      total += moveToScore[Move.Rock];
    }
  }
  if (opponent === Move.Scissors) {
    if (my === Outcome.Win) {
      total += moveToScore[Move.Rock];
    } else if (my === Outcome.Lose) {
      total += moveToScore[Move.Paper];
    } else {
      total += moveToScore[Move.Scissors];
    }
  }
  if (opponent === Move.Paper) {
    if (my === Outcome.Win) {
      total += moveToScore[Move.Scissors];
    } else if (my === Outcome.Lose) {
      total += moveToScore[Move.Rock];
    } else {
      total += moveToScore[Move.Paper];
    }
  }
  total += outcomeToScore[my as Outcome];
}
console.log(total);
