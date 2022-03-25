// import things here

var resolver = (obj, args, ctx, info) => {
  return {
    total: 4,
    caption: 'Hello User :)'
  };
};

module.exports = resolver;
