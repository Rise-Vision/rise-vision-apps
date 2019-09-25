/* jshint expr: true */

(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;

  var UrlFieldScenarios = function() {
    describe("URL Field Component", function() {

      var validUrl = "https://www.example.com/foo/?bar=baz&inga=42&quux",
        invalidUrl = "http://a.b--c.de/";

      beforeEach(function (){
        browser.get("/test/e2e/components/background-image-setting/url-field.html");
      });

      describe("** Standard functionality **", function () {

        it("Should correctly load", function () {
          // ensure validate checkbox is checked
          expect(element(by.css("#main input[name=validate-url]")).getAttribute("checked")).
            to.eventually.be.null;
          // ensure storage selector is displayed
          expect(element(by.css("#main .input-group")).isPresent()).to.eventually.be.true;
          expect(element(by.css("#main .input-url-addon")).isPresent()).to.eventually.be.true;
        });

        it("Should update input field via two-way binding", function () {
          element(by.css("#main input[name='url']")).sendKeys(validUrl);

          expect(element(by.css("#main input[name=url]")).getAttribute("value")).
            to.eventually.equal(validUrl);

          element(by.css("#main input[name='url']")).clear();
          element(by.css("#main input[name='url']")).sendKeys(invalidUrl);

          expect(element(by.css("#main input[name=url]")).getAttribute("value")).
            to.eventually.equal(invalidUrl);
        });

        it("Should provide checkbox to opt in or out of validating based on invalid URL entry", function () {
          element(by.css("#main input[name='url']")).sendKeys(invalidUrl);

          // ensure validate checkbox is displayed
          expect(element(by.css("#main input[name=validate-url]")).isDisplayed()).to.eventually.be.true;
        });

        it("Should show and hide error message based on valid and invalid URL entry", function () {
          element(by.css("#main input[name='url']")).sendKeys(validUrl);

          // ensure no error message
          expect(element(by.css("#main .text-danger")).isPresent()).to.eventually.be.false;

          element(by.css("#main input[name='url']")).clear();
          element(by.css("#main input[name='url']")).sendKeys(invalidUrl);

          // ensure error message shown
          expect(element(by.css("#main .text-danger")).isPresent()).to.eventually.be.true;
        });

        it("Should bypass validation when checking 'Remove Validation' checkbox ", function () {
          element(by.css("#main input[name='url']")).sendKeys(invalidUrl);

          // ensure remove validation checkbox is displayed
          expect(element(by.css("#main input[name=validate-url]")).isDisplayed()).to.eventually.be.true;
          // ensure remove validation checkbox is not checked
          expect(element(by.css("#main input[name=validate-url]")).getAttribute("checked")).
            to.eventually.be.null;

          element(by.css("#main input[name=validate-url]")).click();

          // ensure the checkbox has been checked
          expect(element(by.css("#main input[name=validate-url]")).getAttribute("checked")).
            to.eventually.not.be.null;
          // ensure no error message
          expect(element(by.css("#main .text-danger")).isPresent()).to.eventually.be.false;

          element(by.css("#main input[name='url']")).clear();
          element(by.css("#main input[name='url']")).sendKeys(validUrl);

          element(by.css("#main input[name='url']")).clear();
          element(by.css("#main input[name='url']")).sendKeys(invalidUrl);

          // ensure no error message
          expect(element(by.css("#main .text-danger")).isPresent()).to.eventually.be.false;
        });

        it("Should turn validation back on when un-checking 'Remove Validation' checkbox ", function () {
          element(by.css("#main input[name='url']")).sendKeys(invalidUrl);

          element(by.css("#main input[name=validate-url]")).click();

          element(by.css("#main input[name='url']")).clear();
          element(by.css("#main input[name='url']")).sendKeys(validUrl);

          element(by.css("#main input[name='url']")).clear();
          element(by.css("#main input[name='url']")).sendKeys(invalidUrl);

          // ensure no error message
          expect(element(by.css("#main .text-danger")).isPresent()).to.eventually.be.false;

          element(by.css("#main input[name=validate-url]")).click();

          // ensure error message shown
          expect(element(by.css("#main .text-danger")).isDisplayed()).to.eventually.be.true;
        });
      });

      describe("** Hiding functionality **", function () {

        it("Should hide the label", function () {
          expect(element(by.css("#hiding div.form-group > label")).isPresent()).to.eventually.be.false;
        });

        it("Should hide the storage selector", function () {
          // ensure storage selector is displayed
          expect(element(by.css("#hiding .input-group")).isPresent()).to.eventually.be.false;
          expect(element(by.css("#hiding .input-url-addon")).isPresent()).to.eventually.be.false;
        });

      });

      describe("** Initial empty value functionality **", function () {

        it("Should allow empty default value to be deemed valid", function () {
          // ensure no error message
          expect(element(by.css("#empty .text-danger")).isPresent()).to.eventually.be.false;

          // ensure validate checkbox is not displayed
          expect(element(by.css("#empty input[name=validate-url]")).isDisplayed()).to.eventually.be.false;
        });

      });

      describe("** File type functionality **", function () {

        it("Should validate url to have appropriate image file type", function () {
          var extensions = [".jpg", ".jpeg", ".png", ".bmp", ".svg", ".gif"],
            i;

          for (i = 0; i < extensions.length; i += 1) {
            element(by.css("#imageType input[name='url']")).clear();
            element(by.css("#imageType input[name='url']")).sendKeys(validUrl);

            // ensure error message shown
            expect(element(by.css("#imageType .text-danger")).isPresent()).to.eventually.be.true;

            element(by.css("#imageType input[name='url']")).clear();
            element(by.css("#imageType input[name='url']")).sendKeys(validUrl + "/image" + extensions[i]);

            // ensure no error message
            expect(element(by.css("#imageType .text-danger")).isPresent()).to.eventually.be.false;
          }

        });

        it("Should validate url to have appropriate video file type", function () {
          var extensions = [".webm", ".mp4", ".ogv", ".ogg"],
            i;

          for (i = 0; i < extensions.length; i += 1) {
            element(by.css("#videoType input[name='url']")).clear();
            element(by.css("#videoType input[name='url']")).sendKeys(validUrl);

            // ensure error message shown
            expect(element(by.css("#videoType .text-danger")).isPresent()).to.eventually.be.true;

            element(by.css("#videoType input[name='url']")).clear();
            element(by.css("#videoType input[name='url']")).sendKeys(validUrl + "/video" + extensions[i]);

            // ensure no error message
            expect(element(by.css("#videoType .text-danger")).isPresent()).to.eventually.be.false;
          }

        });

      });

    });
  };
  module.exports = URlFieldScenarios;

})();
