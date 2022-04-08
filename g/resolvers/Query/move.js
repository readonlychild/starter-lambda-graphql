// import things here
let moves = require('./../../../data/moves.json');

var resolver = (obj, args, ctx, info) => {
  let id = args.id;
  let move = null;
  if (moves[id.toUpperCase()]) {
    move = moves[id.toUpperCase()];
  }
  return move;
};

module.exports = resolver;
