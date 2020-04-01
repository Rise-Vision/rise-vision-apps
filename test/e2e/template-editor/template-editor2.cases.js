(function() {
  'use strict';

  var CommonHeaderPage = require('./../common-header/pages/commonHeaderPage.js');
  var PresentationListPage = require('./pages/presentationListPage.js');

  var ImageComponentScenarios = require('./cases/components/image.js');
  var SlidesComponentScenarios = require('./cases/components/slides.js');
  var VideoComponentScenarios = require('./cases/components/video.js');
  var RssComponentScenarios = require('./cases/components/rss.js');
  var CounterComponentScenarios = require('./cases/components/counter.js');
  var TimeDateComponentScenarios = require('./cases/components/time-date.js');
  var TwitterComponentScenarios = require('./cases/components/twitter.js');

  describe('Template Editor 2', function() {

    var subCompanyName = 'E2E TEST SUBCOMPANY - TEMPLATE EDITOR 2';
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

    var imageComponentScenarios = new ImageComponentScenarios();
    var slidesComponentScenarios = new SlidesComponentScenarios();
    var videoComponentScenarios = new VideoComponentScenarios();
    var rssComponentScenarios = new RssComponentScenarios();
    var counterComponentScenarios = new CounterComponentScenarios();
    var timeDateComponentScenarios = new TimeDateComponentScenarios();
    var twitterComponentScenarios = new TwitterComponentScenarios(subCompanyName);

    after(function() {
      // Loading the Presentation List is a workaround to a Chrome Driver issue that has it fail to click on elements over the Preview iframe
      presentationsListPage.loadCurrentCompanyPresentationList();
      commonHeaderPage.deleteCurrentCompany(subCompanyName);
    });
  });
})();
