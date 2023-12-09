const currentInput = input.split('\n');
const instructions = currentInput[0];
const map = currentInput.slice(2).reduce((p, c) => {
  const [source, dest] = c.split(' = ');
  const [, L, R] = new RegExp('([0-9A-Z]{3}), ([0-9A-Z]{3})').exec(dest);
  return { ...p, [source]: { L, R } };
}, {});

function countSteps(start, isEnd) {
  let curr = start;
  for (var i = 0; ; i++) {
    curr = map[curr][instructions[i % instructions.length]];
    if (isEnd(curr)) return i + 1;
  }
}

const output = [
  countSteps('AAA', (v) => v === 'ZZZ'),
  // TODO find LCM of this array https://www.calculatorsoup.com/calculators/math/lcm.php
  Object.keys(map)
    .filter((k) => k.endsWith('A'))
    .map((start) => countSteps(start, (v) => v.endsWith('Z'))),
];

console.log(output);
