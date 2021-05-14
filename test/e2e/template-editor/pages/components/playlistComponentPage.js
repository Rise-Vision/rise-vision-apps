'use strict';

var PlaylistComponentPage = function() {
  var selectTemplatesButton = element(by.id('te-playlist-select-templates'));
  var addTemplateButton = element(by.id('te-playlist-add-template'));
  var templatesLoaderSpinner = element(by.id('rise-playlist-templates-loader'));
  var searchInput = element(by.id('te-playlist-search'));
  var noResultsDiv = element(by.id('te-playlist-no-results'));
  var loadedTemplatesSelector = '(key, value) in playlistComponentFactory.templates.items.list';
  var playlistItemsSelector = '(key, value) in playlistItems';
  var firstLoadedTemplate = element(by.repeater(loadedTemplatesSelector).row(0));
  var playlistItems = element.all(by.repeater(playlistItemsSelector));
  var selectedTemplate = element(by.repeater(playlistItemsSelector).row(0));
  var editItemLink = selectedTemplate.element(by.name('edit'));
  var deleteItemLink = selectedTemplate.element(by.name('trash'));
  var durationInput = element(by.id('te-playlist-item-duration'));
  var transitionSelect = element(by.id('te-playlist-item-transition'));
  var slideFromRightOption = element(by.cssContainingText('option', 'Slide from right'));
  
  this.getSelectTemplatesButton = function () {
    return selectTemplatesButton;
  };

  this.getAddTemplateButton = function () {
    return addTemplateButton;
  };

  this.getTemplatesLoaderSpinner = function () {
    return templatesLoaderSpinner;
  };

  this.getSearchInput = function () {
    return searchInput;
  };

  this.getNoResultsDiv = function () {
    return noResultsDiv;
  };

  this.getLoadedTemplates = function () {
    return element.all(by.repeater(loadedTemplatesSelector));
  };

  this.getFirstLoadedTemplate = function () {
    return firstLoadedTemplate;
  };

  this.getPlaylistItems = function () {
    return playlistItems;
  };

  this.getEditItemLink = function () {
    return editItemLink;
  };

  this.getDeleteItemLink = function () {
    return deleteItemLink;
  };

  this.getDurationInput = function () {
    return durationInput;
  };

  this.getTransitionSelect = function () {
    return transitionSelect;
  };

  this.getSlideFromRightOption = function () {
    return slideFromRightOption;
  };

};

module.exports = PlaylistComponentPage;
