'use strict';
describe('service: gadgetFactory: ', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.editor.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('gadget',function () {
      return {
        _gadget: gadget = {
          id: 'gadgetId',
          productCode: 'productCode',
          name: 'some gadget',
          revisionStatus: 0
        },
        get: function(gadgetId) {
          var deferred = Q.defer();
          if(returnGadget){
            apiCalls++;
            deferred.resolve({item: this._gadget});
          }else{
            deferred.reject('ERROR; could not get gadget');
          }
          return deferred.promise;
        },
        list: function(productCode) {
          var deferred = Q.defer();
          if(returnGadget){
            apiCalls++;
            deferred.resolve({items: [this._gadget]});
          }else{
            deferred.reject('ERROR; could not get gadget');
          }
          return deferred.promise;
        }
      };
    });

  }));
  var gadgetFactory, gadget, returnGadget, apiCalls, gadgetApi;
  beforeEach(function(){
    returnGadget = true;
    apiCalls = 0;
    
    inject(function($injector){  
      gadgetFactory = $injector.get('gadgetFactory');
      gadgetApi = $injector.get('gadget');
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist',function(){
    expect(gadgetFactory).to.be.ok;
    
    expect(gadgetFactory.loadingGadget).to.be.false;

    expect(gadgetFactory.getGadgetById).to.be.a('function');
    expect(gadgetFactory.getGadgetByProduct).to.be.a('function');
  });
    
  describe('getGadgetById: ', function(){
    it('should get the gadget',function(done){
      gadgetFactory.getGadgetById('gadgetId')
      .then(function(gadget) {
        expect(gadget).to.be.truely;
        expect(gadget.name).to.equal('some gadget');

        setTimeout(function() {
          expect(gadgetFactory.loadingGadget).to.be.false;

          done();
        }, 10);
      })
      .then(null, function() {
        done('error');
      })
      .then(null,done);
    });
    
    it('should handle failure to get gadget correctly',function(done){
      returnGadget = false;
      
      gadgetFactory.getGadgetById()
      .then(function(result) {
        done(result);
      })
      .then(null, function() {
        expect(gadgetFactory.apiError).to.be.truely;
        expect(gadgetFactory.apiError).to.equal('ERROR; could not get gadget');

        setTimeout(function() {
          expect(gadgetFactory.loadingGadget).to.be.false;

          done();
        }, 10);
      })
      .then(null,done);
    });

    it('should only call API once', function(done) {
      gadgetFactory.getGadgetById('gadgetId');
      
      setTimeout(function() {
        gadgetFactory.getGadgetById('gadgetId');
        
        setTimeout(function() {
          expect(apiCalls).to.equal(1);
          
          done();
        }, 10);
      }, 10);
    });
  });

  describe('getGadgetByProduct: ', function(){
    it('should get the gadget',function(done){
      gadgetFactory.getGadgetByProduct('productCode')
      .then(function(gadget) {
        expect(gadget).to.be.truely;
        expect(gadget.name).to.equal('some gadget');

        setTimeout(function() {
          expect(gadgetFactory.loadingGadget).to.be.false;

          done();
        }, 10);
      })
      .then(null, function() {
        done('error');
      })
      .then(null,done);
    });
    
    it('should return the Presentation item',function(done){
      gadgetFactory.getGadgetByProduct('d3a418f1a3acaed42cf452fefb1eaed198a1c620')
      .then(function(gadget) {
        expect(gadget).to.be.ok;
        expect(gadget.name).to.equal('Embedded Presentation');

        setTimeout(function() {
          expect(gadgetFactory.loadingGadget).to.be.false;

          done();
        }, 10);
      })
      .then(null, function() {
        done('error');
      })
      .then(null,done);
    });
    
    it('should handle failure to get gadget correctly',function(done){
      returnGadget = false;
      
      gadgetFactory.getGadgetByProduct('productCode')
      .then(function(result) {
        done(result);
      })
      .then(null, function() {
        expect(gadgetFactory.apiError).to.be.truely;
        expect(gadgetFactory.apiError).to.equal('ERROR; could not get gadget');

        setTimeout(function() {
          expect(gadgetFactory.loadingGadget).to.be.false;

          done();
        }, 10);
      })
      .then(null,done);
    });

    it('should only call API once', function(done) {
      gadgetFactory.getGadgetByProduct('productCode');
      
      setTimeout(function() {
        gadgetFactory.getGadgetByProduct('productCode');
        
        setTimeout(function() {
          expect(apiCalls).to.equal(1);
          
          done();
        }, 10);
      }, 10);
    });
  });

});
