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
const inputs = raw.split("\n").map(item => item.split(", "));
const maxDistance = 10000;

const { performance, PerformanceObserver } = require("perf_hooks");
const obs = new PerformanceObserver(items => {
  console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ entryTypes: ["measure"] });
performance.mark("begin");

function getDistances(input, x, y) {
  const distances = [];
  for (let i = 0; i < input.length; i++) {
    const [nodeX, nodeY] = input[i];
    const distance = Math.abs(x - nodeX) + Math.abs(y - nodeY);
    distances.push(distance);
  }
  return distances.reduce((total, d) => total + d);
}

const xMin = Math.min(...inputs.map(i => i[0]));
const xMax = Math.max(...inputs.map(i => i[0]));
const yMin = Math.min(...inputs.map(i => i[1]));
const yMax = Math.max(...inputs.map(i => i[1]));
const grid = {};

for (let x = xMin; x <= xMax; x++) {
  for (let y = yMin; y <= yMax; y++) {
    grid[`${x}x${y}`] = getDistances(inputs, x, y);
  }
}

const solution = Object.values(grid).filter(item => item < maxDistance).length;
performance.mark("end");
performance.measure("algorithm", "begin", "end");
console.log(solution);
