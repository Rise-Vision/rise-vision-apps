'use strict';

describe('service: checkTemplateAccess:', function() {

  beforeEach(module('risevision.editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('currentPlanFactory', function() {
      return {
        isPlanActive: sinon.stub().returns(true)
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
        showPurchaseOptions: sinon.stub()
      };
    });

  }));
  
  var checkTemplateAccess, $modal, currentPlanFactory, plansFactory;

  beforeEach(function(){
    inject(function($injector){
      checkTemplateAccess = $injector.get('checkTemplateAccess');
      $modal = $injector.get('$modal');
      currentPlanFactory = $injector.get('currentPlanFactory');
      plansFactory = $injector.get('plansFactory');
    });
  });

  it('should exist',function(){
    expect(checkTemplateAccess).to.be.a('function');
  });

  it('should give access to premium templates if subscribed to Templates Library', function() {
    checkTemplateAccess();

    currentPlanFactory.isPlanActive.should.have.been.calledWith();
    $modal.open.should.not.have.been.called;
  });

  it('should show license modal for Templates if not subscribed to Templates Library', function() {
    currentPlanFactory.isPlanActive.returns(false);

    checkTemplateAccess(true);

    $modal.open.should.have.been.calledWithMatch({
      templateUrl: 'partials/components/confirm-modal/madero-confirm-modal.html',
      controller: "confirmModalController",
      windowClass: 'madero-style centered-modal display-license-required-message'
    });
  });

  it('should show license modal for Presentations if not subscribed to Templates Library', function() {
    currentPlanFactory.isPlanActive.returns(false);

    checkTemplateAccess();

    $modal.open.should.have.been.calledWithMatch({
      templateUrl: 'partials/components/confirm-modal/confirm-modal.html',
      controller: 'confirmModalController',
      windowClass: 'display-license-required-message'
    });
  });

  it('should dismiss and open plansModal on page confirm', function(done){
    currentPlanFactory.isPlanActive.returns(false);

    checkTemplateAccess();

    setTimeout(function() {
      $modal.modalInstance.dismiss.should.have.been.called;
      plansFactory.showPurchaseOptions.should.have.been.called;

      done();
    }, 10);
  });

});
