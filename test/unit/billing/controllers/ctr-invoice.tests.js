'use strict';
describe('controller: InvoiceCtrl', function () {
  var sandbox = sinon.sandbox.create();
  var $scope, $loading, billingFactory;

  beforeEach(module('risevision.apps.billing.controllers'));

  beforeEach(module(function ($provide) {
    $provide.service('$loading', function () {
      return {
        start: sandbox.stub(),
        stop: sandbox.stub()
      };
    });

    $provide.value('billingFactory', {
      payInvoice: sandbox.spy(),
      updateInvoice: sandbox.stub().returns(Q.resolve()),
      invoice: {}
    });

    $provide.service('helpWidgetFactory', function () {
      return {};
    });
  }));

  beforeEach(inject(function($injector, $rootScope, $controller) {
    $scope = $rootScope.$new();
    $loading = $injector.get('$loading');
    billingFactory = $injector.get('billingFactory');

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

    expect($scope.billingFactory).to.be.ok;
    expect($scope.helpWidgetFactory).to.be.ok;

    expect($scope.completeCardPayment).to.be.a('function');
    expect($scope.updatePoNumber).to.be.a('function');
    expect($scope.hideEditForm).to.be.a('function');
  });
  
  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loading.stop.should.have.been.calledWith('invoice-loader');
    });

    it('should start spinner', function(done) {
      $scope.billingFactory.loading = true;
      $scope.$digest();
      setTimeout(function() {
        $loading.start.should.have.been.calledWith('invoice-loader');

        done();
      }, 10);
    });
  });

  describe('completeCardPayment:', function() {
    it('should not pay invoice if form is invalid', function() {
      $scope.completeCardPayment();

      billingFactory.payInvoice.should.not.have.been.called;
    });

    it('should pay invoice', function() {
      $scope.form.paymentMethodsForm.$valid = true;

      $scope.completeCardPayment();

      billingFactory.payInvoice.should.have.been.called;
    });
  });

  describe('updatePoNumber:', function() {
    it('should set poNumber to blank string if null', function() {
      $scope.updatePoNumber();

      expect(billingFactory.invoice.poNumber).to.equal('');
    });

    it('should update the invoice and hide the edit form', function(done) {
      $scope.editPoNumber = true;
      $scope.updatePoNumber();

      billingFactory.updateInvoice.should.have.been.called;

      setTimeout(function() {
        expect($scope.editPoNumber).to.be.false;

        done();
      }, 10);
    });

    it('should not hide the edit form on errors', function(done) {
      billingFactory.updateInvoice.returns(Q.reject());
      $scope.editPoNumber = true;
      $scope.updatePoNumber();

      billingFactory.updateInvoice.should.have.been.called;

      setTimeout(function() {
        expect($scope.editPoNumber).to.be.true;

        done();
      }, 10);
    });

  });

  it('hideEditForm:', function() {
    $scope.editPoNumber = true;

    $scope.hideEditForm();

    expect($scope.editPoNumber).to.be.false;
  });

});
