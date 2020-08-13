'use strict';

describe('service: confirmModal', function() {

  beforeEach(module('risevision.common.components.confirm-modal.services'));

  var confirmModal, $modal, $templateCache;

  beforeEach(function() {
    inject(function($injector) {
      confirmModal = $injector.get('confirmModal');
     
      $modal = $injector.get('$modal');
      $templateCache = $injector.get('$templateCache');

      sinon.stub($modal, 'open').returns({result: Q.resolve()});
      sinon.spy($templateCache, 'get');
    });
  });

  it('should initialize', function () {
    expect(confirmModal).to.be.ok;
    expect(confirmModal).to.be.a('function');
  });

  it('should return a promise', function() {
    expect(confirmModal('title', 'message').then).to.be.ok;
    expect(confirmModal('title', 'message').then).to.be.a('function');
  });

  it('should show confirmation modal with default values', function() {
    confirmModal('title', 'message');

    $modal.open.should.have.been.calledWithMatch({
      controller: 'confirmModalController',
      windowClass: 'modal-custom'
    });

    var params = $modal.open.getCall(0).args[0];
    expect(params.resolve.confirmationTitle()).to.equal('title');
    expect(params.resolve.confirmationMessage()).to.equal('message');

    $templateCache.get.should.to.have.been.calledWith('partials/components/confirm-modal/confirm-modal.html');
  });

  it('should configure confirmation modal', function() {      
    confirmModal('title', 'message', 'confirm', 'cancel', 'windowClass', 'templateUrl', 'sm');

    $modal.open.should.have.been.calledWithMatch({
      controller: 'confirmModalController',
      windowClass: 'windowClass',
      templateUrl: 'templateUrl',
      size: 'sm'
    });

    var params = $modal.open.getCall(0).args[0];
    expect(params.resolve.confirmationTitle()).to.equal('title');
    expect(params.resolve.confirmationMessage()).to.equal('message');
    expect(params.resolve.confirmationButton()).to.equal('confirm');
    expect(params.resolve.cancelButton()).to.equal('cancel');

    $templateCache.get.should.not.have.been.called;
  });

  it('should resolve if user confirms', function(done) {
    confirmModal().then(function(){
      done();
    }).catch(function(){
      done('error');
    });
  });

});
