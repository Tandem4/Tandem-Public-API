var router = require('express').Router();
var throttle = require('../middleware/apiRateLimiter');
var authController = require('./authController');
var verifyExistingUser = require('./auth').verifyExistingUser;
var addNewUser = require('./auth').addNewUser;
var validateMail = require('./auth').validateMail;

/*********************************************
* NOTE: All routes relative to '/auth'
*********************************************/

//API rate limiting middleware function
router.use(throttle());

//Render login page
router.get('/login', (req, res) => {
  res.render('login');
});

//Verify is existing user & log them in - return signed JWT token
router.post('/login', verifyExistingUser(), authController.login);

//Render new sign up page
router.get('/signup', (req, res) => {
  res.render('signup');
});

//Process initial signup details & send verification email
router.post('/signup', addNewUser(), authController.signUp);

//Update user info based on email verification & return signed JWT token
router.get('/verify', validateMail(), authController.verify);

module.exports = router;