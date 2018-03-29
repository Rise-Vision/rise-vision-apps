'use strict';
describe('service: productsFactory: ', function() {
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.value('EMBEDDED_PRESENTATIONS_CODE', 'epProductCode')
    $provide.service('store',function () {
      return store = {
        product: {
          list: sinon.spy(function() {
            return Q.resolve({items: [
              { productCode: 'randomProduct' }, 
              { productCode: 'epProductCode'}
            ]});
          })
        }
      };
    });

    $provide.service('subscriptionStatusFactory',function () {
      return {
        checkProductCodes: function(productCodes) {
          return Q.resolve([statusResponse]);  
        }
      }
    });

  }));
  var productsFactory, store,statusResponse;
  beforeEach(function(){
    statusResponse = {pc:'epProductCode', isSubscribed: false};
    
    inject(function($injector){  
      productsFactory = $injector.get('productsFactory');
    });
  });

  it('should exist',function(){
    expect(productsFactory).to.be.ok;
    
    expect(productsFactory.loadProducts).to.be.a('function');
    expect(productsFactory.isUnlistedProduct).to.be.a('function');
  });

  describe('listProducts: ', function() {
    it('should apply search and cursor parameter', function(done) {
      productsFactory.loadProducts('search', 'cursor').then(function() {
        store.product.list.should.have.been.calledWith('search', 'cursor');

        done();
      });      
    });

    it('should filter out Product if not Subscribed', function(done) {
      productsFactory.loadProducts().then(function(result) {
        expect(result.items).to.be.an('array');
        expect(result.items).to.have.length(1);

        done();
      });
    });

    it('should not filter Product if Subscribed', function(done) {
      statusResponse.isSubscribed = true;

      productsFactory.loadProducts().then(function(result) {
        expect(result.items).to.be.an('array');
        expect(result.items).to.have.length(2);

        done();
      });      
    });
  });

  it('isUnlistedProduct: ',function () {
    // Embedded Presentation
    expect(productsFactory.isUnlistedProduct('epProductCode')).to.be.true;

    expect(productsFactory.isUnlistedProduct('randomCode')).to.be.false;
  });

});
