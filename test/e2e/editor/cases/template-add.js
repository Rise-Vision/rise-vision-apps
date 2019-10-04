'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var SignInPage = require('./../../launcher/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var PresentationListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var helper = require('rv-common-e2e').helper;
var PresentationPropertiesModalPage = require('./../pages/presentationPropertiesModalPage.js');
var StoreProductsModalPage = require('./../pages/storeProductsModalPage.js');
var ProductDetailsModalPage = require('./../pages/productDetailsModalPage.js');
var PricingComponentModalPage = require('./../../common/pages/pricingComponentModalPage.js');

var TemplateAddScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe('Template Add', function () {
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var presentationsListPage;
    var workspacePage;
    var presentationPropertiesModalPage;
    var storeProductsModalPage;
    var productDetailsModalPage;
    var pricingComponentModalPage;

    function loadEditor() {
      homepage.getEditor();
      signInPage.signIn();
    }

    function openContentModal() {
      helper.waitDisappear(presentationsListPage.getPresentationsLoader(),'Presentation loader');
      presentationsListPage.getPresentationAddButton().click();

      helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');
      
      helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader(), 'Store products loader');
    }

    function selectSubCompany() {
      commonHeaderPage.selectUnsubscribedSubCompany();
    }

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      presentationsListPage = new PresentationListPage();
      workspacePage = new WorkspacePage();
      commonHeaderPage = new CommonHeaderPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();
      storeProductsModalPage = new StoreProductsModalPage();
      productDetailsModalPage = new ProductDetailsModalPage();
      pricingComponentModalPage = new PricingComponentModalPage();

      loadEditor();
      selectSubCompany();
      openContentModal();
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

    xit('should show preview modal when selecting a free template',function(){
      storeProductsModalPage.getFreeProducts().get(0).click();

      helper.wait(productDetailsModalPage.getProductDetailsModal(), 'Product Details Modal');

      expect(productDetailsModalPage.getProductDetailsModal().isDisplayed()).to.eventually.be.true;
      expect(productDetailsModalPage.getUseProductButton().isDisplayed()).to.eventually.be.true;
      expect(productDetailsModalPage.getUseProductButton().getText()).to.eventually.equal('Start with this Template');
      expect(productDetailsModalPage.getCloseButton().isDisplayed()).to.eventually.be.true;
      productDetailsModalPage.getCloseButton().click();

      helper.waitDisappear(productDetailsModalPage.getProductDetailsModal(), 'Product Details Modal');
    });

    it('should show pricing component modal',function(){
      browser.call(()=>console.log("should show pricing component modal"));
      storeProductsModalPage.getPremiumProducts().get(0).click();

      helper.wait(productDetailsModalPage.getProductDetailsModal(), 'Product Details Modal');

      helper.waitDisappear(productDetailsModalPage.getPricingLoader(), 'Pricing loader');
      expect(productDetailsModalPage.getProductDetailsModal().isDisplayed()).to.eventually.be.true;
      expect(productDetailsModalPage.getStartTrialButton().isDisplayed()).to.eventually.be.true;
      productDetailsModalPage.getStartTrialButton().click();
      browser.call(()=>console.log("waiting for pricing component frame"));
      helper.wait(pricingComponentModalPage.getSubscribeButton(), 'Pricing Component Modal');
      browser.call(()=>console.log("subscribing"));
    });

    it('should initialize purchase flow', function() {
        browser.call(()=>console.log("waiting for getSubscribeButton"));
        helper.wait(pricingComponentModalPage.getSubscribeButton(), 'Subscribe Button');

        expect(pricingComponentModalPage.getSubscribeButton().isDisplayed()).to.eventually.be.true;

        // Note: No point to purchase here; we test purchase subscription and adding a template in other tests
        // helper.clickWhenClickable(pricingComponentModalPage.getSubscribeButton(), 'Subscribe Button');
        // browser.call(()=>console.log("clicked subscribe button"));
        // 
        // helper.waitDisappear(pricingComponentModalPage.getSubscribeButton(), 'Subscribe Button Disappear');
        // 
        // browser.call(()=>console.log("waiting purchase flow billing continue button"));

        // purchaseFlowModalPage.purchase();
    });
    
    xit('should show Select Template button', function() {
      browser.call(()=>console.log("should show select template button"));
      // Sometimes the trial does not start in time; this section tries to reduce the number of times this step fails
      browser.sleep(5000);
      // Reload page and select company whose trial has just started
      loadEditor();
      selectSubCompany();
      openContentModal();

      // Validate buttons are updated as expected
      storeProductsModalPage.getPremiumProducts().get(0).click();

      helper.wait(productDetailsModalPage.getProductDetailsModal(), 'Product Details Modal');

      helper.waitDisappear(productDetailsModalPage.getPricingLoader(), 'Pricing loader');
      expect(productDetailsModalPage.getProductDetailsModal().isDisplayed()).to.eventually.be.true;
      helper.wait(productDetailsModalPage.getUseProductButton(),'Use Product Button');
      expect(productDetailsModalPage.getUseProductButton().isDisplayed()).to.eventually.be.true;
      productDetailsModalPage.getCloseButton().click();
      
      helper.waitDisappear(productDetailsModalPage.getProductDetailsModal(), 'Product Details Modal');
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
