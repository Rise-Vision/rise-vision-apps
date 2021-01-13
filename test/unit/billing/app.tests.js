'use strict';

describe('app:', function() {
  var sandbox = sinon.sandbox.create();
  var $state, canAccessApps, $stateParams, billingFactory;

  beforeEach(function () {
    angular.module('risevision.apps.partials',[]);

    module('risevision.apps');

    module(function ($provide) {
      $provide.service('canAccessApps',function(){
        return sandbox.stub().returns(Q.resolve());
      });
      $provide.service('billingFactory', function() {
        return {
          getInvoice: sandbox.spy(),
          init: sandbox.spy()
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
      billingFactory = $injector.get('billingFactory');
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
      $state.get('apps.billing.home').resolve.canAccessApps[2](canAccessApps, billingFactory);
      setTimeout(function() {
        canAccessApps.should.have.been.called.once;
        billingFactory.init.should.have.been.called;

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
      $state.get('apps.billing.invoice').resolve.invoiceInfo[2](billingFactory, $stateParams);
      setTimeout(function() {
        billingFactory.getInvoice.should.have.been.calledWith('invoiceId', 'companyId', 'token');

        done();
      }, 10);
    });

  });

});
