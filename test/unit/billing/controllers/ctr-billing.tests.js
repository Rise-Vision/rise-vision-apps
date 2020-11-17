'use strict';
describe('controller: BillingCtrl', function () {
  var sandbox = sinon.sandbox.create();
  var $rootScope, $scope, $loading, $timeout, listServiceInstance;

  beforeEach(module('risevision.apps.billing.controllers'));

  beforeEach(module(function ($provide) {
    $provide.service('$loading', function () {
      return {
        startGlobal: sandbox.stub(),
        stopGlobal: sandbox.stub(),
        stop: sandbox.stub()
      };
    });
    $provide.service('companySettingsFactory', function () {
      return {
        openCompanySettings: sandbox.stub()
      };
    });   
    $provide.service('ScrollingListService', function () {
      return function () {
        return listServiceInstance;
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
    $provide.service('currentPlanFactory', function() {
      return {};
    });
    $provide.service('ChargebeeFactory', function () {
      return function() {
        return {
          openBillingHistory: sandbox.stub(),
          openPaymentSources: sandbox.stub(),
          openSubscriptionDetails: sandbox.stub()
        };
      };
    });
    $provide.service('billing', function () {
      return {
        getSubscriptions: sandbox.stub(),
        getUnpaidInvoices: sandbox.stub()
      };
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
    expect($scope.viewPastInvoices).to.be.a.function;
    expect($scope.editPaymentMethods).to.be.a.function;
    expect($scope.editSubscription).to.be.a.function;
  });

  describe('past invoices', function () {
    it('should show Chargebee invoices', function () {
      $scope.viewPastInvoices();
      expect($scope.chargebeeFactory.openBillingHistory).to.be.calledOnce;
      expect($scope.chargebeeFactory.openBillingHistory.getCall(0).args[0]).to.equal('testId');
    });

  });

  describe('checkCreationDate: ', function() {
    it('should return false if creation date is null', function() {
      expect($scope.checkCreationDate()).to.be.false;
    });

    it('should return false if company was created after the launch date', function() {
      $scope.company.creationDate = 'Sep 25, 2018';

      expect($scope.checkCreationDate()).to.be.false;
    });

    it('should return true if company has not completed onboarding', function() {
      $scope.company.creationDate = 'Aug 25, 2015';

      expect($scope.checkCreationDate()).to.be.true;
    });

  });

  describe('hasUnpaidInvoices: ', function() {
    it('should default to false', function() {
      expect($scope.invoices).to.be.an('object');

      expect($scope.hasUnpaidInvoices).to.be.false;
    });

    it('should be true if there are invoices', function() {
      $scope.invoices = {
        items: {
          list: [
            {id: 'invoice1'}
          ]
        },
        loadingItems: false
      };

      $scope.$digest();

      expect($scope.hasUnpaidInvoices).to.be.true;
    });

    it('should be true if there are no invoices', function() {
      $scope.invoices = {
        items: {
          list: []
        },
        loadingItems: false
      };

      $scope.$digest();

      expect($scope.hasUnpaidInvoices).to.be.false;
    });

    it('should remove watcher', function() {
      expect($scope.$$watchers).to.have.length(2);

      $scope.invoices = {
        items: {
          list: []
        },
        loadingItems: false
      };

      $scope.$digest();

      expect($scope.$$watchers).to.have.length(1);

      expect($scope.hasUnpaidInvoices).to.be.false;
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
    it('should show Chargebee subscription details for a Subscription with parentId == null', function () {
      $scope.editSubscription({ subscriptionId: 'subs1' });
      expect($scope.chargebeeFactory.openSubscriptionDetails).to.be.calledOnce;
      expect($scope.chargebeeFactory.openSubscriptionDetails.getCall(0).args[0]).to.equal('testId');
      expect($scope.chargebeeFactory.openSubscriptionDetails.getCall(0).args[1]).to.equal('subs1');
    });

    it('should show Chargebee parent subscription details for a Subscription with parentId != null', function () {
      $scope.editSubscription({ subscriptionId: 'subs1', parentId: 'parentId' });
      expect($scope.chargebeeFactory.openSubscriptionDetails).to.be.calledOnce;
      expect($scope.chargebeeFactory.openSubscriptionDetails.getCall(0).args[0]).to.equal('testId');
      expect($scope.chargebeeFactory.openSubscriptionDetails.getCall(0).args[1]).to.equal('parentId');
    });
  });

  describe('events: ', function () {
    it('should reload Subscriptions when Subscription is updated on Customer Portal', function () {
      $rootScope.$emit('chargebee.subscriptionChanged');
      $timeout.flush();
      expect($loading.startGlobal).to.be.calledOnce;
      expect($loading.stopGlobal).to.be.calledOnce;
      expect(listServiceInstance.doSearch).to.be.calledOnce;
    });

    it('should reload Subscriptions when Subscription is started', function () {
      $rootScope.$emit('risevision.company.planStarted');
      $rootScope.$digest();
      expect(listServiceInstance.doSearch).to.be.calledOnce;
    });

  });

  describe('data formatting', function () {
    describe('getSubscriptionDesc: ', function() {
      it('should format legacy subscription names', function () {
        expect($scope.getSubscriptionDesc({
          productName: 'Enterprise Plan',
          quantity: 1,
          unit: 'per Company per Month'
        })).to.equal('Enterprise Plan Monthly');

        expect($scope.getSubscriptionDesc({
          productName: 'Enterprise Plan',
          quantity: 3,
          unit: 'per Display per month'
        })).to.equal('3 x Enterprise Plan Monthly');

        expect($scope.getSubscriptionDesc({
          productName: 'Advanced Plan',
          quantity: 1,
          unit: 'per Company per Year',
          billingPeriod: 0
        })).to.equal('Advanced Plan Yearly');

        expect($scope.getSubscriptionDesc({
          productName: 'Basic Plan',
          quantity: 2,
          unit: 'per Company per Year',
          billingPeriod: 1
        })).to.equal('2 x Basic Plan Yearly');

        expect($scope.getSubscriptionDesc({
          productName: 'Basic Plan',
          quantity: 2,
          unit: 'per Company per Year',
          billingPeriod: 3
        })).to.equal('2 x Basic Plan 3 Year');

        expect($scope.getSubscriptionDesc({
          productName: 'Additional Licenses',
          quantity: 1,
          unit: 'per Display per Year',
          productCode: 'pppc'
        })).to.equal('1 x Additional Licenses Yearly');

      });

      it('should format volume plan names', function () {
        expect($scope.getSubscriptionDesc({
          productName: 'Volume Plan',
          quantity: 1,
          unit: 'per Company per Month',
          productCode: '34e8b511c4cc4c2affa68205cd1faaab427657dc'
        })).to.equal('1 x Display Licenses Monthly Plan');

        expect($scope.getSubscriptionDesc({
          productName: 'Volume Plan for Education',
          quantity: 3,
          unit: 'per Company per Year',
          productCode: '88725121a2c7a57deefcf06688ffc8e84cc4f93b'
        })).to.equal('3 x Display Licenses for Education Yearly Plan');

      });

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
