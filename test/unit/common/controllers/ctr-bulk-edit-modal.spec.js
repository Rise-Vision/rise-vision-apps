'use strict';
describe('controller: BulkEditModalCtrl', function() {
  beforeEach(module('risevision.apps.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance',function() {
      return {
        dismiss: sandbox.stub(),
        close: sandbox.stub()
      }
    });
  }));

  var sandbox, $scope, $modalInstance, $controller, baseModel;

  beforeEach(function() {   
    sandbox = sinon.sandbox.create();
    baseModel = { id: 'item1', name: 'companyId' };

    inject(function($injector, $rootScope, _$controller_) {
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      $controller = _$controller_;

      $controller('BulkEditModalCtrl', {
        $scope : $scope,
        $modalInstance: $modalInstance,
        baseModel: baseModel,
        title: 'title',
        partial: 'partial'
      });

      $scope.$digest();
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.baseModel).to.equal(baseModel);
    expect($scope.title).to.equal('title');
    expect($scope.partial).to.equal('partial');
    expect($scope.save).to.be.a('function');
    expect($scope.cancel).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
  });
  
  describe('save:', function() {
    it('should close modal with resolving baseModel',function(){
      $scope.save();
      $scope.$digest();
      $modalInstance.close.should.have.been.calledWith(baseModel);
    });
  });

  it('should dismiss modal when clicked cancel with a cancel action',function(){
    $scope.cancel();
    $scope.$digest();
    $modalInstance.dismiss.should.have.been.calledWith('cancel');
  });

  it('should dismiss modal when clicked on close with no action',function(){
    $scope.dismiss();
    $scope.$digest();
    $modalInstance.dismiss.should.have.been.calledWith();
  });

});
