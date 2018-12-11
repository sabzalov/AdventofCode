function getMaxSpread(inputs) {
  const spread = inputs.reduce(
    ({ maxX, maxY, minX, minY }, i) => {
      return {
        maxX: maxX > i[0] ? maxX : i[0],
        maxY: maxY > i[1] ? maxY : i[1],
        minX: minX < i[0] ? minX : i[0],
        minY: minY < i[1] ? minY : i[1]
      };
    },
    {
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY
    }
  );
  return {
    ...spread,
    xDiff: spread.maxX - spread.minX,
    yDiff: spread.maxY - spread.minY
  };
}

function parseTick(positions, velocities) {
  return positions.map((p, i) => {
    return [p[0] + velocities[i][0], p[1] + velocities[i][1]];
  });
}
function reverseTick(positions, velocities) {
  return positions.map((p, i) => {
    return [p[0] - velocities[i][0], p[1] - velocities[i][1]];
  });
}

function didBoxShrink(prev, next) {
  return next.xDiff < prev.xDiff || next.yDiff < prev.yDiff;
}

function getSolutionString(positions, spread) {
  let box = new Array(spread.yDiff + 1)
    .fill(".")
    .map(r => new Array(spread.xDiff + 1).fill("."));

  positions.forEach(([x, y]) => {
    box[y - spread.minY][x - spread.minX] = "x";
  });
  return box.reduce((total, line) => `${total}\n${line.join("")}`, "\n");
}

function solution(positions, velocities) {
  let prevMaxSpread = getMaxSpread(positions);
  let tick = 1;
  let currentPosition = parseTick(positions, velocities);
  let nextMaxSpread = getMaxSpread(currentPosition);
  while (didBoxShrink(prevMaxSpread, nextMaxSpread)) {
    prevMaxSpread = nextMaxSpread;
    currentPosition = parseTick(currentPosition, velocities);
    nextMaxSpread = getMaxSpread(currentPosition);
    tick++;
  }

  currentPosition = reverseTick(currentPosition, velocities);
  const spread = getMaxSpread(currentPosition);

  const sol = getSolutionString(currentPosition, spread);
  console.log(sol, tick - 1);
  return sol;
}

module.exports = {
  parseInput: input => {
    const regex = "*(<.+>)";

    const inputs = input
      .split("\n")
      .filter(r => r.length)
      .map(r => {
        const position = r
          .substring(10, r.indexOf(">"))
          .split(", ")
          .map(v => {
            return Number(v);
          });
        const velocity = r
          .substring(r.indexOf("velocity") + 10, r.length - 1)
          .split(", ")
          .map(v => Number(v));
        return { position, velocity };
      });

    return inputs.reduce(
      (prev, i) => {
        prev.positions.push(i.position);
        prev.velocities.push(i.velocity);
        return prev;
      },
      { positions: [], velocities: [] }
    );
  },
  getSolution: ({ positions, velocities }) => {
    return solution(positions, velocities);
  }
};
