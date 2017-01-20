'use strict';
var PlaylistPage = function() {
  var moveUpButtons = element.all(by.id('moveUpButton'));
  var moveDownButtons = element.all(by.id('moveDownButton'));
  var removeButtons = element.all(by.id('removeButton'));
  var removeItemButton = element(by.id("confirmForm")).element(by.buttonText('Remove'));
  var duplicateItemButton = element.all(by.id('duplicateButton'));
  var presentationNameCell = element.all(by.id('presentationNameCell'));

  this.getMoveUpButtons = function() {
    return moveUpButtons;
  };
  
  this.getMoveDownButtons = function() {
    return moveDownButtons;
  };
  
  this.getRemoveButtons = function() {
    return removeButtons;
  };
  
  this.getRemoveItemButton = function() {
    return removeItemButton;
  };
  
  this.getDuplicateItemButton = function() {
    return duplicateItemButton;
  };
  
  this.getPresentationNameCell = function() {
    return presentationNameCell;
  };
  
};

module.exports = PlaylistPage;
