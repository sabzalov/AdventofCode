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
      crashed = position;
      break;
    }
    cartPositions[position] = 1;
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

function solution(track, carts) {
  let cartIndex = 0;
  while (!haveCrashed(carts)) {
    const cart = carts[cartIndex];
    cart.doTurn(track);
    cartIndex = cartIndex + 1;
    console.log(cart);
    if (cartIndex === carts.length) {
      cartIndex = 0;
      carts.sort(sortCarts);
    }
  }
  console.log(carts.map(cart => `${cart.x},${cart.y}`));
}

module.exports = {
  parseInput: input => {
    const inputs = input.split("\n").map(r => r.split(""));

    const carts = [];
    for (let y = 0; y < inputs.length; y++) {
      const row = inputs[y];
      for (let x = 0; x < row.length; x++) {
        if (isCart(row[x])) {
          carts.push(new Cart(row[x], x, y, carts.length));
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
