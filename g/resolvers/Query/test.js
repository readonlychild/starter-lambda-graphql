// import things here

var resolver = (obj, args, ctx, info) => {
  console.log('Activating QUERY->RESOLVER', 'test.js');
  let msg = args.message;
  return {
    total: 4,
    caption: msg,
    prop1: 'value1',
    prop2: 'value2',
    prop3: 'value3'
  };
};

module.exports = resolver;
