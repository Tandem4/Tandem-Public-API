//Intro point for server

//Setup config
var config = require('./server/config/config');
var app = require('./server/server');

app.listen(config.port);
console.log('Listening on http://localhost:' + config.port + '...');