const raw = `Step O must be finished before step W can begin.
Step S must be finished before step V can begin.
Step Z must be finished before step B can begin.
Step F must be finished before step R can begin.
Step I must be finished before step D can begin.
Step W must be finished before step P can begin.
Step J must be finished before step E can begin.
Step P must be finished before step N can begin.
Step Q must be finished before step V can begin.
Step D must be finished before step K can begin.
Step X must be finished before step N can begin.
Step E must be finished before step B can begin.
Step L must be finished before step H can begin.
Step A must be finished before step T can begin.
Step U must be finished before step R can begin.
Step M must be finished before step T can begin.
Step V must be finished before step R can begin.
Step N must be finished before step C can begin.
Step T must be finished before step C can begin.
Step Y must be finished before step B can begin.
Step H must be finished before step B can begin.
Step B must be finished before step C can begin.
Step C must be finished before step K can begin.
Step R must be finished before step K can begin.
Step G must be finished before step K can begin.
Step Q must be finished before step K can begin.
Step U must be finished before step Y can begin.
Step L must be finished before step G can begin.
Step S must be finished before step D can begin.
Step E must be finished before step R can begin.
Step Z must be finished before step M can begin.
Step U must be finished before step K can begin.
Step Q must be finished before step H can begin.
Step T must be finished before step B can begin.
Step J must be finished before step Q can begin.
Step X must be finished before step V can begin.
Step Q must be finished before step U can begin.
Step T must be finished before step K can begin.
Step S must be finished before step B can begin.
Step L must be finished before step C can begin.
Step Q must be finished before step D can begin.
Step E must be finished before step K can begin.
Step N must be finished before step G can begin.
Step L must be finished before step T can begin.
Step E must be finished before step L can begin.
Step A must be finished before step N can begin.
Step V must be finished before step C can begin.
Step D must be finished before step L can begin.
Step O must be finished before step S can begin.
Step V must be finished before step Y can begin.
Step N must be finished before step T can begin.
Step I must be finished before step H can begin.
Step U must be finished before step N can begin.
Step O must be finished before step Y can begin.
Step J must be finished before step C can begin.
Step Y must be finished before step C can begin.
Step W must be finished before step A can begin.
Step M must be finished before step C can begin.
Step X must be finished before step E can begin.
Step S must be finished before step J can begin.
Step U must be finished before step C can begin.
Step H must be finished before step K can begin.
Step Q must be finished before step B can begin.
Step E must be finished before step G can begin.
Step N must be finished before step H can begin.
Step I must be finished before step J can begin.
Step P must be finished before step B can begin.
Step Z must be finished before step T can begin.
Step J must be finished before step M can begin.
Step C must be finished before step G can begin.
Step I must be finished before step B can begin.
Step D must be finished before step G can begin.
Step X must be finished before step T can begin.
Step O must be finished before step F can begin.
Step A must be finished before step Y can begin.
Step S must be finished before step G can begin.
Step X must be finished before step K can begin.
Step L must be finished before step M can begin.
Step A must be finished before step H can begin.
Step D must be finished before step H can begin.
Step U must be finished before step T can begin.
Step B must be finished before step K can begin.
Step S must be finished before step C can begin.
Step W must be finished before step R can begin.
Step M must be finished before step G can begin.
Step M must be finished before step H can begin.
Step J must be finished before step D can begin.
Step W must be finished before step Y can begin.
Step S must be finished before step Y can begin.
Step A must be finished before step G can begin.
Step P must be finished before step M can begin.
Step C must be finished before step R can begin.
Step Q must be finished before step Y can begin.
Step O must be finished before step H can begin.
Step O must be finished before step R can begin.
Step Q must be finished before step M can begin.
Step V must be finished before step B can begin.
Step H must be finished before step G can begin.
Step J must be finished before step V can begin.
Step M must be finished before step R can begin.
Step R must be finished before step G can begin.`;

const rawTest = `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`;

const inputs = raw.split("\n").map(string => [string[5], string[36]]);
const outputs = inputs.reduce((pattern, [before, after]) => {
  if (!pattern[before]) {
    pattern[before] = { after: [], before: [] };
  }
  if (!pattern[after]) {
    pattern[after] = { after: [], before: [] };
  }
  pattern[before].after.push(after);
  pattern[after].before.push(before);
  return pattern;
}, {});

Object.keys(outputs).forEach(key => outputs[key].after.sort());

const endPoints = inputs.map(([_, after]) => after);
const startPoints = inputs.map(([before, _]) => before);
let startingPoints = Array.from(
  inputs.reduce((points, [before, after]) => {
    if (endPoints.indexOf(before) === -1) {
      points.add(before);
    }
    return points;
  }, new Set())
);
startingPoints.sort();

const allNodes = Object.keys(outputs);
const pattern = [];
let time = 0;
let workers = [];
const stepBasis = 60;
const workerCount = 5;
const alphabet = "abcdefghijklmnopqrstuvwxyz";

while (pattern.length < allNodes.length) {
  const { completedWorkers, remainingWorkers } = workers.reduce(
    (data, worker) => {
      if (worker.endsAt <= time) {
        data.completedWorkers.push(worker.val);
      } else {
        data.remainingWorkers.push(worker);
      }
      return data;
    },
    { completedWorkers: [], remainingWorkers: [] }
  );

  workers = remainingWorkers;
  // console.log(time, workers, completedWorkers);

  completedWorkers.forEach(nextNodeKey => {
    pattern.push(nextNodeKey);
    const nodes = outputs[nextNodeKey].after;
    for (let i = 0; i < nodes.length; i++) {
      const nodeKey = nodes[i];
      const requirements = outputs[nodeKey].before;
      if (
        requirements.every(val => pattern.indexOf(val) > -1) &&
        startingPoints.indexOf(nodes[i]) === -1
      ) {
        startingPoints.push(nodes[i]);
      }
    }
    startingPoints.sort();
  });

  while (workers.length < workerCount && startingPoints.length > 0) {
    const next = startingPoints.shift();
    workers.push({
      endsAt: time + stepBasis + alphabet.indexOf(next.toLowerCase()) + 1,
      val: next
    });
  }

  // time++;
  // console.log(workers, time);
  const nextTime = Math.min(...workers.map(({ endsAt }) => endsAt));
  console.log(workers, time);
  // time = Number.isFinite(nextTime) ? nextTime : time + 1;
  time = nextTime;
}

console.log("SOLUTION:", time);
