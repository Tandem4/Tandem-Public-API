var Trend = require('tandem-db').Trend;
var Article = require('tandem-db').Article;
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

//Get a single trend TODO: update to filter for a specific trend id & re-consider route architecture/modularity
methods.getOne = (req, res, next) => {
  // Article.forge({ trend_id: req.trendId })
  Article.forge()
    .fetchAll()
    .then((articles) => {
      if (!articles) {
        //No such articles found
        res.status(404);
        next(new Error("Trend not found"));
      } else {
        //Send the trend JSON object
        res.status(200).json(articles);
      }
    })
    //Catch unexpected errors
    .catch((err) => {
      next(err);
    })

}

module.exports = methods;