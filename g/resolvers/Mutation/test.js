// import things here

var resolver = (obj, args, ctx, info) => {
  let msg = args.message;
  return {
    success: true,
    message: msg
  };
};

module.exports = resolver;
