/*
    Module responsible for:
        1. Creating a 'logger' object.
        2. Logging the erros into 'logfile.log' and MongoDB 'log' folder.
        3. Pass the 'logger' object to: 'app.js', 'server.js', 'db.js' (in 'startup folder')
           and 'error.js' (in 'middleware folder').
*/

require("express-async-errors");
const { createLogger, format, transports } = require("winston");
require("winston-mongodb");
const config = require("config");

const db = config.get("db");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.json(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.metadata()
  ),
  transports: [
    new transports.File({ filename: "logfile.log" }),
    new transports.MongoDB({
      db: db,
      options: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    new transports.Console({ colorize: true, prettyPrint: true }),
  ],
});

module.exports = function () {
  /* 
    . To handle errors that occur outside the request pipeline of 'express.js', meaning
      errors that occur at a higher level, for example in 'node.js', we use a process object, an event emitter ('process').
   
    . We use 'on' ('process.on') to subscribe to an event.
    
    . 'uncaughtException' (process.on("uncaughtException", ...) is a standard event.
    . 'uncaughtException' represents an exception in the 'node.js' process, but no where we have handle that excption using a 'catch' block.
   
    . To handle this case we use a function '(exception) => {}' to handle this exceptions.
    
    . NOTE: THE FOLLOWING CODE IS ONLY VALID FOR SYNCRONOUS CODE! 
         DOES NOT WORK WITH ASYNC CODE (like 'Promisses')
  */

  process.on("uncaughtException", (exception) => {
    logger.error(exception.message, exception);
    process.exit(1); // We need this to exit node and run the APP again. '1' or other number: failiure / '0': success
  });

  process.on("unhandledRejection", (exception) => {
    logger.error(exception.message, exception);
    process.exit(1); // We need this to exit node and run the APP again. '1' or other number: failiure / '0': success
  });

  /*
    . Code to simulate possible error cenarios:
        . Simulating an "uncaughtException" error:
            ' throw new Error("Something failed during startup."); '

        . Simulating an "unhandledRejection" error:
            ' const p = Promise.reject(new Error("Something failed miserably!"));
              p.then(() => console.log("Done")); '
  */
};

module.exports = logger;
