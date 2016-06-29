var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('../config/config');
var checkToken = expressJwt({ secret: config.secrets.jwt } ); //returns middleware function that checks req.headers.authorization to determine whether token valid or not
var uuid = require('node-uuid');
var User = require('tandem-db').User;
var userController = require('../user/userController');
var Promise = require('bluebird');

module.exports = {
  //TODO: THIS IS UGLY AND NEEDS REFACTORTING OF USER METHODS INTO USER CONTROLLER
  addNewUser: () => {
    return (req, res, next) => {                   
      var newUser = {
        email_address: req.body.email,
        link_uuid: uuid.v1(),
        verified: false,
        api_key: req.body.password,
        api_secret: uuid.v4().split('-').join('') //uuid
      }
      var verifyLink = req.protocol + '://' + req.headers.host + '/auth/verify?id=' + newUser.link_uuid;
    // var messageOptions = mail.createMessage(newUser.email_address, verifyLink);
    // mail.send(messageOptions, (err, result)=> {
    //   if (error) {
    //     console.log('ERROR sending mail: ', error);
    //   } else {
        User.forge(newUser)
        .save()
        .then((user) => {
          req.user = user;
          next();
        })
        .catch((err) => {
          next(err);
        });
      // }
    // })
    }
  },

  //Verify user on login
  verifyExistingUser: () => {
    return (req, res, next) => {
      var email = req.body.email;
      var password = req.body.password;

      //2nd validation check - should be checked on client side first
      if (!email || !password) {
        res.status(400).send('Please enter a valid email address and password');
        return;
      }

      //TODO: THIS IS UGLY AND NEEDS REFACTORTING OF USER METHODS INTO USER CONTROLLER
      //Check user vs database
      User.forge({ email_address: email })
        .fetch()
        .then((user) => {
          if (!user) {
            res.status(401).send('No user with the given username');
          } else {
            if (!user.authenticate(password)) { //Method added to Bookshelf model
              res.status(401).send('Wrong password');
            } else {
              //user found - attach to request & call next so controller can sign token from req.user.id
              req.user = user;
              //call next middleware
              next();
            }
          }
        })
        .catch((err) => {
          next(err);
        });
    };
  },

  validateMail: () => {
    return (req, res, next) => {
      //Select user from db based on uuid per verify link
      User.forge({ 'link_uuid': req.query.id })
        .fetch()
        .then((user) => {
          //If exists, set verified to true, save & redirect to admin console
          if (user) {
            user.set({ verified: 1 });
            user.save();
            req.user = user;
            next();
          } else {
            //TODO: 403 redirect?
            res.status(403).send('403 Forbidden - Invalid User');
          }
        })
        .catch((err) => {
          next(err);
        });
    }
  },

  //Update the user info on the request object
  getFreshUser: () => {
    return (req, res, next) => {
      //TODO: THIS IS UGLY AND NEEDS REFACTORTING OF USER METHODS INTO USER CONTROLLER
      User.forge({ id: req.user.id })
        .fetch()
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
        .catch((err) => {
          next(err);
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
      // Calls next() if valid token & attaches decoded token to req.user; else calls next() with an error
      checkToken(req, res, next);
    }
  },

  //Sign the token
  signToken: (id) => {
    return jwt.sign(
      {id: id},
      config.secrets.jwt,
      {expiresIn: config.expireTime})
  }
};