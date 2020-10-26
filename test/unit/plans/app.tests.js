'use strict';

describe('app:', function() {
  beforeEach(function () {
    angular.module('risevision.apps.partials',[]);

    module('risevision.apps');

    module(function ($provide) {
      $provide.service('canAccessApps',function(){
        return sinon.stub().returns(Q.resolve("auth"));
      });

      $provide.service('currentPlanFactory',function(){
        return {
          isSubscribed: sinon.stub().returns(true),
          isParentPlan: sinon.stub().returns(false),
          currentPlan: {
            isPurchasedByParent: false,
            subscriptionId: 'subscriptionId'
          }
        };
      });

      $provide.service('messageBox', function() {
        return messageBoxStub = sinon.stub();
      });

    });

    inject(function ($injector) {
      $state = $injector.get('$state');
      canAccessApps = $injector.get('canAccessApps');
      currentPlanFactory = $injector.get('currentPlanFactory');
      $rootScope = $injector.get('$rootScope');

      sinon.spy($state, 'go');
    });
  });

  var $state, canAccessApps, currentPlanFactory, userState, $rootScope, messageBoxStub;

  describe('state apps.plans.home:',function(){
    it('should register state',function(){
      var state = $state.get('apps.plans.home');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/plans');
      expect(state.controller).to.equal('PlansCtrl');
    });

    it('should go to billing page/edit subscription if company has a plan and manages it', function(done) {
      $state.go('apps.plans.home');
      $rootScope.$digest();

      canAccessApps.should.have.been.called;

      setTimeout(function(){
        expect($state.go).to.have.been.calledWith('apps.billing.home', {edit: 'subscriptionId'});

        expect(messageBoxStub).to.not.have.been.called;
        done();
      },10);
    });

    it('should show a message if company has a plan but it is managed by a parent company', function(done) {
      currentPlanFactory.currentPlan.isPurchasedByParent = true

      $state.go('apps.plans.home');
      $rootScope.$digest();

      canAccessApps.should.have.been.called;

      setTimeout(function(){
        expect(messageBoxStub).to.have.been.calledWith(
          'You can\'t edit your current plan.',
          'Your plan is managed by your parent company. Please contact your account administrator for additional licenses.',
          'Ok', 'madero-style centered-modal', 'partials/template-editor/message-box.html', 'sm'
        );

        expect($state.go).to.have.been.calledWith('apps.home');
        expect($state.go).to.not.have.been.calledWith('apps.billing.home', {edit: 'subscriptionId'});
        done();
      },10);
    });

    it('should show plan admin email if available', function(done) {
      currentPlanFactory.currentPlan.isPurchasedByParent = true      
      currentPlanFactory.currentPlan.parentPlanContactEmail = 'test@email.com';

      $state.go('apps.plans.home');
      $rootScope.$digest();

      setTimeout(function(){
        expect(messageBoxStub).to.have.been.calledWith(
          'You can\'t edit your current plan.',
          'Your plan is managed by your parent company. Please contact your account administrator at test@email.com for additional licenses.',
          'Ok', 'madero-style centered-modal', 'partials/template-editor/message-box.html', 'sm'
        );

        done();
      },10);
    });

    it('should stay on the Plans page if company is not subscribed to a plan', function(done) {
      currentPlanFactory.isSubscribed.returns(false);

      $state.go('apps.plans.home');
      $rootScope.$digest();

      setTimeout(function(){
        expect(messageBoxStub).to.not.have.been.called;
        $state.go.should.have.been.calledOnce;

        done();
      },10);
    });

  });


});
