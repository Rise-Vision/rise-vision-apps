'use strict';
  
describe('service: storageFactory:', function() {
  beforeEach(module('risevision.storage.services'));
  var storageFactory, $modal;
  beforeEach(module(function ($provide) {
    $provide.service('$modal', function() {
      return {
        open: function(){}
      };
    });
    $provide.service('userState', function() {
      return {
        getSelectedCompanyId: function() {
          return 'companyId';
        },
        _restoreState: function() {}
      };
    });
  }));

  beforeEach(function(){
    
    inject(function($injector){  
      storageFactory = $injector.get('storageFactory');
      $modal = $injector.get('$modal');
      
      storageFactory.selectorType = 'single-file';
      storageFactory.storageFull = true;
    });
  });

  it('should exist',function(){
    expect(storageFactory).to.be.ok;
    
    // Hardcoded
    expect(storageFactory.storageFull).to.be.true;
    expect(storageFactory.isSingleFileSelector()).to.be.true;
    expect(storageFactory.isMultipleFileSelector()).to.be.false;
    expect(storageFactory.isSingleFolderSelector()).to.be.false;
    
    expect(storageFactory.getBucketName).to.be.a('function');
    expect(storageFactory.getFolderSelfLinkUrl).to.be.a('function');
    
    expect(storageFactory.fileIsCurrentFolder).to.be.a('function');
    expect(storageFactory.fileIsFolder).to.be.a('function');
    expect(storageFactory.fileIsTrash).to.be.a('function');
    
    expect(storageFactory.isTrashFolder).to.be.a('function');
  });
  
  it('getBucketName: ', function() {
    expect(storageFactory.getBucketName()).to.equal('risemedialibrary-companyId');
  });
  
  it('getFolderSelfLinkUrl: ', function() {
    expect(storageFactory.getFolderSelfLinkUrl()).to.equal('https://www.googleapis.com/storage/v1/b/risemedialibrary-companyId/o?prefix=');
  });

  it('fileIsCurrentFolder: ', function() {
    storageFactory.folderPath = '';
    expect(storageFactory.fileIsCurrentFolder({name: 'someFolder/'})).to.be.false;
    
    storageFactory.folderPath = 'someFolder/';
    expect(storageFactory.fileIsCurrentFolder({name: 'someFolder/'})).to.be.true;
  });

  it('fileIsFolder: ', function() {
    expect(storageFactory.fileIsFolder({name: '--TRASH--/'})).to.be.true;
    expect(storageFactory.fileIsFolder({name: 'someFolder/'})).to.be.true;
    expect(storageFactory.fileIsFolder({name: 'someFolder/image.jpg'})).to.be.false;
    expect(storageFactory.fileIsFolder({name: 'image.jpg'})).to.be.false;
  });
  
  it('fileIsTrash: ', function() {
    expect(storageFactory.fileIsTrash({name: '--TRASH--/'})).to.be.true;
    expect(storageFactory.fileIsTrash({name: 'image.jpg'})).to.be.false;
  });
  
  it('isTrashFolder: ', function() {
    storageFactory.folderPath = '';
    expect(storageFactory.isTrashFolder()).to.be.false;
    
    storageFactory.folderPath = 'someFolder/';
    expect(storageFactory.isTrashFolder()).to.be.false;

    storageFactory.folderPath = '--TRASH--/';
    expect(storageFactory.isTrashFolder()).to.be.true;
  });

  describe('addFolder:', function(){
    it('should open modal', function(){
      var modalOpenSpy = sinon.spy($modal,'open');
      storageFactory.addFolder();

      modalOpenSpy.should.have.been.calledWith({
        templateUrl: "partials/storage/new-folder-modal.html",
        controller: "NewFolderModalCtrl",
        size: 'md'
      });

    });
  });

});
