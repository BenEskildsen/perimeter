// @flow

const {makeEntity} = require('./makeEntity');
const globalConfig = require('../config');

const config = {
  hp: 150,
  width: 3,
  height: 3,
  pheromoneEmitter: true,
  pheromoneType: 'COLONY',

  // need this for panning to focus on it
  MOVE: {
    duration: 10,
  },
};

const make = (
  game: Game,
  position: Vector,
  playerID,
  quantity: ?number,
): Base => {
  return {
    ...makeEntity('BASE', position, config.width, config.height),
    ...config,
    playerID,
    quantity: quantity || globalConfig.pheromones[config.pheromoneType].quantity,
    actions: [],
  };
};

const render = (ctx, game, token): void => {
  ctx.save();
  ctx.translate(token.position.x, token.position.y);
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'steelblue';
  ctx.beginPath();
  const radius = token.width / 2;
  ctx.arc(
    token.width / 2,
    token.height / 2,
    radius, 0, Math.PI * 2,
  );
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.restore();
};

module.exports = {config, make, render};
