/*
  NOTES:
    1. Log exception by level of importance: 'error', 'warn', 'info', 'verbose', 'debug', 'silly'.
    2. This 'function (err, req, res, next) {}' only works for errors that happens in request process pipeline.
    3. For "uncaughtException" or "unhandledRejection", meaning outside the scope of 'express.js' we use 'process.on'
       (see 'app.js' file).
*/

/* Type of erros used:
      1. 500:
         Internal Server Error => something failed on the server, but we do not know what.
*/

const logger = require("../startup/logging");

module.exports = function (err, req, res, next) {
  logger.error(err.message, err); // alternative method to 'wiston.error'

  res.status(500).send("Something failed.");
};
