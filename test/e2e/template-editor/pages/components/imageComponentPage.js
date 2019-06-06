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

  this.getSelectedImagesTitles = function() {
    return element.all(by.xpath('//div[@class="image-text"]/div[1]'));
  }

  this.getThumbnails = function() {
    return element.all(by.xpath('//div[@class="image-thumbnail"]/img'));
  }

  this.getBrokenLinks = function() {
    return element.all(by.xpath('//div[@class="image-thumbnail"]/div[2]'));
  }

  this.getRemoveLinkFor = function(imageName) {
    return element(by.xpath(
      '//div[@class="image-remove"][..//div[contains(text(), "' + imageName + '")]]/a'
    ));
  }

};

module.exports = ImageComponentPage;
