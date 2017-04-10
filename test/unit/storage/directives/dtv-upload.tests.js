'use strict';
describe('directive: upload', function() {
  beforeEach(module('risevision.storage.directives'));

  beforeEach(module(function ($provide) {
    $provide.factory('FileUploader', function() {
      return FileUploader = {
        addToQueue: function(files){
          FileUploader.onAfterAddingFile({file:files[0]});
        },
        uploadItem: function(){},
        queue: [],
        removeFromQueue: function(){}
      };
    });

    filesFactory = {
      addFile: function(){}
    };

    $provide.factory('storage', function() {
      return storage = {
        files: {
          get: function() {
            return Q.when({file:'file.jpg'})
          }
        }
      };
    });

    $provide.factory('UploadURIService', function() {
      return UploadURIService = {
        getURI: function(file) {
          var deferred = Q.defer();
          
          deferred.resolve(file.name);
          
          return deferred.promise;
        },
        notifyGCMTargetsChanged: function() {
          return {
            then: function(cb) {
              cb();
            }
          };
        }
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
  var FileUploader, UploadURIService;

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

  it('should add uploader callbacks', function() {
    expect(FileUploader.onAfterAddingFile).to.exist;
    expect(FileUploader.onBeforeUploadItem).to.exist;
    expect(FileUploader.onCancelItem).to.exist;
    expect(FileUploader.onCompleteItem).to.exist;

    expect(UploadURIService.getURI).to.exist;
  });
  
  it('Uploader onAfterAddingFile should return a promise', function() {
    var file1 = { name: 'test1.jpg', size: 200, slice: function() {} };
    var fileItem = { file: file1 };

    expect(FileUploader.onAfterAddingFile(fileItem).then).to.exist;
    expect(FileUploader.onAfterAddingFile(fileItem).then).to.be.a.function;
  });

  it('should invoke onAfterAddingFile', function() {
    var file1 = { name: 'test1.jpg', size: 200, slice: function() {} };
    var spy = sinon.spy(FileUploader,'onAfterAddingFile');
    FileUploader.addToQueue([ file1 ]);
    spy.should.have.been.called;  
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
    var getURI = sinon.spy(UploadURIService, 'getURI');
    
    filesFactory.folderPath = 'test/';
    FileUploader.onAfterAddingFile(file1);
    
    var args = getURI.getCall(0).args;
    
    expect(getURI.called).to.be.true;
    expect(args[0].name).to.be.equal('test/test1.jpg');
  });

  it('should not modify the name if the file is being retried', function() {
    var fileName = 'test/test1.jpg';
    var file1 = { name: fileName, size: 200, slice: function() {}, isRetrying: true, file: { name: fileName } };
    var getURI = sinon.spy(UploadURIService, 'getURI');
    
    filesFactory.folderPath = 'test/';
    FileUploader.onAfterAddingFile(file1);
    
    var args = getURI.getCall(0).args;
    
    expect(getURI.called).to.be.true;
    expect(args[0].name).to.be.equal('test/test1.jpg');
  });

  describe('removeItem:',function(){

    it('should remove item from Uploader queue',function(){
      var spy = sinon.spy(FileUploader, 'removeFromQueue');
      var myItem = 'item'
      $scope.removeItem(myItem);
      spy.should.have.been.calledWith(myItem);
    });

  });

  describe('onCompleteItem:',function(){
    it('should request file metadata',function(){
      var spy = sinon.spy(storage.files,'get');
      var file1 = { name: 'fileName' };
      var item = {isSuccess: true, file:file1};

      $scope.activeUploadCount = function() {return 1};
      FileUploader.onCompleteItem(item);
      
      spy.should.have.been.calledWith({file:file1.name});      
    });

    it('should remove item on completed',function(done){
      var spy = sinon.spy(FileUploader,'removeFromQueue');
      var file1 = { name: 'fileName' };
      var item = {isSuccess: true, file:file1};

      $scope.activeUploadCount = function() {return 1};
      FileUploader.onCompleteItem(item);

      setTimeout(function() {
        spy.should.have.been.calledWith(item);
        expect($scope.completed).to.contain(item.file.name); 
        done();
      }, 10);               
    });      
  });

});
