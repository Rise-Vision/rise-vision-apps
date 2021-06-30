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

  it('state apps.purchase.plans:',function(){
    var state = $state.get('apps.purchase.plans');
    expect(state).to.be.ok;
    expect(state.url).to.equal('/plans');
    expect(state.redirectTo).to.equal('apps.purchase.home');
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
        expect($state.go).to.have.been.calledWith('apps.purchase.licenses.add', {displayCount: 1});

        expect(messageBoxStub).to.not.have.been.called;
        done();
      },10);
    });

    it('should pass displayCount parameter value', function(done) {
      $state.go('apps.purchase.home', {displayCount: 'displayCount'});
      $rootScope.$digest();

      canAccessApps.should.have.been.called;

      setTimeout(function(){
        expect($state.go).to.have.been.calledWith('apps.purchase.licenses.add', {displayCount: 'displayCount'});

        expect(messageBoxStub).to.not.have.been.called;
        done();
      },10);
    });

    it('should go to Purchase page if company is not subscribed to a plan', function(done) {
      currentPlanFactory.isSubscribed.returns(false);

      $state.go('apps.purchase.home');

      setTimeout(function(){
        $state.go.should.have.been.calledOnce;

        done();
      },10);
    });

    it('should show a message if company has a plan inherited from the parent company', function(done) {
      currentPlanFactory.isParentPlan.returns(true);

      $state.go('apps.purchase.home');
      $rootScope.$digest();

      canAccessApps.should.have.been.called;

      setTimeout(function(){
        expect(messageBoxStub).to.have.been.calledWith(
          'You can\'t edit your current plan.',
          'Your plan is managed by your parent company. Please contact your account administrator for additional licenses.',
          'Ok', 'madero-style centered-modal', 'partials/template-editor/message-box.html', 'sm'
        );

        expect($state.go).to.have.been.calledWith('apps.home');
        expect($state.go).to.not.have.been.calledWith('apps.purchase.licenses.add');
        done();
      },10);
    });

    it('should show a message if company has a plan purchased by the parent company', function(done) {
      currentPlanFactory.currentPlan.isPurchasedByParent = true;

      $state.go('apps.purchase.home');
      $rootScope.$digest();

      canAccessApps.should.have.been.called;

      setTimeout(function(){
        expect(messageBoxStub).to.have.been.calledWith(
          'You can\'t edit your current plan.',
          'Your plan is managed by your parent company. Please contact your account administrator for additional licenses.',
          'Ok', 'madero-style centered-modal', 'partials/template-editor/message-box.html', 'sm'
        );

        expect($state.go).to.have.been.calledWith('apps.home');
        expect($state.go).to.not.have.been.calledWith('apps.purchase.licenses.add');
        done();
      },10);
    });

    it('should show plan admin email if available', function(done) {
      currentPlanFactory.currentPlan.isPurchasedByParent = true;
      currentPlanFactory.currentPlan.parentPlanContactEmail = 'test@email.com';

      $state.go('apps.purchase.home');
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
      expect(state.templateUrl).to.equal('partials/purchase/update-subscription.html');
      expect(state.controller).to.equal('UpdateSubscriptionCtrl');
      expect(state.abstract).to.be.true;
    });

    it('should resolve redirectTo as previous path', function() {
      sinon.stub($location, 'path').returns('/displays/list');

      var redirectTo = $state.get('apps.purchase.licenses').resolve.redirectTo[1]($location);
      expect(redirectTo).to.equal('/displays/list');
    });

    it('should resolve redirectTo as blank if previous path is licenses add and no subscription', function() {
      sinon.stub($location, 'path').returns('/licenses/add/');

      var redirectTo = $state.get('apps.purchase.licenses').resolve.redirectTo[1]($location);
      expect(redirectTo).to.equal('');
    });

    it('should resolve redirectTo as blank if previous path is licenses remove and no subscription', function() {
      sinon.stub($location, 'path').returns('/licenses/remove/');

      var redirectTo = $state.get('apps.purchase.licenses').resolve.redirectTo[1]($location);
      expect(redirectTo).to.equal('');
    });

    it('should resolve redirectTo as blank if previous path is licenses add', function() {
      sinon.stub($location, 'path').returns('/licenses/add/SUBSCRIPTIONID');

      var redirectTo = $state.get('apps.purchase.licenses').resolve.redirectTo[1]($location);
      expect(redirectTo).to.equal('');
    });

    it('should resolve redirectTo as blank if previous path is licenses remove', function() {
      sinon.stub($location, 'path').returns('/licenses/remove/SUBSCRIPTIONID');

      var redirectTo = $state.get('apps.purchase.licenses').resolve.redirectTo[1]($location);
      expect(redirectTo).to.equal('');
    });
  });

  describe('state apps.purchase.licenses.add:',function(){
    it('should register state',function(){
      var state = $state.get('apps.purchase.licenses.add');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/add/:subscriptionId');
      expect(state.params).to.deep.equal({purchaseAction: 'add', subscriptionId: ''});
    });

    it('should check apps access', function() {
      $state.go('apps.purchase.licenses.add');
      $rootScope.$digest();
      canAccessApps.should.have.been.called;
    });

    it('should redirect to apps.purchase.home if no subscriptionId is provided and company does not have a plan', function(done) {
      currentPlanFactory.isSubscribed.returns(false);

      $state.go('apps.purchase.licenses.add');
      $rootScope.$digest();

      setTimeout(function(){
        $state.go.should.have.been.calledWith('apps.purchase.home');

        done();
      },10);
    });

    it('should not redirect to apps.purchase.home if subscriptionId is not provided but company has a plan', function(done) {
      currentPlanFactory.isSubscribed.returns(true);

      $state.go('apps.purchase.licenses.add');
      $rootScope.$digest();
      
      setTimeout(function(){
        $state.go.should.not.have.been.calledWith('apps.purchase.home');

        done();
      },10);
    });
  });

  describe('state apps.purchase.licenses.remove:',function(){
    it('should register state',function(){
      var state = $state.get('apps.purchase.licenses.remove');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/remove/:subscriptionId');
      expect(state.params).to.deep.equal({purchaseAction: 'remove', subscriptionId: ''});
    });

    it('should check apps access', function() {
      $state.go('apps.purchase.licenses.remove');
      $rootScope.$digest();
      canAccessApps.should.have.been.called;
    });

    it('should redirect to apps.purchase.home if no subscriptionId is provided and company does not have a plan', function(done) {
      currentPlanFactory.isSubscribed.returns(false);

      $state.go('apps.purchase.licenses.remove');
      $rootScope.$digest();

      setTimeout(function(){
        $state.go.should.have.been.calledWith('apps.purchase.home');

        done();
      },10);
    });

    it('should not redirect to apps.purchase.home if subscriptionId is not provided but company has a plan', function(done) {
      currentPlanFactory.isSubscribed.returns(true);

      $state.go('apps.purchase.licenses.remove');
      $rootScope.$digest();
      
      setTimeout(function(){
        $state.go.should.not.have.been.calledWith('apps.purchase.home');

        done();
      },10);
    });
  });

  describe('state apps.purchase.licenses.unlimited:',function(){
    it('should register state',function(){
      var state = $state.get('apps.purchase.licenses.unlimited');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/unlimited/:subscriptionId');
      expect(state.params).to.deep.equal({purchaseAction: 'unlimited', subscriptionId: ''});
    });

    it('should check apps access', function() {
      $state.go('apps.purchase.licenses.unlimited');
      $rootScope.$digest();
      canAccessApps.should.have.been.called;
    });

    it('should redirect to apps.purchase.home if no subscriptionId is provided and company does not have a plan', function(done) {
      currentPlanFactory.isSubscribed.returns(false);

      $state.go('apps.purchase.licenses.unlimited');
      $rootScope.$digest();

      setTimeout(function(){
        $state.go.should.have.been.calledWith('apps.purchase.home');

        done();
      },10);
    });

    it('should not redirect to apps.purchase.home if subscriptionId is not provided but company has a plan', function(done) {
      currentPlanFactory.isSubscribed.returns(true);

      $state.go('apps.purchase.licenses.unlimited');
      $rootScope.$digest();
      
      setTimeout(function(){
        $state.go.should.not.have.been.calledWith('apps.purchase.home');

        done();
      },10);
    });
  });

  describe('state apps.purchase.frequency:',function(){
    it('should register state',function(){
      var state = $state.get('apps.purchase.frequency');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/frequency/:subscriptionId');
      expect(state.templateUrl).to.equal('partials/purchase/update-subscription.html');
      expect(state.controller).to.equal('UpdateSubscriptionCtrl');
      expect(state.params).to.deep.equal({purchaseAction: 'annual', subscriptionId: ''});
    });

    it('should check apps access', function() {
      $state.go('apps.purchase.frequency');
      $rootScope.$digest();

      canAccessApps.should.have.been.called;
    });

    it('should resolve redirectTo as previous path', function() {
      sinon.stub($location, 'path').returns('/displays/list');

      var redirectTo = $state.get('apps.purchase.frequency').resolve.redirectTo[1]($location);
      expect(redirectTo).to.equal('/displays/list');
    });

    it('should resolve redirectTo as blank if previous path is annual and no subscription', function() {
      sinon.stub($location, 'path').returns('/frequency');

      var redirectTo = $state.get('apps.purchase.frequency').resolve.redirectTo[1]($location);
      expect(redirectTo).to.equal('');
    });

    it('should resolve redirectTo as blank if previous path is annual', function() {
      sinon.stub($location, 'path').returns('/frequency/SUBSCRIPTIONID');

      var redirectTo = $state.get('apps.purchase.frequency').resolve.redirectTo[1]($location);
      expect(redirectTo).to.equal('');
    });

  });

});
