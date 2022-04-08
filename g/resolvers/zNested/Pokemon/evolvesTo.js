// import things here
let pokemon = require('./../../../../data/pokemon.json');

var resolver = (obj, args, ctx, info) => {
  // obj, the parent Pokemon
  let ary = [];
  obj.evolutionBranch.forEach((evo) => {
    let evoId = evo.form || evo.evolution;
    let p = findPokemon(evoId);
    if (p) ary.push(p);
  });
  return ary;
};

function findPokemon (id) {
  let p = false;
  for (let k = 0; k <= pokemon.length; k++) {
    if (pokemon[k].id === id.toUpperCase()) {
      p = pokemon[k];
      break;
    }
  }
  return p;
}

module.exports = resolver;
