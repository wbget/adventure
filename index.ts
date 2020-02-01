import * as Koa from 'koa';
import { createScene } from './scene';
const scene = createScene();

const app = new Koa();
app.use(async ctx => {
  const result = scene.land.cubes.reduce((pre, cur) => {
    return pre + `(${cur.x},${cur.y})${cur.right ? '-' : '\n'}`;
  }, '');
  const up = scene.land.cubes.reduce((pre, cur) => {
    return (
      pre +
      `(${cur.up ? `${cur.up.x},${cur.up.y}` : ''})${cur.right ? '-' : '\n'}`
    );
  }, '');
  const right = scene.land.cubes.reduce((pre, cur) => {
    return (
      pre +
      `(${cur.right ? `${cur.right.x},${cur.right.y}` : ''})${
        cur.right ? '-' : '\n'
      }`
    );
  }, '');
  const down = scene.land.cubes.reduce((pre, cur) => {
    return (
      pre +
      `(${cur.down ? `${cur.down.x},${cur.down.y}` : ''})${
        cur.right ? '-' : '\n'
      }`
    );
  }, '');
  const left = scene.land.cubes.reduce((pre, cur) => {
    return (
      pre +
      `(${cur.left ? `${cur.left.x},${cur.left.y}` : ''})${
        cur.right ? '-' : '\n'
      }`
    );
  }, '');
  ctx.body = result + up + right + down + left;
});
app.listen(3000);
