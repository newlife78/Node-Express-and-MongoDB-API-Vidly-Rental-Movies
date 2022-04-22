/*
    Module responsible for:
        1. Setting the connection with MongoDB.
        2. Pass the connection to 'server.js' for starting the APP.
*/

const mongoose = require("mongoose");
const logger = require("../startup/logging");
const config = require("config");

module.exports = function () {
  const db = config.get("db");

  // Connect to MongoDB
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => logger.info(`Connected to ${db}...`))
    .catch((err) => app.logger.error(err.message, err));
};
