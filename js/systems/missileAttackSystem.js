// @flow

const {randomIn, normalIn} = require('../utils/stochastic');
const globalConfig = require('../config');
const {Entities} = require('../entities/registry');

const initMissileAttackSystem = (store) => {
  const {dispatch} = store;
  let time = -1;
  store.subscribe(() => {
    const state = store.getState();
    const {game} = state;
    if (!game) return;
    if (game.time == time) return;
    time = game.time;

    if (game.pauseMissiles) return;

    let freq = 0; // time in seconds
    let altProb = 0;
    let nukeProb = 0;

    if (game.time == 1) {
      dispatch({type: 'SET_TICKER_MESSAGE',
        time: 60 * 10,
        message: 'WARNING - MISSILES INCOMING IN 1 MINUTE',
      });
    }

    if (game.time == 60 * 60 * 1) {
      dispatch({type: 'SET_TICKER_MESSAGE',
        time: 60 * 10,
        message: 'MISSILES INCOMING EVERY 5 - 10 SECONDS',
      });
    }
    if (game.time > (60 * 60 * 1)) {
      freq = 5;
    }

    if (game.time == 60 * 60 * 5) {
      dispatch({type: 'SET_TICKER_MESSAGE',
        time: 60 * 10,
        message: 'MISSILES INCOMING TWICE AS OFTEN',
      });
    }
    if (game.time > (60 * 60 * 5)) {
      freq = 2;
    }

    if (game.time == 60 * 60 * 9) {
      dispatch({type: 'SET_TICKER_MESSAGE',
        time: 60 * 10,
        message: 'MISSILES INCOMING TWICE AS OFTEN',
      });
    }
    if (game.time > (60 * 60 * 9)) {
      freq = 1;
    }

    if (game.time == 60 * 60 * 10) {
      dispatch({type: 'SET_TICKER_MESSAGE',
        time: 60 * 10,
        message: 'NUCLEAR MISSILES INCOMING',
      });
    }
    if (game.time > (60 * 60 * 10)) {
      freq = 1;
      altProb = 0.02;
      nukeProb = 0.1;
    }

    if (game.time == 60 * 60 * 12) {
      dispatch({type: 'SET_TICKER_MESSAGE',
        time: 60 * 10,
        message: 'MISSILES INCOMING TWICE AS OFTEN',
      });
    }
    if (game.time > (60 * 60 * 12)) {
      freq = 0.5;
      altProb = 0.04;
      nukeProb = 0.1;
    }
    let alternateSide = Math.random() < altProb;
    let isNuke = Math.random() < nukeProb;
    if (time > 1 && time % (freq * 60) == 0) {
      const playerID = 2;
      let pos = {x: randomIn(2, 5), y: randomIn(25, 45)};
      let theta = -1 * randomIn(25, 75) / 100;
      const velocity = randomIn(30, 90);

      if (alternateSide) {
        pos.x = game.gridWidth - pos.x - 1;
        theta += Math.PI;
      }

      const warhead = Entities[isNuke ? 'NUKE' : 'DYNAMITE'].make(game, null, playerID);
      const missile = Entities.MISSILE.make(game, pos, playerID, warhead, theta, velocity);
      dispatch({type: 'CREATE_ENTITY', entity: missile});
    }

  });
};

module.exports = {initMissileAttackSystem};
