(function() {
  'use strict';

  var CommonHeaderPage = require('./../common-header/pages/commonHeaderPage.js');
  var PresentationListPage = require('./pages/presentationListPage.js');

  var PlaylistComponentScenarios = require('./cases/components/playlist.js');
  var TwitterComponentScenarios = require('./cases/components/twitter.js');

  describe('Template Editor 3', function() {

    var subCompanyName = 'E2E TEST SUBCOMPANY - TEMPLATE EDITOR 3';
    var commonHeaderPage;
    var presentationsListPage;

    before(function () {
      commonHeaderPage = new CommonHeaderPage();
      presentationsListPage = new PresentationListPage();

      browser.driver.manage().window().setSize(1920, 1080);

      presentationsListPage.loadPresentationsList();
      commonHeaderPage.createSubscribedSubCompany(subCompanyName);

      //TODO Allow time for the subcompany subscription to be enabled
      browser.sleep(30000);

      commonHeaderPage.selectSubCompany(subCompanyName);
    });

    var playlistComponentScenarios = new PlaylistComponentScenarios();
    var twitterComponentScenarios = new TwitterComponentScenarios();

    after(function() {
      // Loading the Presentation List is a workaround to a Chrome Driver issue that has it fail to click on elements over the Preview iframe
      presentationsListPage.loadCurrentCompanyPresentationList();
      commonHeaderPage.deleteCurrentCompany(subCompanyName);
    });
  });
})();
