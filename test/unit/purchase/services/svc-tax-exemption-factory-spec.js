/*jshint expr:true */
"use strict";

describe("Services: tax exemption factory", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});
    $provide.service("storeService", function() {
      return storeService = {
        addTaxExemption: sinon.stub().returns(Q.resolve()),
        uploadTaxExemptionCertificate: sinon.stub().returns(Q.resolve("url"))
      };
    });

  }));

  var taxExemptionFactory, storeService;

  beforeEach(function() {
    inject(function($injector) {
      taxExemptionFactory = $injector.get("taxExemptionFactory");
      
      taxExemptionFactory.taxExemption = {
        file: "asdf"
      };
    });
  });

  it("should exist", function() {
    expect(taxExemptionFactory).to.be.ok;
    expect(taxExemptionFactory.submitCertificate).to.be.a("function");
    expect(taxExemptionFactory.init).to.be.a("function");
  });

  it("init:", function() {
    taxExemptionFactory.init();

    expect(taxExemptionFactory.taxExemption).to.deep.equal({});
  });

  it("should stop spinner on load", function() {
    expect(taxExemptionFactory.loading).to.be.false;
  });
  
  describe("submitCertificate: ", function() {

    it("should successfully submit", function (done) {
      taxExemptionFactory.submitCertificate().then(function () {
        expect(taxExemptionFactory.taxExemptionError).to.not.be.ok;
        expect(storeService.uploadTaxExemptionCertificate).to.have.been.called;
        expect(storeService.addTaxExemption).to.have.been.called;

        done();
      });
    });

    it("should fail to submit when uploading tax exemption certificate fails", function (done) {
      storeService.uploadTaxExemptionCertificate.returns(Q.reject({}));

      taxExemptionFactory.submitCertificate().then(function () {
        expect(taxExemptionFactory.taxExemptionError).to.be.not.null;
        expect(storeService.uploadTaxExemptionCertificate).to.have.been.called;
        expect(storeService.addTaxExemption).to.not.have.been.called;

        done();
      });
    });

    it("should fail to submit when sending tax exemption fails", function (done) {
      storeService.addTaxExemption.returns(Q.reject({}));

      taxExemptionFactory.submitCertificate().then(function () {
        expect(taxExemptionFactory.taxExemptionError).to.be.not.null;
        expect(storeService.uploadTaxExemptionCertificate).to.have.been.called;
        expect(storeService.addTaxExemption).to.have.been.called;

        done();
      });
    });

    it("should start and stop spinner", function(done) {
      taxExemptionFactory.submitCertificate();

      expect(taxExemptionFactory.loading).to.be.true;

      setTimeout(function() {
        expect(taxExemptionFactory.loading).to.be.false;

        done();
      }, 10);
    });

  });

});
