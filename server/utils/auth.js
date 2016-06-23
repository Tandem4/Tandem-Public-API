var crypto = require('crypto');
var uuid = require('node-uuid');
var jwt = require('jwt-simple');

const time = {
  seconds: ,
  minutes: ,
  hours: ,
  days
};

auth = {



  authenticateApiRequest: () => {

  },


  //Generates an API key for new users
  generateApiKey: (ipAddress) => {
    //Create timestamp based UUID
    var key = uuid.v1();

    //Generate a hash using 'sha256' algorithm, salting with ipAddress & using hex encoding 
    key = crypto.createHash('sha256')
        .update(key)
        .update(ipAddress)
        .digest('hex');

    //TODO: remove
    console.log(key);

    return key;
  }

}

//Private methods
//-------------------------------------
//Generate the JWT token for the session
genToken = (apiKeySecret) => {
  var expires = expiresIn(1); //1 days
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret')());

  return {
    token: token,
    expires: expires,
    user: apiKeySecret
  }
}

//Set expiry date for token
expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;