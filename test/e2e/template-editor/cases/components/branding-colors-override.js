'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var BrandingColorsOverrideComponentPage = require('./../../pages/components/brandingColorsOverrideComponentPage.js');
var helper = require('rv-common-e2e').helper;

var BrandingColorsOverrideComponentScenarios = function () {
  describe('Branding Colors Override Component', function () {
    var presentationsListPage;
    var templateEditorPage;
    var brandingColorsOverrideComponentPage;

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      brandingColorsOverrideComponentPage = new BrandingColorsOverrideComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();

      presentationsListPage.createNewPresentationFromTemplate('Example Branding Template', 'example-branding-template');
    });

    describe('Branding Colors Override list', function () {

      it('should list Branding Colors Override Settings link', function () {
        expect(templateEditorPage.getBrandingColorsOverrideContainer().isDisplayed()).to.eventually.be.true;
        expect(templateEditorPage.getBrandingColorsOverrideEditLink().isDisplayed()).to.eventually.be.true;
      });

      it('should open Branding Colors Override Settings', function () {
        helper.clickWhenClickable(templateEditorPage.getBrandingColorsOverrideEditLink(),'Edit Branding Colors Override Link');
        browser.sleep(1000);

        expect(brandingColorsOverrideComponentPage.getCheckboxInput().isDisplayed()).to.eventually.be.true;
        expect(brandingColorsOverrideComponentPage.getCheckboxInput().isSelected()).to.eventually.be.false;

        expect(brandingColorsOverrideComponentPage.getColorsContainer().isDisplayed()).to.eventually.be.false;
      });

      it('should show color settings when override checkbox selected', function () {
        helper.clickWhenClickable(brandingColorsOverrideComponentPage.getCheckboxInput(),'Select override checkbox');
        browser.sleep(3000);

        expect(brandingColorsOverrideComponentPage.getColorsContainer().isDisplayed()).to.eventually.be.true;
        expect(brandingColorsOverrideComponentPage.getBaseColorInput().isDisplayed()).to.eventually.be.true;
        expect(brandingColorsOverrideComponentPage.getAccentColorInput().isDisplayed()).to.eventually.be.true;

        expect(brandingColorsOverrideComponentPage.getBaseColorInput().isEnabled()).to.eventually.be.true;
        expect(brandingColorsOverrideComponentPage.getAccentColorInput().isEnabled()).to.eventually.be.true;
      });

      it('should set colors', function() {
        brandingColorsOverrideComponentPage.getBaseColorInput().sendKeys("red");
        brandingColorsOverrideComponentPage.getAccentColorInput().sendKeys("yellow");

        expect(brandingColorsOverrideComponentPage.getBaseColorInput().getAttribute('value')).to.eventually.equal("red");
        expect(brandingColorsOverrideComponentPage.getAccentColorInput().getAttribute('value')).to.eventually.equal("yellow");
      });

    });

  });
};

module.exports = BrandingColorsOverrideComponentScenarios;
