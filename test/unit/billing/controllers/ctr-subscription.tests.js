'use strict';
describe('controller: SubscriptionCtrl', function () {
  var sandbox = sinon.sandbox.create();
  var $rootScope, $scope, $loading, subscriptionFactory, taxExemptionFactory, plansService;

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
    $provide.value('taxExemptionFactory', {
      taxExemption: {},
      init: sandbox.stub()
    });
    $provide.service('ChargebeeFactory', function () {
      return function() {
        return {
          openPaymentSources: sandbox.stub(),
          openSubscriptionDetails: sandbox.stub()
        };
      };
    });
    $provide.service('plansService', function () {
      return {
        getPlanById: sandbox.stub().returns({
          name: 'planName',
          productCode: 'somePlan'
        }),
        getVolumePlan: sandbox.stub().returns({
          productCode: 'volumePlan'
        }),
        isVolumePlan: sandbox.stub().returns(true)
      };
    });

  }));

  beforeEach(inject(function($injector, _$rootScope_, $controller) {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $loading = $injector.get('$loading');
    subscriptionFactory = $injector.get('subscriptionFactory');
    taxExemptionFactory = $injector.get('taxExemptionFactory');
    plansService = $injector.get('plansService');

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
    expect($scope.taxExemptionFactory).to.equal(taxExemptionFactory);
    expect($scope.company).to.be.ok;

    expect($scope.isInvoiced).to.be.a('function');
    expect($scope.isDisplayLicensePlan).to.be.a('function');
    expect($scope.isVolumePlan).to.be.a('function');
    expect($scope.getPlanName).to.be.a('function');

    expect($scope.editPaymentMethods).to.be.a('function');
    expect($scope.editSubscription).to.be.a('function');
  });

  it('should initialize tax exemption', function() {
    taxExemptionFactory.init.should.have.been.called;
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

    it('should start and stop spinner from taxExemptionFactory', function() {
      taxExemptionFactory.loading = true;
      $scope.$digest();

      $loading.start.should.have.been.calledWith('subscription-loader');

      taxExemptionFactory.loading = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledTwice;
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

  describe('isDisplayLicensePlan', function() {
    it('should return false if an invalid subscription is passed', function() {
      expect($scope.isDisplayLicensePlan()).to.be.false;
    });

    it('should return false if the plan product codes do not match', function() {
      expect($scope.isDisplayLicensePlan({
        plan_id: 'planId'
      })).to.be.false;

      plansService.getPlanById.should.have.been.calledWith('planId');
      plansService.getVolumePlan.should.have.been.called;
    });

    it('should return false if a plan is not found', function() {
      plansService.getPlanById.returns(null);
      expect($scope.isDisplayLicensePlan({})).to.not.be.ok;
    });

    it('should return true if the product codes match', function() {
      plansService.getPlanById.returns({
        productCode: 'volumePlan'
      });
      expect($scope.isDisplayLicensePlan({})).to.be.true;
    });

  });

  describe('isVolumePlan', function() {
    it('should return false if an invalid subscription is passed', function() {
      expect($scope.isVolumePlan()).to.be.false;
    });

    it('should return true if the plan is a volume plan', function() {
      expect($scope.isVolumePlan({
        plan_id: 'planId'
      })).to.be.true;

      plansService.getPlanById.should.have.been.calledWith('planId');
    });

    it('should return false if it is not a volume plan', function() {
      plansService.isVolumePlan.returns(false);
      expect($scope.isVolumePlan({})).to.be.false;
    });

  });

  describe('getPlanName', function() {
    it('should return blank if an invalid subscription is passed', function() {
      expect($scope.getPlanName()).to.equal('');
    });

    it('should return plan name', function() {
      expect($scope.getPlanName({
        plan_id: 'planId'
      })).to.equal('planName Plan');

      plansService.getPlanById.should.have.been.calledWith('planId');
    });

    it('should return plan id if plan is not found', function() {
      plansService.getPlanById.returns(null);
      expect($scope.getPlanName({
        plan_id: 'planId'
      })).to.equal('planId');
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

      expect(subscriptionFactory.reloadSubscription).to.be.calledOnce;
    });

  });

});
