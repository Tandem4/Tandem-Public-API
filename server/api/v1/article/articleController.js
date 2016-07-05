var Article = require('tandem-db').Article;
var Trend = require('tandem-db').Trend;
var RawArticle = require('../../../config/mongoConfig');
var uuid = require('node-uuid');
var methods = {};

/*---------------------------------------------------------------------------------------------
 * Not neccessary in this implentation, but retained in the repo as is a useful pattern:
 * -> Local route param callback to set route specific params on request object for easy access
 * see 'articleRoutes.js', called by 'router.param' method
----------------------------------------------------------------------------------------------*/
methods.params = (req, res, next, id) => {
  Article.forge({ id: id })
    .fetch()
    .then((article) => {
      if (!article) {
        next(new Error('Article not found'));
      } else {
        req.article = article.attributes.id;
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
  console.log(req.query.id);
  var trendId = req.query.id;
  Trend.where({ 'id': trendId })
    .fetch({ withRelated: ['articles'] })
    .then((articles) => {
      if (!articles) {
        next(new Error('No articles found'));
      } else {
        res.json(articles);
      }
    })
    //Catch unanticipated errors
    .catch((err) => {
      next(err);
    });

  // //GET method returning all articles
  // methods.getArticles = (req, res, next) => {
  //   console.log(req.query.id);
  //   var trendId = req.query.id;
  //   var queryArticles = Article.query();
  //   queryArticles.select([‘pa.*’, ‘publications.pub_name’])
  //     .innerJoin(‘processed_articles_trends as pat’, ‘pa.id’, ‘pat.processed_article_id’)
  //     .innerJoin(‘publications as pub’, ‘pa.pub_id’, ‘pub.id’)
  //     .where(‘pat.trend_id’, ‘=‘, req.query.id)
  //     .then((articles) => {
  //       if (!articles) {
  //         next(new Error('No articles found'));
  //       } else {
  //         res.json(articles);
  //       }
  //     })
  //     //Catch unanticipated errors
  //     .catch((err) => {
  //       next(err);
  //     });

  // Article.forge({ trendid: trendId })
  //   .fetchAll()
  //   .then((articles) => {
  //     if (!articles) {
  //       //Raise error - no data returned
  //       next(new Error('No articles found'));
  //     } else {
  //       //Send the JSON articles object
  //       res.json(articles);
  //     }
  //   })
  //   //Catch unanticipated errors
  //   .catch((err) => {
  //     next(err);
  //   })
};

//GET method returning all articles
methods.getOne = (req, res, next) => {
  Article.forge({ id: req.article })
    .fetch()
    .then((article) => {
      if (!article) {
        //Raise error - no data returned
        next(new Error('No articles found'));
      } else {
        //Send the JSON articles object
        res.redirect('/articles');
      }
    })
    //Catch unanticipated errors
    .catch((err) => {
      next(err);
    })
};

//TODO: REFACTOR INTO SEPARATE ROUTE ENDPOINT WITH SEPARATE CONTROLLER - DOESNT BELONG HERE
//POST method for manually adding an article to the database
methods.post = (req, res, next) => {
  //Get the upload object from req.body & add a unique upload key
  var rawArticle = Object.assign({}, req.body, { uploadid: uuid.v1().split('-').join('') });
  //Insert the article into MongoDb
  RawArticle(rawArticle);
  res.json(rawArticle)
  next();
};

module.exports = methods;