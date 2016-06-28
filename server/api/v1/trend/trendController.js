var Trend = require('tandem-db').Trend;
var methods = {};

//Router param callback to decorate the request object with specified trend
method.params = (req, res, next, id) => {
  Trend.forge({ id: id })
    .fetch()
    .then((trend) {
      //Trend not found; raise error
      if (!trend) {
        next(new Error("Trend not found"))
      } else {
        //Decorate the request object
        req.trend = trend;
      }
    })
    //Catch any unantacipated errors
    .catch((err) => {
      next(err);
    })
}

//Get all trends (need to specifiy a time 'where' constrain?)
method.get = (req, res, next) => {
  Trend.forge()
    .fetch()
    .then((trends) => {
      //No trends found
      if (!trends) {
        next(new Error("No data"))
      } else {
        //Send the trends JSON object
        res.json(trends);
      }
    })
    //Catch unexpected errors
    .catch((err) => {
      next(err);
    })
}

//
method.getOne = (req, res, next) => {
  Trend.forge({ id: req.trend.id })
    .fetch()
    .then()

}

module.exports = methods;