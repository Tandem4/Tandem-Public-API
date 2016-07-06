var Trend = require('tandem-db').Trend;
var Article = require('tandem-db').Article;
var methods = {};

//NO AUTH - Get all trends sorted by rank in descending order
methods.get = (req, res, next) => {
  Trend.forge()
    .orderBy('rank', 'DESC')
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

module.exports = methods;