'use strict';
  
describe('service: fileSelectorFactory:', function() {
  beforeEach(module('risevision.storage.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('filesFactory', function() {
      return filesFactory;
    });

    $provide.service('gadgetsApi',function(){
      return gadgetsApi = {
        rpc: {
          call: function() {}
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
    $provide.service('$modal', function() {
      return {
        open: function(obj){
          var deferred = Q.defer();

          if (obj.resolve) {
            obj.resolve.enableByURL ? obj.resolve.enableByURL() : undefined;
          }

          if(modalSuccess) {
            deferred.resolve('success');  
          }
          else {
            deferred.reject();
          }

          return {
            result: deferred.promise
          }
        }
      };
    });
  }));
  var filesResponse, fileSelectorFactory, returnFiles, filesFactory, storageFactory, gadgetsApi, $rootScope, $broadcastSpy, $window;
  var $modal, modalSuccess;
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
      },
      refreshFilesList: function() {
      }
    };
    modalSuccess = true;
    
    inject(function($injector){  
      $rootScope = $injector.get('$rootScope');
      $window = $injector.get('$window');
      $modal = $injector.get('$modal');
      storageFactory = $injector.get('storageFactory');
      fileSelectorFactory = $injector.get('fileSelectorFactory');
    });
  });
  
  beforeEach(function() {
    storageFactory.storageIFrame = false;
    storageFactory.selectorType = 'single-file';
    storageFactory.storageFull = true;
    
    $broadcastSpy = sinon.spy($rootScope, '$broadcast');
  });

  it('should exist',function(){
    expect(fileSelectorFactory).to.be.ok;

    expect(fileSelectorFactory.resetSelections).to.be.a('function');
    expect(fileSelectorFactory.selectAllCheckboxes).to.be.a('function');
    expect(fileSelectorFactory.getSelectedFiles).to.be.a('function');
    expect(fileSelectorFactory.sendFiles).to.be.a('function');
    expect(fileSelectorFactory.onFileSelect).to.be.a('function');
    expect(fileSelectorFactory.changeFolder).to.be.a('function');    
    expect(fileSelectorFactory.cancel).to.be.a('function');
  });
  
  it('selections should be initialized', function() {
    expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
    expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
    expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(0);
  });
  
  it('should resetSelections on $state change', function(done) {
    var resetSelectionsSpy = sinon.spy(fileSelectorFactory, 'resetSelections');
    $rootScope.$broadcast('$stateChangeStart');
    
    setTimeout(function() {
      resetSelectionsSpy.should.have.been.calledOnce;

      done();
    });
  });

  it('resetSelections: ', function() {
    fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[1]);
    fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[3]);
    
    fileSelectorFactory.resetSelections();
    
    expect(filesFactory.filesDetails.files[1].isChecked).to.be.false;
    expect(filesFactory.filesDetails.files[3].isChecked).to.be.false;
    expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
    expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
    expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(0);
  });

  describe('selectAllCheckboxes: ', function() {
    it('should select all files and folders in storage full', function() {
      fileSelectorFactory.selectAll = false;
      fileSelectorFactory.selectAllCheckboxes();

      expect(filesFactory.filesDetails.checkedCount).to.be.equal(3);
      expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(1);
      expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(4);
      expect(filesFactory.filesDetails.files[0].isChecked).to.be.true;
    });
    
    it('should select all filtered files and folders', function() {
      fileSelectorFactory.selectAll = false;
      fileSelectorFactory.selectAllCheckboxes('file');

      expect(filesFactory.filesDetails.checkedCount).to.be.equal(3);
      expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
      expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(3);
      expect(filesFactory.filesDetails.files[3].isChecked).to.be.false;
    });

    it('should select all files in multiple file selector', function() {
      storageFactory.selectorType = 'multiple-file';
      storageFactory.storageFull = false;

      fileSelectorFactory.selectAll = false;
      fileSelectorFactory.selectAllCheckboxes();

      expect(filesFactory.filesDetails.checkedCount).to.be.equal(3);
      expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
      expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(3);
    });

    it('should deselect all files and folders', function() {
      fileSelectorFactory.selectAll = true;
      fileSelectorFactory.selectAllCheckboxes();

      expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
      expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
      expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(0);
    });
  });
  
  it('getSelectedFiles: ', function() {
    fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[1]);
    fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[2]);

    expect(fileSelectorFactory.getSelectedFiles()).to.deep.equal([
      filesFactory.filesDetails.files[1], 
      filesFactory.filesDetails.files[2]
    ]);
  })
  
  it('sendFiles: ', function() {
    storageFactory.selectorType = 'multiple-file';
    
    fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[1]);
    fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[2]);

      expect(filesFactory.filesDetails.checkedCount).to.be.equal(2);
    fileSelectorFactory.sendFiles();

    $broadcastSpy.should.have.been.calledWith('FileSelectAction', [
      'https://storage.googleapis.com/risemedialibrary-companyId/test%2Ffile2', 
      'https://storage.googleapis.com/risemedialibrary-companyId/test%2Ffile3'
    ]);
  });
  
  describe('changeFolder: ', function() {
    it('should not do anything if a file is selected', function() {
      fileSelectorFactory.changeFolder(filesFactory.filesDetails.files[1]);
      
      expect(filesFactory.filesDetails.files[1].isChecked).to.be.false;
      expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
      expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
      expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(0);
    });

    it('should reset selections and refreshFilesList', function() {
      var refreshFilesListSpy = sinon.spy(filesFactory, 'refreshFilesList');

      fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[1]);

      fileSelectorFactory.changeFolder(filesFactory.filesDetails.files[3]);

      expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
      expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
      expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(0);
      
      refreshFilesListSpy.should.have.been.calledOnce;
    });

    it('should update folderPath', function() {
      fileSelectorFactory.changeFolder(filesFactory.filesDetails.files[3]);

      expect(storageFactory.folderPath).to.be.equal(filesFactory.filesDetails.files[3].name);
    });
    
    it('should navigate to parent folder', function() {
      storageFactory.folderPath = filesFactory.filesDetails.files[3].name;
      fileSelectorFactory.changeFolder(filesFactory.filesDetails.files[3]);

      expect(storageFactory.folderPath).to.be.equal('');
    });
  });

  describe('onFileSelect: ', function() {
    describe('storageFull: ', function() {
      it('should select a file', function() {
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        
        expect(filesFactory.filesDetails.files[1].isChecked).to.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(1);
      });
      
      it('should select a folder', function() {
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[3]);
        
        expect(filesFactory.filesDetails.files[3].isChecked).to.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(1);
      });
      
      it('should select multiple files/folders', function() {
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[3]);
        
        expect(filesFactory.filesDetails.files[1].isChecked).to.be.true;
        expect(filesFactory.filesDetails.files[3].isChecked).to.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(2);
      });
      
      it('should toggle selection', function() {
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        
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

      it('should select a file', function() {
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        
        expect(filesFactory.filesDetails.files[1].isChecked).to.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(1);
      });

      it('should not select folder', function() {
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[3]);
        
        expect(filesFactory.filesDetails.files[3].isChecked).to.be.false;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(0);
      });
      
      it('should select file', function() {
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[1]);

        $broadcastSpy.should.have.been.calledWith('FileSelectAction',
          ['https://storage.googleapis.com/risemedialibrary-companyId/test%2Ffile2']);
      });
      
      it('should select file and postMessage/send rpc', function() {
        storageFactory.storageIFrame = true;
        var rpcCallSpy = sinon.spy(gadgetsApi.rpc, 'call');
        var postMessageSpy = sinon.spy($window.parent, "postMessage");

        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[1]);

        rpcCallSpy.should.have.been.calledWith('', 'rscmd_saveSettings', null,
          {params: 'https://storage.googleapis.com/risemedialibrary-companyId/test%2Ffile2'});
          
        // postMessage receives an array of file paths and a '*' as second parameter
        postMessageSpy.should.have.been.calledWith(['https://storage.googleapis.com/risemedialibrary-companyId/test%2Ffile2'], '*');
        postMessageSpy.restore();
      });
    });

    describe('single-folder: ', function() {
      beforeEach(function() {
        storageFactory.storageFull = false;
        storageFactory.selectorType = 'single-folder';
      });

      it('should select a folder', function() {
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[3]);
        
        expect(filesFactory.filesDetails.files[3].isChecked).to.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(1);
      });

      it('should not select a file', function() {
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[1]);

        expect(filesFactory.filesDetails.files[1].isChecked).to.be.false;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(0);
      });
      
      it('should select folder', function() {
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[3]);

        $broadcastSpy.should.have.been.calledWith('FileSelectAction',
          ['https://storage.googleapis.com/risemedialibrary-companyId/test%2F']);
      });
      
      it('should select folder and postMessage/send rpc', function() {
        storageFactory.storageIFrame = true;
        var rpcCallSpy = sinon.spy(gadgetsApi.rpc, 'call');
        var postMessageSpy = sinon.spy($window.parent, "postMessage");

        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[3]);

        rpcCallSpy.should.have.been.calledWith('', 'rscmd_saveSettings', null,
          {params: 'https://storage.googleapis.com/risemedialibrary-companyId/test%2F'});
          
        // postMessage receives an array of file paths and a '*' as second parameter
        postMessageSpy.should.have.been.calledWith(['https://storage.googleapis.com/risemedialibrary-companyId/test%2F'], '*');
        postMessageSpy.restore();
      });
    });

    describe('multiple-file: ', function() {
      beforeEach(function() {
        storageFactory.storageFull = false;
        storageFactory.selectorType = 'multiple-file';
      });

      it('should select a file', function() {
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        
        expect(filesFactory.filesDetails.files[1].isChecked).to.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(1);
      });

      it('should not select a folder', function() {
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[3]);
        
        expect(filesFactory.filesDetails.files[3].isChecked).to.be.false;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(0);
      });
      
      it('should select multiple files', function() {
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[2]);
        
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
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        
        expect(filesFactory.filesDetails.files[1].isChecked).to.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(1);
      });
      
      it('should select a folder', function() {
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[3]);
        
        expect(filesFactory.filesDetails.files[3].isChecked).to.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(0);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(1);
      });
      
      it('should select multiple files/folders', function() {
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[1]);
        fileSelectorFactory.onFileSelect(filesFactory.filesDetails.files[3]);
        
        expect(filesFactory.filesDetails.files[1].isChecked).to.be.true;
        expect(filesFactory.filesDetails.files[3].isChecked).to.be.true;
        expect(filesFactory.filesDetails.checkedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.folderCheckedCount).to.be.equal(1);
        expect(filesFactory.filesDetails.checkedItemsCount).to.be.equal(2);
      });
    });

    describe('cancel:',function(){
      it('should broadcast cancel action',function(){
        fileSelectorFactory.cancel();

        $broadcastSpy.should.have.been.calledWith('CancelFileSelect');
      });

      it('should postMessage/send rpc',function(){
        storageFactory.storageIFrame = true;
        var rpcCallSpy = sinon.spy(gadgetsApi.rpc, 'call');
        var postMessageSpy = sinon.spy($window.parent, "postMessage");

        fileSelectorFactory.cancel();

        rpcCallSpy.should.have.been.calledWith('', 'rscmd_closeSettings', null);
          
        postMessageSpy.should.have.been.calledWith("close", "*");
        postMessageSpy.restore();
      });
    });

  });  

  describe('openSelector:', function(){
    it('should return a promise', function() {
      expect(fileSelectorFactory.openSelector().then).to.be.a('function');
    });
    
    it('should initialize default selection', function() {
      fileSelectorFactory.openSelector();

      expect(storageFactory.selectorType).to.equal('single-file');
    });

    it('should open modal', function() {
      var $modalSpy = sinon.spy($modal, 'open');
      
      fileSelectorFactory.openSelector();      
      
      $modalSpy.should.have.been.called;
    });
    
    it('should initialize selectorType', function() {
      var setSelectorTypeSpy = sinon.spy(storageFactory, 'setSelectorType');

      fileSelectorFactory.openSelector('multiple-files-folders', 'images');

      setSelectorTypeSpy.should.have.been.calledWith('multiple-files-folders', 'images');
    });

    it('should resolve promise', function(done) {
      fileSelectorFactory.openSelector()
      .then(function(result){
        expect(result).to.equal('success');

        done();
      })
      .then(null,done);
    });
    
    it('should reject promise on cancel', function(done) {
      modalSuccess = false;
      fileSelectorFactory.openSelector()
      .then(function(result) {
        done('failed');
      })
      .then(null, function() {
        done();
      })
      .then(null,done);
    });

  });

});
