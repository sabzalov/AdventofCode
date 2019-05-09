const directions = ["<", "^", ">", "v"];

const directionMap = {
  "^": {
    "|": "^",
    "\\": "<",
    "/": ">"
  },
  ">": {
    "-": ">",
    "\\": "v",
    "/": "^"
  },
  v: {
    "|": "v",
    "\\": ">",
    "/": "<"
  },
  "<": {
    "-": "<",
    "\\": "^",
    "/": "v"
  }
};

class Cart {
  constructor(direction, xCoord, yCoord, id) {
    this.id = id;
    this.direction = direction;
    this.x = xCoord;
    this.y = yCoord;
    this.crossroadModifier = -1;
  }

  doTurn(track) {
    const nextCoordinate = this.getNextCoordinate();
    this.x = nextCoordinate.x;
    this.y = nextCoordinate.y;

    const nextTrackPiece = track[nextCoordinate.y][nextCoordinate.x];

    if (nextTrackPiece === "+") {
      let directionIndex =
        directions.indexOf(this.direction) + this.crossroadModifier;
      if (directionIndex < 0) {
        directionIndex = directions.length - 1;
      }
      if (directionIndex == directions.length) {
        directionIndex = 0;
      }
      this.direction = directions[directionIndex];
      this.crossroadModifier = this.crossroadModifier + 1;
      if (this.crossroadModifier > 1) {
        this.crossroadModifier = -1;
      }
    } else {
      this.direction = directionMap[this.direction][nextTrackPiece];
    }
  }

  getNextCoordinate() {
    let nextCoordinate = { x: this.x, y: this.y };
    switch (this.direction) {
      case "^":
        nextCoordinate.y = this.y - 1;
        break;
      case "v":
        nextCoordinate.y = this.y + 1;
        break;
      case ">":
        nextCoordinate.x = this.x + 1;
        break;
      case "<":
        nextCoordinate.x = this.x - 1;
        break;
    }
    return nextCoordinate;
  }
}

function isCart(val) {
  return val === "^" || val === "v" || val === ">" || val === "<";
}

function getCartTrackPiece(val) {
  return val == "^" || val === "v" ? "|" : "-";
}

function haveCrashed(carts) {
  const cartPositions = {};
  let crashed = false;
  for (cart of carts) {
    const position = `${cart.x}:${cart.y}`;
    if (cartPositions[position]) {
      crashed = [cartPositions[position], cart.id];
      // console.log("GAH", crashed);
      break;
    }
    cartPositions[position] = cart.id;
  }
  return crashed;
}

function sortCarts(a, b) {
  if (a.y < b.y) {
    return -1;
  }
  if (a.y > b.y) {
    return 1;
  }
  if (a.y === b.y && a.x < b.x) {
    return -1;
  }
  if (a.y === b.y && a.x > b.x) {
    return 1;
  }
  return 0;
}

function drawMap(track, carts) {
  const trackToDraw = track.map(r => [...r]);
  carts.forEach(cart => {
    trackToDraw[cart.y][cart.x] = cart.direction;
  });
  trackToDraw.map(r => {
    console.log(r.join(""));
  });
}

function solution(track, carts) {
  let remainingCarts = [...carts];
  let crashedCarts = [];
  let cartIndex = 0;
  while (remainingCarts.length > 1) {
    const cart = remainingCarts[cartIndex];
    cart.doTurn(track);
    const filteredCarts = remainingCarts.filter(
      cart => !crashedCarts.includes(cart.id)
    );
    const newCrashes = haveCrashed(filteredCarts);
    if (newCrashes) {
      crashedCarts = [...crashedCarts, ...newCrashes];
    }
    cartIndex = cartIndex + 1;
    if (cartIndex >= remainingCarts.length) {
      cartIndex = 0;
      remainingCarts = remainingCarts.filter(
        cart => !crashedCarts.includes(cart.id)
      );
      remainingCarts.sort(sortCarts);
      crashedCarts = [];
      // drawMap(track, remainingCarts);
    }
  }
  console.log(remainingCarts.map(cart => `${cart.x},${cart.y}`));
}

module.exports = {
  parseInput: input => {
    const inputs = input.split("\n").map(r => r.split(""));

    const carts = [];
    for (let y = 0; y < inputs.length; y++) {
      const row = inputs[y];
      for (let x = 0; x < row.length; x++) {
        if (isCart(row[x])) {
          carts.push(new Cart(row[x], x, y, carts.length + 1));
          inputs[y][x] = getCartTrackPiece(row[x]);
        }
      }
    }

    return { map: inputs, carts: carts };
  },
  getSolution: ({ map, carts }) => {
    // console.log(map, carts);
    solution(map, carts);
  }
};
