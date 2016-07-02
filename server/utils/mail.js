var nodemailer = require('nodemailer');
var CONFIG = require('../config/constants');
/****************************************
* NODEMAILER does not support ES6 syntax
****************************************/

//Configure static SMTP Server details
const smtpTransport = nodemailer.createTransport("SMTP", {
  service: CONFIG.NODE_MAILER.SERVICE,
  auth: {
    user: CONFIG.NODE_MAILER.USER,
    pass: CONFIG.NODE_MAILER.PASS
  }
});

module.exports = {
  //Create standard mailOptions object
  createMessage: function(emailTo, verifyLink) {
    var mailOptions = {
      to: emailTo,
      subject: 'Please verify your Email address',
      html: 'Hello, <br> Please click on the link to verify your email.<br><a href=' + verifyLink + '>Click here to verify</a>'
    };
    return mailOptions;
  },

  //Wrapper for sendMail method
  send: function(mailOptions) {
    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      } else {
        console.log(response);
      }
    })
  }
};


