'use strict';
describe('service: TwitterOAuthService:', function() {

  beforeEach(module('risevision.widgets.twitter'));

  beforeEach(module(function ($provide) {

    $provide.service('OAuthService',function(){
      return {
        getConnectionStatus: sinon.stub(),
        authenticate: sinon.stub(),
        revoke: sinon.stub(),
        initialize: sinon.stub()
      }
    });
  }));

  var twitterOAuthService, oauthService;

  beforeEach(function(){
    inject(function($injector){
      oauthService = $injector.get('OAuthService');
      twitterOAuthService = $injector.get('TwitterOAuthService');
    });
  });

  it('should exist',function(){
    expect(twitterOAuthService).to.be.ok;
    expect(twitterOAuthService.getConnectionStatus).to.be.a('function');
    expect(twitterOAuthService.authenticate).to.be.a('function');
    expect(twitterOAuthService.revoke).to.be.a('function');
  });

  it('should call initialize with twitter',function(){
    oauthService.initialize.should.have.been.calledWith('twitter');
  });

  it('should call getConnectionStatus',function(){
    twitterOAuthService.getConnectionStatus();
    oauthService.getConnectionStatus.should.have.been.called;
  });

  it('should call getConnectionStatus',function(){
    twitterOAuthService.authenticate();
    oauthService.authenticate.should.have.been.called;
  });

  it('should call getConnectionStatus',function(){
    twitterOAuthService.revoke();
    oauthService.revoke.should.have.been.called;
  });

});
