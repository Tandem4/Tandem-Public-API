var chai = require('chai');
var assert = chai.assert;
var expect = require('chai').expect;
var supertest = require('supertest');
var server = require('../index.js');
var request = supertest.agent(server);
var trendController = require('../server/api/v1/trends/trendController');
var articleController = require('../server/api/v1/articles/articleController');

describe('get all trends', function() {
  it('should be a function', function() {
    expect(trendController.get).to.be.a('function');
  });
});

describe('get all articles', function() {
  it('should be a function', function() {
    expect(articleController.getArticles).to.be.a('function');
  });
});

// supertest
// describe('server', function() {

//   describe('GET /', function () {
//     it('should return Hello world from Tandem!', function (done) {
//       request
//         .get('/')
//         .expect(200, 'Hello world from Tandem!', done);
//     });
//   });

  // describe('GET /api/v1/dashboard', function () {
  //   it('should return the mocked trend data', function (done) {
  //     request
  //       .get('/api/v1/dashboard')
  //       .expect(200, 'mocked data', done);
  //   });
  // });

  // describe('GET /api/v1/trends/:trend_id', function () {
  //   it('should return the mocked article data', function (done) {
  //     request
  //       .get('/api/v1/trends/:trend_id')
  //       .expect(200, 'mocked data', done);
  //   });
  // });

// });

// describe('should break Travis', function() {
//   it('should return false', function() {
//     assert.equal(true, false);
//   });
// });
