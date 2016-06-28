var Article = require('tandem-db').Article;

var methods = {};

methods.params((req, res, next, id) => {
  Article.forge({ id: id })
    .fetch()
    .then((article) => {
      if (!article) {
        next(new Error('Article not found'));
      } else {
        req.article = article.id;
        next();
      }
    })
    .catch((err) => {
      next(err);
    })
};

//GET method returning all articles
methods.get((req, res, next) => {
  Article.forge()
    .fetchAll()
    .then((articles) => {
      if (!article) {
        //Raise error - no data returned
        next(new Error('No articles found'));
      } else {
        //Send the JSON articles object
        res.json(articles);
      }
    })
    //Catch unanticipated errors
    .catch((err) {
      next(err);
    })
});

//POST method for manually adding an article to the database
methods.post((req, res, next) => {
  Article.forge( req.article )
    .save()
    .then((article) => {
      //Error creating article
      if (!article) {
        next(new Error("Article not added"));
      } else {
        //Return JSON object for article created
        res.json(article)
      }
    })
    //Catch unexpected errors
    .catch((err) => {
      next(err);
    })
})

module.exports = methods;