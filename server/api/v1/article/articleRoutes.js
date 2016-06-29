var router = require('express').Router();
var articleController = require('./articleController');
var verifyUser = require('../../../auth/auth').verifyUser;

/*********************************************
* Routes relative to /api/v1/articles
*********************************************/

router.param('id', articleController.params);

router.route('/')
  .get(articleController.get) //get all stories

// router.post('/', verifyUser(), articleController.post); //add a story

router.route('/:id') //edit a specific story
  // .put(articleController.put)
  // .delete(articleController.delete);

module.exports = router;