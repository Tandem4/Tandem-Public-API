var router = require('express').Router();
var trendController = require('./trendController');

/*********************************************
* Routes relative to /api/v1/trends
*********************************************/

//
router.param('id', trendController.params);

//Collection routes - all trends
router.route('/')
  .get(trendController.get);

//Instance routes - specific trend
router.route('/:id')
  .get(trendController.getOne);

module.exports = router;