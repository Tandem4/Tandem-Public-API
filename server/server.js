var bodyParser = require('body-parser');
var morgan = require('morgan');
var express = require('express');
var db = require('tandem-db');
var host = process.env.TANDEM_SERVER_HOST || '127.0.0.1';
var port = process.env.TANDEM_SERVER_PORT || '8080';

var app = express();

//Set up application middleware
app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json


// //All API endpoints subject to throttling
// app.all('/api/v1/*', [require('./middleware/throttle')]);

app.get('/', (req, res) => {
  console.log(db);
  res.send("This is the crawler server");
})

app.listen(port, host, err => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening on http(s)://' + host + ':' + port + '/...');
});

db.printGreeting();