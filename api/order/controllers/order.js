'use strict';
const { sanitizeEntity } = require('strapi-utils');

const stripe = require('stripe')(process.env.STRIPE_KEY);
const orderTemplate = require('../../../config/email-templates/order');

module.exports = {
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body;

    //simplify cart data
    const cartGamesIds = await strapi.config.functions.cart.cartGamesIds(cart);

    //get all games
    const games = await strapi.config.functions.cart.cartItems(cartGamesIds);

    if(!games.length) {
      ctx.response.status = 404;

      return {
        error: 'No valid games found!'
      }
    }

    const total = await strapi.config.functions.cart.total(games);

    if (total === 0) {
      return {
        freeGames: true
      }
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
        metadata: { cart: JSON.stringify(cartGamesIds) }
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
    const user= await strapi
      .query("user", "users-permissions")
      .findOne({ id: userId });

    //simplify cart data
    const cartGamesIds = await strapi.config.functions.cart.cartGamesIds(cart);
    // pegar jogos
    const games = await strapi.config.functions.cart.cartItems(cartGamesIds);

    // pegar total
    const total_in_cents = await strapi.config.functions.cart.total(games);

    // pegar do frontend os valores do paymentMethod
    let paymentInfo;

    if(total_in_cents !== 0) {
      try {
        paymentInfo = await stripe.paymentMethods.retrieve(paymentMethod);
      } catch (err) {
        ctx.response.status = 402;

        return { error: err.message }
      }
    }
    //salver no banco
    const entry = {
      total_in_cents,
      payment_intent_id: paymentIntentId,
      card_brand: paymentInfo?.card?.brand,
      card_last4: paymentInfo?.card?.last4,
      games,
      user
    };

    const entity = await strapi.services.order.create(entry);

    // enviar um email da compra
    await strapi.plugins.email.services.email.sendTemplatedEmail({
      to: user.email,
      from: 'wongames@wongames.com',
    },
    orderTemplate,
    {
      user,
      payment: {
        total: `$ ${total_in_cents / 100}`,
        card_brand: entry.card_brand,
        card_last4: entry.card_last4,
      },
      games
    })
    return sanitizeEntity(entity, { model: strapi.models.order });
  }
};
