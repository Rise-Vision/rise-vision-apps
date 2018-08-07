'use strict';
describe('controller: BillingCtrl', function () {
  var sandbox = sinon.sandbox.create();
  var $scope, $window, $loading, $modal, chargebeeFactory;

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
        openPaymentSources: sandbox.stub()
      };
    });
  }));

  beforeEach(inject(function($injector, $rootScope, $controller) {
    $scope = $rootScope.$new();
    $window = $injector.get('$window');
    $loading = $injector.get('$loading');
    $modal = $injector.get('$modal');
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

  describe('payment methods', function () {
    it('should show Chargebee payment methods', function () {
      $scope.editPaymentMethods();
      expect(chargebeeFactory.openPaymentSources).to.be.calledOnce;
      expect(chargebeeFactory.openPaymentSources.getCall(0).args[0]).to.equal('testId');
    });
  });

  describe('account information', function () {
    it('should show Company Settings modal', function () {
      $scope.showCompanySettings();
      expect($modal.open).to.be.calledOnce;
    });
  });
});
