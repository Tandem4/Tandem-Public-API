var signToken = require('./auth').signToken;

var methods = {};

//Render the static login page
methods.goToLogin = (req, res, next) => {
  res.render('login');
}

//Sign and send token response for valid users
methods.login = (req, res, next) => {
  var token = signToken(req.user.id);
  //Send the JWT token back in a custom response header
  res.set('X-Access-Token', token);
  //Render the article page for manually submitting an article
  res.render('article');
}

//Render the static signup page for new users
methods.goToSignup = (req, res, next) => {
  res.render('signup');
}

//After adding new user to db, prompt them to validate email address
methods.signUp = (req, res, next) => {
  res.send('<div>Please verify your email address by clicking the link in the email sent to you & then logging in <a href="/auth/login">here</a></div>');
}

//After adding new user to db, prompt them to validate email address
methods.verify = (req, res, next) => {
  var token = signToken(req.user.id);
  //Send the JWT token back in a custom response header
  res.set('X-Access-Token', token);
  //Render the article page for manually submitting an article
  res.render('article');
}

module.exports = methods;

