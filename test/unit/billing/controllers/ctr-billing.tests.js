'use strict';
describe('controller: Billing', function () {
  var sandbox = sinon.sandbox.create();
  var $scope, $window, $loading, chargebeeFactory;

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
    $provide.service('userState', function () {
      return {
        getSelectedCompanyId: function () {
          return 'testId';
        }
      };
    });
    $provide.service('chargebeeFactory', function () {
      return {
        openBillingHistory: sandbox.stub()
      };
    });
  }));

  beforeEach(inject(function($injector, $rootScope, $controller) {
    $scope = $rootScope.$new();
    $window = $injector.get('$window');
    $loading = $injector.get('$loading');
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
  });

  describe('loading:', function () {
    it('should show spinner on init', function () {
      $loading.startGlobal.should.have.been.calledWith('billing.loading');
    });

    it('should global spinner after loading billing information', function () {
      $loading.stopGlobal.should.have.been.calledWith('billing.loading');
    });
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
});
