'use strict';
describe('controller: widget modal', function() {
  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module(function ($provide) {
    widget = {
      url: 'widget.url',
      additionalParams: 'test'
    };
    $provide.service('$modalInstance',function(){
      return {
        close : function(){
          return;
        },
        dismiss : function(action){
          return;
        }
      }
    });
    $provide.service('gadgetsApi',function(){
      return gadgetsApi;
    });
    
  }));
  var $scope, $timeout, $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy, widget, gadgetsApi;

  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      gadgetsApi = {
        rpc: {
          register : function(functionName, functionCall){
            gadgetsApi.functions[functionName] = functionCall;
          },
          setupReceiver : function(receiver){
            gadgetsApi.receiver = receiver;
          }          
        },
        functions: {}
      };
      
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');

      $timeout = $injector.get('$timeout');

      $controller('widgetModal', {
        $scope: $scope,
        $timeout: $timeout,
        $modalInstance : $modalInstance,
        widget: widget,
        gadgetsApi: $injector.get('gadgetsApi')
      });
      $scope.$digest();
    });
  });
  
  beforeEach(function() {
    $timeout.flush();
  })
  
  it('should exist',function(){
    expect($scope).to.be.truely;
    expect($scope.widgetUrl).to.ok;
  });

  it('should initialize RPC',function() {
    expect(gadgetsApi.rpc.register).to.be.a('function');
    expect(gadgetsApi.rpc.setupReceiver).to.be.a('function');

    expect(gadgetsApi.receiver).to.equal('widget-modal-frame');
    
    expect(gadgetsApi.functions).to.be.an('object');
    expect(gadgetsApi.functions).to.have.property('rscmd_saveSettings');
    expect(gadgetsApi.functions).to.have.property('rscmd_closeSettings');
    expect(gadgetsApi.functions).to.have.property('rscmd_getAdditionalParams');
  });
  
  it('should load additionalParams', function() {
    expect(gadgetsApi.functions['rscmd_getAdditionalParams']()).to.equal('test');
  })
  
  it('should close settings', function() {
    gadgetsApi.functions['rscmd_closeSettings']();
    
    $modalInstanceDismissSpy.should.have.been.called;
  });
  
  it('should save settings', function() {
    gadgetsApi.functions['rscmd_saveSettings']('params');
    
    $modalInstanceCloseSpy.should.have.been.called;
    $modalInstanceCloseSpy.should.have.been.calledWith('params');
  });

});
