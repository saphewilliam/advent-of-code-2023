function getNumbersArray(str) {
  return str
    .split(' ')
    .map((v) => parseInt(v))
    .filter((v) => !isNaN(v));
}

function mergeNumbersArray(nArr) {
  return parseInt(nArr.reduce((p, c) => p + c, ''));
}

function getRecordBreakCount(time, distance) {
  let counter = 0;
  for (let i = 0; i <= time; i++) if ((time - i) * i > distance) counter++;
  return counter;
}

const [times, distances] = input.split('\n').map(getNumbersArray);
const [time, distance] = [times, distances].map(mergeNumbersArray);
const output = [1, getRecordBreakCount(time, distance)];
for (const [timeIndex, time] of times.entries())
  output[0] *= getRecordBreakCount(time, distances[timeIndex]);

console.log(output);
