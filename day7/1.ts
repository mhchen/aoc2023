import { parseInput } from '../utils';

const lines = parseInput().slice(1);

let lsMode = false;

type Directory = {
  name: string;
  contents: (Directory | File)[];
  parent: Directory | null;
};

type File = {
  name: string;
  size: number;
};

const root: Directory = {
  name: '/',
  contents: [],
  parent: null,
};

let current = root;

function executeCommand(line: string) {
  const command = line.replace(/^\$ /, '');
  if (command === 'ls') {
    lsMode = true;
    return;
  }
  const dirName = command.split(' ')[1];
  if (dirName === '..') {
    if (!current.parent) {
      throw new Error('No parent found');
    }
    current = current.parent;
  } else {
    const newDirectory = current.contents.find((d) => d.name === dirName);
    current = newDirectory as Directory;
  }
  lsMode = false;
}

const directorySizeMap = new Map<Directory, number>();

for (const line of lines) {
  if (line.startsWith('$')) {
    executeCommand(line);
  } else if (lsMode) {
    if (line.startsWith('dir')) {
      const name = line.split(' ')[1];
      const dir: Directory = {
        name,
        contents: [],
        parent: current,
      };
      current.contents.push(dir);
    } else {
      const tokens = line.split(' ');
      const name = tokens[1];
      const size = Number(tokens[0]);
      const file: File = {
        name,
        size,
      };
      current.contents.push(file);
    }
  }
}

function calculateDirectorySize(dir: Directory) {
  let size = 0;
  if (directorySizeMap.has(dir)) {
    return directorySizeMap.get(dir)!;
  }
  for (const item of dir.contents) {
    if ('contents' in item) {
      size += calculateDirectorySize(item);
    } else {
      size += item.size;
    }
  }
  directorySizeMap.set(dir, size);
  return size;
}

for (const dir of root.contents) {
  if ('contents' in dir) {
    calculateDirectorySize(dir);
  }
}
let total = 0;
for (const size of directorySizeMap.values()) {
  if (size <= 100000) {
    total += size;
  }
}

console.log(total);
