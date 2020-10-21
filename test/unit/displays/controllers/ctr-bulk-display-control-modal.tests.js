'use strict';
describe('controller: bulk display control modal', function() {
  var sandbox;

  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('displayControlFactory',function() {
      return {
        getDefaultConfiguration: sandbox.stub().returns('default contents')
      };
    });  
    $provide.service('$modalInstance',function() {
      return {
        dismiss: sandbox.stub(),
        close: sandbox.stub()
      }
    });
  }));
  var $scope, $modalInstance, displayControlFactory, $controller;
  beforeEach(function() {   
    sandbox = sinon.sandbox.create();

    inject(function($injector, $rootScope, _$controller_) {
      $scope = $rootScope.$new();

      displayControlFactory = $injector.get('displayControlFactory');
      $modalInstance = $injector.get('$modalInstance');


      $controller = _$controller_;
      $controller('BulkDisplayControlModalCtrl', {
        $scope : $scope,
        displayControlFactory: displayControlFactory,
        $modalInstance: $modalInstance
      });

      $scope.$digest();
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.truely;
    expect($scope.saveConfiguration).to.be.a('function');
    expect($scope.resetForm).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
    expect($scope.formData).to.be.ok;
    expect($scope.formData.displayControlContents).to.be.ok;
  });
 
  it('should initialize using default content', function() {
    expect($scope.formData.displayControlContents).to.be.equal('default contents');
  });

  it('should dismiss modal', function() {
    $scope.dismiss();
    $modalInstance.dismiss.should.have.been.called;
  });

  describe('saveConfiguration:', function() {
    it('should close the modal and return contents', function() {
      $scope.formData.displayControlContents = 'contents';

      $scope.saveConfiguration()

      $modalInstance.close.should.have.been.calledWith($scope.formData.displayControlContents);      
    });
  });

  describe('resetForm:', function() {
    it('should reset form', function() {
      $scope.formData.displayControlContents = '';
      $scope.resetForm();

      displayControlFactory.getDefaultConfiguration.should.have.been.called;
      expect($scope.formData.displayControlContents).to.be.equal('default contents');
    });
  });

});
