"use strict";

describe("Services: Cookies", function() {
  beforeEach(module("risevision.common.cookie"));

  var cookieTester;

  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});
  }));

  beforeEach(function() {
    inject(function($injector) {
      cookieTester = $injector.get("cookieTester");
    });
  });

  it('should exist', function() {
    expect(cookieTester).to.be.ok;
    expect(cookieTester.checkCookies).to.be.a('function');
  });

  it('should resolve if cookies exist', function(done) {
    expect(cookieTester.checkCookies().then).to.be.a('function');

    cookieTester.checkCookies()
      .then(function() {
        done();
      });
  });

});
