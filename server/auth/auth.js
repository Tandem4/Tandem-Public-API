var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('../config/config');
var jwtSecret = config.secrets.jwt;
var jwtExpiry = config.expireTime;
var checkToken = expressJwt({ secret: jwtSecret } );
var uuid = require('node-uuid');
var User = require('tandem-db').User;
var mail = require('../utils/mail');
var Promise = require('bluebird');

module.exports = {
  //Hashes email & password & adds a new (unverified) user to the Users table; sends verification email to new user
  addNewUser: () => {
    return (req, res, next) => {       
      //New user object for database; verified set to false            
      var newUser = {
        email_address: req.body.email,
        link_uuid: req.body.password,
        verified: false,
        api_key: uuid.v4().split('-').join(''),
        api_secret: uuid.v4().split('-').join('') //uuid
      }
      //Build email verification link
      var verifyLink = req.protocol + '://' + req.headers.host + '/auth/verify?id=' + newUser.api_key;
      //Set standard email message format
      var messageOptions = mail.createMessage(newUser.email_address, verifyLink);
      //Send verfication email
      mail.send(messageOptions)
        .then((msgResponse)=> {
          User.forge(newUser)
          .save()
          .then((user) => {
            //Add user to request object & call next middleware function
            req.user = user;
            next();
          })
          .catch((err) => {
            next(err);
          });
        })
        .catch((err) => {
          //Log any errors sending the email
          console.log(err);
          next(err);
        });
    }
  },

  //Validates email address based on link sent during signup & changes user status to 'verified' in Users table
  validateMail: () => {
    return (req, res, next) => {
      //Select user from db based on uuid per verify link
      User.forge({ 'api_key': req.query.id })
        .fetch()
        .then((user) => {
          //If exists, set verified to true, save & redirect to admin console
          if (user) {
            user.set({ verified: 1 });
            user.save();
            req.user = user;
            next();
          } else {
            res.status(403).send('403 Forbidden - Invalid User');
          }
        })
        .catch((err) => {
          next(err);
        });
    }
  },

  //Basic authentication of existing users using the Web Portal - compares login details to hashed details in Users table
  verifyExistingUser: () => {
    return (req, res, next) => {
      //Get the sign in details from the request body
      var email = req.body.email;
      var password = req.body.password;

      //2nd validation check - should be checked on client side first
      if (!email || !password) {
        res.status(400).send('Please enter a valid email address and password');
        return;
      }

      //Check user details aginst users Table
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

  newApiKey: () => {
    return (req, res, next) => {       
      //New API key info for user      
      var newKeyPair = {
        api_key: uuid.v4().split('-').join(''),
        api_secret: uuid.v4().split('-').join('') //uuid
      };
      //Get current user
      User.forge({ id: req.user.id })
      .fetch()
      .then((user) => {
        //Update keyPair with new values & save
        user.set(newKeyPair);
        user.save();
        //Update user on request object
        req.user = user;
        next();
      })
      .catch((err) => {
        next(err);
      });
    }
  },


  //Decode the token received from the client
  decodeToken: () => {
    return (req, res, next) => {
      //Parse the token from the cookie header on the request & add it to the Auth header for purposes of the Jwt checkToken function
      var accessToken = req.headers.cookie.substring(13) || '';
      req.headers.authorization = 'Bearer ' + accessToken;
      // If valid token, attaches decoded token to req.user & calls next(); else calls next() with an error
      checkToken(req, res, next);
    }
  },

  //Sign the token with user id, secret & expiry time
  signToken: (id) => {
    return jwt.sign(
      { id: id },
      jwtSecret,
      { expiresIn: jwtExpiry })
  }
};