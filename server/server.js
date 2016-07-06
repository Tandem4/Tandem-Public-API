var express = require('express');
var app = express();
var pug = require('pug').__express;
var auth = require('./auth/authRoutes');
var api = require('./api/v1/api');

//Configure server side rendering templates & view engine
app.engine('pug', pug);
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

//Set up app middleware
require('./middleware/appMiddleware')(app);

//Set up the auth & api routes
app.use('/api/v1', api);
app.use('/auth', auth);

//Set up wildcard default redirect for unhandled routes
app.get('/', (req, res) => {
  res.redirect('/api/v1/trends');
})

//Global error handling
app.use((err, req, res, next) => {
  //Unhandled authorization error
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('<div>Invalid token - please login <a href="/auth/login">here</a></div>');
    return;
  }
  //Unhandled server error
  console.error(err.stack);
  res.status(500).send('Internal Server Error'); //check message
})

module.exports = app;