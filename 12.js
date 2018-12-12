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

function solution(plants, rules) {
  const pots = new RowOfPots();
  plants.forEach(val => pots.addToTail(val));
  //   console.log(rules.length);
  //   const generations = 20;
  const generations = 50000000000;
  //   console.log(`row 0>>`, pots.print());
  for (let i = 1; i <= generations; i++) {
    let plantsToPrepend = 0;
    if (pots.head.hasPlant) {
      plantsToPrepend = 5;
    } else if (pots.head.next.hasPlant) {
      plantsToPrepend = 4;
    } else if (pots.head.next.next.hasPlant) {
      plantsToPrepend = 3;
    } else if (pots.head.next.next.next.hasPlant) {
      plantsToPrepend = 2;
    } else if (pots.head.next.next.next.next.hasPlant) {
      plantsToPrepend = 1;
    }
    for (let p = 0; p < plantsToPrepend; p++) {
      pots.addToHead(false);
    }

    let plantsToAppend = 0;
    if (pots.tail.hasPlant) {
      plantsToAppend = 5;
    } else if (pots.tail.prev.hasPlant) {
      plantsToAppend = 4;
    } else if (pots.tail.prev.prev.hasPlant) {
      plantsToAppend = 3;
    } else if (pots.tail.prev.prev.prev.hasPlant) {
      plantsToAppend = 2;
    } else if (pots.tail.prev.prev.prev.prev.hasPlant) {
      plantsToAppend = 1;
    }
    let pot = pots.head;

    for (let p = 0; p < plantsToAppend; p++) {
      pots.addToTail(false);
    }

    while (pot.next) {
      pot.calculateNextGeneration(rules);
      pot = pot.next;
    }
    pot.calculateNextGeneration(rules);
    pots.tick();
    // console.log(`row ${i}>>`, pots.print(), pots.getSum());
  }
  return pots.getSum();
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
