'use strict';

describe('service: messageBox', function() {

  beforeEach(module('risevision.common.components.message-box.services'));

  var messageBox, $modal, $templateCache;

  beforeEach(function() {
    inject(function($injector) {
      messageBox = $injector.get('messageBox');
     
      $modal = $injector.get('$modal');
      $templateCache = $injector.get('$templateCache');

      sinon.stub($modal, 'open').returns({result: Q.resolve()});
      sinon.spy($templateCache, 'get');
    });
  });

  it('should initialize', function () {
    expect(messageBox).to.be.ok;
    expect(messageBox).to.be.a('function');
  });

  it('should return a promise', function() {
    expect(messageBox('title', 'message').then).to.be.ok;
    expect(messageBox('title', 'message').then).to.be.a('function');
  });

  it('should show confirmation modal with default values', function() {
    messageBox('title', 'message');

    $modal.open.should.have.been.calledWithMatch({
      controller: 'messageBoxController',
      size: 'md',
    });

    var params = $modal.open.getCall(0).args[0];
    expect(params.resolve.title()).to.equal('title');
    expect(params.resolve.message()).to.equal('message');

    $templateCache.get.should.to.have.been.calledWith('partials/components/message-box/message-box.html');
  });

  it('should configure confirmation modal', function() {      
    messageBox('title', 'message', 'close', 'windowClass', 'templateUrl', 'sm');

    $modal.open.should.have.been.calledWithMatch({
      controller: 'messageBoxController',
      windowClass: 'windowClass',
      templateUrl: 'templateUrl',
      size: 'sm'
    });

    var params = $modal.open.getCall(0).args[0];
    expect(params.resolve.title()).to.equal('title');
    expect(params.resolve.message()).to.equal('message');
    expect(params.resolve.button()).to.equal('close');

    $templateCache.get.should.not.have.been.called;
  });

  it('should resolve if user confirms', function(done) {
    messageBox().then(function(){
      done();
    }).catch(function(){
      done('error');
    });
  });

});
