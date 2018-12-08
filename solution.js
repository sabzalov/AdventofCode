const { performance, PerformanceObserver } = require("perf_hooks");
const fs = require("fs");

const part = process.argv[2];

const inputId = part[0];
const input = fs.readFileSync(`./inputs/${inputId}.txt`, "utf8");
const getSolution = require(`./${part}.js`);
const obs = new PerformanceObserver(items => {
  console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ entryTypes: ["measure"] });

const solution = getSolution(input);

performance.mark("end");
performance.measure("algorithm", "begin", "end");
console.log("SOLUTION:", solution);
