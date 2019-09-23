"use strict";

describe("service: process error code:", function() {
  var processErrorCode, translateReturn;

  beforeEach(module("risevision.common.components.scrolling-list"));
  beforeEach(module(function ($provide) {
    $provide.value("translateFilter", function(key){
      return translateReturn || key;
    });
  }));

  beforeEach(function() {
    translateReturn = undefined;
    inject(function($injector) {
      processErrorCode = $injector.get("processErrorCode");
    });
  });

  var itemName = "Presentation";
  var action = "add";
  
  it("should process empty error objects", function() {
    expect(processErrorCode(itemName, action)).to.equal("An Error has Occurred");
    expect(processErrorCode(itemName, action, {})).to.equal("An Error has Occurred");
  });

  it("should attempt to internationalize Storage errors", function() {
    expect(processErrorCode(itemName, action, {
      result: { error: { message: "i18n-fail" } }
    })).to.equal("i18n-fail");

    translateReturn = "Translation succeeded.";
    expect(processErrorCode(itemName, action, {
      result: { error: { message: "i18n-success" } }
    })).to.equal(translateReturn);
  });

  it("should process 400 error codes", function() {
    expect(processErrorCode(itemName, action, {
      status: 400
    })).to.equal("apps-common.errors.actionFailed An Error has Occurred");

    expect(processErrorCode(itemName, action, {
      status: 400,
      result: { error: { message: "Field name is not editable." } }
    })).to.equal("apps-common.errors.actionFailed Field name is not editable.");

    expect(processErrorCode(itemName, action, {
      status: 400,
      result: { error: { message: "Field name is required." } }
    })).to.equal("apps-common.errors.actionFailed Field name is required.");
  });

  it("should process 401 error codes", function() {
    expect(processErrorCode(itemName, action, {
      status: 401
    })).to.equal("apps-common.errors.notAuthenticated");
  });

  describe("403: ", function() {
    it("should process generic error", function() {      
      expect(processErrorCode(itemName, action, {
        status: 403
      })).to.equal("apps-common.errors.actionFailed An Error has Occurred");
    });

    it("should process company access error", function() {
      expect(processErrorCode(itemName, action, {
        status: 403,
        result: { error: { message: "User is not allowed access" } }
      })).to.equal("apps-common.errors.actionFailed apps-common.errors.parentCompanyAction");
    });

    it("should process user permission error", function() {
      expect(processErrorCode(itemName, action, {
        status: 403,
        result: { error: { message: "User does not have the necessary rights" } }
      })).to.equal("apps-common.errors.actionFailed apps-common.errors.permissionRequired");
    });

    it("should process template library error", function() {
      expect(processErrorCode(itemName, action, {
        status: 403,
        result: { error: { message: "Premium Template requires Purchase" } }
      })).to.equal("apps-common.errors.actionFailed apps-common.errors.premiumTemplate");
    });

    it("should process Storage subscription error", function() {
      expect(processErrorCode(itemName, action, {
        status: 403,
        result: { error: { message: "Storage requires active subscription" } }
      })).to.equal("apps-common.errors.actionFailed apps-common.errors.storageSubscription");
    });
  });

  it("should process 404 error codes", function() {
    expect(processErrorCode(itemName, action, {
      status: 404
    })).to.equal("apps-common.errors.notFound");
  });

  it("should process 409 error codes", function() {
    expect(processErrorCode(itemName, action, {
      status: 409,
      result: { error: { message: "The Schedule is not valid." } }
    })).to.equal("apps-common.errors.actionFailed The Schedule is not valid.");
  });

  it("should process 500 error codes", function() {
    expect(processErrorCode(itemName, action, {
      status: 500
    })).to.equal("apps-common.errors.serverError apps-common.errors.tryAgain");
  });

  it("should process 503 error codes", function() {
    expect(processErrorCode(itemName, action, {
      status: 503
    })).to.equal("apps-common.errors.serverError apps-common.errors.tryAgain");
  });

  it("should process network errors code -1 or 0", function() {
    expect(processErrorCode(itemName, action, {
      result: { error: { code: -1 }}
    })).to.equal("apps-common.errors.checkConnection");

    expect(processErrorCode(itemName, action, {
      result: { error: { code: 0 }}
    })).to.equal("apps-common.errors.checkConnection");
  });

});
