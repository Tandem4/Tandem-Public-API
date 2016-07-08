var router = require('express').Router();
var throttle = require('../../middleware/apiRateLimiter');

/***********************************************************************************
* PURPOSE: Mount major API routes as middleware - all endpoints relative to /api/v1
***********************************************************************************/

//ALL ROUTES (/api/v1) - API rate limiting middleware function
router.use(throttle());
//Mount all other routers for api resources
router.use('/trends', require('./trend/trendRoutes'));
router.use('/articles', require('./article/articleRoutes'));//post requires auth

//Catch all path for invalid routes
router.get('*', (req, res) => {
  res.status(404).send('Page not found');
})

module.exports = router;