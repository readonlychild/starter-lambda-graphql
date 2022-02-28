// import things here

var resolver = (obj, args, ctx, info) => {
  console.log('Activating QUERY->RESOLVER', 'testNoParam.js');
  return {
    total: 4,
    caption: 'Hello User :)'
  };
};

module.exports = resolver;
