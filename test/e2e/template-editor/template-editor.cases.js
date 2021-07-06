(function() {
  'use strict';

  var CommonHeaderPage = require('./../common-header/pages/commonHeaderPage.js');
  var PresentationListPage = require('./pages/presentationListPage.js');

  var TemplateEditorAddScenarios = require('./cases/template-editor-add.js');
  var TextComponentScenarios = require('./cases/components/text.js');
  var FinancialComponentScenarios = require('./cases/components/financial.js');
  var WeatherComponentScenarios = require('./cases/components/weather.js');
  var BrandingComponentScenarios = require('./cases/components/branding.js');

  describe('Template Editor', function() {

    var subCompanyName = 'E2E TEST SUBCOMPANY - TEMPLATE EDITOR 1';
    var commonHeaderPage;
    var presentationsListPage;

    before(function () {
      commonHeaderPage = new CommonHeaderPage();
      presentationsListPage = new PresentationListPage();

      browser.driver.manage().window().setSize(1920, 1080);

      presentationsListPage.loadPresentationsList();
      commonHeaderPage.createSubscribedSubCompany(subCompanyName);

      commonHeaderPage.selectSubCompany(subCompanyName);
    });

    // These scenarios deal with the auto schedule modal, so they always should come first.
    var brandingComponentScenarios = new BrandingComponentScenarios();
    var templateEditorAddScenarios = new TemplateEditorAddScenarios();
    var textComponentScenarios = new TextComponentScenarios();
    var financialComponentScenarios = new FinancialComponentScenarios();   
    var weatherComponentScenarios = new WeatherComponentScenarios();    

    after(function() {
      // Loading the Presentation List is a workaround to a Chrome Driver issue that has it fail to click on elements over the Preview iframe
      presentationsListPage.loadCurrentCompanyPresentationList();
      commonHeaderPage.deleteCurrentCompany(subCompanyName);
    });
  });
})();
