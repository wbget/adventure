enum Status {
  dead = 0,
  empty,
  born,
  alive,
  kill
}
function Counter(name: string) {
  let i = 0;
  return function(_, __: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    descriptor.value = function(...args) {
      const result = method.call(this, ...args);
      i++;
      console.log(`${name}${i}`);
      return result;
    };
  };
}
function Born(_, __: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  descriptor.value = function(this: Creature, ...args) {
    if (this.status !== Status.empty) return;
    this.status = Status.born;
    const result = method.call(this, ...args);
    this.status = Status.alive;
    return result;
  };
}
function Kill(_, __: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  descriptor.value = function(this: Creature, ...args) {
    if (this.status !== Status.alive) return;
    this.status = Status.kill;
    const result = method.call(this, ...args);
    this.status = Status.dead;
    return result;
  };
}

abstract class Creature {
  status: Status = Status.empty;
  abstract born(...args);
  abstract kill(...args);
}
class Cube extends Creature {
  protected _x: number = null;
  protected _y: number = null;

  up: Cube;
  right: Cube;
  down: Cube;
  left: Cube;
  linked = false;

  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  // @Counter('生产 cube 数量：')
  @Born
  born(x: number, y: number) {
    this._x = x;
    this._y = y;
  }
  // @Counter('杀死 cube 数量：')
  @Kill
  kill() {
    this._x = null;
    this._y = null;
  }
}
class Land extends Creature {
  protected _width = 1;
  protected _height = 1;

  protected _cubes: Cube[];

  constructor(width: number, height: number) {
    super();
    this._width = width;
    this._height = height;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get cubes() {
    return this._cubes;
  }
  @Born
  born() {
    this.bornCubes();
  }
  @Kill
  kill() {
    this.killCubes();
  }
  private link(cube: Cube) {
    if (cube === null || cube.linked) return;
    const x = cube.x;
    const y = cube.y;
    const up = this.getCube(x, y + 1);
    const down = this.getCube(x, y - 1);
    const right = this.getCube(x + 1, y);
    const left = this.getCube(x - 1, y);
    cube.up = up;
    cube.down = down;
    cube.left = left;
    cube.right = right;
    cube.linked = true;
    // 递归扩散
    this.link(up);
    this.link(down);
    this.link(left);
    this.link(right);
  }
  private unlinkCube(cube: Cube) {
    if (cube.up) {
      cube.up.down = null;
      cube.up = null;
    }
    if (cube.down) {
      cube.down.up = null;
      cube.down = null;
    }
    if (cube.left) {
      cube.left.right = null;
      cube.left = null;
    }
    if (cube.right) {
      cube.right.left = null;
      cube.right = null;
    }
    cube.linked = false;
  }
  private bornCubes() {
    this._cubes = [];
    // 1. 创建cubes
    for (let i = this.height - 1; i >= 0; i--) {
      for (let j = 0; j < this.width; j++) {
        const cube = new Cube();
        cube.born(j, i); // 先x，后y
        this.cubes.push(cube);
      }
    }
    // console.log(this.cubes);
    // 2. 创建四叉树
    // let x = Math.floor(Math.random() * this.width);
    // let y = Math.floor(Math.random() * this.height);
    let x = 2,
      y = 2;
    const cube = this.getCube(x, y);
    this.link(cube);
  }
  private killCubes() {
    for (let cube of this.cubes) {
      // 删除四叉树
      this.unlinkCube(cube);
      // 删除cubes
      cube.kill();
    }
    this._cubes = null;
  }
  getCube(x, y) {
    if (x < 0 || x >= this.width) return null;
    if (y < 0 || y >= this.height) return null;
    return this.cubes[(this.height - y - 1) * this.width + x];
  }
}

export { Status, Creature, Cube, Land };
