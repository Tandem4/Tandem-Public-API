var express = require('express');
var router = express.router();




//Routes that can be accessed by anyone





//Routes that can be accessed by authenticated users only





//Routes that can be accessed by authenticated AND authorised users only


//API - Basic user endpoints (THROTTLED)
router.get('/api/v1/trends/', trends.getAll);
router.get('/api/v1/trends/:trend_id/', trends.getOne);
router.get('/api/v1/trends/:trend_id/article_id/', articles.get);

//Routes that can be accessed by authenticated AND authorised users only
router.post('/api/v1/articles/:article_id/', articles.add);


//AUTH - SignUp & login endpoints
router.get('/signup/', UserController.addNewUser);
router.get('/send/', UserController.addNewUser);
router.get('/verify/', UserController.getTeamUser);
router.get('/login/', UserController.getUsersTeam);
router.get('/oauth/tokens/', UserController.getUsersTeam);


  module.exports = router;