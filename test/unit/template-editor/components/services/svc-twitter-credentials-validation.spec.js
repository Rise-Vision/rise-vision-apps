'use strict';

describe('service: twitterCredentialsValidation:', function() {
  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function () {
      return Q;
    });
  }));

  var twitterCredentialsValidation, $httpBackend;

  beforeEach(function () {
    inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      twitterCredentialsValidation = $injector.get('twitterCredentialsValidation');
    });
  });

  it('should initialize', function () {
    expect(twitterCredentialsValidation).to.be.truely;
    expect(twitterCredentialsValidation.verifyCredentials).to.be.a('function');
  });

  describe('verifyCredentials', function() {

    it("should return true if ok response and data indicates success", function( done ) {
      var companyId = 'abc123';

      $httpBackend.when('GET', 'https://services-stage.risevision.com/twitter/verify-credentials?companyId=' + companyId).respond(200, {"success":true});

      setTimeout(function() {
        $httpBackend.flush();
      });

      twitterCredentialsValidation.verifyCredentials(companyId)
        .then(function (result) {
          expect(result).to.be.equal(true);

          done();
        })
        .catch(function(err) {
          fail('Unexpected ' + err);
        });
    });

    it("should return false if ok response and data indicates no success", function( done ) {
      var companyId = 'abc123';

      $httpBackend.when('GET', 'https://services-stage.risevision.com/twitter/verify-credentials?companyId=' + companyId)
        .respond(200, {"success":false, "message": "No credentials for: " + companyId + ":twitter"});

      setTimeout(function() {
        $httpBackend.flush();
      });

      twitterCredentialsValidation.verifyCredentials(companyId)
        .then(function (result) {
          expect(result).to.be.equal(false);

          done();
        })
        .catch(function(err) {
          fail('Unexpected ' + err);
        });
    });

  } );

});
