var userController = require('./user/userController');
var signToken = require('./auth').signToken;



module.exports = (req, res, next) => {
  var token = signToken(req.user.id);
  res.json({ token: token });
}

var methods = {};

methods.params = (req, res, next) => {
  
}

methods.goToLogin = (req, res, next) => {
  res.render('login');
}

methods.login = (req, res, next) => {
  
}

methods.goToSignup = (req, res, next) => {
  res.render('signup');
}

methods.signUp = (req, res, next) => {
    var linkUuid = uuid.v1();
    // var mailTo = req.query.to;
    var mailTo = req.body.email;
    var verifyLink = req.protocol + '://' + req.headers.host + '/verify?id=' + linkUuid;
    // var messageOptions = mail.createMessage(mailTo, verifyLink);
    // mail.send(messageOptions, (error, response)=> {
    //   if (error) {
    //     console.log('ERROR sending mail: ', error);
    //   } else {
        var apiKey = auth.generateApiKey(req.body.password, linkUuid); //bcrypt email, password, salt
        var apiSecret = uuid.v4().split('-').join(''); //uuid    
  
}

methods.verify = (req, res, next) => {
  
}

module.exports = methods;

