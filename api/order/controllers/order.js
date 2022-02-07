'use strict';

const stripe = require('stripe')(process.env.STRIPE_KEY);

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

    if (total === 0) {
      return {
        freeGames: true
      }
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total * 100,
        currency: 'usd',
        automatic_payment_methods: {enabled: true},
      });

      return paymentIntent;
    } catch (err) {
      return {
        error: err.raw.message
      }
    }

  },

  create: async (ctx) => {
    // pegar as informações do frontend
    const { cart, paymentIntentId, paymentMethod } = ctx.request.body;
    // pegar o token
    const token = await strapi.plugins["users-permissions"].services.jwt.getToken(ctx);

    // pega o id do usuario
    const userId = token.id;

    //pegar informacoes do usuario
    const userInfo = await strapi
      .query("user", "users-permissions")
      .findOne({ id: userId });

    // pegar jogos
    // pegar total
    // pegar paymentIntentId


    return { cart, paymentIntentId, paymentMethod };
  }
};
