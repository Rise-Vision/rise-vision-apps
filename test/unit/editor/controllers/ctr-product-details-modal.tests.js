'use strict';
describe('controller: ProductDetailsModalController', function() {
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
    $provide.service('checkTemplateAccess',function(){
      return sinon.spy(function () {
        return storeAuthorize ? Q.resolve() : Q.reject();
      });
    });
    $provide.service('$loading',function(){
      return $loading = {
        start: sinon.spy(),
        stop: sinon.spy()
      };
    });
    $provide.service('plansFactory', function(){
      return {
        showPlansModal: function() {}
      }
    })
  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy, product,
    $loading, checkTemplateAccessSpy, storeAuthorize;
  
  function initController(paymentTerms) {
    inject(function($injector,$rootScope, $controller, checkTemplateAccess){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');

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
  });

  it('should retrieve premium product status',function(){
    initController('premium');

    expect($scope.canUseProduct).to.be.false;
    $loading.start.should.have.been.calledWith('loading-price');
    checkTemplateAccessSpy.should.have.been.called;
  });

  it('should allow owned products',function(done){
    storeAuthorize = true;
    initController('premium');
    
    checkTemplateAccessSpy.should.have.been.called;
    setTimeout(function() {
      expect($scope.canUseProduct).to.be.true;
      $loading.stop.should.have.been.calledWith('loading-price');
      done();
    }, 10);
  });

  it('should not enable not owned products',function(done){
    storeAuthorize = false;
    initController('premium');

    setTimeout(function() {
      expect($scope.canUseProduct).to.be.false;

      $loading.stop.should.have.been.calledWith('loading-price');
      done();
    }, 10);
  });

});
