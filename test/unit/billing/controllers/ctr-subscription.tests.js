'use strict';
describe('controller: SubscriptionCtrl', function () {
  var sandbox = sinon.sandbox.create();
  var $rootScope, $scope, $loading, $timeout, subscriptionFactory;

  beforeEach(module('risevision.apps.billing.controllers'));

  beforeEach(module(function ($provide) {
    $provide.service('$loading', function () {
      return {
        start: sandbox.stub(),
        stop: sandbox.stub()
      };
    });
    $provide.service('companySettingsFactory', function () {
      return {
        openCompanySettings: sandbox.stub()
      };
    });
    $provide.service('userState', function () {
      return {
        getSelectedCompanyId: function () {
          return 'testId';
        },
        getCopyOfSelectedCompany: function () {
          return {};
        }
      };
    });
    $provide.service('subscriptionFactory', function() {
      return {
        reloadSubscription: sandbox.spy()
      };
    });
    $provide.service('creditCardFactory', function() {
      return {
        
      };
    });
    $provide.service('ChargebeeFactory', function () {
      return function() {
        return {
          openPaymentSources: sandbox.stub(),
          openSubscriptionDetails: sandbox.stub()
        };
      };
    });
    $provide.service('billing', function () {
      return {
        getSubscriptions: 'getSubscriptions',
        getInvoices: 'getInvoices'
      };
    });
  }));

  beforeEach(inject(function($injector, _$rootScope_, $controller) {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $loading = $injector.get('$loading');
    $timeout = $injector.get('$timeout');
    subscriptionFactory = $injector.get('subscriptionFactory');

    $controller('SubscriptionCtrl', {
      $scope: $scope
    });
    $scope.$digest();
  }));

  afterEach(function () {
    sandbox.restore();
  });

  it('should exist',function () {
    expect($scope).to.be.ok;

    expect($scope.subscriptionFactory).to.equal(subscriptionFactory);
    expect($scope.creditCardFactory).to.be.ok;
    expect($scope.companySettingsFactory).to.be.ok;
    expect($scope.company).to.be.ok;

    expect($scope.isInvoiced).to.be.a('function')

    expect($scope.editPaymentMethods).to.be.a('function');
    expect($scope.editSubscription).to.be.a('function');
  });

  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loading.stop.should.have.been.calledWith('subscription-loader');
    });

    it('should start spinner', function(done) {
      subscriptionFactory.loading = true;
      $scope.$digest();
      setTimeout(function() {
        $loading.start.should.have.been.calledWith('subscription-loader');

        done();
      }, 10);
    });
  });

  describe('isInvoiced', function() {
    it('should return false by default', function() {
      expect($scope.isInvoiced()).to.not.be.ok;
    });

    it('should return false if a card exists', function() {
      subscriptionFactory.item = {
        card: 'card'
      };

      expect($scope.isInvoiced()).to.be.false;
    });

    it('should return true if a card does not exist', function() {
      subscriptionFactory.item = {
        card: undefined
      };

      expect($scope.isInvoiced()).to.be.true;
    });

  });

  describe('payment methods', function () {
    it('should show Chargebee payment methods', function () {
      $scope.editPaymentMethods();
      expect($scope.chargebeeFactory.openPaymentSources).to.be.calledOnce;
      expect($scope.chargebeeFactory.openPaymentSources.getCall(0).args[0]).to.equal('testId');
    });
  });

  describe('edit subscriptions', function () {
    it('should show Chargebee subscription details', function () {
      $scope.editSubscription({ id: 'subs1' });
      expect($scope.chargebeeFactory.openSubscriptionDetails).to.be.calledOnce;
      expect($scope.chargebeeFactory.openSubscriptionDetails.getCall(0).args[0]).to.equal('testId');
      expect($scope.chargebeeFactory.openSubscriptionDetails.getCall(0).args[1]).to.equal('subs1');
    });
  });

  describe('events: ', function () {
    it('should reload Subscription when it is updated on Customer Portal', function () {
      $rootScope.$emit('chargebee.subscriptionChanged');
      $timeout.flush();

      expect($loading.start).to.be.calledOnce;
      expect(subscriptionFactory.reloadSubscription).to.be.calledOnce;
    });

  });

});
