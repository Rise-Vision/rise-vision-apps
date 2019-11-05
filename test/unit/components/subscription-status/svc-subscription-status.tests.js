/*jshint expr:true */
"use strict";

describe("Services: subscriptionStatusService", function() {

  beforeEach(module("risevision.common.components.subscription-status.service"));

  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});

    $provide.service("storeAuthorization", function() {
      return {
        check: sinon.stub().returns(Q.reject(false))
      };
    });

    $provide.service("storeProduct", function() {
      return {
        status: sinon.stub().returns(Q.resolve(response))
      };
    });

  }));

  var subscriptionStatusService, storeAuthorization, storeProduct, response;

  beforeEach(function(){
    response = {
      items: [{
        "pc":"pc1",
        "status":"Subscribed"
      }]
    };

    inject(function($injector){
      storeAuthorization = $injector.get('storeAuthorization');
      storeProduct = $injector.get('storeProduct');
      subscriptionStatusService = $injector.get('subscriptionStatusService');
    });
  });

  it("should exist", function() {
    expect(subscriptionStatusService).be.defined;
  });

  it("should call product status api", function() {
    subscriptionStatusService.get("1");

    storeProduct.status.should.have.been.calledWith(["1"]);
  });

  it("should not call authorization api if subscribed", function(done) {
    subscriptionStatusService.get("1").then(function(data){
      storeProduct.status.should.have.been.calledWith(["1"]);
      storeAuthorization.check.should.not.have.been.called;

      done();
    });
  });

  it("should handle blank responses", function(done) {
    response.items = undefined;

    subscriptionStatusService.get("1").then(function(){
      done("Failed");
    })
    .catch(function(err) {
      expect(err).to.equal("No results.");

      done();
    });
  });

  it("should handle subscription status api failure", function(done) {
    storeProduct.status.returns(Q.reject("API Failed"));

    subscriptionStatusService.get("1").then(function(){
      done("Failed");
    })
    .catch(function(err) {
      expect(err).to.equal("API Failed");

      done();
    });
  });

  it("should call authorization api if subscription status returns false", function(done) {
    response.items[0].status = "Cancelled";

    subscriptionStatusService.get("1").then(function(data){
      storeProduct.status.should.have.been.calledWith(["1"]);
      storeAuthorization.check.should.have.been.calledWith("1");

      done();
    });
  });

  describe('status:', function() {
    it("should return free product", function(done) {
      response.items[0].status = "Free";

      subscriptionStatusService.get("1").then(function(data){
        expect(data).be.defined;
        expect(data.status).be.equal("Free");
        expect(data.statusCode).be.equal("free");
        expect(data.isSubscribed).be.be.true;

        done();
      });
    });

    it("should return expired product", function(done) {
      response.items[0].status = "Trial Expired";

      subscriptionStatusService.get("2").then(function(data){
        expect(data).be.defined;
        expect(data.status).be.equal("Trial Expired");
        expect(data.statusCode).be.equal("trial-expired");
        expect(data.isSubscribed).be.be.false;

        done();
      });
    });

    it("should return active subscription for cancelled product", function(done) {
      response.items[0].status = "Cancelled";
      storeAuthorization.check.returns(Q.resolve(true));

      subscriptionStatusService.get("3").then(function(data){
        expect(data).be.defined;
        expect(data.status).be.equal("Cancelled");
        expect(data.statusCode).be.equal("cancelled");
        expect(data.isSubscribed).be.be.true;

        done();
      });
    });

    it("should return inactive subscription if authorization fails", function(done) {
      response.items[0].status = "Cancelled";
      storeAuthorization.check.returns(Q.reject("error"));

      subscriptionStatusService.get("3").then(function(data){
        expect(data).be.defined;
        expect(data.status).be.equal("Cancelled");
        expect(data.statusCode).be.equal("cancelled");
        expect(data.isSubscribed).be.be.false;

        done();
      });
    });

    it("should return trial available", function(done) {
      response.items[0] = {
        status: "Not Subscribed",
        trialPeriod: 5
      };

      subscriptionStatusService.get("3").then(function(data){
        expect(data).be.defined;
        expect(data.status).be.equal("Not Subscribed");
        expect(data.statusCode).be.equal("trial-available");
        expect(data.isSubscribed).be.be.false;
        expect(data.trialAvailable).be.be.true;

        done();
      });
    });

    it("should return a list of products", function(done) {
      response.items = [
        { pc: 1, status: "Free" },
        { pc: 2, status: "Trial Expired" },
        { pc: 3, status: "Cancelled" }];

      subscriptionStatusService.list(["1", "2", "3"]).then(function(data){
        expect(data).be.defined;
        expect(data.length).be.equal(3);
        expect(data[0].status).be.equal("Free");
        expect(data[1].status).be.equal("Trial Expired");
        expect(data[2].status).be.equal("Cancelled");

        done();
      });
    });
  });

  describe('isSubscribed: ', function() {
    it('should default to FALSE',function(done){
      response.items[0].status = undefined;

      subscriptionStatusService.get('pc1').then(function(status){
        expect(status.isSubscribed).to.be.false;
        done();
      });
    });

    it('should default FALSE if status is empty',function(done){
      response.items[0].status = '';

      subscriptionStatusService.get('pc1').then(function(status){
        expect(status.isSubscribed).to.be.false;
        done();
      });
    });

    describe('TRUE:',function(){
      it('should return TRUE if status is Free',function(done){
        response.items[0].status = 'Free';

        subscriptionStatusService.get('pc1').then(function(status){
          expect(status.isSubscribed).to.be.true;
          done();
        });

      });

      it('should return TRUE if status is On Trial',function(done){
        response.items[0].status = 'On Trial';

        subscriptionStatusService.get('pc1').then(function(status){
          expect(status.isSubscribed).to.be.true;
          done();
        });
      });

      it('should return TRUE if status is Subscribed',function(done){
        response.items[0].status = 'Subscribed';

        subscriptionStatusService.get('pc1').then(function(status){
          expect(status.isSubscribed).to.be.true;
          done();
        });
      });
    });

    describe('FALSE:',function(){
      it('should return FALSE if status is Not Subscribed',function(done){
        response.items[0].status = 'Not Subscribed';

        subscriptionStatusService.get('pc1').then(function(status){
          expect(status.isSubscribed).to.be.false;
          done();
        });
      });

      it('should return FALSE if status is Trial Expired',function(done){
        response.items[0].status = 'Trial Expired';

        subscriptionStatusService.get('pc1').then(function(status){
          expect(status.isSubscribed).to.be.false;
          done();
        });
      });

      it('should return FALSE if status is Cancelled',function(done){
        response.items[0].status = 'Cancelled';

        subscriptionStatusService.get('pc1').then(function(status){
          expect(status.isSubscribed).to.be.false;
          done();
        });
      });

      it('should return FALSE if status is Suspended',function(done){
        response.items[0].status = 'Suspended';

        subscriptionStatusService.get('pc1').then(function(status){
          expect(status.isSubscribed).to.be.false;
          done();
        });
      });

      it('should return FALSE if status is Product Not Found',function(done){
        response.items[0].status = 'Product Not Found';

        subscriptionStatusService.get('pc1').then(function(status){
          expect(status.isSubscribed).to.be.false;
          done();
        });
      });

      it('should return FALSE if status is Company Not Found',function(done){
        response.items[0].status = 'Company Not Found';

        subscriptionStatusService.get('pc1').then(function(status){
          expect(status.isSubscribed).to.be.false;
          done();
        });
      });

      it('should return FALSE if status is Error',function(done){
        response.items[0].status = 'Error';

        subscriptionStatusService.get('pc1').then(function(status){
          expect(status.isSubscribed).to.be.false;
          done();
        });
      });
    });
  });

});
