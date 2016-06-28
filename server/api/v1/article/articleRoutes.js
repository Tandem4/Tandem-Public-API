var router = require('express').Router();
var storyController = require('./storyController');

/*********************************************
* Routes relative to /api/v1/articles
*********************************************/

router.param('id', storyController.params);

router.route('/')
  .get(storyController.get) //get all stories
  .post(storyController.post) //add a story

router.route('/:id') //edit a specific story
  .put(storyController.put)
  .delete(storyController.delete)

module.exports = router;