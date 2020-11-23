'use strict';
describe('controller: InvoiceCtrl', function () {
  var sandbox = sinon.sandbox.create();
  var $scope, $loading;

  beforeEach(module('risevision.apps.billing.controllers'));

  beforeEach(module(function ($provide) {
    $provide.service('$loading', function () {
      return {
        start: sandbox.stub(),
        stop: sandbox.stub()
      };
    });

    $provide.service('billingFactory', function () {
      return {};
    });
  }));

  beforeEach(inject(function($injector, $rootScope, $controller) {
    $scope = $rootScope.$new();
    $loading = $injector.get('$loading');

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


});
