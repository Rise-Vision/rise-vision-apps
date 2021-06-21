'use strict';

describe('app:', function() {
  var sandbox = sinon.sandbox.create();
  var $state, canAccessApps, $stateParams, invoiceFactory, subscriptionFactory;

  beforeEach(function () {
    angular.module('risevision.apps.partials',[]);

    module('risevision.apps');

    module(function ($provide) {
      $provide.service('canAccessApps',function(){
        return sandbox.stub().returns(Q.resolve());
      });
      $provide.service('invoiceFactory', function() {
        return {
          getInvoice: sandbox.spy(),
          init: sandbox.spy()
        };
      });
      $provide.service('subscriptionFactory', function() {
        return {
          getSubscription: sandbox.spy()
        };
      });
      $provide.service('currentPlanFactory', function () {
        return {
        };
      });

    });

    inject(function ($injector) {
      $state = $injector.get('$state');
      canAccessApps = $injector.get('canAccessApps');
      $stateParams = $injector.get('$stateParams');
      invoiceFactory = $injector.get('invoiceFactory');
      subscriptionFactory = $injector.get('subscriptionFactory');
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('state apps.billing.home:',function(){

    it('should register state',function(){
      var state = $state.get('apps.billing.home');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/billing?edit');
      expect(state.controller).to.be.ok;
      expect(state.forceAuth).to.not.be.false;
    });

    it('should initialize factory', function(done) {
      $state.get('apps.billing.home').resolve.canAccessApps[2](canAccessApps, invoiceFactory);
      setTimeout(function() {
        canAccessApps.should.have.been.called.once;
        invoiceFactory.init.should.have.been.called;

        done();
      }, 10);
    });

  });

  describe('state apps.billing.subscription:',function(){

    it('should register state',function(){
      var state = $state.get('apps.billing.subscription');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/billing/subscription/:subscriptionId');
      expect(state.controller).to.equal('SubscriptionCtrl');
    });

    it('should open Edit Subscription', function(done) {
      $stateParams.subscriptionId = 'subscriptionId';
      $state.get('apps.billing.subscription').resolve.invoiceInfo[3](canAccessApps, subscriptionFactory, $stateParams);
      setTimeout(function() {
        canAccessApps.should.have.been.called.once;
        subscriptionFactory.getSubscription.should.have.been.calledWith('subscriptionId', true);

        done();
      }, 10);
    });

  });

  describe('state apps.billing.payment:',function(){

    it('should register state',function(){
      var state = $state.get('apps.billing.payment');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/billing/payment/:subscriptionId');
      expect(state.controller).to.equal('AddPaymentSourceCtrl');
    });

    it('should open page and load subscription', function(done) {
      $stateParams.subscriptionId = 'subscriptionId';
      $state.get('apps.billing.payment').resolve.invoiceInfo[3](canAccessApps, subscriptionFactory, $stateParams);
      setTimeout(function() {
        canAccessApps.should.have.been.called.once;
        subscriptionFactory.getSubscription.should.have.been.calledWith('subscriptionId');

        done();
      }, 10);
    });

  });

  describe('state apps.billing.unpaid:',function(){

    it('should register state',function(){
      var state = $state.get('apps.billing.unpaid');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/billing/unpaid?:token');
      expect(state.controller).to.equal('UnpaidInvoicesCtrl');
      expect(state.forceAuth).to.be.false;
    });

  });

  describe('state apps.billing.invoice:',function(){

    it('should register state',function(){
      var state = $state.get('apps.billing.invoice');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/billing/invoice/:invoiceId?:token');
      expect(state.controller).to.equal('InvoiceCtrl');
      expect(state.forceAuth).to.be.false;
    });

    it('should open Edit Invoice', function(done) {
      $stateParams.invoiceId = 'invoiceId';
      $stateParams.cid = 'companyId';
      $stateParams.token = 'token';
      $state.get('apps.billing.invoice').resolve.invoiceInfo[2](invoiceFactory, $stateParams);
      setTimeout(function() {
        invoiceFactory.getInvoice.should.have.been.calledWith('invoiceId', 'companyId', 'token');

        done();
      }, 10);
    });

  });

});
