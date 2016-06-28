var express = require('express');
var app = express();
var pug = require('pug').__express;
var config = require('./config/config');
var api = require('./api/v1/api');
var auth = require('./auth/auth');

//Configure static views
app.engine('pug', pug);
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
// app.use(express.static('public'));

//Set up app middleware
require('./middleware/appMiddleware')(app);

// //All API endpoints subject to throttling
// app.all('/api/v1/*', [require('./middleware/throttle')]);

//Set up the auth routes
// app.use('/api/v1/auth', auth); //TBC

//Set up the api
app.use('/api/v1', api);

//Global error handling
app.use((err, req, res, next) => {
  //Unhandled auth error
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token') //href to login?
    return;
  }

  console.error(err.stack);
  res.status(500).send('Internal server error'); //check message
})

app.get('/', (req, res) => {
  res.redirect('/login');
})

module.exports = app;