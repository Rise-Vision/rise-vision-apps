'use strict';
describe('controller: ProductDetailsModalController', function() {
  var STORE_URL = 'https://store.risevision.com';
  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance',function(){
      return {
        close : function(){},
        dismiss : function(){}
      }
    });
    $provide.service('userState',function(){
      return {
        getCopyOfUserCompany : function(){
          return {        
          };
        }
      }
    });
    $provide.service('currencyService',function(){
      return function(){
        return Q.resolve({
          getByCountry: function() {
            return {
              getName: function() { return 'CAD'},
              pickPrice: function(usd, cad) {
                return cad
              }
            }
          }
        })
      };
    });
    $provide.service('storeAuthorization',function(){
      return {
        check: function(arg){
          if (storeAuthorize) {
            console.log("resolve")
            return Q.resolve();
          } else {
            console.log("reject")
            return Q.reject();  
          }          
        }
      };
    });
    $provide.service('checkTemplateAccess',function(){
      return sinon.spy(function () {
        return storeAuthorize ? Q.resolve() : Q.reject();
      });
    });
    $provide.service('$loading',function(){
      return {
        stop: function(){}
      };
    });
    $provide.service('planFactory', function(){
      return {
        showPlansModal: function() {}
      }
    })
    $provide.value('STORE_URL',STORE_URL);
  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy, product,
    $loadingStopSpy, $timeout, storeCheckSpy, checkTemplateAccessSpy, storeAuthorize, TEMPLATE_LIBRARY_PRODUCT_CODE,
    planFactory;
  
  function initController(paymentTerms) {
    inject(function($injector,$rootScope, $controller, $loading, storeAuthorization, checkTemplateAccess){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      $timeout = $injector.get('$timeout');
      TEMPLATE_LIBRARY_PRODUCT_CODE = $injector.get('TEMPLATE_LIBRARY_PRODUCT_CODE');
      planFactory = $injector.get('planFactory');

      $loadingStopSpy = sinon.spy($loading,'stop');

      storeCheckSpy = sinon.spy(storeAuthorization,'check');
      checkTemplateAccessSpy = checkTemplateAccess;
      
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');

      product = {
        paymentTerms: paymentTerms ? paymentTerms: 'free', 
        productCode: '1', 
        pricing:[
          {
            priceUSD: '10',
            priceCAD: '12'
          }
        ]
      };

      $controller('ProductDetailsModalController', {
        $scope: $scope,
        $modalInstance: $modalInstance,
        product: product
      });
      $scope.$digest();
    });
  }
  
  it('should exist',function(){
    initController();
    expect($scope).to.be.ok;
    expect($scope.select).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
    expect($scope.product).to.equal(product);
    expect($scope.storeUrl).to.equal(STORE_URL);
  });

  it('should close modal on select',function(){
    initController();
    $scope.select();
    $modalInstanceCloseSpy.should.have.been.calledWith(product);
  });

  it('should dismiss modal',function(){
    initController();
    $scope.dismiss();
    $modalInstanceDismissSpy.should.have.been.called;
  });

  it('should allow free product',function(){
    initController();
    
    expect($scope.canUseProduct).to.be.true;
    $timeout.flush();
    $loadingStopSpy.should.have.been.calledWith('loading-price');
  });

  it('should retrieve premium product status',function(){
    initController('premium');
    
    expect($scope.canUseProduct).to.be.false;
    checkTemplateAccessSpy.should.have.been.called;
  });

  it('should allow owned products',function(done){
    storeAuthorize = true;
    initController('premium');
    
    checkTemplateAccessSpy.should.have.been.called;
    setTimeout(function() {
      expect($scope.canUseProduct).to.be.true;
      $loadingStopSpy.should.have.been.calledWith('loading-price');
      done();
    }, 10);
  });

  it('should show details and not enable not owned products',function(done){
    storeAuthorize = false;
    initController('premium');

    setTimeout(function() {
      expect($scope.canUseProduct).to.be.false;

      expect($scope.currencyName).to.equal('CAD');
      expect($scope.price).to.equal('12');

      $loadingStopSpy.should.have.been.calledWith('loading-price');
      done();
    }, 10);
  });

});
