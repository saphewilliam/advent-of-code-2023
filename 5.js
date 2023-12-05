const currentInput = input.split('\n');

function getLocationNumbers(source, min, max = min + 1) {
  // Pick min from range if "location"
  if (source === 'location') return [min];

  // Form and sort ranges
  const i = currentInput.slice(1).findIndex((v) => v.startsWith(source));
  const newSource = (new RegExp(`(${source}-to-)(.*)( map:)`)).exec(currentInput[i+1])[2];
  const ranges = [];
  for (let j = i + 2; j < currentInput.length - 1 && currentInput[j] !== ''; j++) {
    const [dst, src, len] = currentInput[j].split(' ').map((v) => parseInt(v));
    ranges.push({min: src, max: src + len, diff: dst - src})
  }
  ranges.sort((a, b) => a.min - b.min)

  // Recursively split given min to max range into given ranges
  const numbers = [];
  let minIndex = min;
  for (const range of ranges) {
    if (max < range.min || min > range.max) continue;
    if (range.min > minIndex) numbers.push(...getLocationNumbers(newSource, minIndex, range.min));

    const newMin = Math.max(minIndex, range.min) + range.diff;
    const newMax = Math.min(max, range.max) + range.diff;
    numbers.push(...getLocationNumbers(newSource, newMin, newMax));
    minIndex = range.max;
  }
  if (minIndex < max) numbers.push(...getLocationNumbers(newSource, minIndex, max));
  return numbers;
}

const output = [Infinity, Infinity];
const seeds = currentInput[0].split(': ')[1].split(' ').map((v) => parseInt(v));
for (const [seedIndex, seed] of seeds.entries()) {
  // Part 1
  const [n] = getLocationNumbers('seed', seed);
  if (n < output[0]) output[0] = n

  // Part 2
  if (seedIndex % 2 === 0) {
    const numbers = getLocationNumbers('seed', seed, seed + seeds[seedIndex + 1]);
    for (const number of numbers) if (number < output[1]) output[1] = number;
  }
}

console.log(output);
