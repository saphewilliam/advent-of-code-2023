const currentInput = input.split('\n')

function isInBounds(p) {
  const [x, y] = p;
  return !(y < 0 || y >= currentInput.length || x < 0 || x >= currentInput[0].length);
}

function move(p, dir) {
  switch(dir) {
    case 'up':
      return [p[0], p[1] - 1];
    case 'right':
      return [p[0] + 1, p[1]];
    case 'down':
      return [p[0], p[1] + 1];
    case 'left':
      return [p[0] - 1, p[1]];
    default:
      return [p[0], p[1]];
  }
}

function getPoint(p, dir) {
  const dp = move(p, dir);
  if (!isInBounds(dp)) return null;
  return currentInput[dp[1]][dp[0]];
}

function setPoint(p, value) {
  if (!isInBounds(p)) return;
  currentInput[p[1]] =
    currentInput[p[1]].substring(0, p[0]) + value + currentInput[p[1]].substring(p[0] + 1);
}

function moveRocks(dir) {
  for (
    let y = dir === 'down' ? currentInput.length - 1 : 0; 
    (dir === 'down' && y >= 0) || (dir !== 'down' && y < currentInput.length); 
    dir === 'down' ? y-- : y++
  ) {
    for (
      let x = dir === 'right' ? currentInput[y].length - 1 : 0; 
      (dir === 'right' && x >= 0) || (dir !== 'right' && x < currentInput[y].length); 
      dir === 'right' ? x-- : x++
    ) {
      if (getPoint([x, y]) === 'O') {
        setPoint([x, y], '.')
        let p = [x, y];
        while (getPoint(p, dir) === '.') p = move(p, dir);
        setPoint(p, 'O');
      }
    }
  }
}

function printSum() {
  let sum = 0;
  for (let y = 0; y < currentInput.length; y++) {
    for (let x = 0; x < currentInput[y].length; x++) {
      if (getPoint([x, y]) === 'O') sum += currentInput.length - y;
    }
  }
  console.log(sum);
}

// Part 1
// moveRocks('up');
// printSum();

// Part 2
function cycle() {
  moveRocks('up');
  moveRocks('left');
  moveRocks('down');
  moveRocks('right');
}

const cycles = {}
const CYCLES = 1000000000;
for (let i = 0; i < CYCLES; i++) {
  cycle()
  const cycleKey = currentInput.join();
  if (cycles[cycleKey] === undefined) cycles[cycleKey] = i;
  else if (i < 1000) i += (i - cycles[cycleKey]) * (Math.floor((CYCLES - i) / (i - cycles[cycleKey])) - 1)
}

printSum()
