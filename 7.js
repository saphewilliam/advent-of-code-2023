const cards1 = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const cards2 = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];
const handTypes = [[5], [4], [3, 2], [3], [2, 2], [2], [1]];

function getHandType(hand) {
  const countObj = {};
  for (const card of hand) countObj[card] = (countObj[card] ?? 0) + 1;
  const count = Object.values(countObj).toSorted((a, b) => b - a);

  for (const [i, handType] of handTypes.entries())
    if (handType.reduce((p, c, j) => p && c === count[j], true))
      return handTypes.length - i;
}

function getJokerHandType(hand) {
  const jokerIndex = hand.indexOf('J');
  if (jokerIndex === -1) return getHandType(hand);

  const hands = [];
  for (const card of cards2.slice(0, cards2.length - 1)) {
    const newHand = hand.slice(0, jokerIndex) + card + hand.slice(jokerIndex + 1);
    hands.push(getJokerHandType(newHand));
  }
  return Math.max(...hands);
}

function compareHands(a, b, type, cards) {
  if (a[type] !== b[type]) return b[type] - a[type];
  for (const [i, cardA] of [...a.hand].entries()) {
    const cardB = b.hand[i];
    if (cardA === cardB) continue;
    return cards.indexOf(cardA) - cards.indexOf(cardB);
  }
}

const hands = input.split('\n').map((l) => {
  const [hand, bid] = l.split(' ');
  const [type1, type2] = [getHandType, getJokerHandType].map((f) => f(hand));
  return { hand, bid: parseInt(bid), type1, type2 };
});

const output = [
  hands.toSorted((a, b) => compareHands(a, b, 'type1', cards1)),
  hands.toSorted((a, b) => compareHands(a, b, 'type2', cards2)),
].map((v) => v.reduce((p, c, i, a) => p + c.bid * (a.length - i), 0));

console.log(output);
