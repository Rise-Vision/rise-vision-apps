'use strict';

describe('controller: Store Templates Modal', function() {
  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranslate()));
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
    $provide.service('playlistItemFactory',function(){
      return {
        addWidgetByUrl : function(){}
      }
    });
    $provide.service('templateCategoryFilter', function() {
      return function(list, category) {
        return category;
      };
    });
    $provide.service('userState',function(){
      return {
        isEducationCustomer : function(){ return isEducationCustomer; },
        _restoreState: function(){}
      }
    });
    
  }));
  
  var $scope, $loading, $loadingStartSpy, $loadingStopSpy;
  var $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy, $q;
  var $modal, playlistItemAddWidgetByUrlSpy, scrollingListService;
  var isEducationCustomer = false;


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
      var playlistItemFactory = $injector.get('playlistItemFactory');
      playlistItemAddWidgetByUrlSpy = sinon.spy(playlistItemFactory, 'addWidgetByUrl');
      $loading = $injector.get('$loading');
      $loadingStartSpy = sinon.spy($loading, 'start');
      $loadingStopSpy = sinon.spy($loading, 'stop');
      $controller('storeTemplatesModal', {
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
    expect($scope.isEducationCustomer).to.be.false;

    expect($scope.getTemplatesFilter).to.be.a('function');
    expect($scope.select).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
  });

  it('should init the scope objects',function(){
    initController();
    expect($scope.search).to.be.ok;
    expect($scope.search).to.have.property('category');
    expect($scope.search.count).to.equal(1000);
    // mocks search function for client side search
    expect($scope.search.doSearch).to.be.a('function');
  });

  describe('isEducationCustomer:',function(){   
    it('should return userstate isEducationCustomer response for education customers',function(){
      isEducationCustomer = true;
      initController();
      expect($scope.isEducationCustomer).to.be.true;
    });

    it('should return userstate isEducationCustomer response for non-education customers',function(){
      isEducationCustomer = false;
      initController();
      expect($scope.isEducationCustomer).to.be.false;
    });
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

    describe('templateCategories:', function() {
      it('should not populate categories if list is empty', function() {
        expect($scope.categoryFilters).to.not.be.ok;
      });

      it('should populate categories when list is loaded', function(done) {
        $scope.factory.items.list = ['product'];
        $scope.factory.loadingItems = null;
        $scope.$digest();
        setTimeout(function() {
          expect($scope.categoryFilters).to.deep.equal({
            templateCategories: 'templateCategories',
            templateLocations: 'templateLocations',
            templateContentTypes: 'templateContentTypes'
          });

          done();
        }, 10);
      });
    });

  });

  describe('getTemplatesFilter:', function() {
    it('should return a filter object with the category and value selected', function() {
      $scope.search.templatesFilter = 'templateCategories|sampleCategory';

      expect($scope.getTemplatesFilter()).to.deep.equal({
        templateCategories: 'sampleCategory'
      });
    });

    it('should return a blank filter if nothing is selected', function() {
      $scope.search.templatesFilter = null;

      expect($scope.getTemplatesFilter()).to.deep.equal({});
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

    it('quickSelect: should close modal when clicked',function(done){
      var product = {paymentTerms: 'free'};
      $scope.quickSelect(product);

      setTimeout(function() {
        $modalInstanceCloseSpy.should.have.been.calledWith(product);
        done();
      }, 0);
    });

    it('select: should show Template details',function(){
      var modalOpenSpy = sinon.spy($modal, 'open');
      var product = {paymentTerms: 'free'};
      $scope.select(product);

      modalOpenSpy.should.have.been.called;
     
      expect(modalOpenSpy.getCall(0).args[0].templateUrl).to.equal('partials/editor/product-details-modal.html');
      expect(modalOpenSpy.getCall(0).args[0].controller).to.equal('ProductDetailsModalController');
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

  });

});
