'use strict';
  
describe('service: fileSelectorFactory:', function() {
  beforeEach(module('risevision.storage.services'));
  beforeEach(module(function ($provide) {
    $provide.service('filesFactory', function() {
      return filesFactory;
    });

    $provide.service('gadgetsApi',function(){
      return {
        rpc: {
          call: function() {}
        }
      };
    });

  }));
  var filesResponse, fileSelectorFactory, returnFiles, filesFactory;
  beforeEach(function(){
    returnFiles = true;
    filesFactory = {
      filesDetails: {
        files: [{ 'name': 'test/file1', 'size': 5 }, 
          { 'name': 'test/file2', 'size': 3 },
          { 'name': 'test/file3', 'size': 8 },
          { 'name': 'test/', 'size': 0 }]
        ,localFiles: false
        ,checkedCount: 0
        ,folderCheckedCount: 0
        ,folderPath: ''
      }
    };
    
    inject(function($injector){  
      fileSelectorFactory = $injector.get('fileSelectorFactory');
      
      fileSelectorFactory.type = 'single-file';
      
    });
  });

  it('should exist',function(){
    expect(fileSelectorFactory).to.be.ok;
    
    // Hardcoded
    expect(fileSelectorFactory.storageFull).to.be.false;
    expect(fileSelectorFactory.isSingleFileSelector()).to.be.true;
    expect(fileSelectorFactory.isMultipleFileSelector()).to.be.false;
    expect(fileSelectorFactory.isSingleFolderSelector()).to.be.false;
    
    expect(fileSelectorFactory.resetSelections).to.be.a('function');
    expect(fileSelectorFactory.folderSelect).to.be.a('function');    
    expect(fileSelectorFactory.fileCheckToggled).to.be.a('function');    
    expect(fileSelectorFactory.selectAllCheckboxes).to.be.a('function');
    expect(fileSelectorFactory.fileIsCurrentFolder).to.be.a('function');
    expect(fileSelectorFactory.fileIsFolder).to.be.a('function');
    expect(fileSelectorFactory.fileIsTrash).to.be.a('function');
    expect(fileSelectorFactory.postFileToParent).to.be.a('function');
    expect(fileSelectorFactory.onFileSelect).to.be.a('function');
  });
  
  
  xit('should post a message to its parent when a file is clicked', function() {
    var file = filesFactory.filesDetails.files[0];
    var call = sinon.spy(gadgets.rpc, 'call');

    fileSelectorFactory.storageFull = false;
    scope.$emit('FileSelectAction', file);

    scope.$apply();

    expect(call.called).to.equal(true);

    // postMessage receives an array of file paths and a '*' as second parameter
    expect(postMessage.args[0][0].length).to.equal(1);
  });

  describe('selectAllCheckboxes: ', function() {
    it('should select all files and folders in storage full', function() {
      fileSelectorFactory.storageFull = true;
      fileSelectorFactory.selectAll = false;
      fileSelectorFactory.selectAllCheckboxes();

      expect(filesFactory.filesDetails.checkedCount).to.be.equal(3);
      expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(1);
    });

    it('should select all files in multiple file selector', function() {
      fileSelectorFactory.singleFileSelector = true;
      fileSelectorFactory.selectAll = false;
      fileSelectorFactory.selectAllCheckboxes();

      expect(filesFactory.filesDetails.checkedCount).to.be.equal(3);
      expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
    });

    it('should deselect all files and folders', function() {
      fileSelectorFactory.selectAll = true;
      fileSelectorFactory.selectAllCheckboxes();

      expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
      expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
    });
  });

  it('fileIsCurrentFolder: ', function() {
    filesFactory.folderPath = '';
    expect(fileSelectorFactory.fileIsCurrentFolder({name: 'someFolder/'})).to.be.false;
    
    filesFactory.folderPath = 'someFolder/';
    expect(fileSelectorFactory.fileIsCurrentFolder({name: 'someFolder/'})).to.be.true;
  });

  it('fileIsFolder: ', function() {
    expect(fileSelectorFactory.fileIsFolder({name: '--TRASH--/'})).to.be.true;
    expect(fileSelectorFactory.fileIsFolder({name: 'someFolder/'})).to.be.true;
    expect(fileSelectorFactory.fileIsFolder({name: 'someFolder/image.jpg'})).to.be.false;
    expect(fileSelectorFactory.fileIsFolder({name: 'image.jpg'})).to.be.false;
  });
  
  it('fileIsTrash: ', function() {
    expect(fileSelectorFactory.fileIsTrash({name: '--TRASH--/'})).to.be.true;
    expect(fileSelectorFactory.fileIsTrash({name: 'image.jpg'})).to.be.false;
  });

});
