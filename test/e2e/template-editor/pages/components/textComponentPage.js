'use strict';

var TextComponentPage = function() {
  var textInput = element(by.xpath('//template-component-text/div/input'));

  this.getTextInput = function () {
    return textInput;
  };
};

module.exports = TextComponentPage;
