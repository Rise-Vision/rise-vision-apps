'use strict';
var PlaceholdersListPage = function() {
  var placeholders = element.all(by.repeater('placeholder in factory.getPlaceholders()'));
  var manageLinks = element.all(by.id('manageLink'));
  var removeButtons = element.all(by.id('removeButton'));
  var removeItemButton = element(by.id("confirmForm")).element(by.buttonText('Remove'));
  var duplicateItemButton = element.all(by.id('duplicateButton'));

  this.getPlaceholders = function() {
    return placeholders;
  }

  this.getManageLinks = function() {
    return manageLinks;
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
    
};

module.exports = PlaceholdersListPage;
