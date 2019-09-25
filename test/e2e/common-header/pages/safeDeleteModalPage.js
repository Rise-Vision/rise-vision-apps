(function(module) {
  'use strict';

  var SafeDeleteModalPage = function () {
    var safeDeleteModal = element(by.id("safeDeleteForm"));
    var safeDeleteInput = element(by.id("safeDeleteInput"));
    var deleteForeverButton = element(by.id("deleteForeverButton"));
    
    this.getSafeDeleteModal = function() {
      return safeDeleteModal;
    };  

    this.getSafeDeleteInput = function() {
      return safeDeleteInput;
    };  

    this.getDeleteForeverButton = function() {
      return deleteForeverButton;
    };   
    
  };

  module.exports = SafeDeleteModalPage;
})(module);
