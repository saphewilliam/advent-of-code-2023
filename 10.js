const pipeDirection = 'right';

function serializePoint(p) {
  return `x=${p[0]},y=${p[1]}`;
}

function deserializePoint(p) {
  return /x=(\d+),y=(\d+)/
    .exec(p)
    .slice(1, 3)
    .map((v) => parseInt(v));
}

function isInBounds(p) {
  const [x, y] = p;
  return !(y < 0 || y >= currentInput.length || x < 0 || x >= currentInput[0].length);
}

function getPipe(p) {
  if (!isInBounds(p)) return null;
  return currentInput[p[1]][p[0]];
}

function setPipe(p, pipe) {
  const [x, y] = p;
  if (!isInBounds(p)) return;
  currentInput[y] =
    currentInput[y].substring(0, x) + pipe + currentInput[y].substring(x + 1);
}

function getDirection(from, to) {
  const [fromX, fromY, toX, toY] = [...from, ...to];
  if (fromY - toY > 0) return 'up';
  if (toX - fromX > 0) return 'right';
  if (toY - fromY > 0) return 'down';
  if (fromX - toX > 0) return 'left';
}

function isValidNeighbour(from, to) {
  const pipe = getPipe(to);
  if (!pipe) return false;
  return {
    up: ['S', 'F', '7', '|'],
    right: ['S', '7', 'J', '-'],
    down: ['S', 'J', 'L', '|'],
    left: ['S', 'L', 'F', '-'],
  }[getDirection(from, to)].includes(pipe);
}

function getNeighbours(p) {
  const [x, y] = p;
  return (() => {
    switch (getPipe(p)) {
      case '|':
        return [
          [x, y - 1],
          [x, y + 1],
        ];
      case '-':
        return [
          [x - 1, y],
          [x + 1, y],
        ];
      case 'L':
        return [
          [x, y - 1],
          [x + 1, y],
        ];
      case 'J':
        return [
          [x, y - 1],
          [x - 1, y],
        ];
      case '7':
        return [
          [x, y + 1],
          [x - 1, y],
        ];
      case 'F':
        return [
          [x, y + 1],
          [x + 1, y],
        ];
      case 'S':
        return [
          [x, y - 1],
          [x + 1, y],
          [x, y + 1],
          [x - 1, y],
        ];
      default:
        return [];
    }
  })().filter((n) => isValidNeighbour(p, n));
}

function setLeftRight(point, direction) {
  const [x, y] = point;
  const [left, right] = {
    up: [
      [x - 1, y],
      [x + 1, y],
    ],
    left: [
      [x, y + 1],
      [x, y - 1],
    ],
    down: [
      [x + 1, y],
      [x - 1, y],
    ],
    right: [
      [x, y - 1],
      [x, y + 1],
    ],
  }[direction];

  if (getPipe(left) === '.') setPipe(left, pipeDirection === 'left' ? 'I' : 'O');
  if (getPipe(right) === '.') setPipe(right, pipeDirection === 'left' ? 'O' : 'I');
}

const currentInput = input.split('\n');

const startPoint = currentInput.reduce(
  (p, c, i) => (c.indexOf('S') !== -1 ? [c.indexOf('S'), i] : p),
  null,
);

const pathSet = new Set([serializePoint(startPoint)]);
const stack = getNeighbours(startPoint);

// Part 1: DFS traverse, record the path and its length
let steps = 0;
while (stack.length > 0) {
  const item = stack.pop();
  if (getPipe(item) === 'S' && steps > 1) break;
  if (!pathSet.has(serializePoint(item))) {
    pathSet.add(serializePoint(item));
    for (const n of getNeighbours(item)) stack.push(n);
    steps++;
  }
}

// Set all points that are not part of the main loop to '.'
for (let y = 0; y < currentInput.length; y++)
  for (let x = 0; x < currentInput[y].length; x++)
    if (!pathSet.has(serializePoint([x, y]))) setPipe([x, y], '.');

// Part 2: Traverse path again, and set all outside '.' to O and all inside '.' to I
const path = [...pathSet.entries()].map((p) => deserializePoint(p));
for (let i = 0; i < path.length; i++) {
  const point = path[i];
  if (i !== 0) setLeftRight(point, getDirection(path[i - 1], point));
  if (i !== path.length - 1) setLeftRight(point, getDirection(point, path[i + 1]));
}

// DFS fill all remaining '.' with either O or I
for (let y = 0; y < currentInput.length; y++) {
  for (let x = 0; x < currentInput[y].length; x++) {
    const p = [x, y];
    if (getPipe(p) === '.') {
      const discovered = new Set([serializePoint(p)]);
      const queue = [p];
      let io = null;
      while (queue.length > 0) {
        const item = queue.shift();
        for (const n of [
          [item[0], item[1] - 1],
          [item[0] + 1, item[1]],
          [item[0], item[1] - 1],
          [item[0] - 1, item[1]],
        ].filter((n) => {
          pipe = getPipe(n);
          if (pipe === 'I') io = 'I';
          if (pipe === 'O') io = 'O';
          return !discovered.has(serializePoint(n)) && isInBounds(n) && pipe === '.';
        })) {
          discovered.add(serializePoint(n));
          queue.push(n);
        }
      }

      const points = [...discovered.entries()].map((p) => deserializePoint(p));
      for (const point of points) setPipe(point, io);
    }
  }
}

console.log(
  (steps + 1) / 2,
  currentInput.reduce((p, c) => p + c.split('I').length - 1, 0),
);
