import { Grid, parseInput } from '../utils';

const lines = parseInput();

type Node = {
  x: number;
  y: number;
  elevation: number;
  parent?: Node;
  g?: number;
  h?: number;
  f?: number;
};

const grid = new Grid<Node>();

let start!: Node;
let end!: Node;

const CHAR_CODE_START = 96;

function charToElevation(char: string) {
  return char.charCodeAt(0) - CHAR_CODE_START;
}

for (const [y, line] of lines.entries()) {
  for (const [x, char] of line.split('').entries()) {
    let elevation: number;
    let startOrEnd: 'start' | 'end' | undefined;
    if (char === 'S') {
      startOrEnd = 'start';
      elevation = charToElevation('a');
    } else if (char === 'E') {
      elevation = charToElevation('z');
      startOrEnd = 'end';
    } else {
      elevation = charToElevation(char);
    }
    const node: Node = {
      x,
      y,
      elevation,
    };
    if (startOrEnd === 'start') {
      start = node;
      node.g = 0;
    } else if (startOrEnd === 'end') {
      end = node;
      node.h = 0;
    }
    grid.set(x, y, node);
  }
}

start.h = Math.abs(end.x - start.x) + Math.abs(end.y - start.y);
start.f = start.g! + start.h;

function getCoordinateKey(x: number, y: number) {
  return `${x}|${y}`;
}

const open = new Map<string, Node>();
open.set(getCoordinateKey(start.x, start.y), start);
const closed = new Map<string, Node>();

function getPath(node: Node) {
  let currentNode: Node | undefined = node;
  const nodes: Node[] = [];
  while (currentNode) {
    nodes.push(currentNode);
    currentNode = currentNode.parent;
  }
  return nodes.reverse();
}

while (open.size > 0) {
  const current = [...open.values()].sort((a, b) => a.f! - b.f!)[0];
  if (current.x === end.x && current.y === end.y) {
    console.log(getPath(current).length - 1);
    break;
  }
  const key = getCoordinateKey(current.x, current.y);
  open.delete(key);
  closed.set(key, current);
  const { x, y } = current;

  const neighborCoordinates = [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ];
  for (const coordinates of neighborCoordinates) {
    const { x: x2, y: y2 } = coordinates;
    const oldNode = grid.get(x2, y2);

    if (!oldNode) {
      continue;
    }
    const node: Node = {
      x: x2,
      y: y2,
      elevation: oldNode.elevation,
    };

    node.g = current.g! + 1;
    node.h = Math.abs(end.x - x2) + Math.abs(end.y - y2);
    node.f = node.g + node.h;
    const neighborKey = getCoordinateKey(x2, y2);

    if (node.elevation - current.elevation >= 2) {
      continue;
    }
    const existingNode = closed.get(neighborKey);

    if (existingNode && existingNode.g! < node.g) {
      continue;
    }

    node.parent = current;
    open.set(neighborKey, node);
  }
}
