const currentInput = input.split('\n\n');

function transposePattern(pattern) {
  return [...pattern[0]].map((_, col) => pattern.map((row) => row[col]).join(''));
}

function augmentPattern(pattern) {
  const augmentedPatterns = [];
  for (let i = 0; i < pattern.length; i++) {
    for (let j = 0; j < pattern[i].length; j++) {
      const newPattern = [...pattern];
      const getNewPattern = (p) =>
        p.substring(0, j) + (p[j] === '.' ? '#' : '.') + p.substring(j + 1);
      newPattern[i] = getNewPattern(newPattern[i]);
      augmentedPatterns.push(newPattern);
    }
  }
  return augmentedPatterns;
}

function traverseMirror(startPair, pairs) {
  let min = Math.min(...startPair);
  let max = Math.max(...startPair);
  while (max - min !== 1) {
    min++;
    max--;
    if (!pairs.has(`${min},${max}`)) return null;
  }
  return max;
}

function findMirrors1(pattern) {
  const scan = pattern.reduce((p, c, i) => ({ ...p, [c]: [...(p[c] ?? []), i] }), {});
  const pairs = Object.values(scan);
  const minPair = pairs.find((v) => v.includes(0));
  const maxPair = pairs.find((v) => v.includes(pattern.length - 1));
  if (minPair.length === 1 && maxPair.length === 1) return [];

  const pairsSet = new Set();
  pairs.forEach((pair) => {
    for (let i = 0; i < pair.length; i++)
      for (let j = i + 1; j < pair.length; j++) pairsSet.add(`${pair[i]},${pair[j]}`);
  });

  const mirrors = [];
  if (minPair.length > 1) {
    for (let i = 1; i < minPair.length; i++) {
      const mirror = traverseMirror([minPair[0], minPair[i]], pairsSet);
      if (mirror !== null) mirrors.push(mirror);
    }
  }

  for (let i = maxPair.length - 2; i >= 0; i--) {
    const mirror = traverseMirror([maxPair[i], maxPair[maxPair.length - 1]], pairsSet);
    if (mirror !== null) mirrors.push(mirror);
  }

  return mirrors;
}

function getValidMirror(mirrors, index, pattern) {
  const validMirrors = mirrors.filter((v) => {
    const span = Math.min(v - 1, pattern.length - v - 1);
    const minIndex = (v - 1 - span) * pattern[0].length;
    const maxIndex = (v + 1 + span) * pattern[0].length - 1;
    return index >= minIndex && index <= maxIndex;
  });
  return validMirrors[0] ?? null;
}

function findMirrors2(pattern) {
  return augmentPattern(pattern)
    .map(findMirrors1)
    .map((m, i) => getValidMirror(m, i, pattern))
    .filter((m) => m !== null);
}

const output = currentInput.reduce(
  (p, c) => {
    const pattern = c.split('\n');
    const transposedPattern = transposePattern(pattern);

    const mirror1 = findMirrors1(transposedPattern);
    const mirror2 = findMirrors1(pattern);
    if (mirror1.length !== 0) p[0] += mirror1[0];
    else if (mirror2.length !== 0) p[0] += mirror2[0] * 100;

    const mirror3 = findMirrors2(transposedPattern);
    const mirror4 = findMirrors2(pattern);
    if (mirror3.length !== 0) p[1] += mirror3[0];
    else if (mirror4.length !== 0) p[1] += mirror4[0] * 100;

    return p;
  },
  [0, 0],
);

console.log(output);
