import { Land } from './creature';
class Scene {
  land: Land;
}

function createScene() {
  // 创建场景
  const scene = new Scene();
  // 创建土地
  const land = new Land(5, 5);
  land.born();
  land.kill();
  scene.land = land;
  console.log(land.cubes);
  return scene;
}
export { createScene };
