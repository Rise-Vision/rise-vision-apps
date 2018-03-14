'use strict';
describe('service: subscriptionStatusFactory:', function() {
  var TEMPLATE_LIBRARY_PRODUCT_CODE = "templates-library";
  var TEMPLATE_TEST_CODE = "template-test";

  beforeEach(module('risevision.editor.services'));

  beforeEach(module(function ($provide) {
    $provide.value("TEMPLATE_LIBRARY_PRODUCT_CODE", TEMPLATE_LIBRARY_PRODUCT_CODE);
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
    $provide.service('storeAuthorization', function() {
      return {
        check: function(templateCode) {
          var deferred = Q.defer();
          var status = returnStatusArray[0];
          returnStatusArray = returnStatusArray.slice(1);
          if(status) {
            deferred.resolve(response);
          } else {
            deferred.reject('API Error');
          }            
          return deferred.promise;
        }
      };
    });
    
    
  }));
  

  var subscriptionStatusFactory, response, requestedUrl, apiCalls, returnStatus;
  var checkTemplateAccess, returnStatusArray;

  beforeEach(function(){
    returnStatus = true;
    apiCalls = 0;
    response = {
      items: [
      {"pc":"pc1","status":"Subscribed"}
      ]
    };
    returnStatusArray = [];

    inject(function($injector){
      subscriptionStatusFactory = $injector.get('subscriptionStatusFactory');
      checkTemplateAccess = $injector.get('checkTemplateAccess');
    });
  });

  it('should exist',function(){
    expect(subscriptionStatusFactory).to.be.truely;
    expect(subscriptionStatusFactory.checkProductCodes).to.be.a('function');
    expect(checkTemplateAccess).to.be.a('function');
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
  
  describe('isSubscribed: ', function() {
    it('should default to TRUE',function(done){
      response = {
        items: [
        {pc:'pc1'}
        ]
      };

      subscriptionStatusFactory.checkProductCode('pc1').then(function(status){
        expect(status.isSubscribed).to.be.true;
        done();
      });
    });

    it('should default TRUE if status is empty',function(done){
      response = {
        items: [
        {pc:'pc1',status:''}
        ]
      };

      subscriptionStatusFactory.checkProductCode('pc1').then(function(status){
        expect(status.isSubscribed).to.be.true;
        done();
      });
    });

    describe('TRUE:',function(){
      it('should return TRUE if status is Free',function(done){
        response = {
          items: [
          {pc:'pc1',status:''}
          ]
        };

        subscriptionStatusFactory.checkProductCode('pc1').then(function(status){
          expect(status.isSubscribed).to.be.true;
          done();
        });

      });

      it('should return TRUE if status is On Trial',function(done){
        response = {
          items: [
          {pc:'pc1',status:'On Trial'}
          ]
        };

        subscriptionStatusFactory.checkProductCode('pc1').then(function(status){
          expect(status.isSubscribed).to.be.true;
          done();
        });
      });

      it('should return TRUE if status is Subscribed',function(done){
        response = {
          items: [
          {pc:'pc1',status:'Subscribed'}
          ]
        };

        subscriptionStatusFactory.checkProductCode('pc1').then(function(status){
          expect(status.isSubscribed).to.be.true;
          done();
        });
      });
    });

    describe('FALSE:',function(){
      it('should return FALSE if status is Not Subscribed',function(done){
        response = {
          items: [
          {pc:'pc1',status:'Not Subscribed'}
          ]
        };

        subscriptionStatusFactory.checkProductCode('pc1').then(function(status){
          expect(status.isSubscribed).to.be.false;
          done();
        });
      });

      it('should return FALSE if status is Trial Expired',function(done){
        response = {
          items: [
          {pc:'pc1',status:'Trial Expired'}
          ]
        };

        subscriptionStatusFactory.checkProductCode('pc1').then(function(status){
          expect(status.isSubscribed).to.be.false;
          done();
        });
      });

      it('should return FALSE if status is Cancelled',function(done){
        response = {
          items: [
          {pc:'pc1',status:'Cancelled'}
          ]
        };

        subscriptionStatusFactory.checkProductCode('pc1').then(function(status){
          expect(status.isSubscribed).to.be.false;
          done();
        });
      });

      it('should return FALSE if status is Suspended',function(done){
        response = {
          items: [
          {pc:'pc1',status:'Suspended'}
          ]
        };

        subscriptionStatusFactory.checkProductCode('pc1').then(function(status){
          expect(status.isSubscribed).to.be.false;
          done();
        });
      });

      it('should return FALSE if status is Product Not Found',function(done){
        response = {
          items: [
          {pc:'pc1',status:'Product Not Found'}
          ]
        };

        subscriptionStatusFactory.checkProductCode('pc1').then(function(status){
          expect(status.isSubscribed).to.be.false;
          done();
        });
      });

      it('should return FALSE if status is Company Not Found',function(done){
        response = {
          items: [
          {pc:'pc1',status:'Company Not Found'}
          ]
        };

        subscriptionStatusFactory.checkProductCode('pc1').then(function(status){
          expect(status.isSubscribed).to.be.false;
          done();
        });
      });

      it('should return FALSE if status is Error',function(done){
        response = {
          items: [
          {pc:'pc1',status:'Error'}
          ]
        };

        subscriptionStatusFactory.checkProductCode('pc1').then(function(status){
          expect(status.isSubscribed).to.be.false;
          done();
        });
      });
    });
  });

  describe('checkTemplateAccess:', function() {
    it('should give access to premium templates if subscribed to Templates Library', function(done) {
      
      returnStatusArray = [true];

      checkTemplateAccess(TEMPLATE_TEST_CODE)
      .then(function() {
        done();
      });
    });

    it('should give access to premium templates if subscribed to the template', function(done) {
      
      returnStatusArray = [false, true];

      checkTemplateAccess(TEMPLATE_TEST_CODE)
      .then(function() {
        done();
      });
    });

    it('should reject access to premium templates if not subscribed to Templates Library or to the template', function(done) {
      
      returnStatusArray = [false, false];

      checkTemplateAccess(TEMPLATE_TEST_CODE)
      .then(null, function() {
        done();
      });
    });
  });

});
