'use strict';
var PlaylistItemModalPage = function() {
  var playlistItemModal = element(by.id('playlistItemModal'));
  var modalTitle = element(by.css('#playlistItemModal .modal-title'));
  var nameTextbox = element(by.model('item.name'));
  var durationTextbox = element(by.id('itemDuration'));
  // widget item fields
  var widgetName = element(by.id('widgetName'));
  var statusMessage = element(by.id('statusMessage'));
  var widgetSettingsIcon = element(by.css('.input-group-addon .btn-widget-icon-storage'));

  var saveButton = element(by.id('playlistItemSave'));

  this.getPlaylistItemModal = function () {
    return playlistItemModal;
  };

  this.getModalTitle = function () {
    return modalTitle;
  };

  this.getNameTextbox = function() {
    return nameTextbox;
  };
  
  this.getDurationTextbox = function() {
    return durationTextbox;
  };
  
  this.getWidgetName = function() {
    return widgetName;
  };

  this.getStatusMessage = function() {
    return statusMessage;
  };

  this.getWidgetSettingsIcon = function() {
    return widgetSettingsIcon;
  };
    
  this.getSaveButton = function() {
    return saveButton;
  };
  
};

module.exports = PlaylistItemModalPage;
