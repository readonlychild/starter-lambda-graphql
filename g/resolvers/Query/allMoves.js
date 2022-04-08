// import things here
let moves = require('./../../../data/moves.json');

var resolver = (obj, args, ctx, info) => {
  let page = args.page || 1;
  let itemsPerPage = args.itemsPerPage || 10;

  // transform the move data into an array
  let moveAry = [];
  for (let moveId in moves) {
    moveAry.push(moves[moveId]);
  }

  // also sort alpha by Name
  moveAry.sort((a, b) => {
    if (a.Name < b.Name) return -1;
    return 1;
  });

  let items = [];
  let paging = {
    total: moveAry.length,
    totalPages: Math.ceil(moveAry.length / itemsPerPage),
    page,
    itemsPerPage
  };
  let startIndex = (page - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;

  moveAry.forEach((move, idx) => {
    if (idx >= startIndex && idx < endIndex) {
      items.push(move);
    }
  });
  return {
    items,
    paging
  };
};

module.exports = resolver;
