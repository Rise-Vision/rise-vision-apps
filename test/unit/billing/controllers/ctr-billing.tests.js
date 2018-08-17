'use strict';
describe('controller: BillingCtrl', function () {
  var sandbox = sinon.sandbox.create();
  var $rootScope, $scope, $window, $loading, $modal, $timeout, chargebeeFactory, listServiceInstance;

  beforeEach(module('risevision.apps.billing.controllers'));

  beforeEach(module(function ($provide) {
    $provide.value('STORE_URL', 'https://store.risevision.com/');
    $provide.value('INVOICES_PATH', 'account/view/invoicesHistory?cid=companyId');
    $provide.service('$window', function () {
      return {
        open: sandbox.stub()
      };
    });
    $provide.service('$loading', function () {
      return {
        startGlobal: sandbox.stub(),
        stopGlobal: sandbox.stub(),
        stop: sandbox.stub()
      };
    });
    $provide.service('$modal', function () {
      return {
        open: sandbox.stub()
      };
    });
    $provide.service('$templateCache', function () {
      return {
        get: sandbox.stub()
      };
    });
    $provide.service('ScrollingListService', function () {
      return function () {
        listServiceInstance = {
          doSearch: sandbox.stub()
        };

        return listServiceInstance;
      };
    });
    $provide.service('getCoreCountries', function () {
      return function () {
        return [];
      };
    });
    $provide.service('userState', function () {
      return {
        getSelectedCompanyId: function () {
          return 'testId';
        }
      };
    });
    $provide.service('chargebeeFactory', function () {
      return {
        openBillingHistory: sandbox.stub(),
        openPaymentSources: sandbox.stub(),
        openSubscriptionDetails: sandbox.stub()
      };
    });
    $provide.service('billing', function () {
      return {
        getSubscriptions: sandbox.stub()
      };
    });
  }));

  beforeEach(inject(function($injector, _$rootScope_, $controller) {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $window = $injector.get('$window');
    $modal = $injector.get('$modal');
    $loading = $injector.get('$loading');
    $timeout = $injector.get('$timeout');
    chargebeeFactory = $injector.get('chargebeeFactory');

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
    expect($scope.viewPastInvoices).to.be.a.function;
    expect($scope.viewPastInvoicesStore).to.be.a.function;
    expect($scope.editPaymentMethods).to.be.a.function;
    expect($scope.editSubscription).to.be.a.function;
    expect($scope.showCompanySettings).to.be.a.function;
  });

  describe('past invoices', function () {
    it('should show Chargebee invoices', function () {
      $scope.viewPastInvoices();
      expect(chargebeeFactory.openBillingHistory).to.be.calledOnce;
      expect(chargebeeFactory.openBillingHistory.getCall(0).args[0]).to.equal('testId');
    });

    it('should show Store invoices', function () {
      $scope.viewPastInvoicesStore();
      expect($window.open).to.be.calledOnce;
      expect($window.open.getCall(0).args[0]).to.equal('https://store.risevision.com/account/view/invoicesHistory?cid=testId');
    });
  });

  describe('payment methods', function () {
    it('should show Chargebee payment methods', function () {
      $scope.editPaymentMethods();
      expect(chargebeeFactory.openPaymentSources).to.be.calledOnce;
      expect(chargebeeFactory.openPaymentSources.getCall(0).args[0]).to.equal('testId');
    });
  });

  describe('edit subscriptions', function () {
    it('should show Chargebee subscription details for a Subscription with parentId == null', function () {
      $scope.editSubscription({ subscriptionId: 'subs1' });
      expect(chargebeeFactory.openSubscriptionDetails).to.be.calledOnce;
      expect(chargebeeFactory.openSubscriptionDetails.getCall(0).args[0]).to.equal('testId');
      expect(chargebeeFactory.openSubscriptionDetails.getCall(0).args[1]).to.equal('subs1');
    });

    it('should show Chargebee parent subscription details for a Subscription with parentId != null', function () {
      $scope.editSubscription({ subscriptionId: 'subs1', parentId: 'parentId' });
      expect(chargebeeFactory.openSubscriptionDetails).to.be.calledOnce;
      expect(chargebeeFactory.openSubscriptionDetails.getCall(0).args[0]).to.equal('testId');
      expect(chargebeeFactory.openSubscriptionDetails.getCall(0).args[1]).to.equal('parentId');
    });
  });

  describe('account information', function () {
    it('should show Company Settings modal', function () {
      $scope.showCompanySettings();
      expect($modal.open).to.be.calledOnce;
    });
  });

  describe('chargebee events', function () {
    it('should reload Subscriptions when Subscription is updated on Customer Portal', function () {
      $rootScope.$emit('chargebee.subscriptionChanged');
      $timeout.flush();
      expect($loading.startGlobal).to.be.calledOnce;
      expect($loading.stopGlobal).to.be.calledOnce;
      expect(listServiceInstance.doSearch).to.be.calledOnce;
    });
  });

  describe('data formatting', function () {
    it('should format subscription name', function () {
      expect($scope.getSubscriptionDesc({
        productName: 'Enterprise Plan',
        quantity: 1,
        unit: 'per Display per Month',
        currencyCode: 'usd'
      })).to.equal('Enterprise Plan (Monthly/USD)');

      expect($scope.getSubscriptionDesc({
        productName: 'Enterprise Plan',
        quantity: 3,
        unit: 'per Display per month',
        currencyCode: 'cad'
      })).to.equal('3 x Enterprise Plan (Monthly/CAD)');

      expect($scope.getSubscriptionDesc({
        productName: 'Advanced Plan',
        quantity: 1,
        unit: 'per Display per Year',
        currencyCode: 'usd'
      })).to.equal('Advanced Plan (Yearly/USD)');

      expect($scope.getSubscriptionDesc({
        productName: 'Basic Plan',
        quantity: 2,
        unit: 'per Display per Year',
        currencyCode: 'cad'
      })).to.equal('2 x Basic Plan (Yearly/CAD)');
    });

    it('should calculate total price', function () {
      expect($scope.getSubscriptionPrice({
        quantity: 1,
        price: 100,
        shipping: 0
      })).to.equal(100);

      expect($scope.getSubscriptionPrice({
        quantity: 5,
        price: 50,
        shipping: 0
      })).to.equal(250);

      expect($scope.getSubscriptionPrice({
        quantity: 3,
        price: 200,
        shipping: 500
      })).to.equal(1100);
    });

    it('should validate Active status type', function () {
      expect($scope.isActive({ status: 'Active' })).to.be.true;
      expect($scope.isActive({ status: 'Cancelled' })).to.be.false;
    });

    it('should validate Cancelled status type', function () {
      expect($scope.isCancelled({ status: 'Cancelled' })).to.be.true;
      expect($scope.isCancelled({ status: 'Active' })).to.be.false;
    });

    it('should validate Suspended status type', function () {
      expect($scope.isSuspended({ status: 'Suspended' })).to.be.true;
      expect($scope.isSuspended({ status: 'Active' })).to.be.false;
    });
  });
});
