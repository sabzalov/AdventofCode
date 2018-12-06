const { performance, PerformanceObserver } = require("perf_hooks");

const raw = `336, 308
262, 98
352, 115
225, 205
292, 185
166, 271
251, 67
266, 274
326, 85
191, 256
62, 171
333, 123
160, 131
211, 214
287, 333
231, 288
237, 183
211, 272
116, 153
336, 70
291, 117
156, 105
261, 119
216, 171
59, 343
50, 180
251, 268
169, 258
75, 136
305, 102
154, 327
187, 297
270, 225
190, 185
339, 264
103, 301
90, 92
164, 144
108, 140
189, 211
125, 157
77, 226
177, 168
46, 188
216, 244
346, 348
272, 90
140, 176
109, 324
128, 132`;

const obs = new PerformanceObserver(items => {
  console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ entryTypes: ["measure"] });
performance.mark("begin");

const inputs = raw.split("\n").map(item => item.split(", "));

function getClosestNodes(input, x, y) {
  let leastDiff = Number.POSITIVE_INFINITY;
  let closestIndexes = [];

  for (let i = 0; i < input.length; i++) {
    const nodeX = input[i][0];
    const nodeY = input[i][1];
    const key = `${input[i][0]}x${input[i][1]}`;
    const totalDiff = Math.abs(x - nodeX) + Math.abs(y - nodeY);
    if (totalDiff < leastDiff) {
      closestIndexes = [key];
      leastDiff = totalDiff;
    } else if (totalDiff == leastDiff) {
      closestIndexes.push(key);
    }
  }
  return closestIndexes;
}

// solution 1
const xMin = Math.min(...inputs.map(i => i[0]));
const xMax = Math.max(...inputs.map(i => i[0]));
const yMin = Math.min(...inputs.map(i => i[1]));
const yMax = Math.max(...inputs.map(i => i[1]));

const grid = {};

for (let x = xMin; x <= xMax; x++) {
  for (let y = yMin; y <= yMax; y++) {
    grid[`${x}x${y}`] = getClosestNodes(inputs, x, y);
  }
}

const blah = Object.keys(grid).reduce((prev, key) => {
  const val = grid[key];
  const [x, y] = key.split("x").map(v => Number(v));
  if (val.length > 1) {
    return prev;
  }
  if (x == xMin || x == xMax || y == yMin || y == yMax) {
    prev[val] = Number.POSITIVE_INFINITY;
  }

  prev[val] = (prev[val] || 0) + 1;

  return prev;
}, {});

const solution = Math.max(
  ...Object.values(blah).filter(val => val < Number.POSITIVE_INFINITY)
);
performance.mark("end");
performance.measure("algorithm", "begin", "end");
console.log(solution);
