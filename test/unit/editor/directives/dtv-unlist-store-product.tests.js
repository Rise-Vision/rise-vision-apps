'use strict';
describe('directive: unlist store product', function() {
  beforeEach(module('risevision.editor.directives'));
  var elm, $scope, $compile, product, isSubscribed;

  beforeEach(module(function ($provide) {
    $provide.service('gadgetFactory', function() {
      return {
        isUnlistedProduct: function(productCode){
          return productCode === 'presentation';
        }
      };
    });
    $provide.service('subscriptionStatusFactory', function() {
      return {
        checkProductCodes: function(productCodes){
          var deferred = Q.defer();
          deferred.resolve([{
            pc: productCodes[0],
            isSubscribed: (isSubscribed === true)
          }]);
          return deferred.promise;
        }
      };
    });
  }));

  beforeEach(inject(function($rootScope, _$compile_, $templateCache) {
    product = { productCode: 'productCode' };
    $scope = $rootScope.$new();
    $scope.product = product;
    $compile = _$compile_;
  }));

  function compileDirective() {
    elm = $compile('<div unlist-store-product="product">Product</div>')($scope);
    $scope.$digest();
  }

  it('should compile html', function(done) {
    compileDirective();

    setTimeout(function() {
      expect(elm.isolateScope().unlistStoreProduct).to.equal(product);
      expect(elm.html()).to.equal('Product');
      done();
    }, 10);

  });

  it('should not add hide class for other products', function(done) {
    compileDirective();

    setTimeout(function() {
      expect(elm.hasClass('ng-hide')).to.be.false;

      done();
    }, 10);
  });

  it('should add hide class if Unsubscribed', function(done) {
    product.productCode = 'presentation';
    compileDirective();

    setTimeout(function() {
      expect(elm.hasClass('ng-hide')).to.be.true;

      done();
    }, 10);
  });

  it('should not add hide class if Subscribed', function(done) {
    product.productCode = 'presentation';
    isSubscribed = true;
    compileDirective();

    setTimeout(function() {
      expect(elm.hasClass('ng-hide')).to.be.false;

      done();
    }, 10);
  });

});
