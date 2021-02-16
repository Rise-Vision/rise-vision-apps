'use strict';
  
describe('service: productsFactory:', function() {
  beforeEach(module('risevision.common.components.store-products'));
  beforeEach(module(function ($provide) {
    $provide.service('storeProduct', function() {
      return {
        list: 'storeProductList'
      };
    });
  }));
  var productsFactory;

  beforeEach(function(){
    inject(function($injector){
      productsFactory = $injector.get('productsFactory');
    });
  });

  it('should exist',function(){
    expect(productsFactory).to.be.ok;

    expect(productsFactory.loadProducts).to.equal('storeProductList');
  });

});
