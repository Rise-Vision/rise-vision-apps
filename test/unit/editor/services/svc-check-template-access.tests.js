'use strict';

describe('service: checkTemplateAccess:', function() {
  var TEMPLATE_LIBRARY_PRODUCT_CODE = "templates-library";

  beforeEach(module('risevision.editor.services'));

  beforeEach(module(function ($provide) {
    $provide.value("TEMPLATE_LIBRARY_PRODUCT_CODE", TEMPLATE_LIBRARY_PRODUCT_CODE);
    $provide.service('$q', function() {return Q;});

    $provide.service('subscriptionStatusFactory', function() {
      return {
        check: sinon.stub().returns(Q.resolve())
      };
    });
    
    $provide.factory('$modal', function() {
      var modalInstance = { result: Q.resolve(), dismiss: sinon.stub() };
      return {
        modalInstance: modalInstance,
        open: sinon.stub().returns(modalInstance)
      };
    });
    
    $provide.service('plansFactory',function() {
      return {
        showPlansModal: sinon.stub()
      };
    });

  }));
  
  var checkTemplateAccess, $modal, subscriptionStatusFactory, plansFactory;

  beforeEach(function(){
    inject(function($injector){
      checkTemplateAccess = $injector.get('checkTemplateAccess');
      $modal = $injector.get('$modal');
      subscriptionStatusFactory = $injector.get('subscriptionStatusFactory');
      plansFactory = $injector.get('plansFactory');
    });
  });

  it('should exist',function(){
    expect(checkTemplateAccess).to.be.a('function');
  });

  it('should give access to premium templates if subscribed to Templates Library', function(done) {
    checkTemplateAccess()
    .then(function() {
      subscriptionStatusFactory.check.should.have.been.calledWith(TEMPLATE_LIBRARY_PRODUCT_CODE);
      $modal.open.should.not.have.been.called;

      done();
    });
  });

  it('should show license modal for Templates if not subscribed to Templates Library', function(done) {
    subscriptionStatusFactory.check.returns(Q.reject());

    checkTemplateAccess(true)
    .then(function() {
      $modal.open.should.have.been.calledWithMatch({
        templateUrl: 'partials/template-editor/more-info-modal.html',
        controller: "confirmModalController",
        windowClass: 'madero-style centered-modal display-license-required-message'
      });

      done();
    });
  });

  it('should show license modal for Presentations if not subscribed to Templates Library', function(done) {
    subscriptionStatusFactory.check.returns(Q.reject());

    checkTemplateAccess()
    .then(function() {
      $modal.open.should.have.been.calledWithMatch({
        templateUrl: 'partials/components/confirm-modal/confirm-modal.html',
        controller: 'confirmModalController',
        windowClass: 'display-license-required-message'
      });

      done();
    });
  });

  it('should dismiss and open plansModal on page confirm', function(done){
    subscriptionStatusFactory.check.returns(Q.reject());

    checkTemplateAccess();

    setTimeout(function() {
      $modal.modalInstance.dismiss.should.have.been.called;
      plansFactory.showPlansModal.should.have.been.called;

      done();
    }, 10);
  });

});
