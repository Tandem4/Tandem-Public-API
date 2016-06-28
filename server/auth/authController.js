var User = require('tandem-db').User;
var signToken = require('./auth').signToken;

module.exports = (req, res, next) => {
  var token = signToken(req.user.id);
  res.json({ token: token });
}
