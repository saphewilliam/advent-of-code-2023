const digits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function getDigitList(str) {
  const digitList = [];
  for (let i = 0; i < str.length; i++) {
    const n = parseInt(str[i]);
    if (!isNaN(n)) digitList.push(n);

    for (const [j, d] of digits.entries())
      if (str.substr(i, d.length) === d) digitList.push(j + 1);
  }
  return digitList;
}

const output = input.split('\n').reduce((p, c) => {
  const dl = getDigitList(c);
  return p + parseInt(`${dl[0]}${dl[dl.length - 1]}`);
}, 0);

console.log(output);
