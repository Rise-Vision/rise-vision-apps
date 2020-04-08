'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var PresentationListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var helper = require('rv-common-e2e').helper;
var SharedTemplatesModalPage = require('./../pages/sharedTemplatesModalPage.js');

var SharedTemplatesScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe('Shared Templates', function () {
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var presentationsListPage;
    var workspacePage;
    var sharedTemplatesModalPage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      presentationsListPage = new PresentationListPage();
      workspacePage = new WorkspacePage();
      commonHeaderPage = new CommonHeaderPage();
      sharedTemplatesModalPage = new SharedTemplatesModalPage();

      homepage.getEditor();
      signInPage.signIn();
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

    it('should preview template in a new tab', function (done) {
      var newWindowHandle, oldWindowHandle;
      sharedTemplatesModalPage.getPreviewLinks().get(0).click();
      browser.sleep(1000);
      browser.ignoreSynchronization = true;
      browser.getAllWindowHandles().then(function (handles) {
        oldWindowHandle = handles[0];
        newWindowHandle = handles[1];
        browser.switchTo().window(newWindowHandle).then(function () {
          expect(browser.driver.getCurrentUrl()).to.eventually.contain('http://viewer-test.risevision.com/?type=presentation&id=ebbb1b89-166e-41fb-9adb-d0052132b0df');

          browser.driver.close();
          browser.switchTo().window(oldWindowHandle);

          done();
        });
      });      
    });

    it('should open a copy of Shared Template when selecting', function(){
      // Note: closing the preview window and returning to this tab causes
      // re-authentication. Opening the template right away causes the
      // Auth token not to be attached to the request
      // Workaround is to wait for re-authentication to complete via a wait
      browser.sleep(1000);

      sharedTemplatesModalPage.getTemplates().get(0).click();
      helper.wait(workspacePage.getWorkspaceContainer(), 'Workspace Container');

      expect(workspacePage.getPresentationNameContainer().getText()).to.eventually.contain('Copy of ');
    });

    afterEach(function(){
      browser.ignoreSynchronization = false;
    });
  });
};
module.exports = SharedTemplatesScenarios;
