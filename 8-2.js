function getNodeValue(nodes, startPoint) {
  let childCount = nodes[startPoint];
  let entries = nodes[startPoint + 1];
  const childValues = [];
  let currentStartPoint = startPoint + 2;
  while (childCount > 0) {
    let [nextStartPoint, value] = getNodeValue(nodes, currentStartPoint);
    currentStartPoint = nextStartPoint;
    childValues.push(value);
    childCount--;
  }

  let nodeValue = 0;

  for (let i = 0; i < entries; i++) {
    const value = nodes[i + currentStartPoint];
    if (childValues.length === 0) {
      nodeValue = nodeValue + nodes[i + currentStartPoint];
    } else {
      if (childValues[value - 1]) {
        nodeValue = nodeValue + childValues[value - 1];
      }
    }
  }

  return [currentStartPoint + entries, nodeValue];
}

module.exports = {
  parseInput: input => input.split(" ").map(n => Number(n)),
  getSolution: input => {
    const [_, solution] = getNodeValue(input, 0);
    return solution;
  }
};
