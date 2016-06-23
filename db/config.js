var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/scrapedData')

var db = mongoose.connection;

db.on('error', (err) => console.log('Connnection error: ', err));
db.once('open', () => console.log('MongoDb connected...'));

module.exports = db;