const cartGamesIds = async (cart) => {
  return await cart.map((game) => ({ id: game.id }));
}

const cartItems = async (cart) => {
  let games = [];

  await Promise.all(
    cart?.map(async (game) => {
      const validateGame = await strapi.services.game.findOne({
        id: game.id,
      });

      if(validateGame) {
        games.push(validateGame);
      }
  }));

  return games;
};

const total = async (games) => {
  const amount = await games.reduce((acc, game) => acc + game.price, 0);

  return Number((amount * 100).toFixed(0));
};

module.exports = {
  cartItems,
  total,
  cartGamesIds
}
