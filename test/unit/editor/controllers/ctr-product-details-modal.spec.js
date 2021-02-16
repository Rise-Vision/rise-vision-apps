'use strict';
describe('controller: ProductDetailsModalController', function() {
  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance',function(){
      return {
        close : sinon.stub(),
        dismiss : sinon.stub()
      }
    });
    $provide.service('presentationUtils',function(){
      return {
        isHtmlTemplate : function(){
          return htmlTemplate;
        }
      }
    });
  }));
  var $scope, $modalInstance, product, htmlTemplate;

  function initController(paymentTerms) {
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');

      product = {
        productCode: '1'
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
    $modalInstance.close.should.have.been.calledWith(product);
  });

  it('should dismiss modal',function(){
    initController();
    $scope.dismiss();
    $modalInstance.dismiss.should.have.been.called;
  });

  it( 'should not show preview link when product is HTML Template', function() {
    htmlTemplate = true;
    initController();

    expect($scope.showPreviewLink).to.be.false;
  } );

  it( 'should show preview link when product is not HTML Template', function() {
    htmlTemplate = false;
    initController();

    expect($scope.showPreviewLink).to.be.true;
  } );

});
