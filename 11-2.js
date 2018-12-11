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

function getBlockPower(x, y, size, grid) {
  let blockPower = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      try {
        blockPower = blockPower + grid[y + i][x + j];
      } catch (e) {
        console.log("ERR", i, j, x, y, size);
      }
    }
  }
  return blockPower;
}

function getMaxBlockSize(x, y, grid) {
  const maxSize = Math.min(300 - x, 300 - y);
  let maxBlockPower = Number.NEGATIVE_INFINITY;
  let maxSizeBox = 0;
  for (let size = maxSize; size > 0; size--) {
    const blockPower = getBlockPower(x, y, size, grid);
    if (blockPower > maxBlockPower) {
      maxBlockPower = blockPower;
      maxSizeBox = size;
    }
  }

  return { power: maxBlockPower, size: maxSizeBox };
}

function buildGrid(serial) {
  const grid = new Array(300).fill(0).map((r, y) => {
    return new Array(300).fill(0).map((p, x) => {
      return getCellPower(x + 1, y + 1, serial);
    });
  });
  return grid;
}

function getSolution(serial) {
  const grid = buildGrid(serial);
  const results = {};
  let currentMaxPower = Number.NEGATIVE_INFINITY;
  let currentMaxCoord;
  for (let x = 0; x < 300; x++) {
    for (let y = 0; y < 300; y++) {
      const { power: blockPower, size } = getMaxBlockSize(x, y, grid);
      const coord = `${x + 1},${y + 1},${size}`;
      results[coord] = blockPower;
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
  getSolution: serial => {
    // return getSolution(42);
    // return buildGrid(serial);
    return getSolution(serial);
  }
};
