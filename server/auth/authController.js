var signToken = require('./auth').signToken;
var User = require('tandem-db').User;

var methods = {};

//Render the static signup page for new users
methods.goToSignup = (req, res, next) => {
  res.render('signup');
};

//After adding new user to db, prompt them to validate email address
methods.signUp = (req, res, next) => {
  res.send('<div>Please verify your email address by clicking the link in the email sent to you & then logging in <a href="/auth/login">here</a></div>');
};

//After adding new user to db, prompt them to validate email address
//TODO - there need to be two ways of accessing this endpoint (i.e. two endpoints - one for web client, one for straight API call)
methods.verify = (req, res, next) => {
  var token = signToken(req.user.id);
  //Send the JWT token back in a custom response header
  res.set('X-Access-Token', token);
  //Render the article page for manually submitting an article
  res.render('article');
};

//Sign and send token response for valid users; display api key pair
methods.dashboard = (req, res, next) => {
  console.log(req.user);
  //Get the user's API key & secret to display on the page
  User.forge({ id: req.user.id })
    .fetch()
    .then((user) => {
      if (!user) {
        res.status(403).send('Forbidden - user not found')
      } else {
        // Sign the token
        var token = signToken(req.user.id);
        //Set cookie; use 'HttpOnly' flag - only server may attempt to access cookie, not client (mitigate XSS attacks); A
        res.set({
          'Set-Cookie': 'access_token=' + token + '; Path=/; HttpOnly',
          'Access-Control-Allow-Credentials': true
        });
        res.render('admin', {
          api: {
            key: req.user.api_key,
            secret: req.user.api_secret
          }
        });
      }  
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = methods;