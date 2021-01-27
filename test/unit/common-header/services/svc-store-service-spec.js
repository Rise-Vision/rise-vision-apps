"use strict";

describe("Services: storeService", function() {
  var storeService, $httpBackend;
  var storeApiFailure;
  var storeApi, addressObject, response;

  beforeEach(module("risevision.store.services"));

  beforeEach(module(function ($provide) {
    storeApiFailure = false;
    //stub services
    $provide.service("$q", function() {return Q;});
    $provide.service("storeAPILoader", function () {
      return function() {
        var deferred = Q.defer();

        var storeApiResponse = function() {
          if (storeApiFailure) {
            return Q.reject({
              error: "some error"
            });
          }
          else {
            return Q.resolve({
              result: {
                result: "{}"
              },
              item: {}
            });
          }
        };

        deferred.resolve(storeApi = {
          customer_portal: {
            getUrl: storeApiResponse,
            createSession: storeApiResponse
          },
          company: {
            validateAddress: function(obj){
              expect(obj).to.not.have.property("junkProperty");

              return Q.resolve(response);
            }
          },
          tax: {
            estimate: sinon.spy(function(){
              if (storeApiFailure) {
                return Q.reject(response);
              } else {
                return Q.resolve(response);
              }
            })
          },
          purchase: {
            put2: sinon.spy(function() {
              if (storeApiFailure) {
                return Q.reject(response);
              } else {
                return Q.resolve(response);
              }
            })
          },
          payment: {
            prepare: sinon.spy(function() {
              if (storeApiFailure) {
                return Q.reject(response);
              } else {
                return Q.resolve(response);
              }
            }),
            collect: sinon.spy(function() {
              if (storeApiFailure) {
                return Q.reject(response);
              } else {
                return Q.resolve(response);
              }
            })
          },
          taxExemption: {
            add: function () {
              return {
                execute: sinon.spy(function(cb) {
                  cb(response);
                })
              };
            },
            getUploadUrl: function () {
              return {
                execute: sinon.spy(function(cb) {
                  cb(response);
                })
              };
            }
          }
        });

        return deferred.promise;
      };
    });
  }));

  beforeEach(function() {
    inject(function($injector){
      storeService = $injector.get("storeService");
      $httpBackend = $injector.get("$httpBackend");
    });
  });

  describe("createSession: ", function() {
    it("should exist", function() {
      expect(storeService.createSession).to.be.ok;
      expect(storeService.createSession).to.be.a("function");
    });

    it("should succeed", function(done) {
      storeService.createSession().then(function() {
        done();
      })
      .then(null, done);
    });

    it("should fail", function(done) {
      storeApiFailure = true;
      storeService.createSession().then(function() {
        done("success");
      }, function() {
        done();
      });
    });
  });

  describe("validateAddress: ", function() {
    beforeEach(function() {
      response = {
        result: {
          code: 1
        }
      };
      addressObject = {
        street: "street",
        unit: "unit",
        city: "city",
        province: "province",
        country: "country",
        postalCode: "postalCode",
        junkProperty: "junkValue"
      };
    });

    it("should exist", function() {
      expect(storeService.validateAddress).to.be.ok;
      expect(storeService.validateAddress).to.be.a("function");
    });

    it("should return a promise", function() {
      expect(storeService.validateAddress(addressObject).then).to.be.a("function");
    });

    it("should resolve if code is not -1", function(done) {
      storeService.validateAddress(addressObject)
      .then(function(result) {
        expect(result).to.be.ok;

        done();
      })
      .then(null,done);
    });

    it("should reject if code is -1", function(done) {
      response.result.code = -1;

      storeService.validateAddress(addressObject)
      .then(function(result) {
        done(result);
      })
      .then(null, function(error) {
        expect(error).to.be.ok;

        done();
      })
      .then(null,done);
    });

    it("should return response if response.result doesn't exist", function(done) {
      response = response.result;

      storeService.validateAddress(addressObject)
      .then(function(result) {
        expect(result).to.be.ok;

        done();
      })
      .then(null,done);
    });

  });

  describe("calculateTaxes: ", function() {
    var displayCount = 5;

    beforeEach(function() {
      response = {
        result: {
          result: true
        }
      };
      addressObject = {
        id: "ship-to-id",
        street: "street",
        unit: "unit",
        city: "city",
        province: "province",
        country: "country",
        postalCode: "postalCode"
      };
    });

    it("should exist", function() {
      expect(storeService.calculateTaxes).to.be.ok;
      expect(storeService.calculateTaxes).to.be.a("function");
    });

    it("should return a promise", function() {
      expect(storeService.calculateTaxes("companyId", "planId", displayCount, "addonId", "addonQty", addressObject).then).to.be.a("function");
    });

    it("should create the request object", function(done) {
      storeService.calculateTaxes("companyId", "planId", displayCount, "addonId", "addonQty", addressObject, "save50")
      .then(function() {
        storeApi.tax.estimate.should.have.been.called;
        storeApi.tax.estimate.should.have.been.calledWith({
          companyId: "companyId",
          couponCode: "save50",
          shipToId: "ship-to-id",
          planId: "planId",
          planQty: displayCount,
          addonId: "addonId",
          addonQty: "addonQty",
          line1: addressObject.street,
          line2: addressObject.unit,
          city: addressObject.city,
          country: addressObject.country,
          state: addressObject.province,
          zip: addressObject.postalCode
        });
        done();
      })
      .then(null,done);

    });

    it("should resolve if result is true", function(done) {
      storeService.calculateTaxes("companyId", "planId", displayCount, "addonId", "addonQty", addressObject)
      .then(function(result) {
        expect(result).to.be.ok;
        expect(result).to.deep.equal({
          result: true
        });

        done();
      })
      .then(null,done);
    });

    it("should reject if result is not correct with no error message", function(done) {
      response.result = {};

      storeService.calculateTaxes("companyId", "planId", displayCount, "addonId", "addonQty", addressObject)
      .then(function(result) {
        done(result);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal({});

        done();
      })
      .then(null,done);
    });

    it("should return response if response.result doesn't exist", function(done) {
      response.result.error = "Call Failed";

      storeService.calculateTaxes("companyId", "planId", displayCount, "addonId", "addonQty", addressObject)
      .then(function(result) {
        done(result);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal({
          result: true,
          error: "Call Failed"
        });

        done();
      })
      .then(null,done);
    });

    it("should reject on API failure", function(done) {
      storeApiFailure = true;
      response.result.error = "some error";

      storeService.calculateTaxes("companyId", "planId", displayCount, "addonId", "addonQty", addressObject)
      .then(function() {
        done("error");
      })
      .then(null, function(error) {
        expect(error).to.equal("some error");

        done();
      })
      .then(null,done);
    });

  });

  describe("purchase: ", function() {
    beforeEach(function() {
      response = {
        result: {}
      };
    });

    it("should exist", function() {
      expect(storeService.purchase).to.be.ok;
      expect(storeService.purchase).to.be.a("function");
    });

    it("should return a promise", function() {
      expect(storeService.purchase("jsonData").then).to.be.a("function");
    });

    it("should pass the parameter and call the purchase put2 api", function(done) {
      storeService.purchase("jsonData")
      .then(function() {
        storeApi.purchase.put2.should.have.been.called;
        storeApi.purchase.put2.should.have.been.calledWith({
          jsonData: "jsonData"
        });
        done();
      })
      .then(null,done);

    });

    it("should resolve if result is received", function(done) {
      storeService.purchase("jsonData")
      .then(function(result) {
        expect(result).to.be.ok;
        expect(result).to.deep.equal({});

        done();
      })
      .then(null,done);
    });

    it("should reject if no result is received", function(done) {
      response = {};

      storeService.purchase("jsonData")
      .then(function(result) {
        done(result);
      })
      .then(null, function(error) {
        expect(error).to.not.be.ok;

        done();
      })
      .then(null,done);
    });

    it("should return error response", function(done) {
      response.result.error = "Call Failed";

      storeService.purchase("jsonData")
      .then(function(result) {
        done(result);
      })
      .then(null, function(error) {
        expect(error).to.equal("Call Failed");

        done();
      })
      .then(null,done);
    });

    it("should reject on API failure", function(done) {
      storeApiFailure = true;
      response.result.error = "Call Failed";

      storeService.purchase("jsonData")
      .then(function() {
        done("error");
      })
      .then(null, function(error) {
        expect(error).to.equal("Call Failed");

        done();
      })
      .then(null,done);
    });

  });

  describe("preparePayment: ", function() {
    beforeEach(function() {
      response = {
        result: {}
      };
    });

    it("should exist", function() {
      expect(storeService.preparePayment).to.be.ok;
      expect(storeService.preparePayment).to.be.a("function");
    });

    it("should return a promise", function() {
      expect(storeService.preparePayment().then).to.be.a("function");
    });

    it("should pass the parameters and call the api", function(done) {
      storeService.preparePayment("paymentMethodId", "invoiceId", "companyId", "token")
      .then(function() {
        storeApi.payment.prepare.should.have.been.called;
        storeApi.payment.prepare.should.have.been.calledWith({
          paymentMethodId: "paymentMethodId",
          invoiceId: "invoiceId",
          companyId: "companyId",
          token: "token"
        });
        done();
      })
      .then(null,done);

    });

    it("should resolve if result is received", function(done) {
      storeService.preparePayment()
      .then(function(result) {
        expect(result).to.be.ok;
        expect(result).to.deep.equal({});

        done();
      })
      .then(null,done);
    });

    it("should reject if no result is received", function(done) {
      response = {};

      storeService.preparePayment()
      .then(function(result) {
        done(result);
      })
      .then(null, function(error) {
        expect(error).to.not.be.ok;

        done();
      })
      .then(null,done);
    });

    it("should return error response", function(done) {
      response.result.error = "Call Failed";

      storeService.preparePayment()
      .then(function(result) {
        done(result);
      })
      .then(null, function(error) {
        expect(error).to.equal("Call Failed");

        done();
      })
      .then(null,done);
    });

    it("should reject on API failure", function(done) {
      storeApiFailure = true;
      response.result.error = "Call Failed";

      storeService.preparePayment()
      .then(function() {
        done("error");
      })
      .then(null, function(error) {
        expect(error).to.equal("Call Failed");

        done();
      })
      .then(null,done);
    });

  });

  describe("collectPayment: ", function() {
    beforeEach(function() {
      response = {
        result: {}
      };
    });

    it("should exist", function() {
      expect(storeService.collectPayment).to.be.ok;
      expect(storeService.collectPayment).to.be.a("function");
    });

    it("should return a promise", function() {
      expect(storeService.collectPayment().then).to.be.a("function");
    });

    it("should pass the parameters and call the api", function(done) {
      storeService.collectPayment("paymentIntentId", "invoiceId", "companyId", "token")
      .then(function() {
        storeApi.payment.collect.should.have.been.called;
        storeApi.payment.collect.should.have.been.calledWith({
          paymentIntentId: "paymentIntentId",
          invoiceId: "invoiceId",
          companyId: "companyId",
          token: "token"
        });
        done();
      })
      .then(null,done);

    });

    it("should resolve if result is received", function(done) {
      storeService.collectPayment()
      .then(function(result) {
        expect(result).to.be.ok;
        expect(result).to.deep.equal({});

        done();
      })
      .then(null,done);
    });

    it("should reject if no result is received", function(done) {
      response = {};

      storeService.collectPayment()
      .then(function(result) {
        done(result);
      })
      .then(null, function(error) {
        expect(error).to.not.be.ok;

        done();
      })
      .then(null,done);
    });

    it("should return error response", function(done) {
      response.result.error = "Call Failed";

      storeService.collectPayment()
      .then(function(result) {
        done(result);
      })
      .then(null, function(error) {
        expect(error).to.equal("Call Failed");

        done();
      })
      .then(null,done);
    });

    it("should reject on API failure", function(done) {
      storeApiFailure = true;
      response.result.error = "Call Failed";

      storeService.collectPayment()
      .then(function() {
        done("error");
      })
      .then(null, function(error) {
        expect(error).to.equal("Call Failed");

        done();
      })
      .then(null,done);
    });

  });

  describe("addTaxExemption: ", function() {
    it("should exist", function() {
      expect(storeService.addTaxExemption).to.be.ok;
      expect(storeService.addTaxExemption).to.be.a("function");
    });

    it("should succeed", function(done) {
      response = {};

      storeService.addTaxExemption({}, "blobKey").then(function() {
        done();
      })
      .then(null, done);
    });

    it("should fail", function(done) {
      response = {
        error: "error"
      };

      storeService.addTaxExemption({}, "blobKey").then(function() {
        done("success");
      }, function() {
        done();
      });
    });
  });

  describe("uploadTaxExemptionCertificate: ", function() {
    it("should exist", function() {
      expect(storeService.uploadTaxExemptionCertificate).to.be.ok;
      expect(storeService.uploadTaxExemptionCertificate).to.be.a("function");
    });

    it("should succeed", function(done) {
      response = {
        result: {
          result: "url"
        }
      };

      $httpBackend.expect("POST", function () { return true; }).respond(200, {});

      storeService.uploadTaxExemptionCertificate().then(function() {
        done();
      })
      .then(null, done);

      setTimeout(function() {
        $httpBackend.flush();
      }, 10);
    });

    it("should fail", function(done) {
      response = {
        error: "error"
      };

      storeService.uploadTaxExemptionCertificate().then(function() {
        done("success");
      }, function() {
        done();
      });
    });
  });

});
