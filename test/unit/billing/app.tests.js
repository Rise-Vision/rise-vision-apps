'use strict';

describe('app:', function() {
  var sandbox = sinon.sandbox.create();
  var $state, canAccessApps, $stateParams, ChargebeeFactory, userState, chargebeeFactoryStub;

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
    });

    it('should open Edit Subscription if edit param is provided', function(done) {
      $stateParams.edit = 'subscriptionId';
      $state.get('apps.billing.home').resolve.canAccessApps[4](canAccessApps, $stateParams, ChargebeeFactory, userState);
      setTimeout(function() {
        canAccessApps.should.have.been.called.once;
        chargebeeFactoryStub.openEditSubscription.should.have.been.calledWith('cid','subscriptionId');

        done();
      }, 10);
    });

    it('should not open Edit Subscription if edit is not present', function(done) {
      chargebeeFactoryStub.openEditSubscription.resetHistory();

      $state.get('apps.billing.home').resolve.canAccessApps[4](canAccessApps, $stateParams, ChargebeeFactory, userState);
      setTimeout(function() {
        canAccessApps.should.have.been.called.once;
        chargebeeFactoryStub.openEditSubscription.should.not.have.been.called;

        done();
      }, 10);
    });

  });

});
