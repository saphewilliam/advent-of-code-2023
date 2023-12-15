const currentInput = input.split(',');

function getHash(l) {
  return [...l].reduce((p, c) => ((p + c.charCodeAt(0)) * 17) % 256, 0);
}

// Part 1
console.log(currentInput.reduce((p, c) => p + getHash(c), 0));

// Part 2
const boxes = [];
for (const step of currentInput) {
  if (step.split('=').length === 2) {
    const [label, valueStr] = step.split('=');
    const value = parseInt(valueStr);
    const boxIndex = getHash(label);
    if (boxes[boxIndex] === undefined) boxes[boxIndex] = [];

    const lensIndex = boxes[boxIndex].findIndex((l) => l[0] === label);
    if (lensIndex !== -1) boxes[boxIndex][lensIndex][1] = value;
    else boxes[boxIndex].push([label, value]);
  } else {
    const label = step.substring(0, step.length - 1);
    const boxIndex = getHash(label);
    if (boxes[boxIndex] === undefined) boxes[boxIndex] = [];

    const lensIndex = boxes[boxIndex].findIndex((l) => l[0] === label);
    if (lensIndex !== -1) boxes[boxIndex].splice(lensIndex, 1);
  }
}

console.log(
  boxes.reduce(
    (p, cBox, iBox) =>
      p + cBox.reduce((p, cLens, iLens) => p + (1 + iBox) * (1 + iLens) * cLens[1], 0),
    0,
  ),
);
