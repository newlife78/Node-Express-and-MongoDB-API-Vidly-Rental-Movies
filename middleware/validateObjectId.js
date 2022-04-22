/* 
    . Module responsible for:
        . Verify if 'req.params.id' is a valid id, before passing it (for example to '.findById' method in 'genres.js').
        . Otherwise we will never obtain '404' from the route handlers. We would only obtain '500' error from 
          'error.js' middleware file.
*/

const mongoose = require("mongoose");

module.exports = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Invalid ID.");

  next();
};
