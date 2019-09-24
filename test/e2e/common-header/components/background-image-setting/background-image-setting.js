(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;

  var BackgroundImageSettingScenarios = function() {

    describe("Background Image Setting Component", function() {
      beforeEach(function (){
        browser.get("/test/e2e/common-header/components/background-image-setting/background-image-setting.html");
      });

      describe("** Standard functionality **", function () {

        it("Should correctly load", function () {
          // color picker input box displayed
          expect(element(by.css("div[colorpicker]")).isDisplayed()).to.eventually.be.true;
          // color picker addon present
          expect(element(by.css(".color-wheel")).isPresent()).to.eventually.be.true;
          // image choice checkbox displayed
          expect(element(by.css("input[name=choice]")).isDisplayed()).to.eventually.be.true;

          // ensure use image checkbox is not checked
          expect(element(by.model("background.useImage")).isSelected()).to.eventually.be.false;

          // all background image controls should not exist
          expect(element(by.id("backgroundImageControls")).isPresent()).to.eventually.be.false;

          // color container and position container classes should be set
          expect(element(by.css(".colorParentClass")).isPresent()).to.eventually.be.true;
          expect(element(by.css(".colorClass")).isPresent()).to.eventually.be.true;


        });

        it("Should display and correctly load the image controls", function () {
          element(by.css("input[name=choice]")).click();

          expect(element(by.model("background.useImage")).isSelected()).to.eventually.be.true;

          expect(element(by.id("backgroundImageControls")).isPresent()).to.eventually.be.true;

          expect(element(by.css(".image-placeholder")).isPresent()).to.eventually.be.true;
          expect(element(by.css(".image-placeholder")).isDisplayed()).to.eventually.be.true;

          expect(element(by.css("img")).isPresent()).to.eventually.be.true;
          expect(element(by.css("img")).isDisplayed()).to.eventually.be.false;

          expect(element(by.model("background.image.scale")).isSelected()).to.eventually.be.true;

          expect(element(by.css(".positionParentClass")).isPresent()).to.eventually.be.true;
          expect(element(by.css(".positionClass")).isPresent()).to.eventually.be.true;

          expect(element(by.css(".repeatParentClass")).isPresent()).to.eventually.be.true;
          expect(element(by.css(".repeatClass")).isPresent()).to.eventually.be.true;
        });

        it("Should successfully load image and display it", function () {
          element(by.css("input[name=choice]")).click();
          element(by.css("#backgroundImageUrl input[name='url']")).sendKeys("images/background_image.jpg");

          // do arbitrary task to take focus off url field
          element(by.css("#backgroundImageUrl input[name='url']")).sendKeys(protractor.Key.TAB);

          // image placeholder should be removed
          expect(element(by.css(".image-placeholder")).isPresent()).to.eventually.be.false;
          // img element should be displayed
          expect(element(by.css("img")).isDisplayed()).to.eventually.be.true;

        });

        it("Should not successfully load image and maintain displaying placeholder image", function () {
          element(by.css("input[name=choice]")).click();
          element(by.css("#backgroundImageUrl input[name='url']")).sendKeys("images/test.jpg");

          // do arbitrary task to take focus off url field
          element(by.css("input[name=scale]")).click();

          // image placeholder should be present
          expect(element(by.css(".image-placeholder")).isPresent()).to.eventually.be.true;
          expect(element(by.css(".image-placeholder")).isDisplayed()).to.eventually.be.true;
          // img element should not be displayed
          expect(element(by.css("img")).isDisplayed()).to.eventually.be.false;
        });

      });

    });

  };
  module.exports = BackgroundImageSettingScenarios;

})();
