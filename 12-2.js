function Plant(hasPlant, next, prev) {
  this.next = next;
  this.prev = prev;
  this.hasPlant = hasPlant;
  this.nextGenHasPlant = false;
  if (this.next) {
    this.potNumber = this.next.potNumber - 1;
  } else if (this.prev) {
    this.potNumber = this.prev.potNumber + 1;
  } else {
    this.potNumber = 0;
  }
}

Plant.prototype.print = function() {
  return this.hasPlant ? "#" : ".";
};

Plant.prototype.calculateNextGeneration = function(rules) {
  let matches = false;
  for (let i = 0; i < rules.length; i++) {
    matches = this.doesRuleMatch(rules[i].rule);
    if (matches) {
      this.nextGenHasPlant = rules[i].result;
      break;
    }
  }
  if (!matches) {
    console.log("[DIDNOTMATCH]");
    this.nextGenHasPlant = false;
  }
};

Plant.prototype.doesRuleMatch = function(rule) {
  const plantCompare = [
    this.prev && this.prev.prev ? this.prev.prev.hasPlant : false,
    this.prev ? this.prev.hasPlant : false,
    this.hasPlant,
    this.next ? this.next.hasPlant : false,
    this.next && this.next.next ? this.next.next.hasPlant : false
  ];
  return plantCompare.every((v, i) => v == rule[i]);
};

function RowOfPots() {
  this.head = null;
  this.tail = null;
}

RowOfPots.prototype.addToHead = function(value) {
  const newPot = new Plant(value, this.head, null);
  if (this.head) {
    this.head.prev = newPot;
  } else {
    this.tail = newPot;
  }
  this.head = newPot;
};

RowOfPots.prototype.addToTail = function(value) {
  const newPot = new Plant(value, null, this.tail);
  if (this.tail) {
    this.tail.next = newPot;
  } else {
    this.head = newPot;
  }
  this.tail = newPot;
};

RowOfPots.prototype.adjustEnds = function() {
  let limit = 5;
  while (!this.head.hasPlant) {
    this.head.next.prev = null;
    this.head = this.head.next;
  }
  while (!this.tail.hasPlant) {
    this.tail.prev.next = null;
    this.tail = this.tail.prev;
  }

  while (limit > 0) {
    this.addToHead(false);
    this.addToTail(false);
    limit--;
  }
};

RowOfPots.prototype.tick = function() {
  let node = this.head;
  while (node.next) {
    node.hasPlant = node.nextGenHasPlant;
    node.nextGenHasPlant = false;
    node = node.next;
  }
  node.hasPlant = node.nextGenHasPlant;
  node.nextGenHasPlant = false;
};

RowOfPots.prototype.print = function() {
  let pot = this.head;
  let rowOfPots = "";
  while (pot.next) {
    rowOfPots += pot.print();
    pot = pot.next;
  }
  rowOfPots += pot.print();
  return this.head.potNumber + "  " + rowOfPots + "  " + this.tail.potNumber;
};

RowOfPots.prototype.getSum = function() {
  let pot = this.head;
  let total = 0;
  while (pot.next) {
    total = total + (pot.hasPlant ? pot.potNumber : 0);
    pot = pot.next;
  }
  return total;
};

function hasStablizied(generations) {
  if (generations.length < 10) {
    return false;
  }
  let diffs = [];
  for (let i = 0; i < generations.length - 1; i++) {
    diffs.push(generations[i + 1] - generations[i]);
  }
  return diffs.every(v => v === diffs[0]);
}

function solution(plants, rules) {
  const maxGenerations = 50000000000;
  let last10Generations = [];
  let currentGeneration = 0;
  const pots = new RowOfPots();
  plants.forEach(val => pots.addToTail(val));
  pots.adjustEnds();

  while (!hasStablizied(last10Generations)) {
    pots.adjustEnds();
    let pot = pots.head;

    while (pot.next) {
      pot.calculateNextGeneration(rules);
      pot = pot.next;
    }
    pot.calculateNextGeneration(rules);
    pots.tick();
    last10Generations.push(pots.getSum());
    last10Generations =
      last10Generations.length > 10
        ? last10Generations.slice(-10)
        : last10Generations;
    currentGeneration++;
  }
  console.log("stabilized", currentGeneration, last10Generations);
  const diff = last10Generations[1] - last10Generations[0];
  const remaining = diff * (maxGenerations - currentGeneration);
  return remaining + last10Generations[9];
  //   return pots.getSum();
}

module.exports = {
  parseInput: input => {
    const inputs = input.split("\n").filter(r => r.length);
    const plants = inputs[0]
      .slice(15)
      .split("")
      .map(p => p === "#");
    const rules = inputs.slice(1).map(row => {
      const rule = row
        .slice(0, 5)
        .split("")
        .map(v => v === "#");
      const result = row.slice(row.length - 1) === "#";
      return { rule, result };
    });
    return { plants, rules };
  },
  getSolution: ({ plants, rules }) => {
    return solution(plants, rules);
  }
};
