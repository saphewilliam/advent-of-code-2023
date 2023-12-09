function extrapolate(numbers) {
  if (Math.max(...numbers) === 0 && Math.min(...numbers) === 0) return [0, 0];
  const newNumbers = numbers.slice(1).map((v, i) => v - numbers[i]);
  const e = extrapolate(newNumbers);
  return [numbers[0] - e[0], numbers[numbers.length - 1] + e[1]];
}

const output = input.split('\n').reduce(
  (p, c) => {
    const e = extrapolate(c.split(' ').map((v) => parseInt(v)));
    return [p[0] + e[1], p[1] + e[0]];
  },
  [0, 0],
);

console.log(output);
