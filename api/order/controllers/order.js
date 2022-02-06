'use strict';

const { default: createStrapi } = require("strapi");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body;

    let games = [];

    await Promise.all( cart?.map(async (game) => {
      const validateGame = await strapi.services.game.findOne({
        id: game.id,
      });

      if(validateGame) {
        games.push(validateGame);
      }
    }))

    if(!games.length) {
      ctx.response.status = 404;

      return {
        error: 'No valid games found!'
      }
    }

    const total = games.reduce((acc, game) => acc + game.price, 0);

    return { games, total_in_cents: total * 100 };
  }
};
