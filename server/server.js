var bodyParser = require('body-parser');
var morgan = require('morgan');
var pug = require('pug').__express;
var express = require('express');
var app = express();
var db = require('tandem-db');
var host = process.env.TANDEM_SERVER_HOST || '127.0.0.1';
var port = process.env.TANDEM_SERVER_PORT || '8080';

app.engine('pug', pug);
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
// app.use(express.static('public'));

//Logging middleware
app.use(morgan('dev'));
//Parse application/json
app.use(bodyParser.json());
//Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// //All API endpoints subject to throttling
// app.all('/api/v1/*', [require('./middleware/throttle')]);

var routesAuth = require('./routes/routes-auth')(app);
var routesApi = require('./routes/routes-api')(app);

app.get('/', (req, res) => {
  res.redirect('/login');
})

app.listen(port, host, err => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening on http(s)://' + host + ':' + port + '/...');
});

db.printGreeting();