'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var PresentationListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var helper = require('rv-common-e2e').helper;
var PresentationPropertiesModalPage = require('./../pages/presentationPropertiesModalPage.js');
var StoreProductsModalPage = require('./../pages/storeProductsModalPage.js');
var ProductDetailsModalPage = require('./../pages/productDetailsModalPage.js');

var TemplateAddScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe("In order to manage presentations " +
    "As a user signed in " +
    "I would like to add presentations", function () {
    var subCompanyName = 'E2E TEST SUBCOMPANY';
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var presentationsListPage;
    var workspacePage;
    var presentationPropertiesModalPage;
    var storeProductsModalPage;
    var productDetailsModalPage;

    function loadEditor() {
      homepage.getEditor();
      loginPage.signIn();
    }

    function openContentModal() {
      helper.waitDisappear(presentationsListPage.getPresentationsLoader(),'Presentation loader');
      presentationsListPage.getPresentationAddButton().click();

      helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');
    }

    function createSubCompany() {
      commonHeaderPage.createSubCompany(subCompanyName);
    }

    function selectSubCompany() {
      commonHeaderPage.selectSubCompany(subCompanyName);
    }

    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      presentationsListPage = new PresentationListPage();
      workspacePage = new WorkspacePage();
      commonHeaderPage = new CommonHeaderPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();
      storeProductsModalPage = new StoreProductsModalPage();
      productDetailsModalPage = new ProductDetailsModalPage();

      loadEditor();
      createSubCompany();
      selectSubCompany();
      openContentModal();
    });

    after(function() {
      loadEditor();
      commonHeaderPage.deleteAllSubCompanies();
    });

    it('should open the Store Templates Modal', function () {
      expect(storeProductsModalPage.getStoreProductsModal().isDisplayed()).to.eventually.be.true;
    });

    it('should show modal title', function () {
      expect(storeProductsModalPage.getModalTitle().getText()).to.eventually.equal('Add a New Presentation');
    });

    it('should show a search box', function () {
      expect(storeProductsModalPage.getSearchFilter().isDisplayed()).to.eventually.be.true;
      expect(storeProductsModalPage.getSearchInput().getAttribute('placeholder')).to.eventually.equal('Search for Templates');
    });

    it('should show a banner for Templates Library', function () {
      expect(storeProductsModalPage.getDisplayBanner().isDisplayed()).to.eventually.be.true;
      expect(storeProductsModalPage.getDisplayBanner().getAttribute('href')).to.eventually.equal('https://store.risevision.com/product/300/template-library-subscription');
    });

    it('should show search categories', function() {
      expect(storeProductsModalPage.getSearchCategories().count()).to.eventually.equal(3);
      expect(storeProductsModalPage.getSearchCategories().get(0).getText()).to.eventually.equal('ALL');
      expect(storeProductsModalPage.getSearchCategories().get(1).getText()).to.eventually.equal('FREE');
      expect(storeProductsModalPage.getSearchCategories().get(2).getText()).to.eventually.equal('PREMIUM');
    });

    it('should show a list of templates', function () {
      expect(storeProductsModalPage.getStoreProductsList().isDisplayed()).to.eventually.be.true;
    });

    it('should show templates, free and premium', function () {
      helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader(), 'Store products loader');

      expect(storeProductsModalPage.getStoreProducts().count()).to.eventually.be.above(0);
      
      expect(storeProductsModalPage.getFreeProducts().count()).to.eventually.be.above(0);
      expect(storeProductsModalPage.getPremiumProducts().count()).to.eventually.be.above(0);
    });

    it('should show Add Blank Presentation',function(){
      expect(storeProductsModalPage.getAddBlankPresentation().isDisplayed()).to.eventually.be.true;
    });

    it('should show a link to Missing Template form',function(){
      expect(storeProductsModalPage.getSuggestTemplate().isDisplayed()).to.eventually.be.true;
    });
    
    it('should filter Free templates', function() {
      storeProductsModalPage.getSearchCategories().get(1).click();

      expect(storeProductsModalPage.getFreeProducts().count()).to.eventually.be.above(0);
      expect(storeProductsModalPage.getPremiumProducts().count()).to.eventually.equal(0);
    });

    it('should filter Premium templates', function() {
      storeProductsModalPage.getSearchCategories().get(2).click();

      expect(storeProductsModalPage.getFreeProducts().count()).to.eventually.equal(0);
      expect(storeProductsModalPage.getPremiumProducts().count()).to.eventually.be.above(0);
    });
    
    it('should show all templates again', function () {
      storeProductsModalPage.getSearchCategories().get(0).click();

      expect(storeProductsModalPage.getFreeProducts().count()).to.eventually.be.above(0);
      expect(storeProductsModalPage.getPremiumProducts().count()).to.eventually.be.above(0);
    });

    it('should show preview modal when selecting a free template',function(){
      storeProductsModalPage.getFreeProducts().get(0).click();
      browser.sleep(1000);
      expect(productDetailsModalPage.getProductDetailsModal().isDisplayed()).to.eventually.be.true;
      expect(productDetailsModalPage.getUseProductButton().isDisplayed()).to.eventually.be.true;
      expect(productDetailsModalPage.getUseProductButton().getText()).to.eventually.equal('Start with this Template');
      expect(productDetailsModalPage.getCloseButton().isDisplayed()).to.eventually.be.true;
      productDetailsModalPage.getCloseButton().click();
      browser.sleep(1000);
    });

    it('should show preview modal selecting a premium template',function(){
      storeProductsModalPage.getPremiumProducts().get(0).click();
      browser.sleep(1000);
      helper.waitDisappear(productDetailsModalPage.getPricingLoader(), 'Pricing loader');
      expect(productDetailsModalPage.getProductDetailsModal().isDisplayed()).to.eventually.be.true;
      expect(productDetailsModalPage.getViewInStoreButton().isDisplayed()).to.eventually.be.true;
      expect(productDetailsModalPage.getViewInStoreButton().getText()).to.eventually.contain('Purchase in Store');
      expect(productDetailsModalPage.getPreviewTemplate().isDisplayed()).to.eventually.be.true;
      expect(productDetailsModalPage.getPreviewTemplate().getAttribute('href')).to.eventually.contain('http://preview.risevision.com');
      productDetailsModalPage.getCloseButton().click();
      browser.sleep(1000);
    });

    it('should start a trial and, next time product details is open, Select Template button will be shown',function(done){
      storeProductsModalPage.getPremiumProducts().get(0).click();
      browser.sleep(1000);
      helper.waitDisappear(productDetailsModalPage.getPricingLoader(), 'Pricing loader');
      expect(productDetailsModalPage.getProductDetailsModal().isDisplayed()).to.eventually.be.true;
      expect(productDetailsModalPage.getStartTrialButton().isDisplayed()).to.eventually.be.true;
      productDetailsModalPage.getStartTrialButton().click();
      helper.waitDisappear(productDetailsModalPage.getProductDetailsModal(), 'Storage Selector Modal');
      browser.sleep(1000);

      // Hack to account for error when selecting a product on staging
      productDetailsModalPage.getErrorDialogCloseButton().isDisplayed()
      .then(function(displayed) {
        return displayed;
      }, function (err) {
        return false;
      })
      .then(function (displayed) {
        if(displayed) {
          productDetailsModalPage.getErrorDialogCloseButton().click();
          browser.sleep(1000);
        }

        // Reload page and select company whose trial has just started
        loadEditor();
        selectSubCompany();
        openContentModal();
        browser.sleep(2000);
        // Validate buttons are updated as expected
        storeProductsModalPage.getPremiumProducts().get(0).click();
        browser.sleep(1000);
        helper.waitDisappear(productDetailsModalPage.getPricingLoader(), 'Pricing loader');
        expect(productDetailsModalPage.getProductDetailsModal().isDisplayed()).to.eventually.be.true;
        helper.wait(productDetailsModalPage.getUseProductButton(),'Use Product Button');
        expect(productDetailsModalPage.getUseProductButton().isDisplayed()).to.eventually.be.true;
        productDetailsModalPage.getCloseButton().click();
        browser.sleep(1000);
        done();
      });
    });

    // The Store Templates are not yet released to sub-companies
    // so there are no templates to select; disabled tests
    // TODO: re-enable tests when templates are released
    xit('should open the Template presentation', function () {
      storeProductsModalPage.getAddProductButtons().get(0).click();

      helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');

      expect(presentationPropertiesModalPage.getNameInput().getAttribute('value')).to.eventually.contain('Copy of ');
    });

    xit('should treat template as New Presentation', function () {
      expect(workspacePage.getPreviewButton().getAttribute('disabled')).to.eventually.equal('true');

      expect(workspacePage.getPublishButton().isDisplayed()).to.eventually.be.false;
      expect(workspacePage.getRestoreButton().isDisplayed()).to.eventually.be.false;
      expect(workspacePage.getDeleteButton().isDisplayed()).to.eventually.be.false;

      expect(workspacePage.getSaveButton().isPresent()).to.eventually.be.true;
      expect(workspacePage.getCancelButton().isPresent()).to.eventually.be.true;
    });

  });
};
module.exports = TemplateAddScenarios;
