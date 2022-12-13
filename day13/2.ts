import { parseInput } from '../utils';

const lines = parseInput();
const index = 1;
type Comparable = number | Comparable[];
function isInOrder(left: Comparable, right: Comparable): boolean | null {
  if (typeof left === 'number' && typeof right === 'number') {
    if (left < right) {
      return true;
    }
    if (left === right) {
      return null;
    }
    return false;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0; i < left.length; i++) {
      if (right[i] === undefined) {
        return false;
      }
      const result = isInOrder(left[i], right[i]);

      if (result != null) {
        return result;
      }
    }
    if (left.length < right.length) {
      return true;
    }
    return null;
  }
  if (Array.isArray(left) && typeof right === 'number') {
    return isInOrder(left, [right]);
  }
  if (typeof left === 'number' && Array.isArray(right)) {
    return isInOrder([left], right);
  }
  throw new Error('You missed a possibility');
}

const comparables = lines
  .filter((line) => line.trim())
  .map((line) => eval(line) as Comparable);
const decoderPacket1 = [[2]];
const decoderPacket2 = [[6]];
comparables.push(decoderPacket1, decoderPacket2);
comparables.sort((a, b) => {
  const result = isInOrder(a, b);
  if (result) {
    return -1;
  }
  if (result == null) {
    return 0;
  }
  return 1;
});
console.log(
  (comparables.indexOf(decoderPacket1) + 1) *
    (comparables.indexOf(decoderPacket2) + 1),
);
