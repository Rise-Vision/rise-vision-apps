'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var PresentationsListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var PlaceholdersListPage = require('./../pages/placeholdersListPage.js');
var PresentationPropertiesModalPage = require('./../pages/presentationPropertiesModalPage.js');
var helper = require('rv-common-e2e').helper;

var HtmlEditorScenarios = function() {


  browser.driver.manage().window().setSize(1920, 1080);
  describe('Show HTML Editor: ', function () {
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var presentationsListPage;
    var workspacePage;
    var placeholdersListPage;
    var presentationPropertiesModalPage;

    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      presentationsListPage = new PresentationsListPage();
      workspacePage = new WorkspacePage();
      placeholdersListPage = new PlaceholdersListPage();
      commonHeaderPage = new CommonHeaderPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();

      homepage.getEditor();
      //wait for spinner to go away.
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        loginPage.signIn();
      });
    });

    describe(' Given a user is adding a new presentation and selecting Html Editor', function () {
      before(function () {
        presentationsListPage.openNewPresentation();
        presentationPropertiesModalPage.getCancelButton().click();

        workspacePage.getAddPlaceholderButton().click();
        workspacePage.getHtmlButton().click();

      });

      it('Should disable HTML button', function () {
        expect(workspacePage.getHtmlButton().getAttribute("disabled")).to.eventually.equal('true');
      });

      describe('Should allow HTML editing', function () {
        it('should show html editor', function () {
          expect(workspacePage.getCodemirrorHtmlEditor().isDisplayed()).to.eventually.be.true;
          expect(workspacePage.getCodemirrorHtmlEditor().getText()).to.eventually.contain('var presentationData =');
        });
        
        it('should update the path to htmleditor', function() {
          expect(browser.getCurrentUrl()).to.eventually.contain.string('/htmleditor');
        });

        it('should parse and update presentation', function () {
          browser.executeScript("var editor = $('.CodeMirror')[0].CodeMirror;" +
            "editor.replaceRange(\"ph1\",{line:8,ch: 11},{line:8,ch: 14});" +
            "editor.replaceRange(\"ph1\",{line:18,ch: 11},{line:18,ch: 14})");
            
          workspacePage.getDesignButton().click();

          // wait for transitions
          browser.sleep(500);

          expect(placeholdersListPage.getPlaceholders().get(0).getText()).to.eventually.contain('ph1');
        });
        
        it('path should not contain htmleditor', function() {
          expect(browser.getCurrentUrl()).to.eventually.not.contain.string('/htmleditor');
        });

      });
    });
  });
};
module.exports = HtmlEditorScenarios;
