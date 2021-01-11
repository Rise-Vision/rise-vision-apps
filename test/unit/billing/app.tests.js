'use strict';

describe('app:', function() {
  var sandbox = sinon.sandbox.create();
  var $state, canAccessApps, $stateParams, ChargebeeFactory, invoiceFactory, userState, chargebeeFactoryStub;

  beforeEach(function () {
    angular.module('risevision.apps.partials',[]);

    module('risevision.apps');

    module(function ($provide) {
      $provide.service('canAccessApps',function(){
        return sandbox.stub().returns(Q.resolve());
      });
      $provide.service('ChargebeeFactory', function () {
        return function() {
          return chargebeeFactoryStub = {
            openEditSubscription: sandbox.stub()
          };
        };
      });
      $provide.service('invoiceFactory', function() {
        return {
          getInvoice: sandbox.spy(),
          init: sandbox.spy()
        };
      });
      $provide.service('currentPlanFactory', function () {
        return {
        };
      });

      $provide.service('userState', function () {
        return {
          _restoreState: sandbox.stub(),
          getSelectedCompanyId: sandbox.stub().returns('cid')
        };
      });
    });

    inject(function ($injector) {
      $state = $injector.get('$state');
      canAccessApps = $injector.get('canAccessApps');
      $stateParams = $injector.get('$stateParams');
      ChargebeeFactory = $injector.get('ChargebeeFactory');
      invoiceFactory = $injector.get('invoiceFactory');
      userState = $injector.get('userState');
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

    it('should open Edit Subscription if edit param is provided', function(done) {
      $stateParams.edit = 'subscriptionId';
      $state.get('apps.billing.home').resolve.canAccessApps[5](canAccessApps, $stateParams, ChargebeeFactory, invoiceFactory, userState);
      setTimeout(function() {
        canAccessApps.should.have.been.called.once;
        invoiceFactory.init.should.have.been.called;
        chargebeeFactoryStub.openEditSubscription.should.have.been.calledWith('cid','subscriptionId');

        done();
      }, 10);
    });

    it('should not open Edit Subscription if edit is not present', function(done) {
      chargebeeFactoryStub.openEditSubscription.resetHistory();

      $state.get('apps.billing.home').resolve.canAccessApps[5](canAccessApps, $stateParams, ChargebeeFactory, invoiceFactory, userState);
      setTimeout(function() {
        canAccessApps.should.have.been.called.once;
        invoiceFactory.init.should.have.been.called;
        chargebeeFactoryStub.openEditSubscription.should.not.have.been.called;

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
