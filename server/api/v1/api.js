var router = require('express').Router();

//Mount all other routers for our api resources
router.use('/trends', require('./trend/trendRoutes'));
router.use('/articles', require('./article/articleRoutes'));

module.exports = router;