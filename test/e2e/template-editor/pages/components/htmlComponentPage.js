'use strict';

var HtmlComponentPage = function() {
  var textArea = element(by.id('html-input'));

  this.getTextArea = function () {
    return textArea;
  };
};

module.exports = HtmlComponentPage;
