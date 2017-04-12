'use strict';
describe('service: fileActionsFactory', function() {
  var fileActionsFactory, filesFactory, storage, pendingOperationsFactory,
      downloadFactory, $modal, $rootScope, selectedFiles, apiResponse, localStorageService;
  var getResponse, renameResponse;
  var sandbox = sinon.sandbox.create();

  var modalOpenMock = function() {
    return {
      result: {
        then: function(cb){ cb(); }
      }
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
            return {
              then:function(cb){
                if (apiResponse) cb(apiResponse);
              }
            };
          }
        },
        files: {
          get: function() {
            if(getResponse && getResponse.error) {
              return Q.reject(getResponse);
            }
            else {
              return Q.resolve(getResponse);
            }
          }
        },
        rename: function() {
          if(renameResponse && renameResponse.error) {
            return Q.reject(renameResponse);
          }
          else {
            return Q.resolve(renameResponse);
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
    expect(fileActionsFactory).to.be.truely;

    expect(fileActionsFactory.statusDetails).to.be.truely;
    expect(fileActionsFactory.pendingOperations).to.be.truely;
    expect(fileActionsFactory.isPOCollapsed).to.be.truely;
    
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
    it('should enqueue trash action',function(){
      var stub = sinon.stub(fileActionsFactory,'processFilesAction');
      fileActionsFactory.trashButtonClick();

      stub.should.have.been.calledWith('trash');
    });
  });

  describe('restoreButtonClick:', function(){
    it('should enqueue trash action',function(){
      var stub = sinon.stub(fileActionsFactory,'processFilesAction');
      fileActionsFactory.restoreButtonClick();

      stub.should.have.been.calledWith('restore');
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
      expect(stub.getCall(0).args[0].templateUrl).to.equal('confirm-instance/confirm-modal.html');
      expect(stub.getCall(0).args[0].controller).to.equal('confirmInstance');    
    });

    it('should delete file on confirm',function(){
      var stub = sinon.stub($modal,'open',function(){
        return {result:{then: function(cb){cb();}}}
      });
      var processFilesActionStub = sinon.stub(fileActionsFactory,'processFilesAction');
      filesFactory.filesDetails.checkedCount = 1;

      fileActionsFactory.confirmDeleteFilesAction();

      processFilesActionStub.should.have.been.calledWith('delete');       
    });
  });

  describe('processFilesAction:',function(){
    it('should list files in pending operations',function(){
      selectedFiles = [{name:'file1'}, {name:'file2'}];

      fileActionsFactory.processFilesAction('trash');

      var pendingFileNames = pendingOperationsFactory.pendingOperations.map(function (i) {
        return i.name;
      });
      expect(pendingFileNames).to.contain('file1');
      expect(pendingFileNames).to.contain('file2');
    });

    it('should process the action and remove files from pending',function(){
      selectedFiles = [{name:'file1'}, {name:'file2'}];
      apiResponse = {result:{}};
      var storageSpy = sinon.spy(storage.trash,'move');

      fileActionsFactory.processFilesAction('trash');

      storageSpy.should.have.been.calledWith(['file1','file2']);
      var pendingFileNames = pendingOperationsFactory.pendingOperations.map(function (i) {
        return i.name;
      });
      expect(pendingFileNames).to.not.contain('file1');
      expect(pendingFileNames).to.not.contain('file2');
    });

    it('should notify storage failures',function(){
      selectedFiles = [{name:'file1'}, {name:'file2'}];
      apiResponse = {};
      var storageSpy = sinon.spy(storage.trash,'move');

      fileActionsFactory.processFilesAction('trash');

      storageSpy.should.have.been.calledWith(['file1','file2']);
      var pendingFileNames = pendingOperationsFactory.pendingOperations.map(function (i) {
        return i.name;
      });
      expect(pendingFileNames).to.contain('file1');
      expect(pendingFileNames).to.contain('file2');

      expect(selectedFiles[0].actionFailed).to.be.true;
      expect(selectedFiles[1].actionFailed).to.be.true;
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

    it('should fail to rename the file because of business logic error', function(done) {
      sandbox.spy(storage.files, 'get');
      sandbox.spy(storage, 'rename');
      sandbox.spy(filesFactory, 'addFile');
      sandbox.spy(filesFactory, 'removeFiles');

      getResponse = { files: [{ name: "test2.jpg" }] };
      renameResponse = { code: 404, message: "not-found" };

      fileActionsFactory.renameObject({ name: "test.jpg" }, "test2.jpg")
        .then(function() {
          storage.rename.should.have.been.called;
          storage.files.get.should.not.have.been.called;

          done();
        });
    });

    it('should fail to rename the file because of server error', function(done) {
      sandbox.spy(storage.files, 'get');
      sandbox.spy(storage, 'rename');
      sandbox.spy(filesFactory, 'addFile');
      sandbox.spy(filesFactory, 'removeFiles');

      getResponse = { files: [{ name: "test2.jpg" }] };
      renameResponse = { error: true };

      fileActionsFactory.renameObject({ name: "test.jpg" }, "test2.jpg");

      setTimeout(function() {
        storage.rename.should.have.been.called;
        storage.files.get.should.not.have.been.called;

        done();
      }, 0);
    });
  });

  describe('showBreakLinkWarning:', function(){
    it('should open warning modal',function(){
      sandbox.stub(localStorageService, "get").returns('false');
      sandbox.stub($modal, 'open', modalOpenMock);

      return fileActionsFactory.showBreakLinkWarning()
        .then(function() {
          $modal.open.should.have.been.called;
          expect($modal.open.getCall(0).args[0].templateUrl).to.equal('partials/storage/break-link-warning-modal.html');
          expect($modal.open.getCall(0).args[0].controller).to.equal('BreakLinkWarningModalCtrl');
        });
    });

    it('should not open warning modal',function(){
      sandbox.stub(localStorageService, "get").returns('true');
      sandbox.stub($modal, 'open', modalOpenMock);

      return fileActionsFactory.showBreakLinkWarning()
        .then(function() {
          $modal.open.should.not.have.been.called;
        });
    });
  });

  describe('renameButtonClick:', function(){
    it('should open rename modal',function(){
      sandbox.stub(localStorageService, "get").returns('true');
      sandbox.stub($modal, 'open', modalOpenMock);
      selectedFiles = ['file1'];

      return fileActionsFactory.renameButtonClick()
        .then(function() {
          $modal.open.should.have.been.calledOnce;
          expect($modal.open.getCall(0).args[0].templateUrl).to.equal('partials/storage/rename-modal.html');
          expect($modal.open.getCall(0).args[0].controller).to.equal('RenameModalCtrl');
          expect($modal.open.getCall(0).args[0].resolve.sourceObject()).to.equal('file1');
        });
    });
  });
});
