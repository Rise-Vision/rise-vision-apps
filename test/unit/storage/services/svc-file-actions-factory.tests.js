'use strict';
describe('service: fileActionsFactory', function() {
  var fileActionsFactory, filesFactory, storage, pendingOperationsFactory, processErrorCode,
      downloadFactory, $modal, $rootScope, selectedFiles, apiResponse, localStorageService;
  var getResponse, renameResponse, duplicateResponse;
  var sandbox = sinon.sandbox.create();

  var modalOpenMock = function() {
    return {
      result: Q.resolve()
    };
  };

  beforeEach(module('risevision.storage.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    filesFactory = {
      filesDetails: {
        files: []
      },
      addFile: function(){},
      removeFiles: function(){},
      getSelectedFiles: function() {
        return selectedFiles;
      },
      resetSelections: function(){}
    };

    $provide.factory('storage',function () {
      return storage = {
        trash: {
          move: function(){
            if (apiResponse && apiResponse.result && apiResponse.result.error) {
              return Q.reject(apiResponse);
            } else {
              return Q.resolve(apiResponse);
            }
          }
        },
        files: {
          get: function() {
            if (getResponse.result && getResponse.result.error) {
              return Q.reject(getResponse);
            }
            else {
              return Q.resolve(getResponse);
            }
          }
        },
        rename: function() {
          if (renameResponse.result && renameResponse.result.error) {
            return Q.reject(renameResponse);
          }
          else {
            return Q.resolve(renameResponse);
          }
        },
        duplicate: function() {
          if (duplicateResponse.result && duplicateResponse.result.error) {
            return Q.reject(duplicateResponse);
          }
          else {
            return Q.resolve(duplicateResponse);
          }
        }
      };
    });

    $provide.factory('downloadFactory',function () {
      return downloadFactory = {
        downloadFiles: function(){}
      };
    });

    $provide.factory('$modal',function () {
      return $modal = {
        open: function(){}
      };
    });

    $provide.factory('localStorageService', function () {
      return localStorageService = {
        get: function() {},
        set: function() {}
      };
    });

    $provide.service('processErrorCode', function() {
      return processErrorCode = sinon.spy(function() { return 'error'; });
    });
  }));

  beforeEach(function(){
    inject(function($injector){
      selectedFiles = null;
      apiResponse = null;
      $rootScope = $injector.get('$rootScope');
      pendingOperationsFactory = $injector.get('pendingOperationsFactory');
      var FileActionsFactory = $injector.get('FileActionsFactory');
      fileActionsFactory = new FileActionsFactory(filesFactory);
    });
  });

  afterEach(function(){
    sandbox.restore();
  });

  it('should exist',function(){
    expect(fileActionsFactory).to.be.ok;
    
    expect(fileActionsFactory.downloadButtonClick).to.be.a('function');
    expect(fileActionsFactory.deleteButtonClick).to.be.a('function');
    expect(fileActionsFactory.trashButtonClick).to.be.a('function');
    expect(fileActionsFactory.restoreButtonClick).to.be.a('function');
    expect(fileActionsFactory.copyUrlButtonClick).to.be.a('function');
    expect(fileActionsFactory.processFilesAction).to.be.a('function');
  });

  describe('downloadButtonClick:', function(){
    it('should download selected files',function(){
      var spy = sinon.spy(downloadFactory,'downloadFiles');
      selectedFiles = ['file1', 'file2']
      fileActionsFactory.downloadButtonClick();

      spy.should.have.been.calledWith(selectedFiles,100);
    });
  });

  describe('deleteButtonClick:', function(){
    it('should call confirmDeleteFilesAction',function(){
      var stub = sinon.stub(fileActionsFactory,'confirmDeleteFilesAction');
      fileActionsFactory.deleteButtonClick();

      stub.should.have.been.called;
    });
  });

  describe('trashButtonClick:', function(){
    beforeEach(function() {
      sandbox.stub($modal, 'open').returns({
        result: Q.resolve()
      });
      sandbox.stub(fileActionsFactory,'processFilesAction');
    });
    
    it('should open warning modal',function(done){
      sandbox.stub(localStorageService, "get").returns('false');

      fileActionsFactory.trashButtonClick();
      
      setTimeout(function() {
        $modal.open.should.have.been.called;
        expect($modal.open.getCall(0).args[0].templateUrl).to.equal('partials/storage/break-link-warning-modal.html');
        expect($modal.open.getCall(0).args[0].controller).to.equal('BreakLinkWarningModalCtrl');
        expect($modal.open.getCall(0).args[0].resolve).to.be.ok;
        expect($modal.open.getCall(0).args[0].resolve.infoLine1Key()).to.equal('storage-client.breaking-link-warning.text1');

        fileActionsFactory.processFilesAction.should.have.been.calledWith(storage.trash.move, 'delete');
        
        done();
      }, 10);
    });

    it('should not open warning modal',function(done){
      sandbox.stub(localStorageService, "get").returns(true);

      fileActionsFactory.trashButtonClick();
      
      setTimeout(function() {
        $modal.open.should.not.have.been.called;

        fileActionsFactory.processFilesAction.should.have.been.calledWith(storage.trash.move, 'delete');
        
        done();
      }, 10);
    });

    it('should not enqueue trash action',function(done){
      $modal.open.returns({
        result: Q.reject()
      });

      fileActionsFactory.trashButtonClick();

      setTimeout(function() {
        fileActionsFactory.processFilesAction.should.not.have.been.called;

        done();
      }, 10);
    });
  });

  describe('restoreButtonClick:', function(){
    it('should enqueue trash action',function(){
      var stub = sinon.stub(fileActionsFactory,'processFilesAction');
      fileActionsFactory.restoreButtonClick();

      stub.should.have.been.calledWith(storage.trash.restore, 'restore');
    });
  });

  describe('copyUrlButtonClick:', function(){
    it('should open URL Modal',function(){
      var spy = sinon.spy($modal,'open');
      fileActionsFactory.copyUrlButtonClick();

      spy.should.have.been.called;
      expect(spy.getCall(0).args[0].templateUrl).to.equal('partials/storage/copy-url-modal.html');
      expect(spy.getCall(0).args[0].controller).to.equal('CopyUrlModalController');      
    });
  });

  describe('confirmDeleteFilesAction:',function(){
    it('should open confirmation modal',function(){
      var stub = sinon.stub($modal,'open',function(){return {result:{then: function(){}}}});

      filesFactory.filesDetails.checkedCount = 1;
      fileActionsFactory.confirmDeleteFilesAction();

      stub.should.have.been.called;
      expect(stub.getCall(0).args[0].templateUrl).to.equal('partials/components/confirm-modal/confirm-modal.html');
      expect(stub.getCall(0).args[0].controller).to.equal('confirmModalController');    
    });

    it('should delete file on confirm',function(){
      var stub = sinon.stub($modal,'open',function(){
        return {result:{then: function(cb){cb();}}}
      });
      var processFilesActionStub = sinon.stub(fileActionsFactory,'processFilesAction');
      filesFactory.filesDetails.checkedCount = 1;

      fileActionsFactory.confirmDeleteFilesAction();

      processFilesActionStub.should.have.been.calledWith(storage.files.delete, 'delete');       
    });
  });

  describe('processFilesAction:',function(){
    it('should list files in pending operations',function(){
      selectedFiles = [{name:'file1'}, {name:'file2'}];

      fileActionsFactory.processFilesAction(storage.trash.move, 'delete');

      var pendingFileNames = pendingOperationsFactory.pendingOperations.map(function (i) {
        return i.name;
      });
      expect(pendingFileNames).to.contain('file1');
      expect(pendingFileNames).to.contain('file2');
    });

    it('should process the action and remove files from pending',function(done) {
      selectedFiles = [{name:'file1'}, {name:'file2'}];
      apiResponse = {result:{}};
      var storageSpy = sinon.spy(storage.trash,'move');

      fileActionsFactory.processFilesAction(storage.trash.move, 'delete');

      storageSpy.should.have.been.calledWith(['file1','file2']);
      
      setTimeout(function() {
        var pendingFileNames = pendingOperationsFactory.pendingOperations.map(function (i) {
          return i.name;
        });
        expect(pendingFileNames).to.not.contain('file1');
        expect(pendingFileNames).to.not.contain('file2');
        
        done();
      });
    });

    it('should notify storage failures',function(done){
      selectedFiles = [{name:'file1'}, {name:'file2'}];
      apiResponse = {
        result: { error: { message: 'error' } }
      };
      var storageSpy = sinon.spy(storage.trash,'move');

      fileActionsFactory.processFilesAction(storage.trash.move, 'delete');

      storageSpy.should.have.been.calledWith(['file1','file2']);
      
      setTimeout(function() {
        var pendingFileNames = pendingOperationsFactory.pendingOperations.map(function (i) {
          return i.name;
        });
        expect(pendingFileNames).to.contain('file1');
        expect(pendingFileNames).to.contain('file2');

        expect(selectedFiles[0].actionFailed).to.be.true;
        expect(selectedFiles[1].actionFailed).to.be.true;
        
        done();
      });
    });    
  });

  describe('refreshThumbnail: ', function() {
    it('should refresh the thumbnail for a file', function(done) {
      sandbox.spy(storage.files, 'get');

      getResponse = { files: [{ name: "test.jpg" }] };

      fileActionsFactory.refreshThumbnail({ name: "test.jpg" })
        .then(function(resp) {
          storage.files.get.should.have.been.called;
          expect(resp.name).to.equal('test.jpg');
          done();
        });
    });

    it('should not refresh the thumbnail for a folder', function(done) {
      sandbox.spy(storage.files, 'get');

      fileActionsFactory.refreshThumbnail({ name: "folder/" })
        .then(function(resp) {
          storage.files.get.should.not.have.been.called;
          expect(resp.name).to.equal('folder/');
          done();
        });
    });
  });

  describe('rename: ', function() {
    it('should rename a file', function(done) {
      sandbox.spy(storage.files, 'get');
      sandbox.spy(storage, 'rename');
      sandbox.spy(filesFactory, 'addFile');
      sandbox.spy(filesFactory, 'removeFiles');
      sandbox.spy(filesFactory, 'resetSelections');

      getResponse = { files: [{ name: "test2.jpg" }] };
      renameResponse = { code: 200 };

      fileActionsFactory.renameObject({ name: "test.jpg" }, "test2.jpg")
        .then(function() {
          storage.rename.should.have.been.called;
          storage.files.get.should.have.been.called;
          filesFactory.addFile.should.have.been.called;
          filesFactory.removeFiles.should.have.been.called;
          filesFactory.resetSelections.should.have.been.called;

          expect(storage.rename.getCall(0).args[0]).to.equal('test.jpg');
          expect(storage.rename.getCall(0).args[1]).to.equal('test2.jpg');
          expect(storage.files.get.getCall(0).args[0].file).to.equal('test2.jpg');
          expect(filesFactory.removeFiles.getCall(0).args[0][0].name).to.equal('test.jpg');
          expect(filesFactory.addFile.getCall(0).args[0].name).to.equal('test2.jpg');
          done();
        });
    });

    it('should rename a folder', function(done) {
      sandbox.spy(storage.files, 'get');
      sandbox.spy(storage, 'rename');
      sandbox.spy(filesFactory, 'addFile');
      sandbox.spy(filesFactory, 'removeFiles');
      sandbox.spy(filesFactory, 'resetSelections');

      renameResponse = { code: 200 };

      fileActionsFactory.renameObject({ name: "folder1/" }, "folder2")
        .then(function() {
          storage.rename.should.have.been.called;
          storage.files.get.should.not.have.been.called;
          filesFactory.addFile.should.have.been.called;
          filesFactory.removeFiles.should.have.been.called;
          filesFactory.resetSelections.should.have.been.called;

          expect(storage.rename.getCall(0).args[0]).to.equal('folder1/');
          expect(storage.rename.getCall(0).args[1]).to.equal('folder2/');
          expect(filesFactory.removeFiles.getCall(0).args[0][0].name).to.equal('folder1/');
          expect(filesFactory.addFile.getCall(0).args[0].name).to.equal('folder2/');
          done();
      });
    });

    it('should fail to rename the file because of server error', function(done) {
      sandbox.spy(storage.files, 'get');
      sandbox.spy(storage, 'rename');
      sandbox.spy(filesFactory, 'addFile');
      sandbox.spy(filesFactory, 'removeFiles');

      getResponse = { files: [{ name: "test2.jpg" }] };
      renameResponse = {
        status: 404,
        result: { error: { message: "not-found" } }
      };

      fileActionsFactory.renameObject({ name: "test.jpg" }, "test2.jpg")
        .then(done, function() {
          storage.rename.should.have.been.called;
          storage.files.get.should.not.have.been.called;

          done();
        });
    });
  });
  
  describe('renameButtonClick:', function(){
    beforeEach(function() {
      sandbox.stub($modal, 'open', modalOpenMock);
    });
    
    it('should open warning modal',function(done){
      sandbox.stub(localStorageService, "get").returns('false');

      fileActionsFactory.renameButtonClick();
      
      setTimeout(function() {
        $modal.open.should.have.been.calledTwice;
        expect($modal.open.getCall(0).args[0].templateUrl).to.equal('partials/storage/break-link-warning-modal.html');
        expect($modal.open.getCall(0).args[0].controller).to.equal('BreakLinkWarningModalCtrl');
        expect($modal.open.getCall(0).args[0].resolve).to.be.ok;
        expect($modal.open.getCall(0).args[0].resolve.infoLine1Key()).to.equal('storage-client.breaking-link-warning.text1');
        
        done();
      }, 10);
    });

    it('should not open warning modal',function(done){
      sandbox.stub(localStorageService, "get").returns(true);

      fileActionsFactory.renameButtonClick();
      
      setTimeout(function() {
        $modal.open.should.have.been.calledOnce;
        
        done();
      }, 10);
    });

    it('should open rename modal',function(done){
      sandbox.stub(localStorageService, "get").returns(true);
      selectedFiles = ['file1'];

      fileActionsFactory.renameButtonClick();

      setTimeout(function() {
        $modal.open.should.have.been.calledOnce;
        expect($modal.open.getCall(0).args[0].templateUrl).to.equal('partials/storage/rename-modal.html');
        expect($modal.open.getCall(0).args[0].controller).to.equal('RenameModalCtrl');
        expect($modal.open.getCall(0).args[0].resolve.sourceObject()).to.equal('file1');
        
        done();
      }, 10);
    });
  });

  describe('duplicate: ', function() {
    it('should duplicate a file', function(done) {
      sandbox.spy(storage.files, 'get');
      sandbox.spy(storage, 'duplicate');
      sandbox.spy(filesFactory, 'addFile');
      sandbox.spy(filesFactory, 'removeFiles');
      sandbox.spy(filesFactory, 'resetSelections');

      getResponse = { files: [{ name: "test (1).jpg" }] };
      duplicateResponse = { code: 200, message: "test (1).jpg" };

      fileActionsFactory.duplicateObject({ name: "test.jpg" })
        .then(function() {
          storage.duplicate.should.have.been.called;
          storage.files.get.should.have.been.called;
          filesFactory.addFile.should.have.been.called;
          filesFactory.resetSelections.should.have.been.called;

          expect(storage.duplicate.getCall(0).args[0]).to.equal('test.jpg');
          expect(storage.files.get.getCall(0).args[0].file).to.equal('test (1).jpg');
          expect(filesFactory.addFile.getCall(0).args[0].name).to.equal('test (1).jpg');
          done();
        });
    });

    it('should fail to duplicate the file because of server error', function(done) {
      sandbox.spy(storage.files, 'get');
      sandbox.spy(storage, 'duplicate');
      sandbox.spy(filesFactory, 'addFile');

      getResponse = { files: [{ name: "test2.jpg" }] };
      duplicateResponse = {
        status: 404,
        result: { error: { message: "not-found" } }
      };

      fileActionsFactory.duplicateObject({ name: "test.jpg" })
        .then(done, function() {
          storage.duplicate.should.have.been.called;
          storage.files.get.should.not.have.been.called;

          done();
        });
    });

  });

  describe('moveButtonClick: ', function() {
    var destinationFolder, excludedFiles;

    beforeEach(function() {
      renameResponse = { result: { code: 200 } };
      destinationFolder = [{name: 'folder1/'}];
      modalOpenMock = function(obj) {
        if (obj.resolve && obj.resolve.excludedFiles) {
          excludedFiles = obj.resolve.excludedFiles();
        }
        return {
          result: {
            then: function(cb){ cb(destinationFolder); }
          }
        };
      };
      
      sandbox.stub($modal, 'open', modalOpenMock);
      
      selectedFiles = [{name: 'file1'}, {name: 'file2'}];
    });
    
    it('should open warning modal', function(done) {
      sandbox.stub(localStorageService, "get").returns('false');

      fileActionsFactory.moveButtonClick();
      
      setTimeout(function() {
        $modal.open.should.have.been.calledTwice;
        expect($modal.open.getCall(0).args[0].templateUrl).to.equal('partials/storage/break-link-warning-modal.html');
        expect($modal.open.getCall(0).args[0].controller).to.equal('BreakLinkWarningModalCtrl');
        expect($modal.open.getCall(0).args[0].resolve).to.be.ok;
        expect($modal.open.getCall(0).args[0].resolve.infoLine1Key()).to.equal('storage-client.breaking-link-warning.text1');
        
        done();
      }, 10);
    });
    
    it('should exclude selected files from folder modal', function(done) {
      sandbox.stub(localStorageService, "get").returns(true);

      fileActionsFactory.moveButtonClick();
      
      setTimeout(function() {
        $modal.open.should.have.been.calledOnce;
        expect($modal.open.getCall(0).args[0].templateUrl).to.equal('partials/storage/folder-selector-modal.html');
        expect($modal.open.getCall(0).args[0].controller).to.equal('FolderSelectorModalController');
        expect($modal.open.getCall(0).args[0].resolve).to.be.ok;
        expect(excludedFiles).to.deep.equal(['file1', 'file2']);
        
        done();
      }, 10);
    });
    
    it('should list files in pending operations', function() {
      fileActionsFactory.moveButtonClick();

      var pendingFileNames = pendingOperationsFactory.pendingOperations.map(function (i) {
        return i.name;
      });
      expect(pendingFileNames).to.contain('file1');
      expect(pendingFileNames).to.contain('file2');
    });
    
    it('should move two files', function(done) {
      sandbox.spy(storage, 'rename');
      sandbox.spy(filesFactory, 'removeFiles');
      sandbox.spy(filesFactory, 'resetSelections');

      fileActionsFactory.moveButtonClick();

      filesFactory.resetSelections.should.have.been.called;

      setTimeout(function() {
        storage.rename.should.have.been.calledTwice;
        filesFactory.removeFiles.should.have.been.calledTwice;

        expect(storage.rename.getCall(0).args[0]).to.equal('file1');
        expect(storage.rename.getCall(0).args[1]).to.equal('folder1/file1');

        expect(storage.rename.getCall(1).args[0]).to.equal('file2');
        expect(storage.rename.getCall(1).args[1]).to.equal('folder1/file2');

        expect(filesFactory.removeFiles.getCall(0).args[0][0].name).to.equal('file1');
        expect(filesFactory.removeFiles.getCall(1).args[0][0].name).to.equal('file2');

        done();
      }, 10);
    });
    
    it('should move two to the root folder', function(done) {
      destinationFolder = [{name: '/'}];
      selectedFiles = [{name: 'folder1/file1'}, {name: 'folder1/file2'}];

      sandbox.spy(storage, 'rename');

      fileActionsFactory.moveButtonClick();

      setTimeout(function() {
        storage.rename.should.have.been.calledTwice;

        expect(storage.rename.getCall(0).args[0]).to.equal('folder1/file1');
        expect(storage.rename.getCall(0).args[1]).to.equal('file1');

        expect(storage.rename.getCall(1).args[0]).to.equal('folder1/file2');
        expect(storage.rename.getCall(1).args[1]).to.equal('file2');

        done();
      }, 10);
    });
    
    it('should fail to move files', function(done) {
      renameResponse = {
        status: 404,
        result: { error: { message: "not-found" } }
      };

      sandbox.spy(storage, 'rename');

      fileActionsFactory.moveButtonClick();

      setTimeout(function() {
        storage.rename.should.have.been.calledOnce;

        expect(pendingOperationsFactory.pendingOperations[0].actionFailed).to.be.true;
        expect(pendingOperationsFactory.pendingOperations[1].actionFailed).to.be.true;

        done();
      }, 10);
    });
    
    it('should remove pending operations', function(done) {
      fileActionsFactory.moveButtonClick();

      setTimeout(function() {
        var pendingFileNames = pendingOperationsFactory.pendingOperations.map(function (i) {
          return i.name;
        });
        expect(pendingFileNames).to.not.contain('file1');
        expect(pendingFileNames).to.not.contain('file2');
        
        done();
      }, 10);
    });
  });
});
