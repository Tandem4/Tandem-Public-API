var router = require('express').Router();
var trendController = require('./trendController');

/**********************************************
* NOTE: All routes relative to '/api/v1/trends'
**********************************************/

//Local route param callback to set route specific params on request object for easy access
router.param('_id', trendController.params);

//Collection routes - all trends
router.route('/')
  .get(trendController.get);

//Instance routes - specific trend. Only used by programmatic API calls to this endpoint (vs requests from the client itself)
router.route('/:_id')
  .get(trendController.getOne);

module.exports = router;