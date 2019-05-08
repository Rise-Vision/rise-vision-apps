(function() {
  'use strict';

  var expect = require('rv-common-e2e').expect;
  var CommonHeaderPage = require('./../../../web/bower_components/common-header/test/e2e/pages/commonHeaderPage.js');
  var HomePage = require('./../launcher/pages/homepage.js');
  var SignInPage = require('./../launcher/pages/signInPage.js');
  var PlansModalPage = require('./../common/pages/plansModalPage.js');
  var PresentationListPage = require('./pages/presentationListPage.js');
  var TemplateEditorPage = require('./pages/templateEditorPage.js');
  var helper = require('rv-common-e2e').helper;
  
  var TemplateEditorAddScenarios = require('./cases/template-editor-add.js');

  describe('Template Editor', function() {

    var subCompanyName = 'E2E TEST SUBCOMPANY - TEMPLATE EDITOR';
    var commonHeaderPage;
    var homepage;
    var signInPage;
    var plansModalPage;
    var presentationsListPage;
    var templateEditorPage;

    function _loadPresentationsList() {
      homepage.getEditor();
      signInPage.signIn();
    }

    function _createSubCompany() {
      commonHeaderPage.createSubCompany(subCompanyName);
    }

    function _selectSubCompany() {
      commonHeaderPage.selectSubCompany(subCompanyName);
    }

    function _startTrial() {
      helper.waitDisappear(presentationsListPage.getPresentationsLoader(), 'Presentation loader');
      helper.wait(templateEditorPage.seePlansLink(), 'See Plans Link');
      helper.clickWhenClickable(templateEditorPage.seePlansLink(), 'See Plans Link');

      helper.wait(plansModalPage.getPlansModal(), 'Plans Modal');
      helper.wait(plansModalPage.getStartTrialBasicButton(), 'Start Trial Basic Button');
      helper.clickWhenClickable(plansModalPage.getStartTrialBasicButton(), 'Start Trial Basic Button');

      helper.waitDisappear(plansModalPage.getPlansModal(), 'Plans Modal');
    }

    function _loadCurrentCompanyPresentationList() {
      helper.clickWhenClickable(templateEditorPage.getPresentationsListLink(), 'Presentations List');
      helper.waitDisappear(presentationsListPage.getPresentationsLoader(), 'Presentation loader');
    }

    before(function () {
      commonHeaderPage = new CommonHeaderPage();
      homepage = new HomePage();
      signInPage = new SignInPage();
      presentationsListPage = new PresentationListPage();
      plansModalPage = new PlansModalPage();
      templateEditorPage = new TemplateEditorPage();

      _loadPresentationsList();
      _createSubCompany();
      _selectSubCompany();
      _startTrial();
      // Sometimes the trial does not start in time; this section tries to reduce the number of times this step fails
      browser.sleep(5000);
      _loadPresentationsList();
      _selectSubCompany();
    });

    var templateEditorAddScenarios = new TemplateEditorAddScenarios();

    after(function() {
      // Loading the Presentation List is a workaround to a Chrome Driver issue that has it fail to click on elements over the Preview iframe
      _loadCurrentCompanyPresentationList();
      commonHeaderPage.deleteCurrentCompany();
    });
  });
})();
