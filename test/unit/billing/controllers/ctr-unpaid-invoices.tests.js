'use strict';

describe('controller: UnpaidInvoicesCtrl', function () {
  var sandbox = sinon.sandbox.create();
  var $scope, $loading, $stateParams, ScrollingListService, listServiceInstance;

  beforeEach(module('risevision.apps.billing.controllers'));

  beforeEach(module(function ($provide) {
    $provide.service('$loading', function () {
      return {
        start: sandbox.stub(),
        stop: sandbox.stub()
      };
    });
    $provide.service('ScrollingListService', function () {
      return sinon.stub().returns(listServiceInstance);
    });
    $provide.service('billing', function () {
      return {
        getUnpaidInvoices: 'getUnpaidInvoices'
      };
    });
    $provide.value('billingFactory', {
    });
    $provide.value('$stateParams', {
      cid: 'companyId',
      token: 'token'
    });
  }));

  beforeEach(inject(function($injector, $rootScope, $controller) {
    $scope = $rootScope.$new();
    $loading = $injector.get('$loading');
    ScrollingListService = $injector.get('ScrollingListService');

    $controller('UnpaidInvoicesCtrl', {
      $scope: $scope
    });
    $scope.$digest();
  }));

  afterEach(function () {
    sandbox.restore();
  });

  it('should exist',function () {
    expect($scope).to.be.ok;
    expect($scope.billingFactory).to.be.ok;

    expect($scope.unpaidInvoices).to.be.ok;
  });
  
  it('should init list service', function() {
    ScrollingListService.should.have.been.calledWith('getUnpaidInvoices', {
      name: 'Unpaid Invoices',
      companyId: 'companyId',
      token: 'token'
    });
  });

  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loading.stop.should.have.been.calledWith('unpaid-invoice-loader');
    });

    it('should start spinner', function(done) {
      $scope.unpaidInvoices.loadingItems = true;
      $scope.$digest();
      setTimeout(function() {
        $loading.start.should.have.been.calledWith('unpaid-invoice-loader');

        done();
      }, 10);
    });
  });

});
