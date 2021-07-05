'use strict';
describe('directive: basicUploader', function () {
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.template-editor.directives'));

  beforeEach(module(function ($provide) {
    uploadManager = {
      onUploadStatus: sinon.stub(),
      addFile: sinon.stub(),
      isSingleFileSelector: function() {
        return isSingleFileSelector;
      }
    };

    $provide.service('ngModalService', function() {
      return {};
    });

    $provide.constant('STORAGE_UPLOAD_CHUNK_SIZE', 1024);

    $provide.factory('fileUploaderFactory', function () {
      return function () {
        return FileUploader = {
          addToQueue: function(files){
            files.forEach(function(file) {
              FileUploader.onAddingFiles({file:file});
              FileUploader.onAfterAddingFile({file:file});
            });
          },
          uploadItem: sinon.stub(),
          queue: [],
          removeFromQueue: sinon.stub(),
          retryItem: sinon.stub(),
          removeExif: sinon.spy(function (files) {
            return Q.resolve(files);
          })
        };
      };
    });

    $provide.factory('storage', function () {
      return storage = {
        refreshFileMetadata: sinon.spy(function() {
          return Q.when({file:'file.jpg'});
        })
      };
    });

    $provide.factory('uploadOverwriteWarning', function() {
      return uploadOverwriteWarning = {
        checkOverwrite: sinon.stub().returns(Q.resolve()),
        resetConfirmation: sinon.stub()
      };
    });

    $provide.factory('UploadURIService', function () {
      return UploadURIService = {
        getURI: sinon.stub().returns(Q.resolve({}))
      };
    });
  }));

  var element;
  var $scope, uploadManager, storage, templateEditorUtils, presentationUtils, isSingleFileSelector;
  var FileUploader, UploadURIService, uploadOverwriteWarning;

  beforeEach(inject(function($injector){
    var $httpBackend = $injector.get('$httpBackend');

    $httpBackend.whenGET(/\.*/).respond(200, {});
  }));

  beforeEach(inject(function($injector, $compile, $rootScope, $templateCache) {
    $rootScope.uploadManager = uploadManager;
    $templateCache.put('partials/template-editor/basic-uploader.html', '<input type="file" multiple>');

    templateEditorUtils = $injector.get('templateEditorUtils');
    presentationUtils = $injector.get('presentationUtils');

    element = $compile('<basic-uploader upload-manager="uploadManager" valid-extensions="validExtensions"></basic-uploader>')($rootScope);
    $rootScope.$apply();

    $scope = element.isolateScope();
  }));

  it('should render directive', function () {
    expect(element.html()).to.equal('<input type="file" multiple="true">');
  });

  it('should add utility functions to scope', function () {
    expect($scope.retryFailedUpload).to.be.a('function');
  });

  it('should add uploader callbacks', function () {
    expect(FileUploader.onAfterAddingFile).to.exist;
    expect(FileUploader.onBeforeUploadItem).to.exist;
    expect(FileUploader.onCancelItem).to.exist;
    expect(FileUploader.onCompleteItem).to.exist;

    expect(UploadURIService.getURI).to.exist;
  });

  it('should watch uploadManager.isSingleFileSelector value and update input multiple attribute', function() {
    isSingleFileSelector = true;

    $scope.$apply();

    expect(element.html()).to.equal('<input type="file">');
  });

  describe('fileList:', function() {
    it('should watch fileList and upload files when changed', function() {
      sinon.stub($scope,'uploadSelectedFiles');
      var newFileList = [{file: 'a.jpg'}];
      $scope.fileList = newFileList;
      $scope.$apply();
      
      $scope.uploadSelectedFiles.should.have.been.calledWith(newFileList);
    });

    it('should not try to upload a null list', function() {
      sinon.stub($scope,'uploadSelectedFiles');
      $scope.fileList = null;  
      $scope.$apply();
      
      $scope.uploadSelectedFiles.should.not.have.been.called;
    });
  });

  
  it('should invoke onAfterAddingFile', function () {
    var file1 = { name: 'test1.jpg', size: 200, slice: function () {} };
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

  it('should upload to the correct folder', function () {
    var file1 = { name: 'test1.jpg', size: 200, slice: function () {} };

    uploadManager.folderPath = 'test-folder/';
    var onAfterAddingFile = sinon.spy(FileUploader, 'onAfterAddingFile');
    FileUploader.addToQueue([ file1 ]);
    expect(onAfterAddingFile.getCall(0).args[0].file.name).to.equal('test-folder/test1.jpg');
  });

  it('should add current path to the name if the file is just being uploaded', function () {
    var fileName = 'test1.jpg';
    var file1 = { name: fileName, size: 200, slice: function () {}, file: { name: fileName } };

    uploadManager.folderPath = 'test/';
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

  it('should not modify the name if the file is being retried', function () {
    var fileName = 'test/test1.jpg';
    var file1 = { name: fileName, size: 200, slice: function () {}, isRetrying: true, file: { name: fileName } };

    uploadManager.folderPath = 'test/';
    FileUploader.onAfterAddingFile(file1);

    var args = UploadURIService.getURI.getCall(0).args;

    expect(UploadURIService.getURI.called).to.be.true;
    expect(args[0].name).to.be.equal('test/test1.jpg');
  });

  it('should ask for confirmation before overwriting files', function(done) {
    var resp = {message: 'uri', isOverwrite: true};
    UploadURIService.getURI.returns(Q.resolve(resp));

    var fileName = 'test1.tif';
    var file1 = { name: fileName, size: 200, slice: function() {}, file: { name: fileName } };

    FileUploader.onAfterAddingFile(file1);

    setTimeout(function(){
      expect(uploadOverwriteWarning.checkOverwrite).to.have.been.called;
      expect(uploadOverwriteWarning.checkOverwrite.getCall(0).args[0]).to.equal(resp);
      expect(uploadOverwriteWarning.checkOverwrite.getCall(0).args[1]).to.be.true;

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

  it('activeUploadCount: ', function () {
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

    expect($scope.activeUploadCount()).to.equal(3);
  });

  describe('retryFailedUpload:', function () {
    it('should retry upload if there was an error', function () {
      var myItem = {
        isError: true
      };

      $scope.retryFailedUpload(myItem);
      FileUploader.retryItem.should.have.been.calledWith(myItem);
    });

    it('should retry upload if there was an error', function () {
      var myItem = {
        isError: false
      };

      $scope.retryFailedUpload(myItem);
      FileUploader.retryItem.should.not.have.been.called;
    });
  });

  describe('removeItem:', function () {
    it('should remove item from Uploader queue', function () {
      var myItem = 'item';

      $scope.removeItem(myItem);
      FileUploader.removeFromQueue.should.have.been.calledWith(myItem);
    });
  });

  describe('onCompleteItem:', function () {
    it('should request file metadata', function () {
      var file1 = { name: 'fileName' };
      var item = {isSuccess: true, file:file1};

      $scope.activeUploadCount = function () {return 1};
      FileUploader.onCompleteItem(item);

      storage.refreshFileMetadata.should.have.been.calledWith(file1.name);
    });

    it('should remove item on completed', function(done){
      var file1 = { name: 'fileName' };
      var item = {isSuccess: true, file:file1};

      $scope.activeUploadCount = function () {return 1};
      FileUploader.onCompleteItem(item);

      setTimeout(function () {
        FileUploader.removeFromQueue.should.have.been.calledWith(item);
        done();
      }, 10);
    });
  });

  describe('uploadSelectedFiles: ', function () {
    beforeEach(function () {
      $scope.validExtensions = '.gif, .jpg, .png';
      sinon.spy($scope.uploader, 'addToQueue');
      sinon.spy(templateEditorUtils, 'fileHasValidExtension');
      sinon.stub(templateEditorUtils, 'showInvalidExtensionsMessage');
    });

    it('should upload the files without warning', function (done) {
      var file1 = { name: 'test.jpg' };
      $scope.uploadSelectedFiles([ file1 ])
      .then (function () {
        setTimeout(function() {
          expect($scope.uploader.removeExif).to.have.been.called;
          expect($scope.uploader.addToQueue).to.have.been.calledWith([ file1 ]);
          expect(templateEditorUtils.fileHasValidExtension).to.have.been.called;
          expect(templateEditorUtils.showInvalidExtensionsMessage).to.have.not.been.called;

          done();
        }, 50);
      });
    });

    it('should upload the valid files and warn about the invalid ones', function (done) {
      var file1 = { name: 'test.jpg' };
      var file2 = { name: 'test.pdf' };
      $scope.uploadSelectedFiles([ file1, file2 ])
      .then (function () {
        setTimeout(function() {
          expect($scope.uploader.removeExif).to.have.been.called;
          expect($scope.uploader.uploadItem).to.have.been.calledOnce;
          expect($scope.uploader.uploadItem.getCall(0).args[0].file.name).to.equal(file1.name);
          expect(templateEditorUtils.fileHasValidExtension).to.have.been.called;
          expect(templateEditorUtils.showInvalidExtensionsMessage).to.have.been.called;

          done();
        }, 50);
      });
    });
  });

  describe('setAcceptAttribute:', function () {
    it('should use a generic accept attribute value when on a mobile device', function () {
      sinon.stub(presentationUtils, 'isMobileBrowser').callsFake(function() { return true; });

      $scope.validExtensions = '.gif, .jpg, .png';
      $scope.validType = 'image';

      $scope.setAcceptAttribute();

      expect($scope.accept).to.be.equal('image/*')
    });

    it('should accept any video type in the file picker pop up if selecting videos when not on a mobile device', function () {
      sinon.stub(presentationUtils, 'isMobileBrowser').callsFake(function() { return false; });

      $scope.validExtensions = '.webm, .mp4';
      $scope.validType = 'video';

      $scope.setAcceptAttribute();

      expect($scope.accept).to.be.equal('*');
    });
  });
});
