(function() {
  'use strict';

  var CommonHeaderPage = require('./../common-header/pages/commonHeaderPage.js');
  var PricingComponentModalPage = require('./../common/pages/pricingComponentModalPage.js');
  var PurchaseFlowModalPage = require('./../common/pages/purchaseFlowModalPage.js');
  var PresentationListPage = require('./pages/presentationListPage.js');
  var TemplateEditorPage = require('./pages/templateEditorPage.js');
  var helper = require('rv-common-e2e').helper;

  var TemplateEditorAddScenarios = require('./cases/template-editor-add.js');
  var FinancialComponentScenarios = require('./cases/components/financial.js');
  var TextComponentScenarios = require('./cases/components/text.js');
  
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
      helper.waitForSpinner();
      helper.wait(templateEditorPage.seePlansLink(), 'See Plans Link');
      helper.clickWhenClickable(templateEditorPage.seePlansLink(), 'See Plans Link');

      helper.wait(pricingComponentModalPage.getSubscribeButton(), 'Subscribe Button');
      helper.clickWhenClickable(pricingComponentModalPage.getSubscribeButton(), 'Subscribe Button');

      helper.waitDisappear(pricingComponentModalPage.getSubscribeButton(), 'Subscribe Button Disappear');

      purchaseFlowModalPage.purchase();
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

    after(function() {
      // Loading the Presentation List is a workaround to a Chrome Driver issue that has it fail to click on elements over the Preview iframe
      presentationsListPage.loadCurrentCompanyPresentationList();
      commonHeaderPage.deleteCurrentCompany();
    });
  });
})();
