'use strict';
describe('controller: Storage Selector IFrame', function() {
  beforeEach(module('risevision.storage.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('gadgetsApi',function(){
      return gadgetsApi = {
        rpc: {
          call: function() {}
        }
      };
    });
    $provide.service('storageUtils', function() {
      return {
        getFileUrls: function(files) {
          return [files + ' urls'];
        }
      }
    });
    $provide.value('selectorType', 'type');
    $provide.value('selectorFilter', 'filter');
  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy, $window, gadgetsApi;
  beforeEach(function(){
    
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $window = $injector.get('$window');
      $controller('StorageSelectorIFrameController', {
        $scope : $scope,
        $modalInstance : $modalInstance,
      });
      $scope.$digest();
      
      sinon.spy(gadgetsApi.rpc, 'call');
      sinon.spy($window.parent, "postMessage");
    });
  });
  
  afterEach(function() {
    gadgetsApi.rpc.call.restore();
    $window.parent.postMessage.restore();
  })
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    
    expect($scope.selectorType).to.equal('type');
    expect($scope.selectorFilter).to.equal('filter');

    expect($scope.dismiss).to.be.a('function');
  });
  
  it('should receive FileSelectAction event and postMessage/send rpc', function() {
    $scope.$broadcast('FileSelectAction', 'files');

    gadgetsApi.rpc.call.should.have.been.calledWith('', 'rscmd_saveSettings', null,
      {params: 'files urls'});
      
    // postMessage receives an array of file paths and a '*' as second parameter
    $window.parent.postMessage.should.have.been.calledWith(['files urls'], '*');
  });

  it('dismiss: should send close', function() {
    $scope.dismiss();

    gadgetsApi.rpc.call.should.have.been.calledWith('', 'rscmd_closeSettings', null);
      
    $window.parent.postMessage.should.have.been.calledWith("close", "*");      
  });

});
