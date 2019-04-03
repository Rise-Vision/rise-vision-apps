'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var SignInPage = require('./../../launcher/pages/signInPage.js');
var CommonHeaderPage = require('./../../../../web/bower_components/common-header/test/e2e/pages/commonHeaderPage.js');
var PresentationsListPage = require('./../pages/presentationListPage.js');
var PlaceholderSettingsPage = require('./../pages/placeholderSettingsPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var PlaceholdersListPage = require('./../pages/placeholdersListPage.js');
var helper = require('rv-common-e2e').helper;

var PlaceholderSettingsScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe('Placeholder Settings', function () {
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var presentationsListPage;
    var placeholderSettingsPage;
    var workspacePage;
    var placeholdersListPage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      presentationsListPage = new PresentationsListPage();
      workspacePage = new WorkspacePage();
      placeholdersListPage = new PlaceholdersListPage();
      placeholderSettingsPage = new PlaceholderSettingsPage();
      commonHeaderPage = new CommonHeaderPage();

      homepage.getEditor();
      signInPage.signIn();
    });

    describe(' Given a user is adding a new presentation and a few placeholders', function () {
      before(function () {
        presentationsListPage.openNewPresentation();

        helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');
        helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');

        browser.sleep(500);
        workspacePage.getBackToListButton().click();
        browser.sleep(500);
      });

      it('should show placeholder settings', function () {
        helper.wait(placeholdersListPage.getManageLinks().get(0), 'Placeholders List');
        placeholdersListPage.getManageLinks().get(0).click();

        // wait for transitions
        browser.sleep(500);
        
        helper.wait(placeholderSettingsPage.getEditPlaylistButton(), 'Placeholder Playlist Page');
        placeholderSettingsPage.getEditPropertiesButton().click();
        
        expect(placeholderSettingsPage.getIdTextbox().getAttribute('value')).to.eventually.equal('ph0');
        
        expect(placeholderSettingsPage.getEditNameLink().isDisplayed()).to.eventually.be.true;
        expect(placeholderSettingsPage.getIdTextbox().isDisplayed()).to.eventually.be.true;
        expect(placeholderSettingsPage.getTransitionSelect().isDisplayed()).to.eventually.be.true;
        
        expect(placeholderSettingsPage.getSaveNameLink().isDisplayed()).to.eventually.be.false;
        expect(placeholderSettingsPage.getCancelNameLink().isDisplayed()).to.eventually.be.false;
        expect(placeholderSettingsPage.getNewIdTextbox().isDisplayed()).to.eventually.be.false;

      });
      
      it('should allow user to update the placeholder name', function() {
        placeholderSettingsPage.getEditNameLink().click();
        
        expect(placeholderSettingsPage.getEditNameLink().isDisplayed()).to.eventually.be.false;
        expect(placeholderSettingsPage.getIdTextbox().isDisplayed()).to.eventually.be.false;
        
        expect(placeholderSettingsPage.getSaveNameLink().isDisplayed()).to.eventually.be.true;
        expect(placeholderSettingsPage.getCancelNameLink().isDisplayed()).to.eventually.be.true;
        expect(placeholderSettingsPage.getNewIdTextbox().isDisplayed()).to.eventually.be.true;
        
      });
      
      it('should show validation errors', function() {
        placeholderSettingsPage.getNewIdTextbox().clear();
        
        expect(placeholderSettingsPage.getRequiredValidation().isDisplayed()).to.eventually.be.true;
        
        placeholderSettingsPage.getNewIdTextbox().sendKeys('ph0123#$');
        
        expect(placeholderSettingsPage.getInvalidValidation().isDisplayed()).to.eventually.be.true;
                
        placeholderSettingsPage.getNewIdTextbox().clear();
        placeholderSettingsPage.getNewIdTextbox().sendKeys('ph1');
        
        expect(placeholderSettingsPage.getDuplicateValidation().isDisplayed()).to.eventually.be.true;
        
      });
      
      it('should update placeholder name', function() {
        placeholderSettingsPage.getNewIdTextbox().clear();
        placeholderSettingsPage.getNewIdTextbox().sendKeys('ph2');
        
        placeholderSettingsPage.getSaveNameLink().click();

        helper.wait(placeholderSettingsPage.getEditNameLink(), 'Edit Name');
        
        expect(placeholderSettingsPage.getIdTextbox().getAttribute('value')).to.eventually.equal('ph2');
      });

      it('should update transition', function() {
        placeholderSettingsPage.getTransitionSelect().element(by.cssContainingText('option', 'Slide Up')).click();

        workspacePage.getBackToListButton().click();
        browser.sleep(500);
        placeholdersListPage.getManageLinks().get(0).click();
        browser.sleep(500);
        helper.wait(placeholderSettingsPage.getEditPlaylistButton(), 'Placeholder Playlist Page');
        placeholderSettingsPage.getEditPropertiesButton().click();
        
        expect(placeholderSettingsPage.getTransitionSelect().$('option:checked').getText()).to.eventually.equal('Slide Up');
      })

    });
  });
};
module.exports = PlaceholderSettingsScenarios;
