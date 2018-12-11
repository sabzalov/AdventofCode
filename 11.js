function getCellPower(x, y, serial) {
  const rackId = x + 10;
  const initialPower = rackId * y;
  const nextPower = (initialPower + serial) * rackId;
  const hundredsDigit =
    nextPower >= 100
      ? Math.floor((nextPower % Math.pow(10, 3)) / Math.pow(10, 2))
      : 0;
  const power = hundredsDigit - 5;
  return power;
}

function getBlockPower(x, y, serial) {
  let blockPower = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      blockPower = blockPower + getCellPower(x + i, j + y, serial);
    }
  }
  return blockPower;
}

function buildGrid(input) {
  const grid = {};
  let currentMaxPower = Number.NEGATIVE_INFINITY;
  let currentMaxCoord;
  for (let x = 1; x < 297; x++) {
    for (let y = 1; y < 297; y++) {
      const blockPower = getBlockPower(x, y, input);
      const coord = `${x}, ${y}`;
      grid[coord] = blockPower;
      if (blockPower > currentMaxPower) {
        currentMaxPower = blockPower;
        currentMaxCoord = coord;
      }
    }
  }

  return [currentMaxPower, currentMaxCoord];
}

module.exports = {
  parseInput: input => {
    return Number(input);
  },
  getSolution: power => {
    // return buildGrid(42);
    return buildGrid(power);
  }
};
