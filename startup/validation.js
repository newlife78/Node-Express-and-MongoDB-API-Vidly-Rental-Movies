/*
    Module responsible for:
        1. For the configuration of 'Joi'.
        3. Pass this settings to: 'app.js' and 'server.js' (through 'app.js').
*/

const Joi = require("joi");

module.exports = function () {
  Joi.objectId = require("joi-objectid")(Joi);
};
