'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var PresentationListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var helper = require('rv-common-e2e').helper;
var PresentationPropertiesModalPage = require('./../pages/presentationPropertiesModalPage.js');
var ArtboardPage = require('./../pages/artboardPage.js');

var PresentationAddScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe('Presentation Add', function () {
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var presentationsListPage;
    var workspacePage;
    var presentationPropertiesModalPage;
    var artboardPage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      presentationsListPage = new PresentationListPage();
      workspacePage = new WorkspacePage();
      commonHeaderPage = new CommonHeaderPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();
      artboardPage = new ArtboardPage();

      homepage.getEditor();
      signInPage.signIn();
      presentationsListPage.openNewPresentation();
    });

    it('should show Add Placeholder button', function () {
      expect(workspacePage.getAddPlaceholderButton().isPresent()).to.eventually.be.true;
    });

    it('should show artboard empty state',function() {
      helper.wait(artboardPage.getEmptyState(),'Artboard Empty State');
      expect(artboardPage.getEmptyState().isDisplayed()).to.eventually.be.true;
    });

    it('should show Change Template Button', function () {
      expect(workspacePage.getChangeTemplateButton().isDisplayed()).to.eventually.be.true;
    });

    it('should show disabled Preview Button', function () {
      expect(workspacePage.getPreviewButton().isDisplayed()).to.eventually.be.true;
      expect(workspacePage.getPreviewButton().isEnabled()).to.eventually.be.false;
      expect(workspacePage.getSaveAndPreviewButton().isPresent()).to.eventually.be.false;
    });

    it('should disable Publish/Restore Buttons', function () {
      expect(workspacePage.getPublishButton().isEnabled()).to.eventually.be.false;
      expect(workspacePage.getRestoreButton().isEnabled()).to.eventually.be.false;
    });

    it('should show enabled Save Button', function () {
      expect(workspacePage.getSaveButton().isPresent()).to.eventually.be.true;
      expect(workspacePage.getSaveButton().isEnabled()).to.eventually.be.true;
    });

    it('should rename presentation', function () {
      workspacePage.getPresentationPropertiesButton().click();
      helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');

      var presentationName = 'TEST_E2E_PRESENTATION ' + commonHeaderPage.getStageEnv();

      helper.wait(presentationPropertiesModalPage.getNameInput(), 'Waiting for Name Input');
      presentationPropertiesModalPage.getNameInput().sendKeys('workaround'); // clear() fails sometimes
      presentationPropertiesModalPage.getNameInput().clear();
      presentationPropertiesModalPage.getNameInput().sendKeys(presentationName);
      helper.clickWhenClickable(presentationPropertiesModalPage.getApplyButton(), 'Apply Button');
    });

    it('should enable "Save" and "Save & Preview" ',function(){
      expect(workspacePage.getSaveButton().isEnabled()).to.eventually.be.true;
      expect(workspacePage.getSaveAndPreviewButton().isDisplayed()).to.eventually.be.true;
      
      expect(workspacePage.getSaveAndPreviewButton().getText()).to.eventually.equal('Save & Preview');

      expect(workspacePage.getPreviewButton().isPresent()).to.eventually.be.false;      
    });

    it('should save presentation hide Change Template Button and enable Preview button', function() {  
      helper.clickWhenClickable(workspacePage.getSaveButton(), 'Save Button');

      helper.waitDisappear(workspacePage.getChangeTemplateButton(), 'Change Template Button');
      expect(workspacePage.getChangeTemplateButton().isDisplayed()).to.eventually.be.false;

      helper.wait(workspacePage.getSaveStatus(), 'Save Status');
      expect(workspacePage.getSaveButton().isEnabled()).to.eventually.be.true;
      expect(workspacePage.getPreviewButton().isEnabled()).to.eventually.be.true;
      expect(workspacePage.getSaveAndPreviewButton().isPresent()).to.eventually.be.false;
    });

    it('should keep Publish/Restore Buttons disabled', function () {
      expect(workspacePage.getPublishButton().isEnabled()).to.eventually.be.false;
      expect(workspacePage.getRestoreButton().isEnabled()).to.eventually.be.false;
    });

    it('should enable Restore after changes', function () {
      helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');

      expect(workspacePage.getPublishButton().isEnabled()).to.eventually.be.false;
      expect(workspacePage.getRestoreButton().isEnabled()).to.eventually.be.true;
    });    

    it('should enable Publish and Restore after revised', function () {     
      helper.clickWhenClickable(workspacePage.getSaveButton(), 'Save Button');
      browser.sleep(1000);
      helper.wait(workspacePage.getPublishButton(), 'Publish Button');

      expect(workspacePage.getPublishButton().isEnabled()).to.eventually.be.true;
      expect(workspacePage.getRestoreButton().isEnabled()).to.eventually.be.true;
    });

    it('should delete presentation and return to list', function() {
      workspacePage.getPresentationPropertiesButton().click();
      helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');
      browser.sleep(500);
      helper.clickWhenClickable(presentationPropertiesModalPage.getDeleteButton(), 'Presentation Delete Button');

      browser.sleep(500);
      helper.wait(presentationPropertiesModalPage.getDeleteForeverButton(), 'Presentation Delete Forever Button');      
      helper.clickWhenClickable(presentationPropertiesModalPage.getDeleteForeverButton(), 'Presentation Delete Forever Button');

      helper.wait(presentationsListPage.getTitle(), 'Presentation List');
    });
  });
};
module.exports = PresentationAddScenarios;
