

module.exports = function(app) {
  //AUTH - SignUp & login endpoints
  app.get('/signup/', UserController.addNewUser);
  app.get('/send/', UserController.addNewUser);
  app.get('/verify/', UserController.getTeamUser);
  app.get('/login/', UserController.getUsersTeam);
  app.get('/oauth/tokens/', UserController.getUsersTeam);
}