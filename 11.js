const currentInput = input.split('\n');

function scanUniverse() {
  // Locate galaxies
  const galaxies = [];
  for (let y = 0; y < currentInput.length; y++) {
    for (let x = 0; x < currentInput[y].length; x++)
      if (currentInput[y][x] === '#') galaxies.push([x, y]);
  }

  // Scan for horizontal expansions
  const horizontal = [];
  for (let y = 0; y < currentInput.length; y++) {
    if (currentInput[y].indexOf('#') === -1) horizontal.push(y);
  }

  // Scan for vertical expansions
  const vertical = [];
  for (let x = 0; x < currentInput[0].length; x++) {
    const column = [];
    for (let y = 0; y < currentInput.length; y++) column.push(currentInput[y][x]);
    if (column.indexOf('#') === -1) vertical.push(x);
  }
  return [galaxies, horizontal, vertical];
}

// Sum shortest paths between all pairs
function calculate(scan, exp) {
  const [galaxies, horizontal, vertical] = scan;
  let sum = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const [x1, y1, x2, y2] = [...galaxies[i], ...galaxies[j]];
      const v = vertical.filter((e) => e > Math.min(x1, x2) && e < Math.max(x1, x2));
      const h = horizontal.filter((e) => e > Math.min(y1, y2) && e < Math.max(y1, y2));
      sum += Math.abs(x1 - x2) + Math.abs(y1 - y2) + v.length * exp + h.length * exp;
    }
  }
  return sum;
}

const scan = scanUniverse();
const output = [calculate(scan, 2 - 1), calculate(scan, 1000000 - 1)];
console.log(output);
