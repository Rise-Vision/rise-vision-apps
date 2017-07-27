'use strict';
describe('controller: player pro trial modal', function() {
  var displayId = 1234;
  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module('risevision.displays.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('displayFactory',function(){
      return {
        startPlayerProTrial : function(){
          return Q.resolve();
        }
      };
    });    
    $provide.service('$modalInstance',function(){
      return {
        dismiss : function(action){
          return;
        },
        close : function(action){
          return;
        }
      }
    });
  }));
  var $scope, displayFactory, $modalInstanceDismissSpy, $modalInstanceCloseSpy;
  beforeEach(function(){   
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      displayFactory = $injector.get('displayFactory');
      var $modalInstance = $injector.get('$modalInstance');
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');

      $controller('PlayerProTrialModalCtrl', {
        $scope : $scope,
        displayFactory: displayFactory,
        $modalInstance: $modalInstance,
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.truely;
    expect($scope.startTrial).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
  });

  it('should dismiss modal when clicked on close with no action',function(){
    $scope.dismiss();

    $modalInstanceDismissSpy.should.have.been.called;
  });

  describe('startTrial:',function(){
    it('should start trial',function(done){
      var displayFactorySpy = sinon.spy(displayFactory,'startPlayerProTrial')

      $scope.startTrial();

      displayFactorySpy.should.have.been.called;
      setTimeout(function() {
        $modalInstanceCloseSpy.should.have.been.called;
        done();
      }, 10);
    });

    it('should start trial',function(done){
      var displayFactorySpy = sinon.stub(displayFactory,'startPlayerProTrial', function(){return Q.reject();})

      $scope.startTrial();

      displayFactorySpy.should.have.been.called;
      setTimeout(function() {
        $modalInstanceCloseSpy.should.not.have.been.called;
        done();
      }, 10);
    });
  });

});
