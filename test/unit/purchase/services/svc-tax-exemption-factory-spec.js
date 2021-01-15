/*jshint expr:true */
"use strict";

describe("Services: tax exemption factory", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.service("userState", function() {
      return {
        getSelectedCompanyId: sinon.stub().returns('selectedCompany')
      };
    });
    $provide.service("storeService", function() {
      return {
        addTaxExemption: sinon.stub().returns(Q.resolve()),
        uploadTaxExemptionCertificate: sinon.stub().returns(Q.resolve("url"))
      };
    });

  }));

  var taxExemptionFactory, userState, storeService;

  beforeEach(function() {
    inject(function($injector) {
      userState = $injector.get("userState");
      storeService = $injector.get("storeService");
      taxExemptionFactory = $injector.get("taxExemptionFactory");
    });
  });

  it("should exist", function() {
    expect(taxExemptionFactory).to.be.ok;
    expect(taxExemptionFactory.init).to.be.a("function");
    expect(taxExemptionFactory.submitTaxExemption).to.be.a("function");
  });

  describe("init: ", function() {
    it ('should initialize', function() {
      taxExemptionFactory.init('callback');

      expect(taxExemptionFactory.taxExemption).to.be.ok;
      expect(taxExemptionFactory.taxExemption.callback).to.equal('callback');
    });

    it ('should stop spinner', function() {
      taxExemptionFactory.loading = true;

      taxExemptionFactory.init();

      expect(taxExemptionFactory.loading).to.be.false;
    });
  });

  describe("submitTaxExemption: ", function() {
    var callback;
    beforeEach(function() {
      callback = sinon.spy();

      taxExemptionFactory.taxExemption = {
        callback: callback,
        file: 'file'
      };
    });

    it("should return a promise", function() {
      expect(taxExemptionFactory.submitTaxExemption().then).to.be.a("function");
    });

    it("should clear errors and start spinner", function() {
      taxExemptionFactory.taxExemption = {
        error: "error"
      };

      taxExemptionFactory.submitTaxExemption();

      expect(taxExemptionFactory.taxExemption.error).to.not.be.ok;
      expect(taxExemptionFactory.loading).to.be.true;
    });

    it("should successfully submit", function (done) {
      taxExemptionFactory.submitTaxExemption().then(function () {
        expect(taxExemptionFactory.taxExemption.error).to.not.be.ok;
        expect(storeService.uploadTaxExemptionCertificate).to.have.been.calledWith('file');
        expect(storeService.addTaxExemption).to.have.been.calledWith('selectedCompany', taxExemptionFactory.taxExemption, 'url');

        expect(taxExemptionFactory.taxExemption.sent).to.be.true;

        done();
      });
    });

    it("should refresh estimate on success", function (done) {
      taxExemptionFactory.submitTaxExemption().then(function () {
        callback.should.have.been.called;

        expect(taxExemptionFactory.loading).to.be.false;

        done();
      });
    });

    it("should fail to submit when uploading tax exemption certificate fails", function (done) {
      storeService.uploadTaxExemptionCertificate.returns(Q.reject({}));

      taxExemptionFactory.submitTaxExemption(callback).then(function () {
        expect(taxExemptionFactory.taxExemption.error).to.equal('Something went wrong. Please try again.');
        expect(storeService.uploadTaxExemptionCertificate).to.have.been.called;
        expect(storeService.addTaxExemption).to.not.have.been.called;

        callback.should.not.have.been.called;

        expect(taxExemptionFactory.taxExemption.sent).to.not.be.ok;

        done();
      });
    });

    it("should stop spinner and show error on failure", function (done) {
      storeService.uploadTaxExemptionCertificate.returns(Q.reject({message: 'error'}));

      taxExemptionFactory.submitTaxExemption().then(function () {
        expect(taxExemptionFactory.taxExemption.error).to.equal('error');

        expect(taxExemptionFactory.loading).to.be.false;

        done();
      });
    });

    it("should fail to submit when sending tax exemption fails", function (done) {
      storeService.addTaxExemption.returns(Q.reject({}));

      taxExemptionFactory.submitTaxExemption().then(function () {
        expect(taxExemptionFactory.taxExemption.error).to.be.ok;
        expect(storeService.uploadTaxExemptionCertificate).to.have.been.called;
        expect(storeService.addTaxExemption).to.have.been.called;

        callback.should.not.have.been.called;

        expect(taxExemptionFactory.taxExemption.sent).to.not.be.ok;

        done();
      });
    });

  });

});
