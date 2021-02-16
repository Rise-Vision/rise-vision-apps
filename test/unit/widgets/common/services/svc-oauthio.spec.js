'use strict';
describe('service: OAuthio:', function() {
  var OAUTH_PUBLIC_KEY = 'EJMI-lB9hB55OYEsYmjXDNfRGoY';
  var oauthio, oauth, popupFunction;

  beforeEach(module('risevision.widgets.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('$log',function(){
      return {
        debug : function(){}
      }
    });
    $provide.value('OAUTH_PUBLIC_KEY', OAUTH_PUBLIC_KEY);

    $provide.service('$window', function() {
      var oauth = {
        initialize: sinon.stub(),
        popup: popupFunction
      };

      var window = { OAuth: oauth};

      return window;
    });
  }));

  describe('Check functions are called', function() {
    beforeEach(function(){
      popupFunction = sinon.stub();
      inject(function($injector){
        oauth = $injector.get('$window').OAuth;
        oauthio = $injector.get('OAuthio');
      });
    });

    it('should exist',function(){
      expect(oauthio).to.be.ok;
      expect(oauthio.popup).to.be.a('function');
    });

    it('initialize', function() {
      oauth.initialize.should.have.been.calledWith(OAUTH_PUBLIC_KEY);
    });

    it('popup', function() {
      oauthio.popup('twitter', 'xxxxxx');
      oauth.popup.should.have.been.calledWith('twitter', {state: 'xxxxxx'});
    });
  });
  describe('Check popup resolves', function() {
    var callInject = function() {
      inject(function($injector){
        oauth = $injector.get('$window').OAuth;
        oauthio = $injector.get('OAuthio');
      });
    }
    it('popup resolve with code', function(done) {
      popupFunction = function (provider, options, cb) {
        cb(null, {code: 'code'});
      }
      callInject();
      oauthio.popup('twitter', 'xxxxxx')
        .then(function(result){
          expect(result.code).to.equal('code');
          done();
        });
    });

    it('popup reject with error', function(done) {
      popupFunction = function (provider, options, cb) {
        cb(new Error('error'));
      }
      callInject();
      oauthio.popup('twitter', 'xxxxxx')
        .then(null, function(error){
          expect(error.message).to.equal('error');
          done();
        });
    });

    it('popup reject with error', function(done) {
      popupFunction = function (provider, options, cb) {
        cb(new Error('error'));
      }
      callInject();
      oauthio.popup('twitter', 'xxxxxx')
        .then(null, function(error){
          expect(error.message).to.equal('error');
          done();
        });
    });

    it('popup reject with error when $window.OAuth is not available', function(done) {
      module(function ($provide) {
        $provide.service('$window', function() {
          var window = { OAuth: null};

          return window;
        });
      });
      callInject();
      oauthio.popup('twitter', 'xxxxxx')
        .then(null, function(error){
          expect(error.message).to.equal('$window.OAuth is undefined');
          done();
        });
    });
  });
});
