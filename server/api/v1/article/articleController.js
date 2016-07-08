var Article = require('tandem-db').Article;
var db = require('tandem-db').db;
var RawArticle = require('../../../config/mongoConfig');
var uuid = require('node-uuid');
var signToken = require('../../../auth/auth').signToken;

/***********************************************************
* PURPOSE: Controller methods for 'articles' API endpoints
***********************************************************/

var methods = {};

/*---------------------------------------------------------------------------------------------
 * Not neccessary in this implentation, but retained in the repo as is a useful pattern:
 * -> Local route param callback to set route specific params on request object for easy access
 * -> see 'articleRoutes.js', called by 'router.param' method
-----------------------------------------------------------------------------------------------
  // methods.params = (req, res, next, id) => {
  //   Article.forge({ id: id })
  //     .fetch()
  //     .then((article) => {
  //       if (!article) {
  //         next(new Error('Article not found'));
  //       } else {
  //         req.article = article.attributes.id;
  //         console.log(req.article);
  //         next();
  //       }
  //     })
  //     .catch((err) => {
  //       next(err);
  //     })
  // };
----------------------------------------------------------------------------------------------*/

//NO AUTH - method returning all articles for the selected trend, showing publication name & sorted by date in descending order
methods.getArticles = (req, res, next) => {
  var trendId = req.query.id;
  //Use knex QueryBuilder to return required fields constrained by the trend id & join table relationships between trends & article
  Article.query()
    .innerJoin('processed_articles_trends', 'processed_articles.id', 'processed_articles_trends.processed_article_id')
    .innerJoin('publications', 'processed_articles.pub_id', 'publications.id')
    .where('processed_articles_trends.trend_id', '=', trendId)
    .select(db.knex.raw('processed_articles.*'))
    .select('publications.pub_name')
    .orderBy('article_date', 'DESC')
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
};

//NO AUTH - method returning one article
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

// //NO AUTH - method returning one article
// methods.generateToken = (req, res, next) => {
//   //Sign token
//   var token = signToken(req.user.id);
//   //Set authorization header
//   res.set({
//     'Authorization': 'Bearer: ' + token
//   });
//   res.json('User Authenticated')
// };

//AUTH - renders the template for manually posting articles to be included in Tandem
methods.uploadTemplate = (req, res, next) => {
  //Generate the signed token
  var token = signToken(req.user.id);
  //Set cookie; use 'HttpOnly' flag - only server may attempt to access cookie, not client (mitigate XSS attacks); A
  res.set({
    'Set-Cookie': 'access_token=' + token + '; Path=/; HttpOnly',
    'Access-Control-Allow-Credentials': true
  });
  res.render('article');
};

//BEARER AUTH - method for manually adding an article to the database
methods.post = (req, res, next) => {
  //Get the upload object from req.body & add a unique upload key
  var rawArticle = Object.assign({}, req.body, { uploadId: uuid.v1().split('-').join('') });
  //Insert the article into MongoDb
  RawArticle(rawArticle);
  //Generate the signed token
  var token = signToken(req.user.id);
  //Set cookie; use 'HttpOnly' flag - only server may attempt to access cookie, not client (mitigate XSS attacks); A
  res.set({
    'Set-Cookie': 'access_token=' + token + '; Path=/; HttpOnly',
    'Access-Control-Allow-Credentials': true
  });
  res.json(rawArticle)
  next();
};

module.exports = methods;