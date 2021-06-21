'use strict';
  
describe('service: FileSelectorFactory (aka FilesFactory):', function() {
  beforeEach(module('risevision.storage.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    
    $provide.service('processErrorCode', function() {
      return function() { return 'error'; };
    });
    $provide.factory("currentPlanFactory", function() {
      return {
        showPurchaseOptions: sinon.stub()
      };
    });
  }));
  var filesResponse, returnFiles, filesFactory, storageFactory, storageUtils, $rootScope, $broadcastSpy;
  beforeEach(function(){
    returnFiles = true;
    
    inject(function($injector){  
      $rootScope = $injector.get('$rootScope');

      storageUtils = $injector.get('storageUtils');
      var StorageFactory = $injector.get('StorageFactory');
      storageFactory = new StorageFactory();

      var FilesFactory = $injector.get('FilesFactory');
      filesFactory = new FilesFactory(storageFactory);
    });
  });
  
  beforeEach(function() {
    filesFactory.filesDetails.files = [
      { 'name': 'test/file1', 'size': 5 }, 
      { 'name': 'test/file2', 'size': 3 },
      { 'name': 'test/file3', 'size': 8 },
      { 'name': 'test/', 'size': 0 }
    ];

    storageFactory.selectorType = 'single-file';
    storageFactory.storageFull = true;
    
    $broadcastSpy = sinon.spy($rootScope, '$broadcast');
  });

  it('should exist',function(){
    expect(filesFactory).to.be.ok;

    expect(filesFactory.resetSelections).to.be.a('function');
    expect(filesFactory.selectAllCheckboxes).to.be.a('function');
    expect(filesFactory.getSelectedFiles).to.be.a('function');
    expect(filesFactory.sendFiles).to.be.a('function');
    expect(filesFactory.onFileSelect).to.be.a('function');
    expect(filesFactory.changeFolder).to.be.a('function');    
    expect(filesFactory.isTrashFolder).to.be.a('function');
  });
  
  it('selections should be initialized', function() {
    expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
    expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
    expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(0);
  });
  
  it('should resetSelections on $state change', function(done) {
    var resetSelectionsSpy = sinon.spy(filesFactory, 'resetSelections');
    $rootScope.$broadcast('$stateChangeStart');
    
    setTimeout(function() {
      resetSelectionsSpy.should.have.been.calledOnce;

      done();
    });
  });

  it('resetSelections: ', function() {
    filesFactory.onFileSelect(filesFactory.filesDetails.files[1]);
    filesFactory.onFileSelect(filesFactory.filesDetails.files[3]);
    
    filesFactory.resetSelections();
    
    expect(filesFactory.filesDetails.files[1].isChecked).to.be.false;
    expect(filesFactory.filesDetails.files[3].isChecked).to.be.false;
    expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
    expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
    expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(0);
  });

  describe('selectAllCheckboxes: ', function() {
    it('should select all files and folders in storage full', function() {
      filesFactory.selectAll = false;
      filesFactory.selectAllCheckboxes();

      expect(filesFactory.filesDetails.checkedCount).to.be.equal(3);
      expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(1);
      expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(4);
      expect(filesFactory.filesDetails.files[0].isChecked).to.be.true;
    });
    
    it('should select all filtered files and folders', function() {
      filesFactory.selectAll = false;
      filesFactory.selectAllCheckboxes('file');

      expect(filesFactory.filesDetails.checkedCount).to.be.equal(3);
      expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
      expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(3);
      expect(filesFactory.filesDetails.files[3].isChecked).to.be.false;
    });

    it('should select all files in multiple file selector', function() {
      storageFactory.selectorType = 'multiple-file';
      storageFactory.storageFull = false;

      filesFactory.selectAll = false;
      filesFactory.selectAllCheckboxes();

      expect(filesFactory.filesDetails.checkedCount).to.be.equal(3);
      expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
      expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(3);
    });

    it('should deselect all files and folders', function() {
      filesFactory.selectAll = true;
      filesFactory.selectAllCheckboxes();

      expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
      expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
      expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(0);
    });
  });
  
  it('getSelectedFiles: ', function() {
    filesFactory.onFileSelect(filesFactory.filesDetails.files[1]);
    filesFactory.onFileSelect(filesFactory.filesDetails.files[2]);

    expect(filesFactory.getSelectedFiles()).to.deep.equal([
      filesFactory.filesDetails.files[1], 
      filesFactory.filesDetails.files[2]
    ]);
  })
  
  it('sendFiles: ', function() {
    storageFactory.selectorType = 'multiple-file';
    
    filesFactory.onFileSelect(filesFactory.filesDetails.files[1]);
    filesFactory.onFileSelect(filesFactory.filesDetails.files[2]);

    expect(filesFactory.filesDetails.checkedCount).to.be.equal(2);
    filesFactory.sendFiles();

    $broadcastSpy.should.have.been.calledWith('FileSelectAction', [
      filesFactory.filesDetails.files[1], 
      filesFactory.filesDetails.files[2]
    ]);
  });
  
  describe('changeFolder: ', function() {
    it('should not do anything if a file is selected', function() {
      filesFactory.changeFolder(filesFactory.filesDetails.files[1]);
      
      expect(filesFactory.filesDetails.files[1].isChecked).to.not.be.true;
      expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
      expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
      expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(0);
    });

    it('should reset selections and refreshFilesList', function() {
      var refreshFilesListSpy = sinon.spy(filesFactory, 'refreshFilesList');

      filesFactory.onFileSelect(filesFactory.filesDetails.files[1]);

      filesFactory.changeFolder(filesFactory.filesDetails.files[3]);

      expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
      expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
      expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(0);
      
      refreshFilesListSpy.should.have.been.calledOnce;
    });

    it('should update folderPath', function() {
      filesFactory.changeFolder(filesFactory.filesDetails.files[3]);

      expect(filesFactory.folderPath).to.be.equal(filesFactory.filesDetails.files[3].name);
    });
    
    it('should navigate to parent folder', function() {
      filesFactory.folderPath = filesFactory.filesDetails.files[3].name;
      filesFactory.changeFolder({name:''});

      expect(filesFactory.folderPath).to.be.equal('');
    });
  });
  
  it('isTrashFolder: ', function() {
    filesFactory.folderPath = '';
    expect(filesFactory.isTrashFolder()).to.be.false;
    
    filesFactory.folderPath = 'someFolder/';
    expect(filesFactory.isTrashFolder()).to.be.false;

    filesFactory.folderPath = '--TRASH--/';
    expect(filesFactory.isTrashFolder()).to.be.true;

    filesFactory.folderPath = '--TRASH--/subfolder/';
    expect(filesFactory.isTrashFolder()).to.be.true;
  });

  describe('onFileSelect: ', function() {
    describe('storageFull: ', function() {
      it('should select a file', function() {
        filesFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        
        expect(filesFactory.filesDetails.files[1].isChecked).to.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(1);
      });
      
      it('should select a folder', function() {
        filesFactory.onFileSelect(filesFactory.filesDetails.files[3]);
        
        expect(filesFactory.filesDetails.files[3].isChecked).to.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(1);
      });
      
      it('should select multiple files/folders', function() {
        filesFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        filesFactory.onFileSelect(filesFactory.filesDetails.files[3]);
        
        expect(filesFactory.filesDetails.files[1].isChecked).to.be.true;
        expect(filesFactory.filesDetails.files[3].isChecked).to.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(2);
      });
      
      it('should toggle selection', function() {
        filesFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        filesFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        
        expect(filesFactory.filesDetails.files[1].isChecked).to.be.false;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(0);
      });
    });

    describe('single-file: ', function() {
      beforeEach(function() {
        storageFactory.storageFull = false;
      });

      it('should select file', function() {
        filesFactory.onFileSelect(filesFactory.filesDetails.files[1]);

        $broadcastSpy.should.have.been.calledWith('FileSelectAction',
          [filesFactory.filesDetails.files[1]]);
      });
      
      it('should clear selections', function() {
        filesFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        
        expect(filesFactory.filesDetails.files[1].isChecked).to.not.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(0);
      });

      it('should not select folder', function() {
        filesFactory.onFileSelect(filesFactory.filesDetails.files[3]);
        
        $broadcastSpy.should.not.have.been.called;
      });
    });

    describe('single-folder: ', function() {
      beforeEach(function() {
        storageFactory.storageFull = false;
        storageFactory.selectorType = 'single-folder';
      });
      
      it('should select folder', function() {
        filesFactory.onFileSelect(filesFactory.filesDetails.files[3]);

        $broadcastSpy.should.have.been.calledWith('FileSelectAction',
          [filesFactory.filesDetails.files[3]]);
      });

      it('should clear selections', function() {
        filesFactory.onFileSelect(filesFactory.filesDetails.files[3]);
        
        expect(filesFactory.filesDetails.files[3].isChecked).to.not.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(0);
      });

      it('should not select a file', function() {
        filesFactory.onFileSelect(filesFactory.filesDetails.files[1]);

        $broadcastSpy.should.not.have.been.called;
      });
    });

    describe('multiple-file: ', function() {
      beforeEach(function() {
        storageFactory.storageFull = false;
        storageFactory.selectorType = 'multiple-file';
      });

      it('should select a file', function() {
        filesFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        
        expect(filesFactory.filesDetails.files[1].isChecked).to.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(1);
      });

      it('should not select a folder', function() {
        filesFactory.onFileSelect(filesFactory.filesDetails.files[3]);
        
        expect(filesFactory.filesDetails.files[3].isChecked).to.not.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(0);
      });
      
      it('should select multiple files', function() {
        filesFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        filesFactory.onFileSelect(filesFactory.filesDetails.files[2]);
        
        expect(filesFactory.filesDetails.files[1].isChecked).to.be.true;
        expect(filesFactory.filesDetails.files[2].isChecked).to.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(2);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(2);
      });
    });

    describe('multiple-files-folders: ', function() {
      beforeEach(function() {
        storageFactory.storageFull = false;
        storageFactory.selectorType = 'multiple-files-folders';
      });

      it('should select a file', function() {
        filesFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        
        expect(filesFactory.filesDetails.files[1].isChecked).to.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(1);
      });
      
      it('should select a folder', function() {
        filesFactory.onFileSelect(filesFactory.filesDetails.files[3]);
        
        expect(filesFactory.filesDetails.files[3].isChecked).to.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(1);
      });
      
      it('should select multiple files/folders', function() {
        filesFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        filesFactory.onFileSelect(filesFactory.filesDetails.files[3]);
        
        expect(filesFactory.filesDetails.files[1].isChecked).to.be.true;
        expect(filesFactory.filesDetails.files[3].isChecked).to.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(2);
      });
    });

  });

});
