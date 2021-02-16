'use strict';
describe('service: commonSettings:', function() {
  beforeEach(module('risevision.widgets.services'));

  var commonSettings;

  beforeEach(function(){
    inject(function($injector){
      commonSettings = $injector.get('commonSettings');
    });
  });

  it('should exist',function(){
    expect(commonSettings).to.be.ok;
    expect(commonSettings.getStorageUrlData).to.be.a('function');
  });

  it('storage file', function() {
    var url = 'https://storage.googleapis.com/risemedialibrary-f114ad26-949d/100%25%20Particpiation%20gallup.jpg';
    expect(commonSettings.getStorageUrlData(url)).to.deep.equal({
      companyId: 'f114ad26-949d',
      fileName: '100% Particpiation gallup.jpg',
      folder: ''
    });
  });

  it('storage file in folder', function() {
    var url = 'https://storage.googleapis.com/risemedialibrary-f114ad26-949d/folder1/file.jpg';
    expect(commonSettings.getStorageUrlData(url)).to.deep.equal({
      companyId: 'f114ad26-949d',
      fileName: 'file.jpg',
      folder: 'folder1/'
    });
  });

  it('storage folder', function() {
    var url = 'https://www.googleapis.com/storage/v1/b/risemedialibrary-f114ad26-949d/o?prefix=000test%2Fasdf%2F';
    expect(commonSettings.getStorageUrlData(url)).to.deep.equal({
      companyId: 'f114ad26-949d',
      fileName: '',
      folder: '000test/asdf/'
    });
  });

  it('external file', function() {
    var url = 'http://s3.amazonaws.com/Rise-Images/UI/logo.svg';
    expect(commonSettings.getStorageUrlData(url)).to.deep.equal({});
  });

});
