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
        return messageBoxStub = sinon.stub().returns(Q.reject());
      });

    });

    inject(function ($injector) {
      $state = $injector.get('$state');
      canAccessApps = $injector.get('canAccessApps');
      currentPlanFactory = $injector.get('currentPlanFactory');
      $rootScope = $injector.get('$rootScope');
      $location = $injector.get('$location');

      sinon.spy($state, 'go');
    });
  });

  var $state, canAccessApps, currentPlanFactory, userState, $rootScope, messageBoxStub, $location;

  describe('state apps.purchase.plans:',function(){
    it('should register state',function(){
      var state = $state.get('apps.purchase.plans');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/plans');
      expect(state.controller).to.be.ok;
    });

    it('should navigate the purchase page',function(done){
      $state.get('apps.purchase.plans').controller[1]($state);
      setTimeout(function() {
        $state.go.should.have.been.calledWith('apps.purchase.home');

        done();
      }, 10);
    });

  });


  describe('state apps.purchase.home:', function(){
    it('should register state',function(){
      var state = $state.get('apps.purchase.home');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/purchase');
      expect(state.controller).to.equal('PurchaseCtrl')
    });

    it('should go to purchase licenses if company has a plan and manages it', function(done) {
      $state.go('apps.purchase.home');
      $rootScope.$digest();

      canAccessApps.should.have.been.called;

      setTimeout(function(){
        expect($state.go).to.have.been.calledWith('apps.purchase.licenses', {displayCount: 1});

        expect(messageBoxStub).to.not.have.been.called;
        done();
      },10);
    });

    it('should pass displayCount parameter value', function(done) {
      $state.go('apps.purchase.home', {displayCount: 'displayCount'});
      $rootScope.$digest();

      canAccessApps.should.have.been.called;

      setTimeout(function(){
        expect($state.go).to.have.been.calledWith('apps.purchase.licenses', {displayCount: 'displayCount'});

        expect(messageBoxStub).to.not.have.been.called;
        done();
      },10);
    });

    it('should go to Purchase page if company is not subscribed to a plan', function(done) {
      currentPlanFactory.isSubscribed.returns(false);

      $state.go('apps.purchase.home');
      $rootScope.$digest();

      setTimeout(function(){
        $state.go.should.have.been.calledOnce;

        done();
      },10);
    });

    it('should resolve redirectTo as previous path', function() {
      sinon.stub($location, 'path').returns('/displays/list');

      var redirectTo = $state.get('apps.purchase.home').resolve.redirectTo[1]($location);
      expect(redirectTo).to.equal('/displays/list');
    });

    it('should resolve redirectTo as Apps home if previous path is purchase', function() {
      sinon.stub($location, 'path').returns('/purchase');

      var redirectTo = $state.get('apps.purchase.home').resolve.redirectTo[1]($location);
      expect(redirectTo).to.equal('/');
    });

  });

  describe('state apps.purchase.licenses:',function(){
    it('should register state',function(){
      var state = $state.get('apps.purchase.licenses');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/licenses');
      expect(state.controller).to.equal('PurchaseLicensesCtrl')
    });

    it('should go to Purchase page if company is not subscribed to a plan', function(done) {
      currentPlanFactory.isSubscribed.returns(false);

      $state.go('apps.purchase.licenses');
      $rootScope.$digest();

      setTimeout(function(){
        $state.go.should.have.been.calledWith('apps.purchase.home');

        done();
      },10);
    });

    it('should show a message if company has a plan but it is managed by a parent company', function(done) {
      currentPlanFactory.currentPlan.isPurchasedByParent = true;

      $state.go('apps.purchase.licenses');
      $rootScope.$digest();

      canAccessApps.should.have.been.called;

      setTimeout(function(){
        expect(messageBoxStub).to.have.been.calledWith(
          'You can\'t edit your current plan.',
          'Your plan is managed by your parent company. Please contact your account administrator for additional licenses.',
          'Ok', 'madero-style centered-modal', 'partials/template-editor/message-box.html', 'sm'
        );

        // $state.current.name exists; should not redirect to home
        expect($state.go).to.not.have.been.calledWith('apps.home');
        expect($state.go).to.not.have.been.calledWith('apps.billing.home', {edit: 'subscriptionId'});
        done();
      },10);
    });

    it('should show plan admin email if available', function(done) {
      currentPlanFactory.currentPlan.isPurchasedByParent = true
      currentPlanFactory.currentPlan.parentPlanContactEmail = 'test@email.com';

      $state.go('apps.purchase.licenses');
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

    it('should resolve redirectTo as previous path', function() {
      sinon.stub($location, 'path').returns('/displays/list');

      var redirectTo = $state.get('apps.purchase.licenses').resolve.redirectTo[1]($location);
      expect(redirectTo).to.equal('/displays/list');
    });

    it('should resolve redirectTo as Apps home if previous path is purchase', function() {
      sinon.stub($location, 'path').returns('/licenses');

      var redirectTo = $state.get('apps.purchase.licenses').resolve.redirectTo[1]($location);
      expect(redirectTo).to.equal('/');
    });

  });


});
