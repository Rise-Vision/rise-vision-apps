'use strict';

describe('controller: Store Products Modal', function() {
  beforeEach(module('risevision.common.components.store-products'));
  beforeEach(module(function ($provide) {
    $provide.service('ScrollingListService', function() {
      return function() {
        return scrollingListService;
      };
    });
    $provide.service('productsFactory',function(){
      return {
        loadProducts: function(){
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
    $provide.factory("$filter", function() {
      return function() { return sinon.stub(); };
    });
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
    $provide.value('addWidgetByUrl', playlistItemAddWidgetByUrlSpy = sinon.spy());
    $provide.service('$modal',function(){
      return {
        open: function(func){
          return {
            result:{
              then:function(func){
                expect(func).to.be.a('function');
                func();
              }
            }
          }
        }
      };
    });
    
  }));
  
  var $scope, $loading, $loadingStartSpy, $loadingStopSpy;
  var $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy, $q;
  var $modal, playlistItemAddWidgetByUrlSpy, scrollingListService;

  function initController(paymentTerms) {
    scrollingListService = {
      search: {},
      loadingItems: false,
      doSearch: function() {},
      items: {
        list: []
      }
    };

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      $q = $injector.get('$q');
      $modal = $injector.get('$modal');
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');
      $loading = $injector.get('$loading');
      $loadingStartSpy = sinon.spy($loading, 'start');
      $loadingStopSpy = sinon.spy($loading, 'stop');
      $controller('storeContentModal', {
        $scope : $scope,
        $modalInstance : $modalInstance,
        productsFactory: $injector.get('productsFactory'),
        ScrollingListService: $injector.get('ScrollingListService'),
        $loading: $loading
      });
      $scope.$digest();
    });
  }

  it('should exist',function(){
    initController();
    expect($scope).to.be.ok;
    
    expect($scope.factory).to.be.ok;
    expect($scope.factory.loadingItems).to.be.false;
    expect($scope.search).to.be.ok;
    expect($scope.filterConfig).to.be.ok;

    expect($scope.select).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
    expect($scope.addWidgetByUrl).to.be.a('function');
  });

  it('should init the scope objects',function(){
    initController();
    expect($scope.search).to.be.ok;
    expect($scope.search).to.have.property('category');
    expect($scope.search.count).to.equal(1000);
    // mocks search function for client side search
    expect($scope.search.doSearch).to.be.a('function');
  });

  describe('$loading: ', function() {
    beforeEach(function(){
      initController();
    });

    it('should stop spinner', function() {
      $loadingStopSpy.should.have.been.calledWith('product-list-loader');
    });
    
    it('should start spinner', function(done) {
      $scope.factory.loadingItems = true;
      $scope.$digest();
      setTimeout(function() {
        $loadingStartSpy.should.have.been.calledWith('product-list-loader');
        
        done();
      }, 10);
    });
  });

  describe('$modalInstance functionality: ', function() {
    beforeEach(function(){
      initController();
    });

    it('should exist',function(){
      expect($scope).to.be.truely;
      
      expect($scope.select).to.be.a('function');
      expect($scope.dismiss).to.be.a('function');
    });

    it('select: should close modal and pass product when return',function(){
      var product = {paymentTerms: 'free'};
      $scope.select(product);

      $modalInstanceCloseSpy.should.have.been.calledWith(product);
    });

    it('should dismiss modal when clicked on close with no action',function(){
      $scope.dismiss();

      $modalInstanceDismissSpy.should.have.been.called;
    });

    it('should dismiss modal and open add WidgetByUrl modal',function(){
      $scope.addWidgetByUrl();

      $modalInstanceDismissSpy.should.have.been.called;
      playlistItemAddWidgetByUrlSpy.should.have.been.called;
    })
  });

});
