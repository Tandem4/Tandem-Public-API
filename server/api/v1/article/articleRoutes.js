var router = require('express').Router();
var articleController = require('./articleController');
var decodeToken = require('../../../auth/auth').decodeToken;

/*************************************************
* NOTE: All routes relative to '/api/v1/articles'
*************************************************/

/*---------------------------------------------------------------------------------------------
 * Not neccessary in this implentation, but retained in the repo as is a useful pattern:
 * -> Local route param callback to set route specific params on request object for easy access
----------------------------------------------------------------------------------------------*/
// router.param('id', articleController.params);

//Non authenticated routes
router.route('/')
  .get(articleController.getArticles) //Get articles for the selected trend
  
router.route('/:id')
  .get(articleController.getOne)

//Authenticated routes - check user signed in & authenticated
router.post('/restricted', decodeToken(), articleController.uploadTemplate); //Go to the manual article upload template
router.post('/restricted/add', decodeToken(), articleController.post); //add a story

module.exports = router;