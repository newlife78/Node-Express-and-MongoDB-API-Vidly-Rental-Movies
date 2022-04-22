/* Type of erros used:
      1. 401 Unauthorized:
         When a User try to access a protected resource, but they do not supply a valid JSON web token.
      
      2. 403 Forbidden:
         When a User has a valid Json Web Token, we give it another change if they do not have authorization
         to access that resource we say "you are not allowed to access it".
*/

module.exports = function (req, res, next) {
  if (!req.user.isAdmin) return res.status(403).send("Access denied.");

  next();
};
