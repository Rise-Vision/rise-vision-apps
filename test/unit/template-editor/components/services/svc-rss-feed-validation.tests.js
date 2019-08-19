'use strict';

describe('service: rssFeedValidation:', function() {
  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function () {
      return Q;
    });
  }));

  var rssFeedValidation, $httpBackend;

  beforeEach(function () {
    inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      rssFeedValidation = $injector.get('rssFeedValidation');
    });
  });

  it('should initialize', function () {
    expect(rssFeedValidation).to.be.truely;
    expect(rssFeedValidation.isParsable).to.be.a('function');
    expect(rssFeedValidation.isValid).to.be.a('function');
  });

  describe('isParsable', function() {

    it("should return '' if url is empty", function( done ) {
      var url = "";

      rssFeedValidation.isParsable(url)
        .then(function (result) {
          expect(result).to.be.equal('');

          done();
        })
        .catch(function(err) {
          fail('Unexpected ' + err);
        });
    });

    it("should return 'VALID' if response does not contain error", function( done ) {
      var url = "http://rss.cnn.com/rss/cnn_topstories.rss";

      $httpBackend.when('GET', 'https://feed-parser.risevision.com/' + url).respond(200, [{"test":"rss"}]);

      setTimeout(function() {
        $httpBackend.flush();
      });

      rssFeedValidation.isParsable(url)
        .then(function (result) {
          expect(result).to.be.equal('VALID');

          done();
        })
        .catch(function(err) {
          fail('Unexpected ' + err);
        });
    });

    it("should return 'UNAUTHORIZED' if feed requires authentication", function( done ) {
      var url = "http://feeds.reuters.com/reuters/topNews";

      $httpBackend.when('GET', 'https://feed-parser.risevision.com/' + url).respond(200, { Error: '401 Unauthorized' });

      setTimeout(function() {
        $httpBackend.flush();
      });

      rssFeedValidation.isParsable(url)
        .then(function (result) {
          expect(result).to.be.equal('UNAUTHORIZED');

          done();
        })
        .catch(function(err) {
          fail('Unexpected ' + err);
        });
    });

    it("should return 'NON_FEED' if url provided is not a RSS feed", function( done ) {
      var url = "http://tsn.ca";

      $httpBackend.when('GET', 'https://feed-parser.risevision.com/' + url).respond(200, { Error: 'Not a feed' });

      setTimeout(function() {
        $httpBackend.flush();
      });

      rssFeedValidation.isParsable(url)
        .then(function (result) {
          expect(result).to.be.equal('NON_FEED');

          done();
        })
        .catch(function(err) {
          fail('Unexpected ' + err);
        });
    });

    it("should return 'NOT_FOUND' if url provided does not have a recognizable domain", function( done ) {
      var url = "http://ffasfsaa.com";

      $httpBackend.when('GET', 'https://feed-parser.risevision.com/' + url).respond(200, { Error: 'getaddrinfo ENOTFOUND safasfsafsa.com safasfsafsa.com:80' });

      setTimeout(function() {
        $httpBackend.flush();
      });

      rssFeedValidation.isParsable(url)
        .then(function (result) {
          expect(result).to.be.equal('NOT_FOUND');

          done();
        })
        .catch(function(err) {
          fail('Unexpected ' + err);
        });
    });

    it("should return 'VALID' if response has error not pertaining to the feed", function( done ) {
      var url = "http://rss.cnn.com/rss/cnn_topstories.rss";

      $httpBackend.when('GET', 'https://feed-parser.risevision.com/' + url).respond(200, { Error: 'ETIMEDOUT' });

      setTimeout(function() {
        $httpBackend.flush();
      });

      rssFeedValidation.isParsable(url)
        .then(function (result) {
          expect(result).to.be.equal('VALID');

          done();
        })
        .catch(function(err) {
          fail('Unexpected ' + err);
        });
    });

  } );

});
