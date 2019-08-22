(function() {
  'use strict';

  var CommonHeaderPage = require('./../../../web/bower_components/common-header/test/e2e/pages/commonHeaderPage.js');
  var PricingComponentModalPage = require('./../common/pages/pricingComponentModalPage.js');
  var PurchaseFlowModalPage = require('./../common/pages/purchaseFlowModalPage.js');
  var PresentationListPage = require('./pages/presentationListPage.js');
  var TemplateEditorPage = require('./pages/templateEditorPage.js');
  var helper = require('rv-common-e2e').helper;

  var TemplateEditorAddScenarios = require('./cases/template-editor-add.js');
  var FinancialComponentScenarios = require('./cases/components/financial.js');
  var TextComponentScenarios = require('./cases/components/text.js');
  var WeatherComponentScenarios = require('./cases/components/weather.js');
  var ImageComponentScenarios = require('./cases/components/image.js');
  var SlidesComponentScenarios = require('./cases/components/slides.js');
  var VideoComponentScenarios = require('./cases/components/video.js');
  var RssComponentScenarios = require('./cases/components/rss.js');

  describe('Template Editor', function() {

    var subCompanyName = 'E2E TEST SUBCOMPANY - TEMPLATE EDITOR';
    var commonHeaderPage;
    var pricingComponentModalPage;
    var purchaseFlowModalPage;
    var presentationsListPage;
    var templateEditorPage;

    function _createSubCompany() {
      commonHeaderPage.createSubCompany(subCompanyName);
    }

    function _selectSubCompany() {
      commonHeaderPage.selectSubCompany(subCompanyName);
    }

    function _purchaseSubscription() {
      helper.waitDisappear(presentationsListPage.getPresentationsLoader(), 'Presentation loader');
      helper.wait(templateEditorPage.seePlansLink(), 'See Plans Link');
      helper.clickWhenClickable(templateEditorPage.seePlansLink(), 'See Plans Link');

      helper.wait(pricingComponentModalPage.getSubscribeButton(), 'Subscribe Button');
      helper.clickWhenClickable(pricingComponentModalPage.getSubscribeButton(), 'Subscribe Button');

      helper.waitDisappear(pricingComponentModalPage.getSubscribeButton(), 'Subscribe Button Disappear');

      helper.wait(purchaseFlowModalPage.getContinueButton(), 'Purchase flow Billing');
      browser.sleep(1000);
      helper.clickWhenClickable(purchaseFlowModalPage.getContinueButton(), 'Purchase flow Billing');
      helper.waitDisappear(purchaseFlowModalPage.getEmailField(), 'Purchase flow Billing');
      browser.sleep(1000);
      purchaseFlowModalPage.getCompanyNameField().sendKeys('same');
      purchaseFlowModalPage.getStreet().sendKeys('2967 Dundas St. W #632');
      purchaseFlowModalPage.getCity().sendKeys('Toronto');
      purchaseFlowModalPage.getCountry().sendKeys('Can');
      purchaseFlowModalPage.getProv().sendKeys('O');
      purchaseFlowModalPage.getPC().sendKeys('M6P 1Z2');
      browser.sleep(1000);
      helper.clickWhenClickable(purchaseFlowModalPage.getContinueButton(), 'Purchase flow Shipping');
      helper.waitDisappear(purchaseFlowModalPage.getCompanyNameField(), 'Purchase flow Shipping');
      purchaseFlowModalPage.getCardName().sendKeys('AAA');
      purchaseFlowModalPage.getCardNumber().sendKeys('4242424242424242');
      purchaseFlowModalPage.getCardExpMon().sendKeys('0');
      purchaseFlowModalPage.getCardExpYr().sendKeys('222');
      purchaseFlowModalPage.getCardCVS().sendKeys('222');
      browser.sleep(1000);
      helper.clickWhenClickable(purchaseFlowModalPage.getContinueButton(), 'Purchase flow Payment');
      helper.wait(purchaseFlowModalPage.getPayButton(), 'Purchase flow Payment');
      browser.sleep(3000);
      helper.clickWhenClickable(purchaseFlowModalPage.getPayButton(), 'Purchase flow Review');
      helper.waitDisappear(purchaseFlowModalPage.getPayButton(), 'Purchase flow Complete');
    }

    before(function () {
      commonHeaderPage = new CommonHeaderPage();
      presentationsListPage = new PresentationListPage();
      pricingComponentModalPage = new PricingComponentModalPage();
      purchaseFlowModalPage = new PurchaseFlowModalPage();
      templateEditorPage = new TemplateEditorPage();

      presentationsListPage.loadPresentationsList();
      _createSubCompany();
      _selectSubCompany();
      _purchaseSubscription();
      // Sometimes the trial does not start in time; this section tries to reduce the number of times this step fails
      browser.sleep(5000);
      presentationsListPage.loadPresentationsList();
      _selectSubCompany();
    });

    // Text component scenarios deal with the auto schedule modal, so they always should come first.
    var textComponentScenarios = new TextComponentScenarios();
    var templateEditorAddScenarios = new TemplateEditorAddScenarios();
    var financialComponentScenarios = new FinancialComponentScenarios();
    var weatherComponentScenarios = new WeatherComponentScenarios();
    var imageComponentScenarios = new ImageComponentScenarios();
    var slidesComponentScenarios = new SlidesComponentScenarios();
    var videoComponentScenarios = new VideoComponentScenarios();
    var rssComponentScenarios = new RssComponentScenarios();

    after(function() {
      // Loading the Presentation List is a workaround to a Chrome Driver issue that has it fail to click on elements over the Preview iframe
      presentationsListPage.loadCurrentCompanyPresentationList();
      commonHeaderPage.deleteCurrentCompany();
    });
  });
})();
