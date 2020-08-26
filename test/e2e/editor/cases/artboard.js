'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var helper = require('rv-common-e2e').helper;
var WorkspacePage = require('./../pages/workspacePage.js');
var PresentationListPage = require('./../pages/presentationListPage.js');
var PresentationPropertiesModalPage = require('./../pages/presentationPropertiesModalPage.js');
var UnsavedChangesModalPage = require('./../pages/unsavedChangesModalPage.js');

var ArtboardScenarios = function() {


  browser.driver.manage().window().setSize(1920, 1080);
  describe('Artboard', function () {
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var workspacePage;
    var presentationListPage;
    var presentationPropertiesModalPage;
    var unsavedChangesModalPage;
    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      workspacePage = new WorkspacePage();
      presentationListPage = new PresentationListPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();
      unsavedChangesModalPage = new UnsavedChangesModalPage();
    });

    describe('Given a user who wants to set presentation properties of a new presentation', function () {

      before(function () {
        homepage.getEditor();
        signInPage.signIn();
        presentationListPage.openNewPresentation();
      });

      it('should load the workspace', function () {
        expect(workspacePage.getWorkspaceContainer().isDisplayed()).to.eventually.be.true;
      });

      describe('Given a user clicks on the presentation properties cog icon', function () {
        it('should represent the selected properties size', function () {
          workspacePage.getPresentationPropertiesButton().click();
          helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');
          browser.sleep(500);

          presentationPropertiesModalPage.getBackgroundColorInput().clear();
          presentationPropertiesModalPage.getBackgroundColorInput().sendKeys('rgba(201,34,34,1)');
          presentationPropertiesModalPage.getResolutionSelect().element(by.cssContainingText('option', '1024 x 768')).click();
          helper.clickWhenClickable(presentationPropertiesModalPage.getApplyButton(), 'Apply Button');
          browser.sleep(500);

          expect(workspacePage.getArtboardContainer().getCssValue('background')).to.eventually.equal('rgb(201, 34, 34) none repeat scroll 0% 0% / auto padding-box border-box');
          expect(workspacePage.getArtboardContainer().getSize()).to.eventually.have.property('width', 1048);
          expect(workspacePage.getArtboardContainer().getSize()).to.eventually.have.property('height', 792);          
        });
      });

      describe('Given the user has unsaved changes', function () {
        it('should notify when navigating away from the editor', function () {
          commonHeaderPage.getSchedulesMenuItem().click(); //Navigating to Schedules
          helper.wait(unsavedChangesModalPage.getUnsavedChangesModal(),'Unsaved Changed Modal');
          browser.sleep(500);
          expect(unsavedChangesModalPage.getUnsavedChangesModal().isDisplayed()).to.eventually.be.true;
          expect(unsavedChangesModalPage.getDontSaveButton().isDisplayed()).to.eventually.be.true;
          expect(unsavedChangesModalPage.getSaveButton().isDisplayed()).to.eventually.be.true;
          expect(unsavedChangesModalPage.getCancelButton().isDisplayed()).to.eventually.be.true;
        });

        it('should be able to Cancel and go back to Editor',function(){
          helper.clickWhenClickable(unsavedChangesModalPage.getCancelButton(), 'Cancel Button');
          helper.waitDisappear(unsavedChangesModalPage.getUnsavedChangesModal(), 'Unsaved Changed Modal');
          expect(unsavedChangesModalPage.getUnsavedChangesModal().isPresent()).to.eventually.be.false;
          expect(workspacePage.getArtboardContainer().isDisplayed()).to.eventually.be.true;
        });

        it('should be able to leave without saving',function(){
          helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');

          commonHeaderPage.getSchedulesMenuItem().click();
          helper.wait(unsavedChangesModalPage.getUnsavedChangesModal(),'Unsaved Changed Modal');
          browser.sleep(500);
          unsavedChangesModalPage.getDontSaveButton().click();
          expect(workspacePage.getArtboardContainer().isPresent()).to.eventually.be.false;
        });

      });

    });
  });
};
module.exports = ArtboardScenarios;
