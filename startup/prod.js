/*
    . Module responsible for all gathering all the middleware that we need to install for the production environment.
    . All that middleware should be here.
    . This module creates and exports a function that take our 'app' has an object and install in it
      this middleware pieces.
*/

const helmet = require("helmet");
const compression = require("compression");

module.exports = function (app) {
  app.use(helmet());
  app.use(compression());
};
