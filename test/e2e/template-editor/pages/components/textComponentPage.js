'use strict';

var TextComponentPage = function() {
  var textArea = element(by.id('text-component-input-multiline'));

  this.getTextArea = function () {
    return textArea;
  };
};

module.exports = TextComponentPage;
