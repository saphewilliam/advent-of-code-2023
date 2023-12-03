const currentInput = input.split('\n');

function isDigit(lineIndex, columnIndex) {
  return !isNaN(parseInt(currentInput[lineIndex]?.[columnIndex]));
}

function getTokens(lineIndex, columnIndex, length, type) {
  const tokens = [];
  for (let i = lineIndex - 1; i <= lineIndex + 1; i++) {
    const foundNumbersAt = new Set();
    for (let j = columnIndex - length; j <= columnIndex + 1; j++) {
      if (i === lineIndex && j > columnIndex - length && j < columnIndex + 1) continue;

      const char = currentInput[i]?.[j];
      if (isDigit(i, j)) {
        for (var s = j; isDigit(i, s); s--) {}
        for (var e = j; isDigit(i, e); e++) {}
        if (!foundNumbersAt.has(`s${s}e${e}`)) {
          tokens.push(parseInt(currentInput[i]?.substring(s + 1, e)));
          foundNumbersAt.add(`s${s}e${e}`);
        }
      } else if (char !== undefined && char !== '.') tokens.push(char);
    }
  }
  return tokens.filter((t) => typeof t === type);
}

let sum = [0, 0];

for (let [i, line] of currentInput.entries()) {
  let digitBuffer = [];
  for (let [j, char] of Array.from(line).entries()) {
    // Part 1
    const digit = parseInt(char);
    if (isDigit(i, j)) digitBuffer.push(digit);
    if ((!isDigit(i, j) || j === line.length - 1) && digitBuffer.length > 0) {
      const t = getTokens(i, j - Number(!isDigit(i, j)), digitBuffer.length, 'string');
      if (t.length > 0) sum[0] += digitBuffer.reduce((p, c) => parseInt(`${p}${c}`), 0);
      digitBuffer = [];
    }

    // Part 2
    if (char === '*') {
      const t = getTokens(i, j, 1, 'number');
      if (t.length === 2) sum[1] += t.reduce((p, c) => p * c, 1);
    }
  }
}

console.log(sum);
