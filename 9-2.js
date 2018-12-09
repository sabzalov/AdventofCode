function node(value, prev, next) {
  this.prev = prev;
  this.next = next;
  this.value = value;
}

function solution(players, lastMarble) {
  // let currentMarble = { next: }
  let currentNode = new node(0);
  currentNode.prev = currentNode;
  currentNode.next = currentNode;

  let scores = new Array(players).fill(0);
  for (let i = 1; i <= lastMarble; i++) {
    const currentPlayerIndex = i % players;
    // let nextIndex = getNextMarbleIndex(marbles.length, currentMarble);
    if (i % 23 === 0) {
      const nodeToRemove = currentNode.prev.prev.prev.prev.prev.prev.prev;
      scores[currentPlayerIndex] =
        scores[currentPlayerIndex] + i + nodeToRemove.value;
      currentNode = nodeToRemove.next;
      nodeToRemove.prev.next = nodeToRemove.next;
      nodeToRemove.next.prev = nodeToRemove.prev;
    } else {
      currentNode = new node(i, currentNode.next, currentNode.next.next);
      currentNode.prev.next = currentNode;
      currentNode.next.prev = currentNode;
    }
  }
  return Math.max(...scores);
}

module.exports = {
  parseInput: input => {
    const inputs = input.split(" ");
    return { players: Number(inputs[0]), lastMarble: Number(inputs[6]) };
  },
  getSolution: ({ players, lastMarble }) => {
    console.log(solution(9, 25));
    // return solution(players, lastMarble);
    return solution(players, lastMarble * 100);
  }
};
