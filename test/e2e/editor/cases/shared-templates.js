'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var PresentationListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var helper = require('rv-common-e2e').helper;
var PresentationPropertiesModalPage = require('./../pages/presentationPropertiesModalPage.js');
var SharedTemplatesModalPage = require('./../pages/sharedTemplatesModalPage.js');

var SharedTemplatesScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe("In order to manage presentations " +
    "As a user signed in " +
    "I would like to add presentations from shared templates", function () {
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var presentationsListPage;
    var workspacePage;
    var presentationPropertiesModalPage;
    var sharedTemplatesModalPage;

    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      presentationsListPage = new PresentationListPage();
      workspacePage = new WorkspacePage();
      commonHeaderPage = new CommonHeaderPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();
      sharedTemplatesModalPage = new SharedTemplatesModalPage();

      homepage.getEditor();
      //wait for spinner to go away.
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        loginPage.signIn();
      });
      helper.waitDisappear(presentationsListPage.getPresentationsLoader(),'Presentation loader');
      presentationsListPage.getSharedTemplatesButton().click();

      helper.wait(sharedTemplatesModalPage.getSharedTemplatesModal(), 'Select Shared Template Modal');
    });

    it('should open the Shared Templates Modal', function () {
      expect(sharedTemplatesModalPage.getSharedTemplatesModal().isDisplayed()).to.eventually.be.true;
    });

    it('should show modal title', function () {
      expect(sharedTemplatesModalPage.getModalTitle().getText()).to.eventually.equal('Shared Templates');
    });

    it('should show a search box', function () {
      expect(sharedTemplatesModalPage.getSearchFilter().isDisplayed()).to.eventually.be.true;
      expect(sharedTemplatesModalPage.getSearchInput().getAttribute('placeholder')).to.eventually.equal('Search for Shared Templates');
    });

    it('should show a list of templates', function () {
      expect(sharedTemplatesModalPage.getTemplatesTable().isDisplayed()).to.eventually.be.true;
    });

    it('should show templates', function () {
      helper.waitDisappear(sharedTemplatesModalPage.getTemplatesLoader()).then(function () {
        expect(sharedTemplatesModalPage.getTemplates().count()).to.eventually.be.above(0);
      });
    });

    it('should search templates', function(){
      sharedTemplatesModalPage.getSearchInput().sendKeys('Showcase Automated Testing');
      helper.waitDisappear(sharedTemplatesModalPage.getTemplatesLoader()).then(function () {
        expect(sharedTemplatesModalPage.getTemplates().count()).to.eventually.be.above(0);
      });
    });

    it("should preview template in a new tab", function (done) {
      var newWindowHandle, oldWindowHandle;
      sharedTemplatesModalPage.getPreviewLinks().get(0).click();
      browser.sleep(1000);
      browser.ignoreSynchronization = true;
      browser.getAllWindowHandles().then(function (handles) {
        oldWindowHandle = handles[0];
        newWindowHandle = handles[1];
        browser.switchTo().window(newWindowHandle).then(function () {
          expect(browser.driver.getCurrentUrl()).to.eventually.contain("http://rvaviewer-test.appspot.com/?type=presentation&id=ebbb1b89-166e-41fb-9adb-d0052132b0df");

          browser.driver.close();
          browser.switchTo().window(oldWindowHandle);

          done();
        });
      });      
    });

    it('should open a copy of Shared Template when selecting', function(){
      sharedTemplatesModalPage.getTemplates().get(0).click();
      helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');

      expect(presentationPropertiesModalPage.getNameInput().getAttribute('value')).to.eventually.contain('Copy of ');
    });

    afterEach(function(){
      browser.ignoreSynchronization = false;
    });
  });
};
module.exports = SharedTemplatesScenarios;
