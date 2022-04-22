/* Type of erros used:
      1. 401:
         Client does not have the authorizaztion to access this resource.
      
      2. 400:
         Bad request. What Client sends in the webtoken does not have the right data.
*/

const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, process.env.VIDLY_JWT_PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (exception) {
    res.status(400).send("Invalid token.");
  }
};
