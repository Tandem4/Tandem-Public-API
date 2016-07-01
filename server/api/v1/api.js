var router = require('express').Router();
var throttle = require('../../middleware/apiRateLimiter');

/*********************************************
* Routes relative to /api/v1/
*********************************************/

router.use(throttle());
//Mount all other routers for our api resources
router.use('/trends', require('./trend/trendRoutes'));
router.use('/articles', require('./article/articleRoutes'));//post requires auth

module.exports = router;