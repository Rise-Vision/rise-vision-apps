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
    describe('getSubscriptionDesc: ', function() {
      it('should format legacy subscription names', function () {
        expect($scope.getSubscriptionDesc({
          plan_id: 'b1844725d63fde197f5125b58b6cba6260ee7a57-m',
          plan_quantity: 1,
          billing_period: 1,
          billing_period_unit: 'month'
        })).to.equal('Enterprise Plan Monthly');

        expect($scope.getSubscriptionDesc({
          plan_id: 'b1844725d63fde197f5125b58b6cba6260ee7a57-m',
          plan_quantity: 3,
          billing_period: 1,
          billing_period_unit: 'month'
        })).to.equal('3 x Enterprise Plan Monthly');

        expect($scope.getSubscriptionDesc({
          plan_id: '93b5595f0d7e4c04a3baba1102ffaecb17607bf4-m',
          plan_quantity: 1,
          billing_period: 0,
          billing_period_unit: 'year'
        })).to.equal('Advanced Plan Yearly');

        expect($scope.getSubscriptionDesc({
          plan_id: '40c092161f547f8f72c9f173cd8eebcb9ca5dd25-m',
          plan_quantity: 2,
          billing_period: 1,
          billing_period_unit: 'year'
        })).to.equal('2 x Basic Plan Yearly');

        expect($scope.getSubscriptionDesc({
          plan_id: '40c092161f547f8f72c9f173cd8eebcb9ca5dd25-m',
          plan_quantity: 2,
          billing_period: 3,
          billing_period_unit: 'year'
        })).to.equal('2 x Basic Plan 3 Year');

        expect($scope.getSubscriptionDesc({
          plan_id: '40c092161f547f8f72c9f173cd8eebcb9ca5dd25-m',
          plan_quantity: 2,
          billing_period: 3,
          billing_period_unit: 'month'
        })).to.equal('2 x Basic Plan 3 Month');

      });

      it('Use plan_id if the plan mapping is not found', function() {
        expect($scope.getSubscriptionDesc({
          plan_id: 'pppc',
          plan_quantity: 1,
          billing_period: 1,
          billing_period_unit: 'year',
        })).to.equal('pppc');

        expect($scope.getSubscriptionDesc({
          plan_id: 'pppc',
          plan_quantity: 3,
          billing_period: 1,
          billing_period_unit: 'year',
        })).to.equal('pppc');
      });

      it('should format volume plan names', function () {
        expect($scope.getSubscriptionDesc({
          plan_id: '34e8b511c4cc4c2affa68205cd1faaab427657dc',
          plan_quantity: 1,
          billing_period: 1,
          billing_period_unit: 'month',
        })).to.equal('1 x Display Licenses Monthly Plan');

        expect($scope.getSubscriptionDesc({
          plan_id: '88725121a2c7a57deefcf06688ffc8e84cc4f93b',
          plan_quantity: 3,
          billing_period: 1,
          billing_period_unit: 'year',
        })).to.equal('3 x Display Licenses for Education Yearly Plan');

      });

    });

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
