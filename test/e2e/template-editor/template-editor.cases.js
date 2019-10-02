(function() {
  'use strict';

  var CommonHeaderPage = require('./../common-header/pages/commonHeaderPage.js');
  var PresentationListPage = require('./pages/presentationListPage.js');

  var TemplateEditorAddScenarios = require('./cases/template-editor-add.js');
  var FinancialComponentScenarios = require('./cases/components/financial.js');
  var TextComponentScenarios = require('./cases/components/text.js');
  
  describe('Template Editor', function() {

    var subCompanyName = 'E2E TEST SUBCOMPANY - TEMPLATE EDITOR';
    var commonHeaderPage;
    var presentationsListPage;

    before(function () {
      commonHeaderPage = new CommonHeaderPage();
      presentationsListPage = new PresentationListPage();

      presentationsListPage.loadPresentationsList();
      commonHeaderPage.createSubscribedSubCompany(subCompanyName);
      commonHeaderPage.selectSubCompany(subCompanyName);
    });

    // Text component scenarios deal with the auto schedule modal, so they always should come first.
    var textComponentScenarios = new TextComponentScenarios();
    var templateEditorAddScenarios = new TemplateEditorAddScenarios();
    var financialComponentScenarios = new FinancialComponentScenarios();   

    after(function() {
      // Loading the Presentation List is a workaround to a Chrome Driver issue that has it fail to click on elements over the Preview iframe
      presentationsListPage.loadCurrentCompanyPresentationList();
      commonHeaderPage.deleteCurrentCompany(subCompanyName);
    });
  });
})();
