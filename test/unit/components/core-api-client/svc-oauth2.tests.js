"use strict";

describe("Services: getOAuthUserInfo", function() {

  beforeEach(module("risevision.core.oauth2"));

  it("should exist", function(done) {
    inject(function(getOAuthUserInfo) {
      expect(getOAuthUserInfo).be.defined;
      done();
    });
  });
});
