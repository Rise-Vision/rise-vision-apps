'use strict';
describe('service: subscriptionStatusFactory:', function() {
  beforeEach(module('risevision.common.components.subscription-status.service'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('subscriptionStatusService', function() {
      return {
        list: sinon.stub().returns(Q.resolve(response))
      };
    });
    
  }));
  
  var subscriptionStatusFactory, $rootScope, response, subscriptionStatusService;

  beforeEach(function(){
    response = [{
      "pc":"pc1",
      "status":"Subscribed"
    }];

    inject(function($injector){
      $rootScope = $injector.get('$rootScope');
      subscriptionStatusService = $injector.get('subscriptionStatusService');
      subscriptionStatusFactory = $injector.get('subscriptionStatusFactory');
    });
  });

  it('should exist',function(){
    expect(subscriptionStatusFactory).to.be.truely;
    expect(subscriptionStatusFactory.checkProductCode).to.be.a('function');
    expect(subscriptionStatusFactory.check).to.be.a('function');
    expect(subscriptionStatusFactory.checkProductCodes).to.be.a('function');
  });

  it('should request productCodes',function(){
    subscriptionStatusFactory.checkProductCodes(['pc1']);

    subscriptionStatusService.list.should.have.been.calledOnce;
  });
  
  it('should only call API once', function(done) {
    subscriptionStatusFactory.checkProductCodes(['pc1']);
    
    setTimeout(function() {
      subscriptionStatusFactory.checkProductCodes(['pc1']);
      
      setTimeout(function() {
        subscriptionStatusService.list.should.have.been.calledOnce;        

        done();
      }, 10);
    }, 10);
  });

  it('should handle errors',function(done){
    subscriptionStatusService.list.returns(Q.reject('API Error'));

    subscriptionStatusFactory.checkProductCodes(['pc1']).then(null,function(e){
      expect(e).to.equal('API Error');
      done();
    })    
  });

  it("should reset productCodes when selected company changes", function(done) {
    subscriptionStatusFactory.checkProductCodes(['pc1']);

    setTimeout(function () {
      $rootScope.$emit("risevision.company.selectedCompanyChanged");
      $rootScope.$digest();

      subscriptionStatusFactory.checkProductCodes(['pc1']);
      
      setTimeout(function() {
        subscriptionStatusService.list.should.have.been.calledTwice;
        
        done();
      }, 10);
    }, 0);
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

  describe('check:', function() {
    var pc = "pc1";

    it('should resolve if subscribed', function(done) {
      sinon.stub(subscriptionStatusFactory, 'checkProductCode').returns(Q.resolve({isSubscribed: true}));

      subscriptionStatusFactory.check(pc).then(function(status){
        expect(status).to.be.true;

        done();
      },function(err){
        done('Should not reject');
      }); 

    });

    it('should reject if unsubscribed', function(done) {
      sinon.stub(subscriptionStatusFactory, 'checkProductCode').returns(Q.resolve({isSubscribed: false}));

      subscriptionStatusFactory.check(pc).then(function(){
        done('Should not resolve');
      },function(status){
        expect(status).to.be.false;

        done();
      }); 

    });

  });

});
