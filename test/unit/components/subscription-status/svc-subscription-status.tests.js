/*jshint expr:true */
"use strict";

describe("Services: subscriptionStatusService", function() {

  beforeEach(module("risevision.common.components.subscription-status.service"));

  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});

    $provide.service("$http", function() {
      return {
        get: function(url) {
          var deferred = Q.defer();
    
          var response = {
            "data": [{
              "pc":"1",
              "status":"",
              "expiry":null
            }]
          };
    
          console.log(url);
    
          if (url && url.indexOf("/product/status?") !== -1) {
            if (url.indexOf("/company/invalid/") !== -1) {
              response.data[0].status = "";
            }
            else if (url.indexOf("pc=1,2,3") !== -1) {
              response.data = [
                { pc: 1, status: "Free" },
                { pc: 2, status: "Trial Expired" },
                { pc: 3, status: "Cancelled" }];
            }
            else if (url.indexOf("pc=0") !== -1) {
              response.data[0].status = "Subscribed";
            }      
            else if (url.indexOf("pc=1") !== -1) {
              response.data[0].status = "Free";
            }      
            else if (url.indexOf("pc=2") !== -1) {
              response.data[0].status = "Trial Expired";
            }
            else if (url.indexOf("pc=3") !== -1 || url.indexOf("pc=4") !== -1) {
              response.data[0].status = "Cancelled";
            }    
          }
          else if (url && url.indexOf("widget/auth?") !== -1) {
            response = {
              data: {
                authorized: false
              }
            };
            if (url.indexOf("pc=3") !== -1) {
              response.data.authorized = true;
            }
          }
    
          deferred.resolve(response);
    
          return deferred.promise;
        }
      };
    })
  }));

  it("should exist", function(done) {
    inject(function(subscriptionStatusService) {
      expect(subscriptionStatusService).be.defined;

      done();
    });
  });

  it("should call product status api", function(done) {
    inject(function(subscriptionStatusService) {
      subscriptionStatusService.get("1", "12345").then(function(data){
        expect(data).be.defined;
        expect(data.status).be.equal("Free");
        expect(data.statusCode).be.equal("free");
        expect(data.subscribed).be.equal(true);

        done();
      });
    });
  });

  it("should fail if company is invalid", function(done) {
    inject(function(subscriptionStatusService) {
      subscriptionStatusService.get("1", "invalid").then(function(){
        done();
      },
      function(error) {
        expect(error).be.equal("No response");
        done();
      });
    });
  });

  it("should return expired product", function(done) {
    inject(function(subscriptionStatusService) {
      subscriptionStatusService.get("2", "12345").then(function(data){
        expect(data).be.defined;
        expect(data.status).be.equal("Trial Expired");
        expect(data.statusCode).be.equal("trial-expired");
        expect(data.subscribed).be.equal(false);

        done();
      });
    });
  });

  it("should return active subscription for cancelled product", function(done) {
    inject(function(subscriptionStatusService) {
      subscriptionStatusService.get("3", "12345").then(function(data){
        expect(data).be.defined;
        expect(data.status).be.equal("Cancelled");
        expect(data.statusCode).be.equal("cancelled");
        expect(data.subscribed).be.equal(true);

        done();
      });
    });
  });

  it("should return a list of products", function(done) {
    inject(function(subscriptionStatusService) {
      subscriptionStatusService.list(["1", "2", "3"], "12345").then(function(data){
        expect(data).be.defined;
        expect(data.length).be.equal(3);
        expect(data[0].status).be.equal("Free");
        expect(data[1].status).be.equal("Trial Expired");
        expect(data[2].status).be.equal("Cancelled");

        done();
      });
    });
  });

});
