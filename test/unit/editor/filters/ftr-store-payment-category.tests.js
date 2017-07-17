'use strict';
describe('filter: storePaymentCategory', function() {
  beforeEach(module('risevision.editor.filters'));
  var storePaymentCategory;
  var products = [
    {id: 'p1', paymentTerms: 'subscription'},
    {id: 'p2', paymentTerms: 'free'},
    {id: 'p3', paymentTerms: 'FreE'},
    {id: 'p4', paymentTerms: 'something'},
  ];
  beforeEach(function(){
    inject(function($filter){
      storePaymentCategory = $filter('storePaymentCategory');
    });
  });

  it('should exist',function(){
    expect(storePaymentCategory).to.be.ok;
  });

  it('should return all products if category is blank',function(){
    expect(storePaymentCategory(products)).to.deep.equal(products);
  });

  it('should return all products if category is all',function(){
    expect(storePaymentCategory(products, 'all')).to.deep.equal(products);
  });

  it('should return free products',function(){
    expect(storePaymentCategory(products, 'free')).to.deep.equal([products[1], products[2]]);
  });

  it('should return non free products',function(){
    expect(storePaymentCategory(products, 'premium')).to.deep.equal([products[0], products[3]]);
  });

});
