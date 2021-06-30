'use strict';
describe('controller: InvoiceCtrl', function () {
  var sandbox = sinon.sandbox.create();
  var $scope, invoiceFactory;

  beforeEach(module('risevision.apps.billing.controllers'));

  beforeEach(module(function ($provide) {
    $provide.value('invoiceFactory', {
      payInvoice: sandbox.spy(),
      invoice: {}
    });

  }));

  beforeEach(inject(function($injector, $rootScope, $controller) {
    $scope = $rootScope.$new();
    invoiceFactory = $injector.get('invoiceFactory');

    $scope.form = {
      paymentMethodsForm: {}
    };

    $controller('InvoiceCtrl', {
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

    expect($scope.completeCardPayment).to.be.a('function');
  });

  describe('completeCardPayment:', function() {
    it('should not pay invoice if form is invalid', function() {
      $scope.completeCardPayment();

      invoiceFactory.payInvoice.should.not.have.been.called;
    });

    it('should pay invoice', function() {
      $scope.form.paymentMethodsForm.$valid = true;

      $scope.completeCardPayment();

      invoiceFactory.payInvoice.should.have.been.called;
    });
  });

});
