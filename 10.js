const currentInput = input.split('\n');

const PIPE_DIRECTION = 'right'; // TODO determine this dynamically

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
  if (!isInBounds(p)) return;
  currentInput[p[1]] =
    currentInput[p[1]].substring(0, p[0]) + pipe + currentInput[p[1]].substring(p[0] + 1);
}

function getDirection(from, to) {
  if (from[1] - to[1] > 0) return 'up';
  if (to[0] - from[0] > 0) return 'right';
  if (to[1] - from[1] > 0) return 'down';
  if (from[0] - to[0] > 0) return 'left';
}

function isValidNeighbour(from, to) {
  if (!getPipe(to)) return false;
  return {
    up: ['S', 'F', '7', '|'],
    right: ['S', '7', 'J', '-'],
    down: ['S', 'J', 'L', '|'],
    left: ['S', 'L', 'F', '-'],
  }[getDirection(from, to)].includes(getPipe(to));
}

const up = (p) => [p[0], p[1] - 1];
const right = (p) => [p[0] + 1, p[1]];
const down = (p) => [p[0], p[1] + 1];
const left = (p) => [p[0] - 1, p[1]];
const walk = (p, direction) => direction(p);

function getNeighbours(p) {
  return (() => {
    switch (getPipe(p)) {
      case '|':
        return [up, down];
      case '-':
        return [left, right];
      case 'L':
        return [up, right];
      case 'J':
        return [up, left];
      case '7':
        return [down, left];
      case 'F':
        return [down, right];
      case 'S':
        return [up, down, left, right];
      default:
        return [];
    }
  })()
    .map((dir) => walk(p, dir))
    .filter((n) => isValidNeighbour(p, n));
}

function setLeftRight(p, direction) {
  const [leftP, rightP] = {
    up: [left, right],
    left: [down, up],
    down: [right, left],
    right: [up, down],
  }[direction].map((dir) => walk(p, dir));

  if (getPipe(leftP) === '.') setPipe(leftP, PIPE_DIRECTION === 'left' ? 'I' : 'O');
  if (getPipe(rightP) === '.') setPipe(rightP, PIPE_DIRECTION === 'left' ? 'O' : 'I');
}

const startPoint = currentInput.reduce(
  (p, c, i) => (c.indexOf('S') !== -1 ? [c.indexOf('S'), i] : p),
  null,
);

// Part 1: DFS traverse, record the path and its length
let steps = 0;
const pathDiscovered = new Set([serializePoint(startPoint)]);
const stack = getNeighbours(startPoint);
while (stack.length > 0) {
  const point = stack.pop();
  if (getPipe(point) === 'S' && steps > 1) break;
  if (!pathDiscovered.has(serializePoint(point))) {
    pathDiscovered.add(serializePoint(point));
    for (const n of getNeighbours(point)) stack.push(n);
    steps++;
  }
}

// Set all points that are not part of the main loop to '.'
for (let y = 0; y < currentInput.length; y++)
  for (let x = 0; x < currentInput[y].length; x++)
    if (!pathDiscovered.has(serializePoint([x, y]))) setPipe([x, y], '.');

// Part 2: Traverse path again, and set all outside '.' to O and all inside '.' to I
const path = [...pathDiscovered.entries()].map((p) => deserializePoint(p));
for (let i = 0; i < path.length; i++) {
  const point = path[i];
  if (i !== 0) setLeftRight(point, getDirection(path[i - 1], point));
  if (i !== path.length - 1) setLeftRight(point, getDirection(point, path[i + 1]));
}

// DFS fill all remaining '.' with either O or I
for (let y = 0; y < currentInput.length; y++) {
  for (let x = 0; x < currentInput[y].length; x++) {
    const source = [x, y];
    if (getPipe(source) === '.') {
      const discovered = new Set([serializePoint(source)]);
      const queue = [source];
      let io = null;
      while (queue.length > 0) {
        const point = queue.shift();
        for (const n of [up, down, left, right]
          .map((dir) => walk(point, dir))
          .filter((n) => {
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
      for (const p of points) setPipe(p, io);
    }
  }
}

console.log(
  (steps + 1) / 2,
  currentInput.reduce((p, c) => p + c.split('I').length - 1, 0),
);
