const { performance, PerformanceObserver } = require("perf_hooks");
const fs = require("fs");
const input = fs
  .readFileSync("./inputs/8.txt", "utf8")
  .split(" ")
  .map(n => Number(n));

const obs = new PerformanceObserver(items => {
  console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ entryTypes: ["measure"] });
performance.mark("begin");

const part = process.argv.slice(2);
let solution;
if (part == "1") {
  solution = part1(input);
} else {
  solution = part2(input);
}
performance.mark("end");
performance.measure("algorithm", "begin", "end");
console.log("SOLUTION:", solution);

function part1() {
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
  getMetadata(input, 0);
  return allMetadata.reduce((sum, val) => val + sum, 0);
}

function part2(startData) {
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

  const [_, solution] = getNodeValue(startData, 0);
  return solution;
}
