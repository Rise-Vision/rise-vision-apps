'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var PresentationListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var helper = require('rv-common-e2e').helper;
var PresentationPropertiesModalPage = require('./../pages/presentationPropertiesModalPage.js');
var StoreProductsModalPage = require('./../pages/storeProductsModalPage.js');
var ProductDetailsModalPage = require('./../pages/productDetailsModalPage.js');

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

      loadEditor();
      selectSubCompany();
      openContentModal();
    });

    it('should open the Store Templates Modal', function () {
      expect(storeProductsModalPage.getStoreProductsModal().isDisplayed()).to.eventually.be.true;
    });

    it('should show modal title', function () {
      expect(storeProductsModalPage.getModalTitle().getText()).to.eventually.equal('Add From Template');
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
    });

    it('should show Add Blank Presentation',function(){
      expect(storeProductsModalPage.getAddBlankPresentation().isDisplayed()).to.eventually.be.true;
    });

    it('should show a link to Missing Template form',function(){
      expect(storeProductsModalPage.getSuggestTemplate().isDisplayed()).to.eventually.be.true;
    });

  });
};
module.exports = TemplateAddScenarios;
