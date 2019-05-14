'use strict';

var TextComponentPage = function() {
  var textInput = element(by.css('[ng-change="save()"]'));

  this.getTextInput = function () {
    return textInput;
  };
};

module.exports = TextComponentPage;
