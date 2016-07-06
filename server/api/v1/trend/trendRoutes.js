var router = require('express').Router();
var trendController = require('./trendController');

/***********************************************************************************
* PURPOSE: Define API 'trend' routes - all endpoints relative to /api/v1/trends
***********************************************************************************/

//NO AUTH - Get all trends
router.route('/')
  .get(trendController.get);

module.exports = router;