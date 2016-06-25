var crypto = require('crypto');
var uuid = require('node-uuid');
var jwt = require('express-jwt');

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
  }
}

// //Private methods
// //-------------------------------------
// //Generate the JWT token for the session
// genToken = (apiKeySecret) => {
//   var expires = expiresIn(1); //1 days
//   var token = jwt.encode({
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