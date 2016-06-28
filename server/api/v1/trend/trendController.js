var Trend = require('tandem-db').Trend;
var methods = {};

//Router param callback to decorate the request object with specified trend
methods.params = (req, res, next, id) => {
  Trend.forge({ id: id })
    .fetch()
    .then((trend) => {
      //Trend not found; raise error
      if (!trend) {
        next(new Error("Trend not found"))
      } else {
        //Decorate the request object
        req.trendId = trend.id;
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

//
methods.getOne = (req, res, next) => {
  Trend.forge({ id: req.trend.id })
    .fetch()
    .then()

}

module.exports = methods;