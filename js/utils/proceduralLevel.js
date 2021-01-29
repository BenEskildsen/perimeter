// @flow

const {
  weightedOneOf,
  normalIn,
  randomIn,
} = require('../utils/stochastic');
const globalConfig = require('../config');

const getProceduralLevel = (): Array<Action> => {
  const level = {
    numPlayers: 3, gridWidth: 100, gridHeight: 125, upgrades: [],
    actions: [],
  };
  const surfaceY = 50;

  // add the dirt:
  level.actions.push({
    type: "CREATE_ENTITIES",
    entityType: "DIRT",
    rect: {position: {x: 0, y: surfaceY}, width: 100, height: 75},
    args: [1, 1],
  });

  // add the pockets of resources:
  const numPockets = normalIn(20, 30);
  for (let i = 0; i < numPockets; i++) {
    const resourceType = weightedOneOf(
      ['STONE', 'IRON', 'COAL', 'WATER', 'SAND'],
      [1, 10, 12, 4, 2],
    );
    const isPheromone = globalConfig.pheromones[resourceType] != null;
    let width = randomIn(5, 10);
    let height = randomIn(5, 10);

    // bit of a hack to increase size
    if (isPheromone) {
      if (Math.random() < 0.5) {
        width *= 2;
      } else {
        height *= 2;
      }
    }

    const x = randomIn(1, level.gridWidth - width - 1);
    const y = randomIn(surfaceY + 1, level.gridHeight - height - 1);

    // clear out the area for the pocket
    clearOutPocket(level, {position: {x, y}, width, height});

    // add the resource
    if (!isPheromone) {
      level.actions.push({
        type: "CREATE_ENTITIES",
        entityType: resourceType,
        rect: {position: {x, y}, width, height},
        args: [1, 1],
      });
    } else {
      level.actions.push({
        type: "FILL_PHEROMONE",
        pheromoneType: resourceType,
        playerID: 0,
        quantity: globalConfig.pheromones[resourceType].quantity,
        rect: {position: {x, y}, width, height},
        args: [1, 1],
      });
    }
  }

  // add the base:
  const x =  level.gridWidth / 2 - 1;
  const y = surfaceY * 1.5;
  clearOutPocket(level, {position: {x: x - 4, y: y - 4}, width: 11, height: 11});
  level.actions.push({
    type: "CREATE_ENTITIES",
    entityType: "BASE",
    rect: {position: {x, y}, width: 1, height: 1},
    args:[1],
  });

  return level;
};

const clearOutPocket = (level, rect) => {
  const {position, width, height} = rect;
  const {x, y} = position;

  level.actions.push({
    type: "DELETE_ENTITIES",
    rect: {position: {x: x + 1, y: y + 1}, width: width - 2, height: height - 2},
  });
  // level.actions.push({
  //   type: "DELETE_ENTITIES",
  //   rect: {position: {x, y: y + 1}, width, height: height - 2},
  // });

  level.actions.push({
    type: "DELETE_ENTITIES",
    rect: {position: {x: x + 2, y}, width: width - 4, height},
  });
  level.actions.push({
    type: "DELETE_ENTITIES",
    rect: {position: {x, y: y + 2}, width, height: height - 4},
  });
}

module.exports = {getProceduralLevel};