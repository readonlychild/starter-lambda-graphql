// import things here
let pokemon = require('./../../../data/pokemon.json');

var resolver = (obj, args, ctx, info) => {
  let id = args.id;
  let pokem = null;
  pokemon.forEach((item) => {
    if (item.id === id.toUpperCase()) {
      pokem = item;
    }
  });
  return pokem;
};

module.exports = resolver;
