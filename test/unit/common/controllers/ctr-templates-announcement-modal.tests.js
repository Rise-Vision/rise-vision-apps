'use strict';
describe('controller: TemplatesAnnouncementModalCtrl', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.apps.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance',function(){
      return {
        close : sandbox.stub()
      }
    }); 
    $provide.service('userState',function(){
      return {
        getCopyOfProfile : sandbox.stub().returns({firstName:'myFirstName'})
      }
    });    
  }));
  var $scope, $modalInstance;

  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      
      $controller('TemplatesAnnouncementModalCtrl', {
        $scope: $scope,
        $modalInstance : $modalInstance
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.thumbsUp).to.be.a('function');
    expect($scope.thumbsDown).to.be.a('function');
    expect($scope.name).to.be.ok;
  });

  it('should init user first name',function(){
    expect($scope.name).to.equal('myFirstName');
  })

  it('should close modal on thumbs up and resolve a true value',function(){
      $scope.thumbsUp();
      expect($modalInstance.close).to.have.been.been.calledWith(true);
  });

  it('should close modal on thumbs down and resolve a false value',function(){
      $scope.thumbsDown();
      expect($modalInstance.close).to.have.been.been.calledWith(false);
  });
  
});
