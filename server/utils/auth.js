var crypto = require('crypto');
var uuid = require('node-uuid');

module.exports = {

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