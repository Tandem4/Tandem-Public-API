var router = require('express').Router();

/*********************************************
* Routes relative to /api/v1/
*********************************************/

//Mount all other routers for our api resources
router.use('/trends', require('./trend/trendRoutes'));
router.use('/articles', require('./article/articleRoutes'));//post requires auth

module.exports = router;