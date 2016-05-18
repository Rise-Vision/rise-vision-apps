'use strict';
describe('service: subscriptionStatusFactory:', function() {
  beforeEach(module('risevision.editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('store', function() {
      return {
        product : {
          status: function(productCodes) {
            apiCalls++;
            var deferred = Q.defer();
            if(returnStatus) {
              deferred.resolve(response);
            } else {
              deferred.reject('API Error');
            }            
            return deferred.promise;
          }
        }
      };
    });
    
  }));
  

  var subscriptionStatusFactory, response, requestedUrl, apiCalls, returnStatus;

  beforeEach(function(){
    returnStatus = true;
    apiCalls = 0;
    response = {
      items: [
      {"pc":"pc1","status":"Subscribed"}
      ]
    };

    inject(function($injector){
      subscriptionStatusFactory = $injector.get('subscriptionStatusFactory');
    });
  });

  it('should exist',function(){
    expect(subscriptionStatusFactory).to.be.truely;
    expect(subscriptionStatusFactory.checkProductCodes).to.be.a('function');
  });

  it('should request productCodes',function(){
    subscriptionStatusFactory.checkProductCodes(['pc1']);
    expect(apiCalls).to.equal(1);
  });
  
  it('should only call API once', function(done) {
      subscriptionStatusFactory.checkProductCodes(['pc1']);
      
      setTimeout(function() {
        subscriptionStatusFactory.checkProductCodes(['pc1']);
        
        setTimeout(function() {
          expect(apiCalls).to.equal(1);
          
          done();
        }, 10);
      }, 10);
    });

  it('should handle errors',function(done){
    returnStatus = false;
    subscriptionStatusFactory.checkProductCodes(['pc1']).then(null,function(e){
      expect(e).to.equal('API Error');
      done();
    })    
  });

  describe('checkProductCode:',function(){
    var pc = "pc1";

    it('should forward call to checkProductCodes',function(){
      var spy = sinon.spy(subscriptionStatusFactory,'checkProductCodes');
      subscriptionStatusFactory.checkProductCode(pc);
      spy.should.have.been.calledWith([pc])
    });

    it('should return first result of checkProductCodes',function(done){
      var status1 = 'status1';
      var status2 = 'status2';

      sinon.stub(subscriptionStatusFactory,'checkProductCodes',function(){
        return Q.resolve([status1,status2]);
      });

      subscriptionStatusFactory.checkProductCode(pc).then(function(status){
        expect(status).to.equal(status1);
        done();
      });     
    });

    it('should handle empty result',function(done){
      sinon.stub(subscriptionStatusFactory,'checkProductCodes',function(){
        return Q.resolve([]);
      });
      
      subscriptionStatusFactory.checkProductCode(pc).then(function(status){
        expect(status).to.be.null;
        done();
      }); 
    });

    it('should handle null result',function(done){
      sinon.stub(subscriptionStatusFactory,'checkProductCodes',function(){
        return Q.resolve(null);
      });
      
      subscriptionStatusFactory.checkProductCode(pc).then(function(status){
        expect(status).to.be.null;
        done();
      }); 
    });

    it('should handle null result',function(done){
      sinon.stub(subscriptionStatusFactory,'checkProductCodes',function(){
        return Q.reject("Failure");
      });
      
      subscriptionStatusFactory.checkProductCode(pc).then(function(status){
        done('Should not resolve on failure');
      },function(err){
        expect(err).to.be.equal("Failure");
        done();
      }); 
    });

  });

});
