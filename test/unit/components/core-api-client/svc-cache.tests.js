"use strict";

describe("Services: cache", function() {

  beforeEach(module("risevision.core.cache"));

  it("should exist", function(done) {
    inject(function(userInfoCache) {
      expect(userInfoCache).be.defined;
      done();
    });
  });
});
