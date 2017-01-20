'use strict';
var PlaceholderPlaylistPage = function() {
  var addContentButton = element(by.id('addContentButton'));
  var addImageButton = element(by.id('addImageButton'));
  var addVideoButton = element(by.id('addVideoButton'));
  var addTextButton = element(by.id('addTextButton'));

  var playlistItems = element.all(by.css('.ph-playlist .editor-playlist-item'));
  var removeButtons = element.all(by.id('removeButton'));
  var removeItemButton = element(by.id('confirmForm')).element(by.buttonText('Remove'));
  var itemDragHandles = element.all(by.css('.rv-sortable-handle'));
  var duplicateButtons = element.all(by.id('duplicateButton'));
  var duplicateItemButton = element.all(by.id('duplicateButton'));
  var itemNameCells = element.all(by.css('.ph-playlist .editor-playlist-item .name-container .playlist-item-name:not(.ng-hide)'));
  var itemStatusCells = element.all(by.css('.ph-playlist .editor-playlist-item .playlist-item-status'));
  var editPlaylistItemButtons = element.all(by.css('.ph-playlist .editor-playlist-item .editPlaylistItem'));

  this.getAddContentButton = function() {
    return addContentButton;
  };

  this.getAddImageButton = function() {
    return addImageButton;
  };

  this.getAddVideoButton = function() {
    return addVideoButton;
  };

  this.getAddTextButton = function() {
    return addTextButton;
  };

  this.getPlaylistItems = function() {
    return playlistItems;
  };

  this.getRemoveButtons = function() {
    return removeButtons;
  };

  this.getRemoveItemButton = function() {
    return removeItemButton;
  };

  this.getDuplicateButtons = function() {
    return duplicateButtons;
  }

  this.getItemNameCells = function() {
    return itemNameCells;
  };

  this.getItemStatusCells = function() {
    return itemStatusCells;
  };

  this.getEditPlaylistItemButtons = function() {
    return editPlaylistItemButtons;
  };

  this.getItemDragHandles = function() {
    return itemDragHandles;
  }

};

module.exports = PlaceholderPlaylistPage;
