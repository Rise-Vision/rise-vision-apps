'use strict';

var TextComponentPage = function() {
  var textInput = element(by.id('text-component-input'));

  this.getTextInput = function () {
    return textInput;
  };
};

module.exports = TextComponentPage;
