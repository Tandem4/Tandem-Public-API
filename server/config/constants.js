

/********************************************************************************
* NB: To use Gmail with nodemailer requires configuring the Gmail sender account
* to permit access for less secure apps here:
* https://www.google.com/settings/security/lesssecureapps
********************************************************************************/
module.exports = {
  NODE_MAILER: {
    SERVICE: process.env.TANDEM_NODE_MAILER_SERVICE,
    USER: process.env.TANDEM_NODE_MAILER_USER,
    PASS: process.env.TANDEM_NODE_MAILER_PASS
  }
};