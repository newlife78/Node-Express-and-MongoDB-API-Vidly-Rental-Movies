/*
    Module responsible for:
        1. Look for essecial configuration setting during APP startup.
        2. Look for this settings in all the APP code (in this case 'server.js' and 'config' folder).
        3. Pass this settings to: 'app.js' and 'server.js' (through 'app.js').
*/

require("dotenv").config();

module.exports = function () {
  if (!process.env.VIDLY_JWT_PRIVATE_KEY) {
    throw new Error("FATAL ERRROR: jwtPrivateKey is not defined.");
    // process.exit(1); // '0': means success. Other number then '0' means failiure.
  }
};
