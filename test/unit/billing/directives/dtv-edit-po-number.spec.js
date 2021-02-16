'use strict';

describe('directive: edit po number', function() {
  beforeEach(module('risevision.apps.billing.directives'));
  var $rootScope, $scope, form, element;

  beforeEach(inject(function($compile, _$rootScope_, $templateCache){
    $rootScope = _$rootScope_;
    $templateCache.put('partials/billing/edit-po-number.html', '<p>mock</p>');
    $rootScope.item = {};
    $rootScope.updatePoNumber = sinon.stub().returns(Q.resolve());

    element = angular.element('<edit-po-number item="item" update-function="updatePoNumber()"></edit-po-number>');
    $compile(element)($rootScope);

    $rootScope.$digest();
    
    $scope = element.isolateScope();
  }));

  it('should replace the element with the appropriate content', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  it('should exist', function() {
    expect($scope.updateFunction).to.be.a('function');
    expect($scope.item).to.be.a('object');

    expect($scope.updatePoNumber).to.be.a('function');
    expect($scope.hideEditForm).to.be.a('function');
  });

  describe('updatePoNumber:', function() {
    it('should set poNumber to blank string if null', function() {
      $scope.updatePoNumber();

      expect($rootScope.item.poNumber).to.equal('');
    });

    it('should update the invoice and hide the edit form', function(done) {
      $scope.editPoNumber = true;
      $scope.updatePoNumber();

      $rootScope.updatePoNumber.should.have.been.called;

      setTimeout(function() {
        expect($scope.editPoNumber).to.be.false;

        done();
      }, 10);
    });

    it('should not hide the edit form on errors', function(done) {
      $rootScope.updatePoNumber.returns(Q.reject());
      $scope.editPoNumber = true;
      $scope.updatePoNumber();

      $rootScope.updatePoNumber.should.have.been.called;

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
