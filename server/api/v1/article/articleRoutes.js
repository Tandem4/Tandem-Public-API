var router = require('express').Router();
var articleController = require('./articleController');

/*********************************************
* Routes relative to /api/v1/articles
*********************************************/

router.param('id', articleController.params);

router.route('/')
  .get(articleController.get) //get all stories
  .post(articleController.post); //add a story

router.route('/:id') //edit a specific story
  // .put(articleController.put)
  // .delete(articleController.delete);

module.exports = router;