'use strict';
var PlaylistPage = function() {
  var removeButtons = element.all(by.id('removeButton'));
  var removeItemButton = element(by.id('confirmForm')).element(by.buttonText('Remove'));
  var duplicateItemButton = element.all(by.id('duplicateButton'));
  var playlistItemNameCell = element.all(by.css('.playlist-item-name'));

  this.getRemoveButtons = function() {
    return removeButtons;
  };
  
  this.getRemoveItemButton = function() {
    return removeItemButton;
  };
  
  this.getDuplicateItemButton = function() {
    return duplicateItemButton;
  };
  
  this.getPlaylistItemNameCell = function() {
    return playlistItemNameCell;
  };
  
};

module.exports = PlaylistPage;
