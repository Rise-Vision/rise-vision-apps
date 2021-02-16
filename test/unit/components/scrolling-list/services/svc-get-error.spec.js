"use strict";

describe("service: get error:", function() {
  var getError, translateReturn;

  beforeEach(module("risevision.common.components.scrolling-list"));
  beforeEach(module(function ($provide) {
    $provide.value("translateFilter", function(key){
      return translateReturn || key;
    });
  }));

  beforeEach(function() {
    translateReturn = undefined;
    inject(function($injector) {
      getError = $injector.get("getError");
    });
  });

  it("should exist", function() {
    expect(getError).to.be.ok;
    expect(getError).to.be.a('function');
  });

  it("should process empty error objects", function() {
    expect(getError()).to.deep.equal({});
    expect(getError({})).to.deep.equal({});
  });

  it("should process all flavors of errors", function() {
    var e = { code: -1 };
    expect(getError(e)).to.equal(e);
    expect(getError({
      error: e
    })).to.equal(e);
    expect(getError({
      result: e
    })).to.equal(e);
    expect(getError({
      result: {
        error: e
      }
    })).to.equal(e);
  });

});
