"use strict";

describe("Services: subscriptionStatusService", function() {

  beforeEach(module("risevision.common.subscription-status"));

  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});

    $provide.value("storeAPILoader", function() {
      var deffered = Q.defer();
      var gapi = {
        product: {
          status: function () {
            return {
              execute: function (callback) {
                  callback(apiResponse);
              }
            };
          }
        }
      };
      deffered.resolve(gapi);
      return deffered.promise;
    });

    $provide.value("STORE_ENDPOINT_URL", "");
  }));

  var apiResponse;

  it("should exist", function(done) {
    inject(function(subscriptionStatusService) {
      expect(subscriptionStatusService).be.defined;

      done();
    });
  });

  it("should call product status api", function(done) {
    apiResponse = {
      result: {
        items : [
          {
            pc: "12345",
            status: "Free",
            trialPeriod : 0,
            "kind": "store#productItem"
          }
        ]
      },
      items : [
        {
          pc: "12345",
          status: "Free",
          trialPeriod : 0,
          "kind": "store#productItem"
        }
      ]
    };
    inject(function(subscriptionStatusService) {
      subscriptionStatusService.get("1", "12345").then(function(resp){
        expect(resp).be.defined;
        expect(resp.status).be.equal("Free");
        expect(resp.subscribed).be.equal(true);

        done();
      })
      .then(null,done);
    });
  });

  it("should fail if company is invalid", function(done) {
    apiResponse = {
      result: {
        items : [
          {
            pc: "sfdsdfds",
            status: "Product Not Found",
            trialPeriod: 0,
            kind: "store#productItem"
          }
        ]
      },
      items : [
        {
          pc: "sfdsdfds",
          status: "Product Not Found",
          trialPeriod: 0,
          kind: "store#productItem"
        }
      ]
    };
    inject(function(subscriptionStatusService) {
      subscriptionStatusService.get("1", "invalid").then(function(resp){
          expect(resp).be.defined;
          expect(resp.status).be.equal("Product Not Found");
          expect(resp.subscribed).be.equal(false);
          done();
        })
        .then(null,done);
    });
  });

  it("should fail if product code is empty", function(done) {
    apiResponse = {
      error : {
        errors : [
          {
            "domain": "global",
            "reason": "required",
            "message": "Required parameter: productCodes",
            "locationType": "parameter",
            "location": "productCodes"
          }
        ]
      }
    };
    inject(function(subscriptionStatusService) {
      subscriptionStatusService.get("1", "").then(function(){
        done();
      },
        function(error) {
          expect(error).be.deep.equal(apiResponse);
          done();
        })
        .then(null,done);
    });
  });

  it("should fail if company is empty", function(done) {
    apiResponse = {
      error : {
        errors : [
          {
            "domain": "global",
            "reason": "required",
            "message": "Required parameter: companyId",
            "locationType": "parameter",
            "location": "companyId"
          }
        ]
      }
    };
    inject(function(subscriptionStatusService) {
      subscriptionStatusService.get("", "12345").then(function(){
          done();
        },
        function(error) {
          expect(error).be.deep.equal(apiResponse);
          done();
        })
        .then(null,done);
    });
  });

  it("should return expired product", function(done) {

    apiResponse = {
      result: {
        items : [
          {
            pc: "12345",
            status: "Trial Expired",
            trialPeriod: 0,
            kind: "store#productItem"
          }
        ]
      },
      items : [
        {
          pc: "12345",
          status: "Trial Expired",
          trialPeriod: 0,
          kind: "store#productItem"
        }
      ]
    };

    inject(function(subscriptionStatusService) {
      subscriptionStatusService.get("2", "12345").then(function(resp){
        expect(resp).be.defined;
        expect(resp.status).be.equal("Trial Expired");
        expect(resp.subscribed).be.equal(false);

        done();
      }).then(null,done);
    });
  });

  describe("On Trial 10 days", function() {

    var sandbox, clock;
    var expiry = "2015-12-13T18:24:03.929Z";
    var now = "2015-12-03T18:24:03.929Z";
    var nowDate = new Date(now);
    var expiryDate = new Date(expiry);
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    var expectedExpiryDate = Math.floor((expiryDate.getTime() - nowDate.getTime()) / _MS_PER_DAY);
    var service;
    beforeEach( function() {

      inject(function(subscriptionStatusService) {
        service = subscriptionStatusService;
      });
      sandbox = sinon.sandbox.create();
      clock = sinon.useFakeTimers(nowDate.getTime());
    });

    afterEach( function() {
      sandbox.restore();
      clock.restore();
    });

    it("should return on trial product", function(done) {
      apiResponse = {
        result: {
          items : [
            {
              pc: "12345",
              status: "On Trial",
              expiry: expiry,
              trialPeriod: 0,
              kind: "store#productItem"
            }
          ]
        },
        items : [
          {
            pc: "12345",
            status: "On Trial",
            expiry: expiry,
            trialPeriod: 0,
            kind: "store#productItem"
          }
        ]
      };

        service.get("2", "12345").then(function(resp){
          expect(resp).be.defined;
          expect(resp.status).be.equal("On Trial");
          expect(resp.subscribed).be.equal(true);
          expect(resp.expiry).be.equal(expectedExpiryDate);
          expect(resp.plural).be.equal("-many");
          done();
        }).then(null,done);
    });

  });

  describe("On Trial zero days", function() {

    var sandbox, clock;
    var expiry = "2015-12-13T18:24:03.929Z";
    var now = "2015-12-13T18:24:03.929Z";
    var nowDate = new Date(now);
    var expiryDate = new Date(expiry);
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    var expectedExpiryDate = Math.floor((expiryDate.getTime() - nowDate.getTime()) / _MS_PER_DAY);
    var service;
    beforeEach( function() {

      inject(function(subscriptionStatusService) {
        service = subscriptionStatusService;
      });
      sandbox = sinon.sandbox.create();
      clock = sinon.useFakeTimers(nowDate.getTime());
    });

    afterEach( function() {
      sandbox.restore();
      clock.restore();
    });

    it("should return on trial product with plural equal zero", function(done) {
      apiResponse = {
        result: {
          items : [
            {
              pc: "12345",
              status: "On Trial",
              expiry: expiry,
              trialPeriod: 0,
              kind: "store#productItem"
            }
          ]
        },
        items : [
          {
            pc: "12345",
            status: "On Trial",
            expiry: expiry,
            trialPeriod: 0,
            kind: "store#productItem"
          }
        ]
      };

      service.get("2", "12345").then(function(resp){
        expect(resp).be.defined;
        expect(resp.status).be.equal("On Trial");
        expect(resp.subscribed).be.equal(true);
        expect(resp.expiry).be.equal(expectedExpiryDate);
        expect(resp.plural).be.equal("-zero");
        done();
      }).then(null,done);
    });
  });
});
