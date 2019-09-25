/*globals element, by */
(function(module) {
  'use strict';

  var SelectSubcompanyModalPage = function () {
    var selectSubcompanyModal = element(by.css(".select-subcompany-modal"));
    var loader = element(by.xpath('//div[@spinner-key="company-selector-modal-list"]'));

    var companies = element.all(by.repeater('company in companies.items.list'));
    
    var closeButton = element(by.css(".modal-header button.close"));
    
    this.getSelectSubcompanyModal = function() {
      return selectSubcompanyModal;
    };
    
    this.getLoader = function() {
      return loader;
    };
    
    this.getCompanies = function() {
      return companies;
    };
    
    this.getCloseButton = function() {
      return closeButton;
    };
    
  };

  module.exports = SelectSubcompanyModalPage;
})(module);
