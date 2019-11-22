'use strict';
describe('service: productsFactory: ', function() {
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('storeProduct',function () {
      return storeProduct = {
        list: sinon.stub().returns(Q.resolve(storeProducts))
      };
    });

    $provide.service('storeAuthorization',function () {
      return {
        check: sinon.stub().returns(Q.resolve())
      };
    });

    $provide.service('widgetUtils', function() {
      return {
        getProfessionalWidgets: sinon.stub().returns([
          { productCode: 'pc1', name: 'professional content' },
          { productCode: 'pc2' },
          { productCode: 'pc3' },
          { productCode: 'pc4' }
        ])        
      };
    });
  }));
  var productsFactory, storeProducts, storeProduct, widgetUtils, storeAuthorization;

  beforeEach(function(){
    storeProducts = {items: [
      { productCode: 'randomProduct' }
    ]};

    inject(function($injector){  
      widgetUtils = $injector.get('widgetUtils');
      storeAuthorization = $injector.get('storeAuthorization');

      productsFactory = $injector.get('productsFactory');
    });
  });

  it('should exist',function(){
    expect(productsFactory).to.be.ok;
    
    expect(productsFactory.loadProducts).to.be.a('function');
  });

  describe('store product list', function() {
    it('should apply search and cursor parameter', function(done) {
      productsFactory.loadProducts('search', 'cursor').then(function() {
        storeProduct.list.should.have.been.calledWith('search', 'cursor');

        done();
      });      
    });
  });

  describe('professional widgets', function() {
    beforeEach(function() {
      storeAuthorization.check.returns(Q.reject());
    });

    it('should add widgets to the list', function(done) {
      productsFactory.loadProducts({
        category: 'Widgets'
      }).then(function(result) {
        expect(result.items).to.be.an('array');
        expect(result.items).to.have.length(1 + 4);

        done();
      });      
    });

    it('should not add widgets when loading Templates', function(done) {
      productsFactory.loadProducts({
        category: 'Templates'
      }).then(function(result) {
        expect(result.items).to.be.an('array');
        expect(result.items).to.have.length(1);

        done();
      });      
    });
  });

  describe('unlisted store products', function() {
    it('should not add Product if not Subscribed', function(done) {
      storeAuthorization.check.returns(Q.reject());

      productsFactory.loadProducts({
        category: 'Widgets'
      }).then(function(result) {
        expect(result.items).to.be.an('array');
        expect(result.items).to.have.length(1 + 4);

        done();
      });
    });

    it('should add Product if Subscribed', function(done) {
      productsFactory.loadProducts({
        category: 'Widgets'
      }).then(function(result) {
        expect(result.items).to.be.an('array');
        expect(result.items).to.have.length(1 + 1 + 4);

        done();
      });      
    });

    it('should not add Product when loading Templates', function(done) {
      productsFactory.loadProducts({
        category: 'Templates'
      }).then(function(result) {
        expect(result.items).to.be.an('array');
        expect(result.items).to.have.length(1);

        done();
      });      
    });
  });

  describe('filter: ', function() {
    it('should apply search query to professional widgets', function(done) {
      var search = { 
        query: 'professional content'
      };

      productsFactory.loadProducts(search).then(function(result) {
        expect(result.items).to.be.an('array');
        expect(result.items).to.have.length(2);

        done();
      });      
    });

    it('should apply search query to unlisted products', function(done) {
      var search = { 
        query: 'Streaming Watchlist'
      };

      productsFactory.loadProducts(search).then(function(result) {
        expect(result.items).to.be.an('array');
        expect(result.items).to.have.length(2);

        done();
      });      
    });

    it('should not filter store results', function(done) {
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

  describe('duplicates', function() {
    it('should remove duplicate productCodes', function() {
      storeProducts.items.push({ productCode: 'randomProduct', name: 'duplicate content' })
      productsFactory.loadProducts({
        category: 'Templates'
      }).then(function(result) {
        expect(result.items).to.be.an('array');
        expect(result.items).to.have.length(1);

        done();
      });
    });

    it('should not remove undefined productCodes from duplicates', function() {
      storeProducts.items.push({ name: 'new content' }, { name: 'new content' })
      productsFactory.loadProducts({
        category: 'Templates'
      }).then(function(result) {
        expect(result.items).to.be.an('array');
        expect(result.items).to.have.length(1 + 2);

        done();
      });
    });

  });

});
