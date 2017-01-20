'use strict';
var SharedTemplatesModalPage = function() {
  var sharedTemplatesModal = element(by.id('sharedTemplatesModal'));
  var modalTitle = element(by.id('sharedTemplatesModalTitle'));
  var searchFilter = element(by.tagName('search-filter'));
  var searchInput = element(by.id('templateSearchInput'));

  var templatesLoader = element(by.css('#sharedTemplatesModal .spinner-backdrop'));

  var templatesTable = element(by.id('templatesTable'));

  var templates = element.all(by.css('#templatesTable tbody tr'));
    
  var templateNameFields = element.all(by.id('templateName'));
  var previewLinks = element.all(by.id('templatePreview'));


  this.getSharedTemplatesModal = function () {
    return sharedTemplatesModal;
  };

  this.getModalTitle = function () {
    return modalTitle;
  };

  this.getSearchFilter = function() {
    return searchFilter;
  };

  this.getSearchInput = function() {
    return searchInput;
  };
  
  this.getTemplatesTable = function() {
    return templatesTable;
  };

  this.getTemplates = function() {
    return templates;
  };
  
  this.getTemplatesLoader = function() {
    return templatesLoader;
  };

  this.getTemplateNameFields = function() {
    return templateNameFields;
  };

  this.getPreviewLinks = function() {
    return previewLinks;
  };
};

module.exports = SharedTemplatesModalPage;
