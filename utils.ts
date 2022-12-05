import fs from 'fs';
import path from 'path';

export function parseInput() {
  return fs
    .readFileSync(`${path.dirname(process.argv[1])}/input`, 'utf-8')
    .trimEnd()
    .split('\n');
}

type Row<T> = Map<number, T>;
type GridData<T> = Map<number, Row<T>>;

export class Grid<T extends string | number> {
  private data: GridData<T> = new Map();

  minX = 0;

  maxX = 0;

  minY = 0;

  maxY = 0;

  set(x: number, y: number, value: T) {
    let row = this.data.get(x);
    if (!row) {
      row = new Map<number, T>();
      this.data.set(x, row);
    }
    row.set(y, value);

    if (x > this.maxX) {
      this.maxX = x;
    }
    if (x < this.minX) {
      this.minX = x;
    }
    if (y > this.maxY) {
      this.maxY = y;
    }
    if (y < this.minY) {
      this.minY = y;
    }
  }

  get(x: number, y: number) {
    return this.data.get(x)?.get(y);
  }

  *adjacent(x: number, y: number) {
    for (const { x: x2, y: y2 } of [
      {
        x: x - 1,
        y: y - 1,
      },
      {
        x,
        y: y - 1,
      },
      {
        x: x + 1,
        y: y - 1,
      },
      {
        x: x - 1,
        y,
      },
      {
        x,
        y,
      },
      {
        x: x + 1,
        y,
      },
      {
        x: x - 1,
        y: y + 1,
      },
      {
        x,
        y: y + 1,
      },
      {
        x: x + 1,
        y: y + 1,
      },
    ]) {
      const value = this.get(x2, y2);

      if (value != null) {
        yield { x: x2, y: y2, value };
      }
    }
  }

  *[Symbol.iterator]() {
    for (let y = this.minY; y <= this.maxY; y++) {
      for (let x = this.minX; x <= this.maxX; x++) {
        yield { x, y, value: this.get(x, y) };
      }
    }
  }

  print() {
    for (let y = this.minY; y <= this.maxY; y++) {
      for (let x = this.minX; x <= this.maxX; x++) {
        process.stdout.write(this.get(x, y)?.toString() || '.');
        process.stdout.write(' ');
      }
      process.stdout.write('\n');
    }
  }

  size() {
    return (this.maxY + 1 - this.minY) * (this.maxX + 1 - this.minX);
  }
}
