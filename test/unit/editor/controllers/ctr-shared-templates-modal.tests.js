'use strict';
describe('controller: Shared Templates Modal', function() {
  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module(function ($provide) {
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
    $provide.service('$loading',function(){
      return {
        start : function(spinnerKeys){
          return;
        },
        stop : function(spinnerKeys){
          return;
        }
      }
    });
    $provide.service('ScrollingListService', function() {
      return function() {
        return scrollingListService
      };
    });
    $provide.service('template',function(){
      return {
        list : function(){
        }
      }
    });
    $provide.service('editorFactory',function(){
      return {}
    });
    $provide.value('translateFilter', function(){
      return function(key){
        return key;
      };
    });
  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy, 
    $loading,  $loadingStartSpy, $loadingStopSpy, scrollingListService;
  beforeEach(function(){
    scrollingListService = {
      search: {},
      loadingItems: false,
      doSearch: function() {}
    };
    inject(function($injector, $rootScope, $controller){
      $scope = $rootScope.$new();
      $loading = $injector.get('$loading');
      $loadingStartSpy = sinon.spy($loading, 'start');
      $loadingStopSpy = sinon.spy($loading, 'stop');

      $modalInstance = $injector.get('$modalInstance');
      $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      
      $controller('SharedTemplatesModalController', {
        $scope : $scope,
        $modalInstance : $modalInstance        
      });
      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.ok;
    
    expect($scope.factory).to.be.ok;
    expect($scope.factory.loadingItems).to.be.false;
    expect($scope.editorFactory).to.be.ok;
    expect($scope.search).to.be.ok;
    expect($scope.filterConfig).to.be.ok;

    expect($scope.select).to.be.a('function');
  });

  it('should init the scope objects',function(){
    expect($scope.search).to.be.ok;
    expect($scope.search).to.have.property('sortBy');
    expect($scope.search).to.have.property('reverse');
  });

  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loadingStopSpy.should.have.been.calledWith('template-list-loader');
    });
    
    it('should start spinner', function(done) {
      $scope.factory.loadingItems = true;
      $scope.$digest();
      setTimeout(function() {
        $loadingStartSpy.should.have.been.calledWith('template-list-loader');
        
        done();
      }, 10);
    });
  });

  it('should close modal and pass templateId on select',function(){
    $scope.select('templateId');
    $modalInstanceCloseSpy.should.have.been.calledWith('templateId');
  });

  it('should dismiss modal when clicked on close with no action',function(){
    $scope.dismiss();

    $modalInstanceDismissSpy.should.have.been.called;
  });


});
