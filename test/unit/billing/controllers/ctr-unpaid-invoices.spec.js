'use strict';

describe('controller: UnpaidInvoicesCtrl', function () {
  var sandbox = sinon.sandbox.create();
  var $scope, $stateParams, ScrollingListService, listServiceInstance;

  beforeEach(module('risevision.apps.billing.controllers'));

  beforeEach(module(function ($provide) {
    $provide.service('ScrollingListService', function () {
      return sinon.stub().returns(listServiceInstance);
    });
    $provide.service('billing', function () {
      return {
        getUnpaidInvoices: 'getUnpaidInvoices'
      };
    });
    $provide.value('invoiceFactory', {
    });
    $provide.value('$stateParams', {
      cid: 'companyId',
      token: 'token'
    });
  }));

  beforeEach(inject(function($injector, $rootScope, $controller) {
    $scope = $rootScope.$new();
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
    expect($scope.invoiceFactory).to.be.ok;

    expect($scope.unpaidInvoices).to.be.ok;
  });
  
  it('should init list service', function() {
    ScrollingListService.should.have.been.calledWith('getUnpaidInvoices', {
      name: 'Unpaid Invoices',
      companyId: 'companyId',
      token: 'token'
    });
  });

});
