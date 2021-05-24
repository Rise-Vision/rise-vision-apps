'use strict';

var PlaylistComponentPage = function() {
  var addPlaylistItemButton = element(by.id('addPlaylistItemButton'));
  var addTextComponentButton = element(by.cssContainingText('.playlist-menu a', 'Text'));
  var addPresentationItemButton = element(by.id('addPresentationItemButton'));
  var addTemplateButton = element(by.id('te-playlist-add-template'));
  var templatesLoaderSpinner = element(by.id('rise-playlist-templates-loader'));
  var searchInput = element(by.id('te-playlist-search'));
  var noResultsDiv = element(by.id('te-playlist-no-results'));
  var loadedTemplatesSelector = 'template in playlistComponentFactory.templates.items.list';
  var playlistItemsSelector = '(key, value) in playlistItems';
  var firstLoadedTemplate = element(by.repeater(loadedTemplatesSelector).row(0));
  var playlistItems = element.all(by.repeater(playlistItemsSelector));
  var selectedTemplate = element(by.repeater(playlistItemsSelector).row(0));
  var editItemLink = selectedTemplate.element(by.css('[ng-click="editProperties(key)"]'));
  var deleteItemLink = selectedTemplate.element(by.name('trash'));
  var durationInput = element(by.id('te-playlist-item-duration'));
  var transitionSelect = element(by.id('te-playlist-item-transition'));
  var slideFromRightOption = element(by.cssContainingText('option', 'Slide from right'));
  
  this.getAddPlaylistItemButton = function() {
    return addPlaylistItemButton;
  };

  this.getAddTextComponentButton = function() {
    return addTextComponentButton;
  };

  this.getAddPresentationItemButton = function() {
    return addPresentationItemButton;
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
