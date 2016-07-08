var router = require('express').Router();
var articleController = require('./articleController');
var checkApiKeySecret = require('../../../auth/auth').checkApiKeySecret;
var decodeToken = require('../../../auth/auth').decodeToken;

/***********************************************************************************
* PURPOSE: Define API 'article' routes - all endpoints relative to /api/v1/articles
***********************************************************************************/

/*---------------------------------------------------------------------------------------------
 * Not neccessary in this implementation, but retained in the repo as is a useful pattern:
 * -> Local route param callback to set route specific params on request object for easy access
 * -> (see articleController.params)
-----------------------------------------------------------------------------------------------
 // router.param('id', articleController.params);
----------------------------------------------------------------------------------------------*/

//NO AUTH
router.route('/')
  .get(articleController.getArticles) //Get articles for the selected trend

//BEARER AUTH - check user signed in & valid
router.post('/restricted', decodeToken(), articleController.uploadTemplate); //Go to the manual article upload template
router.post('/restricted/add', decodeToken(), articleController.post); //add a story
// router.post('/auth', checkApiKeySecret(), articleController.generateToken); //Generate token for users accessing service programmatically
// router.get('/*', (req, res, next) => {
//   res.redirect('/api/v1/trends');
//   next();
// }); //Generate token for users accessing service programmatically

// router.get('/auth', decodeToken(), articleController.getToken); //add a story

//Catch all path for invalid routes
router.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

module.exports = router;