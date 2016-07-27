'use strict';
var WidgetSettingsPage = function() {
  var widgetModal = element(by.id('widget-modal-frame'));

  var title = element(by.css('.modal-header h2'));
  var saveButton = element(by.id('save'));
  var closeButton = element(by.css('.close'));
  
  var imageWidgetCustomButton = element(by.css('[name="customBtn"]'));
  var imageWidgetURLTextbox = element(by.css('[name="url"]'));
  
  this.getWidgetModal = function() {
    return widgetModal;
  };
  
  this.getTitle = function() {
    return title;
  };
  
  this.getSaveButton = function() {
    return saveButton;
  }

  this.getCloseButton = function() {
    return closeButton;
  };

  this.getImageWidgetCustomButton = function() {
    return imageWidgetCustomButton;
  };
  
  this.getImageWidgetURLTextbox = function() {
    return imageWidgetURLTextbox;
  };

};

module.exports = WidgetSettingsPage;
