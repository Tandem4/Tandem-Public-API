var decodeToken = require('./auth').decodeToken;
var router = require('express').Router();
var throttle = require('../middleware/apiRateLimiter');
var authController = require('./authController');
var verifyExistingUser = require('./auth').verifyExistingUser;
var addNewUser = require('./auth').addNewUser;
var validateMail = require('./auth').validateMail;

/*********************************************
* NOTE: All routes relative to '/auth'
*********************************************/

//API rate limiting middleware function - applies to all /auth routes
router.use(throttle());

//Render login page - no auth
router.get('/login', (req, res) => {
  res.render('login');
});

//Render new sign up page - no auth
router.get('/signup', (req, res) => {
  res.render('signup');
});

//Process initial signup details & send verification email - no auth
router.post('/signup', addNewUser(), authController.signUp);

//Update user info based on email verification & return signed JWT token - no auth
router.get('/verify', validateMail(), authController.verify);

//Verify is existing user & log them in - return signed JWT token - check login details & return token in authController
router.post('/dashboard', verifyExistingUser(), authController.dashboard);

// router.use(decodeToken());

//Check user already signed in & valid
router.post('/newkey', decodeToken(), authController.dashboard);

module.exports = router;