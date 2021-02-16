'use strict';
describe('directive: upload', function() {
  beforeEach(module('risevision.storage.directives'));

  beforeEach(module(function ($provide) {
    $provide.factory('FileUploader', function() {
      return FileUploader = {
        addToQueue: function(files){
          FileUploader.onAddingFiles({file:files[0]});
          FileUploader.onAfterAddingFile({file:files[0]});
        },
        uploadItem: sinon.stub(),
        queue: [],
        removeFromQueue: sinon.spy(),
        retryItem: sinon.spy()
      };
    });

    filesFactory = {
      addFile: function(){}
    };

    $provide.factory('storage', function() {
      return storage = {
        refreshFileMetadata: sinon.spy(function() {
          return Q.when({file:'file.jpg'});
        })
      };
    });

    $provide.factory('UploadURIService', function() {
      return UploadURIService = {
        getURI: sinon.stub().returns(Q.resolve({}))
      };
    });
    
    $provide.factory('$translate', function() {
      return function(key) {
        return {
          then: function(cb) {
            if(Array.isArray(key)) {
              var map = {};
              for(var i = 0; i < key.length; i++) {
                map[key[i]] = key[i];
              }
              cb(map);
            }
            else {
              cb(key);
            }
          }
        };
      };
    });

    $provide.factory('uploadOverwriteWarning', function() {
      return uploadOverwriteWarning = {
        checkOverwrite: sinon.stub().returns(Q.resolve()),
        resetConfirmation: sinon.stub()
      };
    });
    
    $provide.factory('XHRFactory', function() {
      return {
        get: function() {
          return {
            upload: function() {

            },
            open: function() {

            },
            setRequestHeader: function() {

            },
            send: function() {
              this.status = 200;
              this.onload();
            }
          };
        }
      };
    });
  }));  

  var element;
  var UploadController, $scope, filesFactory, storage;
  var FileUploader, UploadURIService, uploadOverwriteWarning;

  beforeEach(inject(function($injector){
    var $httpBackend = $injector.get('$httpBackend');

    $httpBackend.whenGET(/\.*/).respond(200, {});
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache) {
    $rootScope.filesFactory = filesFactory;
    $templateCache.put('partials/storage/upload-panel.html', '<p>mock</p>');

    element = $compile('<upload files-factory="filesFactory"></upload>')($rootScope);
    $rootScope.$apply();
    
    $scope = element.isolateScope();
  }));

  it('should render directive', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  it('should add utility functions to scope', function() {
    expect($scope.activeUploadCount).to.be.a('function');
    expect($scope.retryFailedUpload).to.be.a('function');
    expect($scope.retryFailedUploads).to.be.a('function');
  });

  it('should add uploader callbacks', function() {
    expect(FileUploader.onAddingFiles).to.exist;
    expect(FileUploader.onAfterAddingFile).to.exist;
    expect(FileUploader.onBeforeUploadItem).to.exist;
    expect(FileUploader.onCancelItem).to.exist;
    expect(FileUploader.onCompleteItem).to.exist;

    expect(UploadURIService.getURI).to.exist;
  });

  it('should invoke onAfterAddingFile', function() {
    var file1 = { name: 'test1.jpg', size: 200, slice: function() {} };
    var spy = sinon.spy(FileUploader,'onAfterAddingFile');
    FileUploader.addToQueue([ file1 ]);
    spy.should.have.been.called;  
  });

  it('should invoke onAddingFiles', function () {
    var file1 = { name: 'test1.jpg', size: 200, slice: function () {} };
    var spy = sinon.spy(FileUploader,'onAddingFiles');
    FileUploader.addToQueue([ file1 ]);
    spy.should.have.been.called;
  });

  it('should reset upload overwrite message on adding files', function () {
    var file1 = { name: 'test1.jpg', size: 200, slice: function () {} };
    FileUploader.addToQueue([ file1 ]);
    uploadOverwriteWarning.resetConfirmation.should.have.been.called;
  });

  it('should upload to the correct folder', function() {
      var file1 = { name: 'test1.jpg', size: 200, slice: function() {} };

      filesFactory.folderPath = 'test-folder/';
      var onAfterAddingFile = sinon.spy(FileUploader, 'onAfterAddingFile');
      FileUploader.addToQueue([ file1 ]);
      expect(onAfterAddingFile.getCall(0).args[0].file.name).to.equal('test-folder/test1.jpg');
  });

  it('should add current path to the name if the file is just being', function() {
    var fileName = 'test1.jpg';
    var file1 = { name: fileName, size: 200, slice: function() {}, file: { name: fileName } };
    
    filesFactory.folderPath = 'test/';
    FileUploader.onAfterAddingFile(file1);
    
    var args = UploadURIService.getURI.getCall(0).args;
    
    expect(UploadURIService.getURI.called).to.be.true;
    expect(args[0].name).to.be.equal('test/test1.jpg');
  });

  it('should fall back to storage encoding if overwriting non mp4', function () {
    UploadURIService.getURI = sinon.stub()
      .onCall(0).returns(Q.reject({message: 'Unencodable overwrite'}))
      .onCall(1).returns(Q.resolve({}));

    var fileName = 'test1.webm';
    var file1 = { name: fileName, size: 200, slice: function () {}, file: { name: fileName } };

    return FileUploader.onAfterAddingFile(file1)
    .then(function () {
      var firstCallArgs = UploadURIService.getURI.getCall(0).args;
      var secondCallArgs = UploadURIService.getURI.getCall(1).args;

      expect(UploadURIService.getURI.called).to.be.true;
      expect(firstCallArgs[0].name).to.be.equal('test1.webm');
      expect(firstCallArgs[1]).to.be.equal(undefined);
      expect(secondCallArgs[0].name).to.be.equal('test1.webm');
      expect(secondCallArgs[1]).to.be.equal(true);
    });
  });

  it('should not modify the name if the file is being retried', function() {
    var fileName = 'test/test1.jpg';
    var file1 = { name: fileName, size: 200, slice: function() {}, isRetrying: true, file: { name: fileName } };
    
    filesFactory.folderPath = 'test/';
    FileUploader.onAfterAddingFile(file1);
    
    var args = UploadURIService.getURI.getCall(0).args;
    
    expect(UploadURIService.getURI.called).to.be.true;
    expect(args[0].name).to.be.equal('test/test1.jpg');
  });

  it('should add warning if the file is not supported', function(done) {
    var fileName = 'test1.tif';
    var file1 = { name: fileName, size: 200, slice: function() {}, file: { name: fileName } };

    filesFactory.folderPath = 'test/';
    FileUploader.onAfterAddingFile(file1);

    setTimeout(function(){
      expect($scope.warnings[0].fileName).to.be.equal('test/test1.tif');
      expect($scope.warnings[0].message).to.be.equal('storage-client.warning.image-not-supported');
      done();
    }, 10);
  });

  it('should ask for confirmation before overwriting files', function(done) {
    var resp = {message: 'uri', isOverwrite: true};
    UploadURIService.getURI.returns(Q.resolve(resp));

    var fileName = 'test1.tif';
    var file1 = { name: fileName, size: 200, slice: function() {}, file: { name: fileName } };

    FileUploader.onAfterAddingFile(file1);

    setTimeout(function(){
      expect(uploadOverwriteWarning.checkOverwrite).to.have.been.called;
      expect(uploadOverwriteWarning.checkOverwrite).to.have.been.calledWith(resp);    

      expect(FileUploader.uploadItem).to.have.been.calledWith(file1);

      done();
    },10);
  });

  it('should remove file if user doesn\'t want to overwrite', function( done) {
    UploadURIService.getURI.returns(Q.resolve({message: 'uri', isOverwrite: true}));
    uploadOverwriteWarning.checkOverwrite.returns(Q.reject());

    var fileName = 'test1.tif';
    var file1 = { name: fileName, size: 200, slice: function() {}, file: { name: fileName } };

    FileUploader.onAfterAddingFile(file1);

    setTimeout(function(){
      expect(uploadOverwriteWarning.checkOverwrite).to.have.been.called;
      expect(FileUploader.removeFromQueue).to.have.been.called;
      expect(FileUploader.uploadItem).to.not.have.been.called;

      done();
    },10);
  });

  it('activeUploadCount: ', function() {
    FileUploader.queue = [
      {
        name: 'file1.pending',
        isUploaded: false,
        isError: false
      },
      {
        name: 'file1.error',
        isUploaded: true,
        isError: true
      },
      {
        name: 'file1.complete',
        isUploaded: true,
        isError: false
      }
    ];

    expect($scope.activeUploadCount()).to.equal(2);
  });

  describe('retryFailedUpload:',function(){
    it('should retry upload if there was an error',function(){
      var myItem = {
        isError: true
      };

      $scope.retryFailedUpload(myItem);
      FileUploader.retryItem.should.have.been.calledWith(myItem);
    });

    it('should retry upload if there was an error',function(){
      var myItem = {
        isError: false
      };

      $scope.retryFailedUpload(myItem);
      FileUploader.retryItem.should.not.have.been.called;
    });

  });

  describe('removeItem:',function(){

    it('should remove item from Uploader queue',function(){
      var myItem = 'item';

      $scope.removeItem(myItem);
      FileUploader.removeFromQueue.should.have.been.calledWith(myItem);
    });

  });

  describe('onCompleteItem:',function(){
    it('should request file metadata',function(){
      var file1 = { name: 'fileName' };
      var item = {isSuccess: true, file:file1};

      $scope.activeUploadCount = function() {return 1};
      FileUploader.onCompleteItem(item);
      
      storage.refreshFileMetadata.should.have.been.calledWith(file1.name);
    });

    it('should remove item on completed',function(done){
      var file1 = { name: 'fileName' };
      var item = {isSuccess: true, file:file1};

      $scope.activeUploadCount = function() {return 1};
      FileUploader.onCompleteItem(item);

      setTimeout(function() {
        FileUploader.removeFromQueue.should.have.been.calledWith(item);
        done();
      }, 10);               
    });      
  });

});
