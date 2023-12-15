const currentInput = input.split('\n');

let cache = {};

function dp(template, blocks, ti, bi, length) {
  const cacheKey = [ti, bi, length];
  if (cache[cacheKey] !== undefined) return cache[cacheKey];

  if (ti === template.length) {
    if (
      (bi === blocks.length && length === 0) ||
      (bi === blocks.length - 1 && blocks[bi] === length)
    )
      return 1;
    return 0;
  }

  let sum = 0;
  for (const c of ['.', '#']) {
    if (template[ti] === c || template[ti] === '?') {
      if (c === '.' && length === 0) sum += dp(template, blocks, ti + 1, bi, 0);
      else if (c === '.' && length > 0 && bi < blocks.length && blocks[bi] === length)
        sum += dp(template, blocks, ti + 1, bi + 1, 0);
      else if (c === '#') sum += dp(template, blocks, ti + 1, bi, length + 1);
    }
  }
  cache[cacheKey] = sum;
  return sum;
}

function calculate(template, blocks) {
  cache = {};
  return dp(template, blocks, 0, 0, 0);
}

const output = currentInput.reduce(
  (p, c) => {
    const [template, blocksStr] = c.split(' ');
    const blocks = blocksStr.split(',').map((v) => parseInt(v));
    p[0] += calculate(template, blocks);
    p[1] += calculate(Array(5).fill(template).join('?'), Array(5).fill(blocks).flat());
    return p;
  },
  [0, 0],
);

console.log(output);
