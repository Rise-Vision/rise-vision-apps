'use strict';

describe('TwitterSettingsController', function () {

  var defaultSettings,
    scope,
    rootScope,
    twitterOAuthService;

  beforeEach(module('risevision.widgets.twitter'));
  beforeEach(module(mockTranslate()));

  beforeEach(module(function ($provide) {
    $provide.service('TwitterOAuthService',function(){
      return {
        getConnectionStatus : sinon.stub(),
        authenticate: sinon.stub(),
        revoke: sinon.stub(),
      }
    });
  }));

  describe('Connection', function () {
    beforeEach(inject(function ($injector, $rootScope, $controller) {
      defaultSettings = $injector.get('defaultSettings');
      scope = $rootScope.$new();
      rootScope = $rootScope;
      twitterOAuthService = $injector.get('TwitterOAuthService');

      twitterOAuthService.getConnectionStatus.returns(Q.reject());

      $controller('TwitterSettingsController', {
        $scope: scope,
        TwitterOAuthService: twitterOAuthService
      });

      scope.settingsForm = {
        $setValidity: function () {
          return;
        }
      };

      scope.settings = {
        additionalParams: defaultSettings.twitterWidget.additionalParams
      };

      scope.$digest();
    }));

    it('should define defaultSettings', function () {
      expect(defaultSettings).to.be.ok;
      expect(defaultSettings).to.be.an('object');
    });

    describe('screenName: ', function() {
      it('should default to empty', function () {
        expect(scope.settings.additionalParams.screenName).to.be.empty;
      });
    });

    describe('authentication: ', function() {
      it('should be authenticated if status reject', function () {
        expect(scope.twitterConnected).to.be.false;
      });

      it('should connect if connection resolves', function (done) {
        twitterOAuthService.authenticate.returns(Q.resolve("key"));
        scope.connect();
        setTimeout(function() {
          expect(scope.twitterConnected).to.be.true;
          done();
        },0);
      });

      it('should not connect if connection rejects', function (done) {
        twitterOAuthService.authenticate.returns(Q.reject());
        scope.connect();
        setTimeout(function() {
          expect(scope.twitterConnected).to.be.false;
          done();
        },0);
      });

      it('should revoke if resolves', function (done) {
        twitterOAuthService.revoke.returns(Q.resolve("key"));
        scope.revoke();
        setTimeout(function() {
          expect(scope.twitterConnected).to.be.false;
          done();
        },0);
      });

      it('should not revoke if rejects', function (done) {
        twitterOAuthService.revoke.returns(Q.reject());
        scope.revoke();
        setTimeout(function() {
          expect(scope.twitterConnected).to.be.true;
          done();
        },0);
      });
    });
  });
});
