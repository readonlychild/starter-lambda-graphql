// import things here

var resolver = (obj, args, ctx, info) => {
  let myParam = args.myParam || 'hello world!';
  let msg = myParam;
  return new Promise ((resolve, reject) => {
    resolve({
      success: true,
      message: msg
    });
  })
  .catch((err) => {
    //reject(err);
    // or
    resolve({
      success: false,
      message: err.message
    });
  });
};

module.exports = resolver;
