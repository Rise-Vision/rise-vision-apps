/*jshint expr:true */
/* global sinon */

"use strict";
describe("directive: subscription status", function() {
  var $compile, $rootScope, $emitSpy, element, modalSuccess, modalResult, subscriptionSuccess;

  beforeEach(module("risevision.common.components.subscription-status.directives"));
  beforeEach(module(function ($provide) {
    $provide.service("subscriptionStatusService", function() {
      return {
        get: function() {
          var deferred = Q.defer();
          if(subscriptionSuccess){
            deferred.resolve({status: "subscribed"});
          }else{
            deferred.resolve({status: "trial"});
          }
          return deferred.promise;
        }
      };
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache){
    modalSuccess = true;
    modalResult = "";
    subscriptionSuccess = false;

    $templateCache.put("subscription-status/subscription-status-template.html", "<p>mock</p>");
    $compile = _$compile_;
    $rootScope = _$rootScope_;

    $emitSpy = sinon.spy($rootScope, "$emit");

    element = $compile("<div id='subscription-status' subscription-status product-id='productId' " +
    "product-code='productCode' company-id='companyId' ng-model='subscribed'></div>")($rootScope);
  }));

  beforeEach(function(done) {
    $rootScope.$digest();

    setTimeout(function() {
      done();
    }, 10);
  });

  it("should replace the element with the appropriate content", function() {
    expect(element.html()).to.equal("<p>mock</p>");
  });

  it("should add watchers", function() {
    expect(element.isolateScope().$$watchers[0].exp).to.equal("subscriptionStatus");
    expect(element.isolateScope().$$watchers[1].exp).to.equal("companyId");
    expect(element.isolateScope().$$watchers[2]).to.be.undefined;
  });

  it("watch companyId and update checkSubscriptionStatus", function() {
    expect(element.isolateScope().subscriptionStatus).to.deep.equal({"status": "trial"});
    expect(element.isolateScope().storeAccountUrl).to.equal("https://store.risevision.com/account?cid=companyId");
    expect(element.isolateScope().storeUrl).to.equal("https://store.risevision.com/product/productId/?cid=companyId");

    $emitSpy.should.have.been.calledOnce;
    $emitSpy.should.have.been.calledWith("subscription-status:changed", {status: "trial"});
  });

  it("should listen to 'refreshSubscriptionStatus' event", function(done) {
    $emitSpy.reset();
    subscriptionSuccess = true;

    $rootScope.$emit("refreshSubscriptionStatus");
    $rootScope.$digest();

    setTimeout(function() {
      expect(element.isolateScope().subscriptionStatus).to.deep.equal({"status": "subscribed"});

      // First $emit is from this test
      $emitSpy.should.have.been.calledTwice;
      $emitSpy.should.have.been.calledWith("subscription-status:changed", {status: "subscribed"});

      done();
    }, 10);
  });

  it("use the provided Store link", function(done) {
    element = $compile("<div id='subscription-status' subscription-status product-id='productId' " +
                       "product-code='productCode' company-id='companyId' ng-model='subscribed' " +
                       "custom-product-link='http://testurl.com'></div>")($rootScope);

    $rootScope.$digest();

    setTimeout(function() {
      expect(element.isolateScope().storeUrl).to.equal("http://testurl.com");
      done();
    }, 0);
  });
});
