'use strict';
  
describe('service: StorageFactory:', function() {
  beforeEach(module('risevision.storage.filters'));
  beforeEach(module('risevision.storage.services'));
  var storageFactory, $modal, SELECTOR_FILTERS;

  beforeEach(function(){
    inject(function($injector){  
      var StorageFactory = $injector.get('StorageFactory');
      storageFactory = new StorageFactory();

      SELECTOR_FILTERS = $injector.get('SELECTOR_FILTERS');
      
      storageFactory.selectorType = 'single-file';
      storageFactory.storageFull = true;
    });
  });

  it('should exist',function(){
    expect(storageFactory).to.be.ok;
        
    expect(storageFactory.setSelectorType).to.be.a('function');
    expect(storageFactory.isMultipleSelector).to.be.a('function');
    expect(storageFactory.isFileSelector).to.be.a('function');
    expect(storageFactory.isFolderSelector).to.be.a('function');
    expect(storageFactory.isFolderFilter).to.be.a('function');
    expect(storageFactory.canSelect).to.be.a('function');
    expect(storageFactory.isDisabled).to.be.a('function');
    expect(storageFactory.fileIsImage).to.be.a('function');    
    expect(storageFactory.fileIsVideo).to.be.a('function');    
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
  
  it('isFolderFilter: ', function() {
    expect(storageFactory.isFolderFilter()).to.be.false;
    storageFactory.setSelectorType('', 'folders');
    expect(storageFactory.isFolderFilter()).to.be.true;
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

    it('false for throttled file ', function() {
      expect(storageFactory.canSelect({name: 'file.jpg', isThrottled: true})).to.be.false;
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

  it('fileIsImage:',function(){
    expect(storageFactory.fileIsImage({name: 'f.jpg'})).to.be.true;
    expect(storageFactory.fileIsImage({name: 'f.jpeg'})).to.be.true;
    expect(storageFactory.fileIsImage({name: 'f.png'})).to.be.true;
    expect(storageFactory.fileIsImage({name: 'f.bmp'})).to.be.true;
    expect(storageFactory.fileIsImage({name: 'f.gif'})).to.be.true;
    expect(storageFactory.fileIsImage({name: 'f.svg'})).to.be.true;
    expect(storageFactory.fileIsImage({name: 'f.webp'})).to.be.true;

    expect(storageFactory.fileIsImage({name: 'f.txt'})).to.be.false;
    expect(storageFactory.fileIsImage({name: 'f.mp3'})).to.be.false;
    expect(storageFactory.fileIsImage({name: 'f.mp4'})).to.be.false;
  });

  it('fileIsVideo:',function(){
    expect(storageFactory.fileIsVideo({name: 'f.webm'})).to.be.true;
    expect(storageFactory.fileIsVideo({name: 'f.mp4'})).to.be.true;
    expect(storageFactory.fileIsVideo({name: 'f.ogg'})).to.be.true;
    expect(storageFactory.fileIsVideo({name: 'f.ogv'})).to.be.true;

    expect(storageFactory.fileIsVideo({name: 'f.txt'})).to.be.false;
    expect(storageFactory.fileIsVideo({name: 'f.mp3'})).to.be.false;
    expect(storageFactory.fileIsVideo({name: 'f.jpg'})).to.be.false;
  });

});
