var Trend = require('tandem-db').Trend;
var Article = require('tandem-db').Article;
var methods = {};

//Router param callback to decorate the request object with specified trend
//
/*---------------------------------------------------------------------------------------------
 * Not neccessary in this implentation, but retained in the repo as is a useful pattern:
 * -> Local route param callback to set route specific params on request object for easy access
 * see 'trendRoutes.js', called by 'router.param' method
----------------------------------------------------------------------------------------------*/
methods.params = (req, res, next, id) => {
  Trend.forge({ _id: id })
    .fetch()
    .then((trend) => {
      //Trend not found; raise error
      if (!trend) {
        next(new Error("Trend not found"))
      } else {
        //Decorate the request object
        req.trendId = trend.attributes._id;
        next();
      }
    })
    //Catch any unantacipated errors
    .catch((err) => {
      next(err);
    })
}

//Get all trends (need to specifiy a time 'where' constrain?)
methods.get = (req, res, next) => {
  Trend.forge()
    .fetchAll()
    .then((trends) => {
      //No trends found
      if (!trends) {
        res.status(404);
        next(new Error("No data"))
      } else {
        //Send the trends JSON object
        res.status(200).json(trends);
      }
    })
    //Catch unexpected errors
    .catch((err) => {
      next(err);
    })
}

//Get a single trend (programmatic API calls only)
methods.getOne = (req, res, next) => {
  Trend.forge({ _id: req.trendId })
    .fetch()
    .then((trend) => {
      if (!trend) {
        //No such articles found
        res.status(404);
        next(new Error("Trend not found"));
      } else {
        //Send the trend JSON object
        res.status(200).json(trend);
      }
    })
    //Catch unexpected errors
    .catch((err) => {
      next(err);
    })

}

module.exports = methods;