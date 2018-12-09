function get23MarbleIndex(marbles, currentIndex) {
  let newIndex = currentIndex - 7;
  if (newIndex < 0) {
    newIndex = marbles + newIndex;
  }
  return newIndex;
}

function getNextMarbleIndex(marbles, currentIndex) {
  let newIndex = currentIndex + 2;
  if (newIndex > marbles) {
    newIndex = newIndex - marbles;
  }
  return newIndex;
}

function solution(players, lastMarble) {
  let currentMarble = 0;
  let scores = new Array(players).fill(0);
  let marbles = [0];
  for (let i = 1; i <= lastMarble; i++) {
    const currentPlayerIndex = i % players;
    let nextIndex = getNextMarbleIndex(marbles.length, currentMarble);
    if (i % 23 === 0) {
      nextIndex = get23MarbleIndex(marbles.length, currentMarble);
      scores[currentPlayerIndex] =
        scores[currentPlayerIndex] + i + marbles[nextIndex];
      marbles.splice(nextIndex, 1);
    } else {
      const nextIndex = getNextMarbleIndex(marbles.length, currentMarble);
      if (nextIndex === marbles.length) {
        marbles.push(i);
      } else {
        marbles.splice(nextIndex, 0, i);
      }
    }
    currentMarble = nextIndex;
  }
  return Math.max(...scores);
}

module.exports = {
  parseInput: input => {
    const inputs = input.split(" ");
    return { players: Number(inputs[0]), lastMarble: Number(inputs[6]) };
  },
  getSolution: ({ players, lastMarble }) => {
    // return solution(players, lastMarble);
    return solution(players, lastMarble * 100);
  }
};
