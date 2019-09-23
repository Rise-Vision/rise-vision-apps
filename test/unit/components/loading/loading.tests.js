/*jshint expr:true */
"use strict";

describe("Services: $loading", function() {

  beforeEach(module("risevision.common.components.loading"));

  it("should exist", function(done) {
    inject(function($loading) {
      expect($loading).be.defined;
      done();
    });
  });
});
