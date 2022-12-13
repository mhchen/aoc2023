import { parseInput } from '../utils';

const lines = parseInput();
let index = 1;
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

let total = 0;
for (let i = 0; i + 1 < lines.length; i += 3) {
  const first = eval(lines[i]) as Comparable;
  const second = eval(lines[i + 1]) as Comparable;
  if (isInOrder(first, second)) {
    total += index;
  }
  index++;
}
console.log(total);
