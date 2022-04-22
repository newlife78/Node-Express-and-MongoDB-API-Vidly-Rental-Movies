/* 
    Module is used to prevente repeat the 'try / catch' block in each route handler.
*/
module.exports = function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (exception) {
      next(exception);
    }
  };
};
