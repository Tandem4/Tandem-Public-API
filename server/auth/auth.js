var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var checkToken = expressJwt({ secret: config.secrets.jwt } ); //checkToken middleware
var crypto = require('crypto');
var uuid = require('node-uuid');
var User = require('tandem-db').User;

module.exports = {
  //Return timestamp based UUID
  generateUUID: () => {
    return uuid.v1();
  },

  //Generates an API key for new users
  generateApiKey: (password, salt) => {
    var apiKey = crypto.createHash('sha256')
        .update(password)
        .update(salt)
        .digest('hex');
    return apiKey;
  },

  //Verify user on login
  verifyUser: () => {
    return (req, res, next) => {
      var email = req.body.email;
      var password = req.body.password;

      //2nd validation check - should be checked on client side first
      if (!email || !password) {
        res.status(400).send('Please enter a valid email address and password');
        return;
      }

      //Check user vs database
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            res.status(401).send('No user with the given username');
          } else {
            if (!user.authenticate(password)) { //Add this function to check hashed password.
              res.status(401).send('Wrong password');
            } else {
              //user found - attach to request body & call next so controller can sign token from req.user.id
              req.user = user;
              next();
            }
          }
        }, (err) => {
          next(err);
        });
      };
  },

  //Update the user info on the request object
  getFreshUser: () => {
    return (req, res, next) => {
      User.findById(req.user.id)
        .then((user) => {
          if (!user) {
            //Implies JWT did not decoded to a valid user per our DB
            res.status(401).send('Unauthorised');
          } else {
            //update req.user with fresh user from stale token data
            req.user = user;
            next();
          }
        })
    }
  },

  //Decode the token received from the client
  decodeToken: () => {
    return (req, res, next) => {
      //if token placed in query string, place on the headers so checkToken function can check it.
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      // Calls next() if valid token & attaches decoded token to req.user
      checkToken(req, res, next);
    }
  },

  //Sign the token
  signToken: (id) => {
    return jwt.sign(
      {id: userid},
      config.secrets.jwt,
      {expiresInMinutes: config.expireTime})
  };
};