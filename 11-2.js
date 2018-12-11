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

function getBlockPower(x, y, size, serial) {
  let blockPower = 0;
  for (let i = 0; i <= size; i++) {
    for (let j = 0; j <= size; j++) {
      blockPower = blockPower + getCellPower(x + i, j + y, serial);
    }
  }
  return blockPower;
}

function getMaxBlockSize(x, y, serial) {
  const maxSize = Math.max(300 - x, 300 - y);
  let maxBlockPower = Number.NEGATIVE_INFINITY;
  let maxSizeBox = 0;
  for (let size = 1; size < maxSize; size++) {
    const blockPower = getBlockPower(x, y, size, serial);
    if (blockPower > maxBlockPower) {
      maxBlockPower = blockPower;
      maxSizeBox = size;
    }
  }

  return { power: maxBlockPower, size: maxSizeBox };
}

function buildGrid(input) {
  const grid = {};
  let currentMaxPower = Number.NEGATIVE_INFINITY;
  let currentMaxCoord;
  for (let x = 1; x < 300; x++) {
    for (let y = 1; y < 300; y++) {
      const { power: blockPower, size } = getMaxBlockSize(x, y, input);
      const coord = `${x}, ${y}, ${size}`;
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
    return buildGrid(18);
    // return buildGrid(power);
  }
};
