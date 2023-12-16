const currentInput = input.split('\n');

function serializeState(state) {
  return `${state[0]},${state[1]},${state[2]}`;
}

function serializePoint(state) {
  return `${state[0]},${state[1]}`;
}

function isInBounds(x, y) {
  return !(y < 0 || y >= currentInput.length || x < 0 || x >= currentInput[0].length);
}

function getValueAt(x, y) {
  if (!isInBounds(x, y)) return null;
  return currentInput[y][x];
}

function move(x, y, dir) {
  switch (dir) {
    case 'up':
      return [x, y - 1];
    case 'right':
      return [x + 1, y];
    case 'down':
      return [x, y + 1];
    case 'left':
      return [x - 1, y];
    default:
      return [x, y];
  }
}

function getEdges(x, y, dir) {
  const tile = getValueAt(x, y);
  const nextDirs = (() => {
    if (tile === '-' && ['up', 'down'].includes(dir)) return ['left', 'right'];
    if (tile === '|' && ['left', 'right'].includes(dir)) return ['up', 'down'];
    if (tile === '/' && dir === 'up') return ['right'];
    if (tile === '/' && dir === 'right') return ['up'];
    if (tile === '/' && dir === 'down') return ['left'];
    if (tile === '/' && dir === 'left') return ['down'];
    if (tile === '\\' && dir === 'up') return ['left'];
    if (tile === '\\' && dir === 'right') return ['down'];
    if (tile === '\\' && dir === 'down') return ['right'];
    if (tile === '\\' && dir === 'left') return ['up'];
    return [dir];
  })();

  return nextDirs.map((d) => [...move(x, y, d), d]).filter(([x, y]) => isInBounds(x, y));
}

function countEnergizedTiles(initialState) {
  const seenStates = new Set([serializeState(initialState)]);
  const seenPoints = new Set([serializePoint(initialState)]);
  const queue = [initialState];

  while (queue.length > 0) {
    const [x, y, dir] = queue.pop();
    seenPoints.add(serializePoint([x, y, dir]));
    for (const edge of getEdges(x, y, dir)) {
      const key = serializeState(edge);
      if (!seenStates.has(key)) {
        seenStates.add(key);
        queue.push(edge);
      }
    }
  }

  return seenPoints.size;
}

// Part 1
console.log(countEnergizedTiles([0, 0, 'right']));

// Part 2
let max = 0;
for (let y = 0; y < currentInput.length; y++) {
  const leftCount = countEnergizedTiles([0, y, 'right']);
  const rightCount = countEnergizedTiles([currentInput[y].length - 1, y, 'left']);
  max = Math.max(max, rightCount, leftCount);
}
for (let x = 0; x < currentInput[0].length; x++) {
  const topCount = countEnergizedTiles([x, 0, 'down']);
  const bottomCount = countEnergizedTiles([x, currentInput.length - 1, 'up']);
  max = Math.max(max, topCount, bottomCount);
}
console.log(max);
