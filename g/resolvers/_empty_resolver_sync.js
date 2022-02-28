// import things here

var resolver = (obj, args, ctx, info) => {
  let myParam = args.myParam || 'hello world!';
  let msg = myParam;
  return {
    success: true,
    message: msg
  };
};

module.exports = resolver;
