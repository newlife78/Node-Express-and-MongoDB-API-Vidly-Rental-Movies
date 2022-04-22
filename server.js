const app = require("./app");
const config = require("config");
const logger = require("./startup/logging");

require("./startup/db")();

const port = config.get("PORT_ONE") || config.get("PORT_TWO");

const server = app.listen(port, () => {
  logger.info(`Listening on port ${port}...`);
});

module.exports = server;
