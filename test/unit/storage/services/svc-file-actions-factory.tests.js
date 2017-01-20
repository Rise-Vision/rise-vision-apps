'use strict';
describe('service: fileActionsFactory', function() {
  beforeEach(module('risevision.storage.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    
    $provide.factory('fileSelectorFactory',function () {
      return fileSelectorFactory = {
        getSelectedFiles: function() {
          return selectedFiles;
        },
        resetSelections: function(){}
      };
    });

    $provide.factory('filesFactory',function () {
      return filesFactory = {
        filesDetails: {
          files: []
        },
        removeFiles: function(){}
      };
    });

    $provide.factory('storage',function () {
      return storage = {
        trash: { 
          move: function(){
            return {
              then:function(cb){
                if (apiResponse) cb(apiResponse);
              }
            }
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

  }));
  var fileActionsFactory, fileSelectorFactory, storage, filesFactory, 
    downloadFactory, $modal, $rootScope, selectedFiles, apiResponse;
  beforeEach(function(){        
    inject(function($injector){
      selectedFiles = null;
      apiResponse = null;
      $rootScope = $injector.get('$rootScope');
      fileActionsFactory = $injector.get('fileActionsFactory');
    });
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
    expect(fileActionsFactory.removePendingOperation).to.be.a('function');
    expect(fileActionsFactory.copyUrlButtonClick).to.be.a('function');
    expect(fileActionsFactory.processFilesAction).to.be.a('function');
    expect(fileActionsFactory.getActivePendingOperations).to.be.a('function');
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

  describe('removePendingOperation:',function(){
    it('should remove pending operation',function(){
      fileActionsFactory.pendingOperations = ['file1', 'file2'];
      fileActionsFactory.removePendingOperation('file2');
      expect(fileActionsFactory.pendingOperations.length).to.equal(1);
      expect(fileActionsFactory.pendingOperations.indexOf('file2')).to.equal(-1);
    });

    it('should handle not found',function () {
      fileActionsFactory.removePendingOperation('file3');
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

      var pendingFileNames = fileActionsFactory.pendingOperations.map(function (i) {
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
      var pendingFileNames = fileActionsFactory.pendingOperations.map(function (i) {
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
      var pendingFileNames = fileActionsFactory.pendingOperations.map(function (i) {
        return i.name;
      });
      expect(pendingFileNames).to.contain('file1');
      expect(pendingFileNames).to.contain('file2');

      expect(selectedFiles[0].actionFailed).to.be.true;
      expect(selectedFiles[1].actionFailed).to.be.true;
    });    
  });

  describe('getActivePendingOperations:',function(){
    it('should return pending operations',function(){
      fileActionsFactory.pendingOperations = [{name:'file1'}, {name:'file2'}];

      expect(fileActionsFactory.getActivePendingOperations())
        .to.deep.equal(fileActionsFactory.pendingOperations);
    });

    it('should not return failed operations',function(){
      fileActionsFactory.pendingOperations = [{name:'file1'}, {name:'file2', actionFailed: true}];

      expect(fileActionsFactory.getActivePendingOperations())
        .to.contain(fileActionsFactory.pendingOperations[0]);
      expect(fileActionsFactory.getActivePendingOperations())
        .to.not.contain(fileActionsFactory.pendingOperations[1]);
    });
  });  
});
