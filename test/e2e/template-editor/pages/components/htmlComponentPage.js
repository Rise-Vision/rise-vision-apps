'use strict';

var HtmlComponentPage = function() {
  var codeMirrorElement = element(by.css('#codemirror-html-input .CodeMirror'));

  this.getCodeMirrorElement = function () {
    return codeMirrorElement;
  };

  this.getCodeMirrorText = function () {
    return browser.executeScript('var editor = $("#codemirror-html-input .CodeMirror")[0].CodeMirror;' +
      'return editor.getValue();');
  }

  this.updateCodeMirrorText = function (text) {
    browser.executeScript('var editor = $("#codemirror-html-input .CodeMirror")[0].CodeMirror;' +
      'editor.setValue("' + text + '");')
  };
};

module.exports = HtmlComponentPage;
