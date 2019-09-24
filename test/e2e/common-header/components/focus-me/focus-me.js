(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;

  var FocusMeScenarios = function() {

    xdescribe("Focus Me: ", function() {
      beforeEach(function () {
        browser.get("/test/e2e/components/focus-me/focus-me.html");
      });

      it("Should load", function () {
        expect(element(by.id("firstInput")).isPresent()).to.eventually.be.true;
        expect(element(by.id("secondInput")).isPresent()).to.eventually.be.true;
      });
      
      it("Should focus only on firstInput", function() {
        expect(element(by.id("focusedElement")).getText()).to.eventually.equal("firstInput");
      });
      
      it("Should focus on secondInput", function() {
        element(by.id("focusSecond")).click();
        
        expect(element(by.id("focusedElement")).getText()).to.eventually.equal("secondInput");
      });
    });

  };
  module.exports = FocusMeScenarios;

})();
