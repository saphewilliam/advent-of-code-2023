function getNumbers(str) {
  return str
    .split(' ')
    .filter((v) => v)
    .map((v) => parseInt(v));
}

function countWinningNumbers(str) {
  const [winningNumbers, yourNumbers] = str.split(': ')[1].split(' | ').map(getNumbers);
  return winningNumbers.reduce((p, c) => p + Boolean(yourNumbers.includes(c)), 0);
}

const cards = [];
const output = input.split('\n').reduce(
  (p, c, i) => {
    const n = countWinningNumbers(c);
    p[0] += n === 0 ? 0 : Math.pow(2, n - 1);
    for (let j = i + 1; j <= i + n; j++) cards[j] = (cards[j] ?? 0) + (cards[i] ?? 0) + 1;
    p[1] += n * ((cards[i] ?? 0) + 1) + 1;
    return p;
  },
  [0, 0],
);

console.log(output);
