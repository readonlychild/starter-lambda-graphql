// import things here

var resolver = (obj, args, ctx, info) => {
  /* return object or promise */
  // access query arguments/parameters
  let myParam = args.myParam;
  let msg = myParam;
  return {
    success: true,
    message: msg
  };
  // or
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
