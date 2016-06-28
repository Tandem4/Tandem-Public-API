var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var uuid = require('node-uuid');
var expressJwt = require('express-jwt');
var checkToken = expressJwt({ secret: config.secrets.jwt } ); //checkToken middleware

auth = {
  //Return timestamp based UUID
  generateUUID: () => {
    return uuid.v1();
  },

  authenticateApiRequest: () => {

  },

  //Generates an API key for new users
  generateApiKey: (password, salt) => {
    var apiKey = crypto.createHash('sha256')
        .update(password)
        .update(salt)
        .digest('hex');
    return apiKey;
  },

  checkJwt: (req, res, next) => {
    //Assume client sending token one of 3 ways - POST Body, GET param or in Header
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    
  },

  decodeToken: () => {
    return (req, res, next) => {
      //if toke placed in query string, place on the headers so checkToken function can check it.
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }

      checkToken(req, res, next);
    }
  }
}

// //Private methods
// //-------------------------------------
// //Generate the JWT token for the session
// genToken = (apiKeySecret) => {
//   var expires = expiresIn(1); //1 days
//   var token = expressJwt.encode({
//     exp: expires
//   }, require('../config/secret')());

//   return {
//     token: token,
//     expires: expires,
//     user: apiKeySecret
//   }
// }

// //Set expiry date for token
// expiresIn(numDays) {
//   var dateObj = new Date();
//   return dateObj.setDate(dateObj.getDate() + numDays);
// }

module.exports = auth;