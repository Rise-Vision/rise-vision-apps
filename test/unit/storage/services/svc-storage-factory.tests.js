'use strict';
  
describe('service: storageFactory:', function() {
  beforeEach(module('risevision.storage.filters'));
  beforeEach(module('risevision.storage.services'));
  var storageFactory, $modal, SELECTOR_FILTERS;

  beforeEach(module(function ($provide) {
    $provide.service('$modal', function() {
      return {
        open: function(){
        }      
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
      SELECTOR_FILTERS = $injector.get('SELECTOR_FILTERS');
      
      storageFactory.selectorType = 'single-file';
      storageFactory.storageFull = true;
    });
  });

  it('should exist',function(){
    expect(storageFactory).to.be.ok;
        
    expect(storageFactory.setSelectorType).to.be.a('function');
    expect(storageFactory.getBucketName).to.be.a('function');
    expect(storageFactory.getFolderSelfLinkUrl).to.be.a('function');
    expect(storageFactory.isMultipleSelector).to.be.a('function');
    expect(storageFactory.isFileSelector).to.be.a('function');
    expect(storageFactory.isFolderSelector).to.be.a('function');
    expect(storageFactory.canSelect).to.be.a('function');
    expect(storageFactory.isDisabled).to.be.a('function');
    expect(storageFactory.fileIsCurrentFolder).to.be.a('function');
    expect(storageFactory.fileIsFolder).to.be.a('function');
    expect(storageFactory.fileIsTrash).to.be.a('function');
    expect(storageFactory.isTrashFolder).to.be.a('function');
    
    expect(storageFactory.addFolder).to.be.a('function');
  });
  
  it('should initialize values', function() {
    // Hardcoded
    expect(storageFactory.storageFull).to.be.true;
    expect(storageFactory.isMultipleSelector()).to.be.true;
    expect(storageFactory.isFileSelector()).to.be.true;
    expect(storageFactory.isFolderSelector()).to.be.true;
    
    expect(storageFactory.selectorFilter).to.equal(SELECTOR_FILTERS.ALL);
  });
  
  describe('setSelectorType: ', function() {
    it('should initialize selectorType', function() {
      storageFactory.setSelectorType('invalid');
      expect(storageFactory.selectorType).to.equal('single-file');
      
      storageFactory.setSelectorType('single-folder');
      expect(storageFactory.selectorType).to.equal('single-folder');
    });
    
    it('should initialize selectorFilter', function() {
      storageFactory.setSelectorType('', 'invalid');
      expect(storageFactory.selectorFilter).to.equal(SELECTOR_FILTERS.ALL);
      
      storageFactory.setSelectorType('', 'images');
      expect(storageFactory.selectorFilter).to.equal(SELECTOR_FILTERS.IMAGES);

      storageFactory.setSelectorType('', 'videos');
      expect(storageFactory.selectorFilter).to.equal(SELECTOR_FILTERS.VIDEOS);
    });
  });
  
  describe('isDisabled: ', function() {
    beforeEach(function() {
      storageFactory.storageFull = false;
    });

    it('false for folders', function() {
      expect(storageFactory.isDisabled({name: 'folder/'})).to.be.false;
      
      storageFactory.selectorType = 'single-folder';
      expect(storageFactory.isDisabled({name: 'folder/'})).to.be.false;
    });

    it('true for files in singleFolderSelector', function() {
      storageFactory.setSelectorType('single-folder', 'images');

      expect(storageFactory.isDisabled({name: 'file.jpg'})).to.be.true;
    });

    it('false for files if no filter is selected', function() {
      expect(storageFactory.isDisabled({name: 'file.jpg'})).to.be.false;
    });
    
    it('should filter non Image files', function() {
      storageFactory.setSelectorType('', 'images');

      expect(storageFactory.isDisabled({name: 'file.jpg'})).to.be.false;
      expect(storageFactory.isDisabled({name: 'file.mp4'})).to.be.true;
      expect(storageFactory.isDisabled({name: 'file.html'})).to.be.true;
    });
    
    it('should filter non Video files', function() {
      storageFactory.setSelectorType('', 'videos');

      expect(storageFactory.isDisabled({name: 'file.mp4'})).to.be.false;
      expect(storageFactory.isDisabled({name: 'file.jpg'})).to.be.true;
      expect(storageFactory.isDisabled({name: 'file.html'})).to.be.true;
    });
  });
  
  describe('canSelect: ', function() {
    beforeEach(function() {
      storageFactory.storageFull = false;
    });

    it('false for file is currentFolder', function() {
      expect(storageFactory.canSelect({name: 'folder/', currentFolder: true})).to.be.false;
    });

    it('false for file is trash', function() {
      expect(storageFactory.canSelect({name: '--TRASH--/'})).to.be.false;
    });

    it('false for files in singleFolderSelector', function() {
      storageFactory.selectorType = 'single-folder';

      expect(storageFactory.canSelect({name: 'file.jpg'})).to.be.false;
    });
    
    it('true for files in singleFileSelector', function() {
      expect(storageFactory.canSelect({name: 'file.jpg'})).to.be.true;
    });
    
    it('true for folders in singleFolderSelector', function() {
      storageFactory.selectorType = 'single-folder';

      expect(storageFactory.canSelect({name: 'folder/'})).to.be.true;
    });
    
    it('false for folders in non singleFolderSelector', function() {
      expect(storageFactory.canSelect({name: 'folder/'})).to.be.false;
    });
    
    it('true for folders in fullScreen', function() {
      storageFactory.storageFull = true;

      expect(storageFactory.canSelect({name: 'folder/'})).to.be.true;
    });
    
    it('should not select filtered files', function() {
      storageFactory.setSelectorType('', 'videos');

      expect(storageFactory.canSelect({name: 'file.mp4'})).to.be.true;
      expect(storageFactory.canSelect({name: 'file.jpg'})).to.be.false;
      expect(storageFactory.canSelect({name: 'file.html'})).to.be.false;
    });
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
