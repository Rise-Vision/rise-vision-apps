'use strict';

var helper = require('rv-common-e2e').helper;

var ImageComponentPage = function() {
  var selectedImagesMain = element.all(by.repeater('image in selectedImages track by $index'));
  var listDurationComponent = element(by.css('.image-component-list-duration'));
  var uploadButtonMain = element(by.id('image-list-uploader-label'));
  var uploadInputMain = element(by.id('image-list-uploader'));
  var uploadPanelMain = element(by.id('upload-panel-image-list-uploader'));

  this.getSelectedImagesMain = function () {
    return selectedImagesMain;
  };

  this.getListDurationComponent = function () {
    return listDurationComponent;
  };

  this.getUploadButtonMain = function () {
    return uploadButtonMain;
  };

  this.getUploadInputMain = function () {
    return uploadInputMain;
  };

  this.getUploadPanelMain = function () {
    return uploadPanelMain;
  };

  this.removeImageRow = function (selectorLabel) {
    var removeLink = element(by.xpath(
      '//div[@class="image-remove"][..//div[contains(text(), "' + selectorLabel + '")]]/a'
    ));

    helper.wait(removeLink, 'Image Row Remove');
    helper.clickWhenClickable(removeLink, 'Image Row Remove');
  }
};

module.exports = ImageComponentPage;
