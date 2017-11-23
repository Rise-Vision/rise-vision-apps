'use strict';
describe('controller: player pro trial modal', function() {
  var displayId = 1234;
  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module('risevision.displays.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('playerProFactory',function(){
      return {
        startPlayerProTrial : function(){
          return Q.resolve();
        },
        getProductLink: function() {
          return 'productLink';
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
    $provide.service('userState',function(){
      return {
          getSelectedCompanyId: function() {return "company1"},
          _restoreState: function(){}
      };
    });
  }));
  var $scope, playerProFactory, $modalInstanceDismissSpy, $modalInstanceCloseSpy;
  beforeEach(function(){   
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      playerProFactory = $injector.get('playerProFactory');
      var $modalInstance = $injector.get('$modalInstance');
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');

      $controller('PlayerProInfoModalCtrl', {
        $scope : $scope,
        playerProFactory: playerProFactory,
        $modalInstance: $modalInstance,
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.truely;
    expect($scope.startTrial).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
    expect($scope.productLink).to.be.ok;
    expect($scope.accountLink).to.be.ok;
  });
  
  it('should initialize', function() {
    expect($scope.productLink).to.equal('productLink');
    expect($scope.accountLink).to.equal('https://store.risevision.com/account?cid=company1');
  });

  it('should dismiss modal when clicked on close with no action',function(){
    $scope.dismiss();

    $modalInstanceDismissSpy.should.have.been.called;
  });

  describe('startTrial:',function(){
    it('should start trial',function(done){
      var playerProFactorySpy = sinon.spy(playerProFactory,'startPlayerProTrial')

      $scope.startTrial();

      playerProFactorySpy.should.have.been.called;
      setTimeout(function() {
        $modalInstanceCloseSpy.should.have.been.called;
        done();
      }, 10);
    });

    it('should start trial',function(done){
      var playerProFactorySpy = sinon.stub(playerProFactory,'startPlayerProTrial', function(){return Q.reject();})

      $scope.startTrial();

      playerProFactorySpy.should.have.been.called;
      setTimeout(function() {
        $modalInstanceCloseSpy.should.not.have.been.called;
        done();
      }, 10);
    });
  });

});
