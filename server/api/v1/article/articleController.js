var Article = require('tandem-db').Article;
var RawArticle = require('../../../config/mongoConfig');
var uuid = require('node-uuid');
var methods = {};

/*---------------------------------------------------------------------------------------------
 * Not neccessary in this implentation, but retained in the repo as is a useful pattern:
 * -> Local route param callback to set route specific params on request object for easy access
 * see 'articleRoutes.js', called by 'router.param' method
----------------------------------------------------------------------------------------------*/
methods.params = (req, res, next, id) => {
  Article.forge({ _id: id })
    .fetch()
    .then((article) => {
      if (!article) {
        next(new Error('Article not found'));
      } else {
        req.article = article.attributes._id;
        console.log(req.article);
        next();
      }
    })
    .catch((err) => {
      next(err);
    })
};

//GET method returning all articles
methods.get = (req, res, next) => {
  var trendId = req.query.id;

  Article.forge({ trend_id: trendId })
    .fetchAll()
    .then((articles) => {
      if (!articles) {
        //Raise error - no data returned
        next(new Error('No articles found'));
      } else {
        //Send the JSON articles object
        res.json(articles);
      }
    })
    //Catch unanticipated errors
    .catch((err) => {
      next(err);
    })
};

//GET method returning all articles
methods.getOne = (req, res, next) => {
  Article.forge({ _id: req.article })
    .fetch()
    .then((article) => {
      if (!article) {
        //Raise error - no data returned
        next(new Error('No articles found'));
      } else {
        //Send the JSON articles object
        res.json(article);
      }
    })
    //Catch unanticipated errors
    .catch((err) => {
      next(err);
    })
};

//POST method for manually adding an article to the database
methods.post = (req, res, next) => {
  var rawArticle = Object.assign({}, req.body, { upload_id: uuid.v1().split('-').join('') });
  RawArticle(rawArticle);
  res.json(rawArticle)
  next();
};

module.exports = methods;