// import things here
let pokemon = require('./../../../data/pokemon.json');

var resolver = (obj, args, ctx, info) => {
  let page = args.page || 1;
  let itemsPerPage = args.itemsPerPage || 10;
  /*
  This resolver needs to return type PokemonPage
  {
    items: [ Pokemon ]
    paging { page itemsPerPage total totalPages }
  }
  */
  let items = [];
  let paging = {
    total: pokemon.length,
    totalPages: Math.ceil(pokemon.length / itemsPerPage),
    page,
    itemsPerPage
  };
  let startIndex = (page - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;
  pokemon.forEach((poke, idx) => {
    if (idx >= startIndex && idx < endIndex) {
      items.push(poke);
    }
  });
  return {
    items,
    paging
  };
};

module.exports = resolver;
