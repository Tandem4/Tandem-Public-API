var router = require('express').Router();
var articleController = require('./articleController');
var verifyUser = require('../../../auth/auth').verifyUser;

/*************************************************
* NOTE: All routes relative to '/api/v1/articles'
*************************************************/

/*---------------------------------------------------------------------------------------------
 * Not neccessary in this implentation, but retained in the repo as is a useful pattern:
 * -> Local route param callback to set route specific params on request object for easy access
----------------------------------------------------------------------------------------------*/
router.param('id', articleController.params);

router.route('/')
  .get(articleController.get)

// router.post('/', verifyUser(), articleController.post); //add a story
router.post('/', articleController.post); //add a story

router.route('/:id')
  .get(articleController.getOne)
  // .delete(articleController.delete);

module.exports = router;