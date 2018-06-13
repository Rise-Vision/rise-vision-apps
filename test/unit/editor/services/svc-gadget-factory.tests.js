'use strict';
describe('service: gadgetFactory: ', function() {
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('gadget',function () {
      return {
        _gadget: {
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

    $provide.service('productsFactory', function() {
      return {
        isUnlistedProduct: function() {
          return true;
        }
      };
    });

    $provide.service('subscriptionStatusFactory',function () {
      return {
        checkProductCodes: function(productCodes) {
          var deferred = Q.defer(); 
          if(statusError){
            deferred.reject('ERROR; could not get subscription status');
          } else {
            deferred.resolve([statusResponse]);  
          }          
          return deferred.promise;
        }
      }
    });

    $provide.service('translateFilter', function(){
      return function(key){
        var status = '';
        switch (key) {
          case 'editor-app.subscription.status.professional':
            status = 'Professional';
            break;
          case 'editor-app.subscription.status.premium':
            status = 'Premium';
            break;
          case 'editor-app.subscription.status.daysTrial':
            status = 'Days Trial';
            break;
          case 'editor-app.subscription.status.daysRemaining':
            status = 'Days Remaining';
            break;
        }
        return status;
      };
    });
  }));
  var gadgetFactory, returnGadget, apiCalls, statusError,statusResponse;
  beforeEach(function(){
    returnGadget = true;
    statusError = false;
    statusResponse = {pc:'productCode', status: 'Free'};
    apiCalls = 0;
    
    inject(function($injector){  
      gadgetFactory = $injector.get('gadgetFactory');
    });
  });

  it('should exist',function(){
    expect(gadgetFactory).to.be.truely;
    
    expect(gadgetFactory.loadingGadget).to.be.false;

    expect(gadgetFactory.getGadgetById).to.be.a('function');
    expect(gadgetFactory.getGadgetByProduct).to.be.a('function');
    expect(gadgetFactory.updateItemsStatus).to.be.a('function');
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

  describe('updateItemsStatus:', function(){  
    var items;
    beforeEach(function() {
      items = [{
        type: 'gadget',
        objectReference: 'gadgetId'
      }];    
    });

    describe('_getGadgets: ', function(){
      it('should get the gadgets',function(done){
        gadgetFactory.updateItemsStatus(items)
        .then(function() {
          expect(items).to.be.okay;
          expect(items.length).to.equal(1);
          expect(items[0].gadget).to.be.okay;
          expect(items[0].gadget.name).to.equal('some gadget');

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
      
      it('should handle failure to get gadgets correctly',function(done){
        returnGadget = false;
        
        gadgetFactory.updateItemsStatus(items)
        .then(function() {
          expect(items).to.be.okay;
          expect(items.length).to.equal(1);
          expect(items[0].gadget).to.be.okay;
          expect(items[0].gadget.name).to.not.be.ok;

          expect(gadgetFactory.apiError).to.be.ok;
          expect(gadgetFactory.apiError).to.equal('ERROR; could not get gadget');

          setTimeout(function() {
            expect(gadgetFactory.loadingGadget).to.be.false;

            done();
          }, 10);
        })
        .then(null,done);
      });

      it('should cache API calls', function(done) {
        gadgetFactory.updateItemsStatus(items);
        
        setTimeout(function() {
          gadgetFactory.updateItemsStatus(items);
          
          setTimeout(function() {
            expect(apiCalls).to.equal(1);
            
            done();
          }, 10);
        }, 10);
      });
    });

    describe('Embedded Presentations: ', function() {
      it('should return the Presentation item if Subscribed',function(done){
        statusResponse.pc = 'd3a418f1a3acaed42cf452fefb1eaed198a1c620';
        statusResponse.isSubscribed = true;
        items = [{
          type: 'presentation'
        }];    

        gadgetFactory.updateItemsStatus(items).then(function() {
          expect(items[0].gadget).to.be.ok;
          expect(items[0].gadget.name).to.equal('Embedded Presentation');
          expect(items[0].gadget.subscriptionStatus).to.equal('Free');
          expect(items[0].gadget.isSubscribed).to.be.true;
          expect(items[0].gadget.statusMessage).to.equal('Free');

          done();
        });
      });

      it('should return the Presentation item as Professional Widget if unsubscribed',function(done){
        statusResponse.pc = 'd3a418f1a3acaed42cf452fefb1eaed198a1c620';
        statusResponse.isSubscribed = false;
        items = [{
          type: 'presentation'
        }];    

        gadgetFactory.updateItemsStatus(items).then(function() {
          expect(items[0].gadget).to.be.ok;
          expect(items[0].gadget.name).to.equal('Embedded Presentation');
          expect(items[0].gadget.subscriptionStatus).to.equal('Free');
          expect(items[0].gadget.isSubscribed).to.be.false;
          expect(items[0].gadget.statusMessage).to.equal('Professional');

          done();
        });
      });

    });

    it('should return the items with updated gadget/subscriptionStatus',function(done){
      gadgetFactory.updateItemsStatus(items).then(function(){
        expect(items[0].gadget).to.be.an('object');
        expect(items[0].gadget.id).to.equal('gadgetId');
        expect(items[0].gadget.subscriptionStatus).to.equal('Free');
        expect(items[0].gadget.statusMessage).to.equal('Free');
        done();
      });  
    });

    describe('statusMessage:',function(){
      it('should handle On Trial',function(done){
        statusResponse.status = 'On Trial';
        statusResponse.expiry = new Date().setDate(new Date().getDate() + 3);

        gadgetFactory.updateItemsStatus(items).then(function(){
          expect(items[0].gadget.subscriptionStatus).to.equal('On Trial');
          expect(items[0].gadget.statusMessage).to.equal('On Trial - 3 Days Remaining');
          done();
        }); 
      });

      it('should handle Not Subscribed',function(done){
        statusResponse.status = 'Not Subscribed';

        gadgetFactory.updateItemsStatus(items).then(function(){
          expect(items[0].gadget.subscriptionStatus).to.equal('Not Subscribed');
          expect(items[0].gadget.statusMessage).to.equal('Not Subscribed');
          done();
        }); 
      })

      it('should handle Not Subscribed with trial',function(done){
        statusResponse.status = 'Not Subscribed';
        statusResponse.trialPeriod = 7

        gadgetFactory.updateItemsStatus(items).then(function(){
          expect(items[0].gadget.subscriptionStatus).to.equal('Not Subscribed');
          expect(items[0].gadget.statusMessage).to.equal('Not Subscribed - 7 Days Trial');
          done();
        }); 
      })

    });

    it('should still resolve promise on gadget API errors',function(done){
      returnGadget = false;
      gadgetFactory.updateItemsStatus(items)
        .then(function(){
          expect(gadgetFactory.apiError).to.be.okay;
          expect(gadgetFactory.apiError).to.equal('ERROR; could not get gadget');
          done();
        });    
    });

    it('should handle subscription Status API errors',function(done){
      statusError = true;
      gadgetFactory.updateItemsStatus(items).then(null,function(error){
        expect(gadgetFactory.apiError).to.be.okay;
        expect(gadgetFactory.apiError).to.equal('ERROR; could not get subscription status');
        done();
      });    
    });
  });

});
