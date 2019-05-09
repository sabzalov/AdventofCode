const { performance, PerformanceObserver } = require("perf_hooks");
const fs = require("fs");

const part = process.argv[2];

/**
 * Solution runner to use from 8 onwards
 */

let inputId = part[0];
if (part.length % 2 == 0) {
  inputId = part[0] + part[1];
}
if (process.argv[3]) {
  inputId = inputId + `-test`;
}
const rawInput = fs.readFileSync(`./inputs/${inputId}.txt`, "utf8");
const { parseInput, getSolution } = require(`./${part}.js`);
const obs = new PerformanceObserver(items => {
  console.log("RUNTIME:", items.getEntriesByName("algorithm")[0].duration);
  performance.clearMarks();
});
obs.observe({ entryTypes: ["measure"] });

const input = parseInput(rawInput);

performance.mark("begin");
const solution = getSolution(input);
performance.mark("end");
performance.measure("algorithm", "begin", "end");

console.log("SOLUTION:", solution);
