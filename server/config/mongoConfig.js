var mongodb = require('mongodb');
var mongo = require('mongodb-bluebird');
var mongoUrl = {
  prod: 'mongodb://admin:CZthJMbBZMzQ05tc@SG-tandemmongo-7799.servers.mongodirector.com:27017'
}

module.exports = saveToMongo = (data) => {
  mongo.connect(mongoUrl.prod).then(function(db) {
    db.collection('news').insert(data)
    .catch(function(err) {
      console.error("ERROR saving data to MongoDB");
    });
  });
};