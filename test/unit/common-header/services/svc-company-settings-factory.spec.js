"use strict";

describe("Services: companySettingsFactory", function() {
  var sandbox = sinon.sandbox.create();
  var companySettingsFactory, $modal;

  beforeEach(module("risevision.common.header.services"));

  beforeEach(module(function ($provide) {
    $provide.service("userState", function() {
      return {
        getSelectedCompanyId: sandbox.stub().returns("cid")
      };
    });
    $provide.service("$modal", function() {
      return {
        open: sandbox.stub()
      };
    });
    $provide.service("getCoreCountries", function() {
      return sandbox.stub();
    });
    $provide.service("$templateCache", function() {
      return {
        get: sandbox.stub().returns("template")
      };
    });
    
  }));

  beforeEach(function() {
    inject(function($injector) {
      companySettingsFactory = $injector.get("companySettingsFactory");
      $modal = $injector.get("$modal");
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("should exist", function() {
    expect(companySettingsFactory).to.be.ok;
    expect(companySettingsFactory.openCompanySettings).to.be.a("function");
  });

  describe("openCompanySettings: ", function() {
    it("should open company settings modal", function(){
      companySettingsFactory.openCompanySettings();

      $modal.open.should.have.been.calledWithMatch({
        template: "template",
        controller: "CompanySettingsModalCtrl",
        size: "lg"
      });
    });
  });

});
