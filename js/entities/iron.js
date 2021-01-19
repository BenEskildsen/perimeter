// @flow

const {
  getTileSprite,
} = require('../selectors/sprites');
const {makeEntity} = require('./makeEntity');

const config = {
  isTiled: true,
  isMeltable: true,
  pheromoneEmitter: true,
  pheromoneType: 'MOLTEN_IRON',
  hp: 12,
  meltTemp: 100, // temperature at which you melt
  heatQuantity: 120, // amount of iron produced when melted
};

const make = (
  game: Game,
  position: Vector,
	width: ?number,
	height: ?number,
): Coal => {
	return {
    ...makeEntity('IRON', position, width || 1, height || 1),
    ...config,
    dictIndexStr: '',
    playerID: 0, // gaia
    quantity: 0, // amount of pheromone emitted
  };
};

const render = (ctx, game, iron): void => {
  // const obj = getTileSprite(game, iron);
  // if (obj == null || obj.img == null) return;
  // ctx.drawImage(
  //   obj.img,
  //   obj.x, obj.y, obj.width, obj.height,
  //   iron.position.x, iron.position.y, iron.width, iron.height,
  // );

  ctx.fillStyle = "darkgray";
  ctx.fillRect(iron.position.x, iron.position.y, iron.width, iron.height);
}

module.exports = {
  make, render, config,
};
