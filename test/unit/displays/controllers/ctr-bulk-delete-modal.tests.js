'use strict';
describe('controller: bulk delete modal', function() {
  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance',function() {
      return {
        dismiss: sandbox.stub(),
        close: sandbox.stub()
      }
    });
    $provide.service('userState', function() {
      return {
        getSelectedCompanyId: sandbox.stub().returns('companyId')
      };
    });
  }));

  var sandbox, $scope, $modalInstance, userState, $controller, selectedItems;

  beforeEach(function() {   
    sandbox = sinon.sandbox.create();
    selectedItems = [
      {id: 'display1', companyId: 'companyId'},
      {id: 'display2', companyId: 'subCompanyId'},
      {id: 'display3', companyId: 'subCompanyId'}
    ];

    inject(function($injector, $rootScope, _$controller_) {
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      userState = $injector.get('userState');
      $controller = _$controller_;

      $controller('BulkDeleteModalCtrl', {
        $scope : $scope,
        $modalInstance: $modalInstance,
        userState: userState,
        selectedItems: selectedItems
      });

      $scope.$digest();
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.companyDisplays).to.be.ok;
    expect($scope.subCompanyDisplays).to.be.ok;
    expect($scope.expectedText).to.be.ok;
    expect($scope.inputText).to.be.null;
    expect($scope.delete).to.be.a('function');
    expect($scope.cancel).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
  });

  it('should count company and subcompany displays', function() {
    expect($scope.companyDisplays).to.equal(1);
    expect($scope.subCompanyDisplays).to.equal(2);
    expect($scope.expectedText).to.equal('3');
  });
  
  describe('delete:', function() {
    it('should close modal if inputText matches expectedText',function(){
      $scope.inputText = '3';
      $scope.expectedText = '3';
      $scope.delete();
      $scope.$digest();
      $modalInstance.close.should.have.been.called;
    });

    it('should not proceed if inputText and expectedText don\'t match',function(){
      $scope.inputText = '2';
      $scope.expectedText = '3';
      $scope.delete();
      $scope.$digest();

      $modalInstance.close.should.not.have.been.called;
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
