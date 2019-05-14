'use strict';
describe('directive: basicUploader', function () {
  beforeEach(module('risevision.template-editor.directives'));

  beforeEach(module(function ($provide) {
    uploadManager = {
      onUploadStatus: sinon.stub(),
      addFile: sinon.stub()
    };

    $provide.constant('STORAGE_UPLOAD_CHUNK_SIZE', 1024);

    $provide.factory('fileUploaderFactory', function () {
      return function () {
        return FileUploader = {
          addToQueue: function(files){
            FileUploader.onAfterAddingFile({file:files[0]});
          },
          uploadItem: function () {},
          queue: [],
          removeFromQueue: sinon.spy(),
          retryItem: sinon.spy()
        };
      };
    });

    $provide.factory('storage', function () {
      return storage = {
        files: {
          get: sinon.spy(function () {
            return Q.when({file:'file.jpg'})
          })
        }
      };
    });

    $provide.factory('UploadURIService', function () {
      return UploadURIService = {
        getURI: sinon.spy(function(file) {
          var deferred = Q.defer();
          
          deferred.resolve(file.name);
          
          return deferred.promise;
        })
      };
    });
  }));  

  var element;
  var $scope, uploadManager, storage;
  var FileUploader, UploadURIService;

  beforeEach(inject(function($injector){
    var $httpBackend = $injector.get('$httpBackend');

    $httpBackend.whenGET(/\.*/).respond(200, {});
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache) {
    $rootScope.uploadManager = uploadManager;
    $templateCache.put('partials/template-editor/common/basic-uploader.html', '<p>mock</p>');

    element = $compile('<basic-uploader upload-manager="uploadManager" valid-extensions="validExtensions"></basic-uploader>')($rootScope);
    $rootScope.$apply();
    
    $scope = element.isolateScope();
  }));

  it('should render directive', function () {
    expect(element.html()).to.equal('<p>mock</p>');
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

  it('should invoke onAfterAddingFile', function () {
    var file1 = { name: 'test1.jpg', size: 200, slice: function () {} };
    var spy = sinon.spy(FileUploader,'onAfterAddingFile');
    FileUploader.addToQueue([ file1 ]);
    spy.should.have.been.called;  
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

  it('should not modify the name if the file is being retried', function () {
    var fileName = 'test/test1.jpg';
    var file1 = { name: fileName, size: 200, slice: function () {}, isRetrying: true, file: { name: fileName } };
    
    uploadManager.folderPath = 'test/';
    FileUploader.onAfterAddingFile(file1);
    
    var args = UploadURIService.getURI.getCall(0).args;
    
    expect(UploadURIService.getURI.called).to.be.true;
    expect(args[0].name).to.be.equal('test/test1.jpg');
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

    expect($scope.activeUploadCount()).to.equal(2);
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
      
      storage.files.get.should.have.been.calledWith({file:file1.name});      
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

});
