(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;

  var SubscriptionStatusScenarios = function() {

    describe("Subscription Status Component", function() {
      beforeEach(function (){
        browser.get("/test/e2e/components/subscription-status/subscription-status.html");
      });

      describe("Simple format", function() {
        it("Should show the default subscription status", function () {
          expect(element(by.css("#subscription-status h3 span")).isPresent()).
            to.eventually.be.true;

          expect(element(by.css("#subscription-status h3 span")).getText()).
            to.eventually.equal("subscription-status.na");
        });

        it("Should show a valid subscription status", function () {
          element(by.id("setValid")).click();

          expect(element(by.css("#subscription-status h3 span")).getText()).
            to.eventually.equal("subscription-status.free");
        });

        it("Should show an invalid subscription status", function () {
          element(by.id("setInvalid")).click();

          expect(element(by.css("#subscription-status h3 span")).getText()).
            to.eventually.equal("subscription-status.na");
        });

        it("Should show an expired subscription status", function () {
          element(by.id("setExpired")).click();

          expect(element(by.css("#subscription-status h3 span")).getText()).
            to.eventually.equal("subscription-status.trial-expired");
        });
      });

      describe("Expanded format", function() {
        it("Should not show for Active subscription status", function () {
          element(by.id("setActive")).click();

          expect(element(by.css(".subscription-status")).isDisplayed()).to.eventually.be.false;
        });

        it("Should not show a Cancelled but Active subscription status", function () {
          element(by.id("setCancelledActive")).click();

          expect(element(by.css(".subscription-status.cancelled")).isDisplayed()).to.eventually.be.false;
        });

        it("Should show a Cancelled subscription status", function () {
          element(by.id("setCancelledInactive")).click();

          expect(element(by.css(".subscription-status.cancelled")).isDisplayed()).to.eventually.be.true;
        });
      });
    });

  };
  module.exports = SubscriptionStatusScenarios;

})();
