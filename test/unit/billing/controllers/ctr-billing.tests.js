'use strict';
describe('controller: BillingCtrl', function () {
  var sandbox = sinon.sandbox.create();
  var $rootScope, $scope, $loading, $timeout, ScrollingListService, listServiceInstance;

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
    $provide.service('ScrollingListService', function () {
      return sinon.stub().returns(listServiceInstance);
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
    $provide.service('currentPlanFactory', function() {
      return {};
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
    $provide.value('billingFactory', {
    });
  }));

  beforeEach(inject(function($injector, _$rootScope_, $controller) {
    listServiceInstance = {
      doSearch: sandbox.stub()
    };

    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $loading = $injector.get('$loading');
    $timeout = $injector.get('$timeout');
    ScrollingListService = $injector.get('ScrollingListService');

    $controller('BillingCtrl', {
      $scope: $scope
    });
    $scope.$digest();
  }));

  afterEach(function () {
    sandbox.restore();
  });

  it('should exist',function () {
    expect($scope).to.be.ok;
    expect($scope.companySettingsFactory).to.be.ok;
    expect($scope.editPaymentMethods).to.be.a.function;
    expect($scope.editSubscription).to.be.a.function;

    expect($scope.subscriptions).to.be.ok;
    expect($scope.invoices).to.be.ok;
  });

  it('should init list service', function() {
    ScrollingListService.should.have.been.calledTwice;
    ScrollingListService.should.have.been.calledWith('getSubscriptions', {
      name: 'Subscriptions'
    });
    ScrollingListService.should.have.been.calledWith('getInvoices', {
      name: 'Invoices'
    });
  });

  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loading.stop.should.have.been.calledWith('billing-loader');
    });

    it('should start spinner', function(done) {
      $scope.subscriptions.loadingItems = true;
      $scope.$digest();
      setTimeout(function() {
        $loading.start.should.have.been.calledWith('billing-loader');

        done();
      }, 10);
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
    it('should reload Subscriptions when Subscription is updated on Customer Portal', function () {
      $rootScope.$emit('chargebee.subscriptionChanged');
      $timeout.flush();

      expect($loading.start).to.be.calledOnce;
      expect(listServiceInstance.doSearch).to.be.calledOnce;
    });

    it('should reload Subscriptions when Subscription is started', function () {
      $rootScope.$emit('risevision.company.planStarted');

      expect(listServiceInstance.doSearch).to.be.calledOnce;
    });

  });

  describe('data formatting', function () {
    it('should validate Active status type', function () {
      expect($scope.isActive({ status: 'active' })).to.be.true;
      expect($scope.isActive({ status: 'cancelled' })).to.be.false;
    });

    it('should validate Cancelled status type', function () {
      expect($scope.isCancelled({ status: 'cancelled' })).to.be.true;
      expect($scope.isCancelled({ status: 'active' })).to.be.false;
    });

    it('should validate Suspended status type', function () {
      expect($scope.isSuspended({ status: 'suspended' })).to.be.true;
      expect($scope.isSuspended({ status: 'active' })).to.be.false;
    });
  });
});
