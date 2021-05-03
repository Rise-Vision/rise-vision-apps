'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var PlaylistComponentPage = require('./../../pages/components/playlistComponentPage.js');
var helper = require('rv-common-e2e').helper;

var PlaylistComponentScenarios = function () {

  describe('Playlist Component', function () {
    var presentationName;
    var presentationsListPage;
    var templateEditorPage;
    var playlistComponentPage;
    var componentLabel = "Playlist of Embedded Templates";

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      playlistComponentPage = new PlaylistComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();

      presentationsListPage.createNewPresentationFromTemplate('Example Playlist Component', 'example-playlist-component');

      templateEditorPage.getPresentationName().getAttribute('value').then(function(name) {
        expect(name).to.contain('Copy of Example Playlist Component');

        presentationName = name;
      });
    });

    describe('basic operations', function () {
      it('should open properties of Playlist Component', function () {
        templateEditorPage.selectComponent(componentLabel);

        helper.wait(playlistComponentPage.getSelectTemplatesButton(), 'Select Button');

        expect(playlistComponentPage.getSelectTemplatesButton().isDisplayed()).to.eventually.be.true;
      });

      it('should show no results message when there are no templates', function () {
        helper.clickWhenClickable(playlistComponentPage.getSelectTemplatesButton(), 'Select Templates');

        helper.waitAppearDisappear(playlistComponentPage.getTemplatesLoaderSpinner(), 'Templates Loader');

        //search for something that returns no results
        playlistComponentPage.getSearchInput().sendKeys("purple unicorn" + protractor.Key.ENTER);

        helper.waitAppearDisappear(playlistComponentPage.getTemplatesLoaderSpinner(), 'Templates Loader');

        expect(playlistComponentPage.getAddTemplateButton().isDisplayed()).to.eventually.be.true;
        expect(playlistComponentPage.getAddTemplateButton().isEnabled()).to.eventually.be.false;
        expect(playlistComponentPage.getNoResultsDiv().isDisplayed()).to.eventually.be.true;
        expect(playlistComponentPage.getLoadedTemplates().count()).to.eventually.equal(0);
      });

      it('should load list of available templates', function () {
        // create Text template to have something to embed
        presentationsListPage.loadCurrentCompanyPresentationList();
        presentationsListPage.createNewPresentationFromTemplate('Text Component Test', 'text-component-test');
        presentationsListPage.loadCurrentCompanyPresentationList();

        //open Embedded Template presentation
        presentationsListPage.loadPresentation(presentationName);
        templateEditorPage.selectComponent(componentLabel);

        helper.wait(playlistComponentPage.getSelectTemplatesButton(), 'Select Templates');

        helper.clickWhenClickable(playlistComponentPage.getSelectTemplatesButton(), 'Select Templates');
        browser.sleep(500);
        helper.waitDisappear(playlistComponentPage.getTemplatesLoaderSpinner(), 'Spinner');

        browser.sleep(1000);
        expect(playlistComponentPage.getAddTemplateButton().isDisplayed()).to.eventually.be.true;
        expect(playlistComponentPage.getAddTemplateButton().isEnabled()).to.eventually.be.false;
        //there might be more than 1 template because other tests for components also create templates
        expect(playlistComponentPage.getLoadedTemplates().count()).to.eventually.above(0);
      });

      it('should select a templates', function () {
        helper.clickWhenClickable(playlistComponentPage.getFirstLoadedTemplate(), 'First Template');

        expect(playlistComponentPage.getAddTemplateButton().isEnabled()).to.eventually.be.true;
      });

      it('should add a selected templates', function () {
        helper.clickWhenClickable(playlistComponentPage.getAddTemplateButton(), 'Add First Template');

        helper.waitDisappear(playlistComponentPage.getTemplatesLoaderSpinner(), 'Spinner');

        browser.sleep(500);
        expect(playlistComponentPage.getPlaylistItems().count()).to.eventually.equal(1);
      });

      it('should open playlist item properties', function () {
        helper.clickWhenClickable(playlistComponentPage.getEditItemLink(), 'Click Edit');

        expect(playlistComponentPage.getTransitionSelect().isDisplayed()).to.eventually.be.true;
      });

      it('should update item duration and transition', function () {
        browser.waitForAngularEnabled(false);
        playlistComponentPage.getDurationInput().clear();
        browser.sleep(10);
        playlistComponentPage.getDurationInput().sendKeys("123" + protractor.Key.ENTER);
        playlistComponentPage.getSlideFromRightOption().click();
        browser.waitForAngularEnabled(true);

        helper.clickWhenClickable(templateEditorPage.getBackToComponentsButton(),'Back to selected templates');
        browser.sleep(1000);
        helper.clickWhenClickable(playlistComponentPage.getEditItemLink(), 'Click Edit');
        expect(playlistComponentPage.getDurationInput().getAttribute('value')).to.eventually.equal("123");
        expect(playlistComponentPage.getTransitionSelect().getAttribute('value')).to.eventually.equal("slideFromRight");
      });

      it('should delete item', function () {
        helper.clickWhenClickable(templateEditorPage.getBackToComponentsButton(),'Back to selected templates');
        browser.sleep(1000);
        helper.clickWhenClickable(playlistComponentPage.getDeleteItemLink(), 'Click Delete');
        browser.sleep(1000);
        expect(playlistComponentPage.getPlaylistItems().count()).to.eventually.equal(0);

        //wait for auto-saved to finish to prevent failures in "after all" hook in the template-editor.cases
        templateEditorPage.waitForAutosave();
      });

    });
  });
};

module.exports = PlaylistComponentScenarios;
