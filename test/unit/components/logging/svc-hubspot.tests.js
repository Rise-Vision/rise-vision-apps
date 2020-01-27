/*jshint expr:true */
"use strict";

describe("Services: hubspot", function() {

  beforeEach(module("risevision.common.components.logging"));
  beforeEach(module(function ($provide) {
    $provide.factory("HUBSPOT_ACCOUNT", [function () {
      return "0000";
    }]);
  }));

  var hubspot, $window;
  beforeEach(function(){
    inject(function($injector){
      hubspot = $injector.get("hubspot");
      $window = $injector.get("$window");
    });
  });

  afterEach(function(){
    $window._hsq.length = 0;
  });

  it("should load correct script and trigger identity function", function() {
    hubspot.loadAs("test-user@example.com");

    expect($window.document.getElementById("hs-script-loader").src.indexOf("0000") > -1).to.be.true;
    expect($window._hsq[0][0]).to.equal("identify");
    expect($window._hsq[0][1].email).to.equal("test-user@example.com");
  });

  it("should load only once", function() {
    hubspot.loadAs("test-user@example.com");
    expect($window.document.getElementById("hs-script-loader").src.indexOf("0000") > -1).to.be.true;
    expect($window._hsq.length).to.equal(1);

    hubspot.loadAs("test-user@example.com");
    expect($window._hsq.length).to.equal(1);
  });
});
