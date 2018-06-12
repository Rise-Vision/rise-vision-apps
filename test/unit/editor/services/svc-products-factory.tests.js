'use strict';
describe('service: productsFactory: ', function() {
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('store',function () {
      return store = {
        product: {
          list: sinon.spy(function() {
            return Q.resolve(storeProducts);
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
  var productCode = 'd3a418f1a3acaed42cf452fefb1eaed198a1c620';
  var productsFactory, storeProducts, store, statusResponse;
  beforeEach(function(){
    statusResponse = {pc: productCode, isSubscribed: false};
    storeProducts = {items: [
      { productCode: 'randomProduct' }
    ]};

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

    it('should not add Product if not Subscribed', function(done) {
      productsFactory.loadProducts({
        category: 'Widgets'
      }).then(function(result) {
        expect(result.items).to.be.an('array');
        expect(result.items).to.have.length(1);

        done();
      });
    });

    it('should add Product if Subscribed', function(done) {
      statusResponse.isSubscribed = true;

      productsFactory.loadProducts({
        category: 'Widgets'
      }).then(function(result) {
        expect(result.items).to.be.an('array');
        expect(result.items).to.have.length(2);

        done();
      });      
    });

    it('should add Product when loading Templates', function(done) {
      statusResponse.isSubscribed = true;

      productsFactory.loadProducts({
        category: 'Templates'
      }).then(function(result) {
        expect(result.items).to.be.an('array');
        expect(result.items).to.have.length(1);

        done();
      });      
    });

    it('should not add Product if not found', function(done) {
      statusResponse.productCode = 'someProduct';

      productsFactory.loadProducts({
        category: 'Widgets'
      }).then(function(result) {
        expect(result.items).to.be.an('array');
        expect(result.items).to.have.length(1);

        done();
      });      
    });
    
    describe('filter: ', function() {
      beforeEach(function() {
        statusResponse.isSubscribed = true;
      });

      it('should apply search query', function(done) {
        var search = { 
          query: 'embedded presentation'
        };

        productsFactory.loadProducts(search).then(function(result) {
          expect(result.items).to.be.an('array');
          expect(result.items).to.have.length(2);

          done();
        });      
      });

      it('should filter results', function(done) {
        var search = { 
          query: 'not found'
        };

        productsFactory.loadProducts(search).then(function(result) {
          expect(result.items).to.be.an('array');
          expect(result.items).to.have.length(1);

          done();
        });      
      });
    });

    describe('item location: ', function() {
      beforeEach(function() {
        statusResponse.isSubscribed = true;
      });

      it('should insert item according to the productOrderWeight', function(done) {
        storeProducts.items = [];
        for (var i = 0; i < 20; i++) {
          storeProducts.items.push({ productCode: 'randomProduct' });
        }

        productsFactory.loadProducts({
          category: 'Widgets'
        }).then(function(result) {
          expect(result.items).to.be.an('array');
          expect(result.items).to.have.length(21);
          expect(result.items[17].productCode).to.equal(productCode);

          done();
        });
      });

      it('should insert item at the end of the list if smaller', function(done) {
        productsFactory.loadProducts({
          category: 'Widgets'
        }).then(function(result) {
          expect(result.items).to.be.an('array');
          expect(result.items).to.have.length(2);
          expect(result.items[1].productCode).to.equal(productCode);

          done();
        });
      });

      it('should create list if item is missing', function(done) {
        storeProducts.items = null;
        productsFactory.loadProducts({
          category: 'Widgets'
        }).then(function(result) {
          expect(result.items).to.be.an('array');
          expect(result.items).to.have.length(1);
          expect(result.items[0].productCode).to.equal(productCode);

          done();
        });
      });
      
    });
  });

  it('isUnlistedProduct: ',function () {
    // Embedded Presentation
    expect(productsFactory.isUnlistedProduct(productCode)).to.be.true;

    expect(productsFactory.isUnlistedProduct('randomCode')).to.be.false;
  });

});
