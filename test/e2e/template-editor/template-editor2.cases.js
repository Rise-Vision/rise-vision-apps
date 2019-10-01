(function() {
  'use strict';

  var CommonHeaderPage = require('./../common-header/pages/commonHeaderPage.js');
  var PresentationListPage = require('./pages/presentationListPage.js');

  var WeatherComponentScenarios = require('./cases/components/weather.js');
  var ImageComponentScenarios = require('./cases/components/image.js');
  var SlidesComponentScenarios = require('./cases/components/slides.js');
  
  describe('Template Editor 2', function() {

    var subCompanyName = 'E2E TEST SUBCOMPANY - TEMPLATE EDITOR 2';
    var commonHeaderPage;
    var presentationsListPage;

    before(function () {
      commonHeaderPage = new CommonHeaderPage();
      presentationsListPage = new PresentationListPage();

      presentationsListPage.loadPresentationsList();
      commonHeaderPage.createSubscribedSubCompany(subCompanyName);
      commonHeaderPage.selectSubCompany(subCompanyName);
    });

    var weatherComponentScenarios = new WeatherComponentScenarios();
    var imageComponentScenarios = new ImageComponentScenarios();
    var slidesComponentScenarios = new SlidesComponentScenarios();

    after(function() {
      // Loading the Presentation List is a workaround to a Chrome Driver issue that has it fail to click on elements over the Preview iframe
      presentationsListPage.loadCurrentCompanyPresentationList();
      commonHeaderPage.deleteCurrentCompany(subCompanyName);
    });
  });
})();
