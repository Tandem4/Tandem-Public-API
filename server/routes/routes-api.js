var db = require('tandem-db');
// var express = require('express');
// var router = express.router();

module.exports = function(app) {
  //API - Basic user endpoints accessible by anyone (THROTTLED)
  // app.get('/api/v1/trends', db.trends.getAll);
  // app.get('/api/v1/trends/:trend_id', db.trends.getOne);
  // app.get('/api/v1/trends/:trend_id/article_id', db.articles.get);

  // //API - Routes that can be accessed by authenticated AND authorised users ONLY
  // app.post('/api/v1/articles/:article_id', db.articles.add);
  // app.get('/api/v1/admin/:user_id', db.user.showApiDetails);
  // app.post('/api/v1/admin/:user_id', db.articles.resetApiSecret);

  // //AUTH - SignUp & login endpoints
  // app.post('/signup', db.users.addNewUser);
  // app.get('/send', db.users.addNewUser);
  // app.get('/verify', db.users.getTeamUser);
  // app.get('/login', db.users.getUsersTeam);

  app.get('/admin', (req, res) => {
    res.render('admin');
  });
  // router.get('/oauth/tokens/', db.users.getUsersTeam);  
}






// var db = require('tandem-db');
// var express = require('express');
// var router = express.router();

// //API - Basic user endpoints accessible by anyone (THROTTLED)
// router.get('/api/v1/trends/', db.trends.getAll);
// router.get('/api/v1/trends/:trend_id/', db.trends.getOne);
// router.get('/api/v1/trends/:trend_id/article_id/', db.articles.get);

// //API - Routes that can be accessed by authenticated AND authorised users ONLY
// router.post('/api/v1/articles/:article_id/', db.articles.add);
// router.get('/api/v1/admin/:user_id/', db.user.showApiDetails);
// router.post('/api/v1/admin/:user_id/', db.articles.resetApiSecret);

// //AUTH - SignUp & login endpoints
// router.post('/signup/', db.users.addNewUser);
// router.get('/send/', db.users.addNewUser);
// router.get('/verify/', db.users.getTeamUser);
// router.get('/login/', db.users.getUsersTeam);
// // router.get('/oauth/tokens/', db.users.getUsersTeam);

// module.exports = router;