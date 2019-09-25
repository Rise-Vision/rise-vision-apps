(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;
  var helper = require('rv-common-e2e').helper;

  var DistributionSelector = function() {

    describe("distribution selector", function() {
      beforeEach(function () {
        browser.get("/test/e2e/components/distribution-selector/distribution-selector.html");
      });

      it("Should load", function () {
        expect(element(by.model("distributeToAll")).isDisplayed()).to.eventually.be.true;
        expect(element(by.model("distributeToAll")).isSelected()).to.eventually.be.true;
        expect(element(by.id("distributeToAllText")).getText()).to.eventually.equal("Select All Displays");
      });

      it("Should show the distribution field", function () {
        element(by.model("distributeToAll")).click();

        expect(element(by.css("#distributionField")).isDisplayed())
          .to.eventually.be.true;
      });

      it("Should hide the distribution field", function () {
        element(by.model("distributeToAll")).click();
        element(by.model("distributeToAll")).click();

        expect(element(by.css("#distributionField")).isPresent())
          .to.eventually.be.false;
      });


      it("Should open dialog", function () {
        element(by.model("distributeToAll")).click();
        element(by.css("#distributionField")).click();

        expect(element(by.css(".modal-dialog .modal-content")).isPresent())
          .to.eventually.be.true;

        element.all(by.css(".modal-footer .btn")).then(function (elements) {
          expect(elements.length).to.equal(2);

          expect(elements[0].getText()).to.eventually.equal("Apply");
          expect(elements[1].getText()).to.eventually.equal("Cancel");
        });
      });

      describe("Distribution selection", function() {
        beforeEach(function() {
          element(by.model("distributeToAll")).click();
          element(by.css("#distributionField")).click();
          helper.wait(element(by.css(".modal-dialog .modal-content")), "Distribution modal");
        });

        it("Should show correct displays", function () {

          element.all(by.css(".display .display-name")).then(function (elements) {
            expect(elements.length).to.equal(3);

            expect(elements[1].getText()).to.eventually.equal("display2");
          });

          expect(element(by.css(".display .active")).isPresent())
            .to.eventually.be.false;
        });

        it("Selecting a display and clicking on the Apply Button should add it to distribution", function () {
          element.all(by.css(".display .display-name")).then(function (elements) {
            elements[1].click();
            element(by.id("applyButton")).click();
            helper.wait(element(by.id("distributionFieldText")), "Distribution text");

            expect(element(by.id("distributionFieldText")).getText()).to.eventually.equal('1 Display Selected');
            expect(element(by.id("distributionValue")).getText()).to.eventually.equal('["id2"]');
            expect(element(by.id("distributeToAllValue")).getText()).to.eventually.equal('false');
          });
        });

        it("Selecting two displays and clicking on the Apply Button should add them to distribution", function () {
          element.all(by.css(".display .display-name")).then(function (elements) {
            elements[1].click();
            elements[2].click();

            element(by.id("applyButton")).click();
            helper.wait(element(by.id("distributionFieldText")), "Distribution text");
            expect(element(by.id("distributionFieldText")).getText()).to.eventually.equal('2 Displays Selected');
            expect(element(by.id("distributionValue")).getText()).to.eventually.equal('["id2","id3"]');
            expect(element(by.id("distributeToAllValue")).getText()).to.eventually.equal('false');

          });
        });

        it("Deselecting displays should remove displays from the distribution", function () {
          element.all(by.css(".display .display-name")).then(function (elements) {
            elements[1].click();
            elements[2].click();

            element(by.id("applyButton")).click();

            helper.wait(element(by.id("distributionFieldText")), "Distribution text");

            element(by.css("#distributionField")).click();
            helper.wait(element(by.css(".modal-dialog .modal-content")), "Distribution modal");

            element.all(by.css(".display .display-name")).then(function (elements) {
              elements[1].click();
              elements[2].click();

              element(by.id("applyButton")).click();
              helper.wait(element(by.id("distributionFieldText")), "Distribution text");

              expect(element(by.id("distributionFieldText")).getText()).to.eventually.equal('No Displays Selected');
              expect(element(by.id("distributionValue")).getText()).to.eventually.equal('[]');
              expect(element(by.id("distributeToAllValue")).getText()).to.eventually.equal('false');
            });
          });
        });

        it("Checking all displays checkbox should set distributeToAll true", function () {
          element.all(by.css(".display .display-name")).then(function (elements) {
            elements[1].click();
            elements[2].click();
            element(by.id("applyButton")).click();

            helper.wait(element(by.id("distributionFieldText")), "Distribution text");

            expect(element(by.id("distributionFieldText")).getText()).to.eventually.equal('2 Displays Selected');
            expect(element(by.id("distributionValue")).getText()).to.eventually.equal('["id2","id3"]');
            expect(element(by.id("distributeToAllValue")).getText()).to.eventually.equal('false');

            element(by.model("distributeToAll")).click();
            expect(element(by.id("distributeToAllValue")).getText()).to.eventually.equal('true');
          });

        });

      });
    });

  };
  module.exports = DistributionSelector;
  
})();
