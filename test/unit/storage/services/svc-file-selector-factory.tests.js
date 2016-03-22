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
  var filesResponse, fileSelectorFactory, returnFiles, filesFactory, storageFactory;
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
      storageFactory = $injector.get('storageFactory');
      fileSelectorFactory = $injector.get('fileSelectorFactory');
      
      storageFactory.selectorType = 'single-file';
      storageFactory.storageFull = true;
    });
  });

  it('should exist',function(){
    expect(fileSelectorFactory).to.be.ok;
    
    // Hardcoded
    
    expect(fileSelectorFactory.resetSelections).to.be.a('function');
    expect(fileSelectorFactory.folderSelect).to.be.a('function');    
    expect(fileSelectorFactory.fileCheckToggled).to.be.a('function');    
    expect(fileSelectorFactory.selectAllCheckboxes).to.be.a('function');
    expect(fileSelectorFactory.postFileToParent).to.be.a('function');
    expect(fileSelectorFactory.onFileSelect).to.be.a('function');
  });
  
  
  xit('should post a message to its parent when a file is clicked', function() {
    var file = filesFactory.filesDetails.files[0];
    var call = sinon.spy(gadgets.rpc, 'call');

    storageFactory.storageFull = false;
    scope.$emit('FileSelectAction', file);

    scope.$apply();

    expect(call.called).to.equal(true);

    // postMessage receives an array of file paths and a '*' as second parameter
    expect(postMessage.args[0][0].length).to.equal(1);
  });

  describe('selectAllCheckboxes: ', function() {
    it('should select all files and folders in storage full', function() {
      fileSelectorFactory.selectAll = false;
      fileSelectorFactory.selectAllCheckboxes();

      expect(filesFactory.filesDetails.checkedCount).to.be.equal(3);
      expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(1);
    });

    it('should select all files in multiple file selector', function() {
      storageFactory.selectorType = 'multiple-file';
      storageFactory.storageFull = false;

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

});
