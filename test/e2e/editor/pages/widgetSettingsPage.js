'use strict';
var WidgetSettingsPage = function() {
  var widgetModal = element(by.id('widget-modal-frame'));

  var title = element(by.css('.modal-header h2'));
  var closeButton = element(by.css('.close'));
  
  this.getWidgetModal = function() {
    return widgetModal;
  };
  
  this.getTitle = function() {
    return title;
  };

  this.getCloseButton = function() {
    return closeButton;
  };

};

module.exports = WidgetSettingsPage;
