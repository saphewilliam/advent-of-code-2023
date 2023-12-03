function getBag(str) {
  const bag = { red: 0, green: 0, blue: 0 };
  for (let set of str.split(': ')[1].split('; '))
    for (let ballStr of set.split(', ')) {
      const [number, ball] = ballStr.split(' ');
      if (bag[ball] < parseInt(number)) bag[ball] = parseInt(number);
    }
  return bag;
}

const output = input.split('\n').reduce(
  (p, c, i) => {
    const b = getBag(c);
    if (b.red <= 12 && b.green <= 13 && b.blue <= 14) p[0] += i + 1;
    p[1] += Object.values(b).reduce((p, c) => p * c, 1);
    return p;
  },
  [0, 0],
);

console.log(output);
