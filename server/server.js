var express = require('express');
var app = express();
var pug = require('pug').__express;
var auth = require('./auth/auth');
var api = require('./api/v1/api');

//Configure server side rendering templates & view engine
app.engine('pug', pug);
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
// app.use(express.static('public'));

//Set up app middleware
require('./middleware/appMiddleware')(app);

// //All API endpoints subject to throttling
// app.all('/api/v1/*', [require('./middleware/throttle')]);

//Set up the auth & api routes
// app.use('/api/v1', auth);
app.use('/api/v1', api);

// //Set up wildcard default redirect for unhandled routes
// app.get('*', (req, res) => {
//   console.log("THE WILDCARD REDIRECT HIT");
//   res.redirect('/api/v1/login');
// })

//Global error handling
app.use((err, req, res, next) => {
  //Unhandled authorization error
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token') //href to login?
    return;
  }
  //Unhandled server error
  console.error(err.stack);
  res.status(500).send('Internal server error'); //check message
})


module.exports = app;