'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var PresentationsListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var PlaceholdersListPage = require('./../pages/placeholdersListPage.js');
var helper = require('rv-common-e2e').helper;

var HtmlEditorScenarios = function() {


  browser.driver.manage().window().setSize(1920, 1080);
  describe('HTML Editor', function () {
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var presentationsListPage;
    var workspacePage;
    var placeholdersListPage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      presentationsListPage = new PresentationsListPage();
      workspacePage = new WorkspacePage();
      placeholdersListPage = new PlaceholdersListPage();
      commonHeaderPage = new CommonHeaderPage();

      homepage.getEditor();
      signInPage.signIn();
    });

    describe(' Given a user is adding a new presentation and selecting Html Editor', function () {
      before(function () {
        presentationsListPage.openNewPresentation();

        helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');

        workspacePage.getHtmlButton().click();

      });

      it('Should hide HTML button', function () {
        expect(workspacePage.getHtmlButton().isPresent()).to.eventually.be.false;
        expect(workspacePage.getDesignButton().isDisplayed()).to.eventually.be.true;
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
