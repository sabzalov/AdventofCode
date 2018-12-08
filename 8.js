const { performance } = require("perf_hooks");

let allMetadata = [];
function getMetadata(nodes, startPoint) {
  let childCount = nodes[startPoint];
  let entries = nodes[startPoint + 1];
  let currentStartPoint = startPoint + 2;
  while (childCount > 0) {
    currentStartPoint = getMetadata(nodes, currentStartPoint);
    childCount--;
  }

  for (let i = 0; i < entries; i++) {
    allMetadata.push(nodes[i + currentStartPoint]);
  }

  return currentStartPoint + entries;
}

module.exports = input => {
  const startData = input.split(" ").map(n => Number(n));
  performance.mark("begin");
  getMetadata(startData, 0);
  const solution = allMetadata.reduce((sum, val) => val + sum, 0);
  performance.mark("end");
  return solution;
};
