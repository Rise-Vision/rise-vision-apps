"use strict";

/* global sinon */

describe("controller: Upload", function() {
    var UploadController, scope, storageFactory;
    var FileUploader = {}, UploadURIService = {};
    var $stateParams = { folderPath: "" };
    
    beforeEach(module("risevision.storage.controllers"));

    beforeEach(function() {
      $stateParams.folderPath = "";

      module(function($provide) {
        $provide.service("$q", function() {
          return Q;
        });
        
        $provide.factory("FileUploader", function() {
          return {
            addToQueue: function(files){
              FileUploader.onAfterAddingFile({file:files[0]});
            },
            uploadItem: function(){},
            queue: [],
            removeFromQueue: function(){}
          }
        });

        $provide.factory("filesFactory", function() {
          return {
            addFile: function(){}
          }
        });

        $provide.factory("storageFactory", function() {
          return {}
        });
        
        $provide.factory("XHRFactory", function() {
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
      });

      inject(function ($controller, $rootScope, $injector) {
        var $httpBackend = $injector.get("$httpBackend");

        $httpBackend.whenGET(/\.*/).respond(200, {});
        FileUploader = $injector.get("FileUploader");
        storageFactory = $injector.get("storageFactory");
        $stateParams = {};

        UploadURIService = {
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

        var $translate = function(key) {
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

        scope = $rootScope.$new();

        UploadController = $controller("UploadController", {
            $scope: scope, $rootScope: $rootScope, $q: Q, $stateParams: $stateParams,
            FileUploader: FileUploader, UploadURIService: UploadURIService,
            $translate: $translate, STORAGE_UPLOAD_CHUNK_SIZE: 1024 });
      });
    });

    it("should be defined", function() {
        expect(UploadController).to.exist;
    });

    it("should add uploader callbacks", function() {
        expect(FileUploader.onAfterAddingFile).to.exist;
        expect(FileUploader.onBeforeUploadItem).to.exist;
        expect(FileUploader.onCancelItem).to.exist;
        expect(FileUploader.onCompleteItem).to.exist;

        expect(UploadURIService.getURI).to.exist;
    });
    
    it("Uploader onAfterAddingFile should return a promise", function() {
      var file1 = { name: "test1.jpg", size: 200, slice: function() {} };
      var fileItem = { file: file1 };

      expect(FileUploader.onAfterAddingFile(fileItem).then).to.exist;
      expect(FileUploader.onAfterAddingFile(fileItem).then).to.be.a.function;
    });

    it("should invoke onAfterAddingFile", function() {
      var file1 = { name: "test1.jpg", size: 200, slice: function() {} };
      var spy = sinon.spy(FileUploader,'onAfterAddingFile');
      FileUploader.addToQueue([ file1 ]);
      spy.should.have.been.called;  
    });

    it("should upload to the correct folder", function() {
        var file1 = { name: "test1.jpg", size: 200, slice: function() {} };

        storageFactory.folderPath = "test-folder/";
        var onAfterAddingFile = sinon.spy(FileUploader, "onAfterAddingFile");
        FileUploader.addToQueue([ file1 ]);
        expect(onAfterAddingFile.getCall(0).args[0].file.name).to.equal("test-folder/test1.jpg");
    });

    it("should add current path to the name if the file is just being", function() {
      var fileName = "test1.jpg";
      var file1 = { name: fileName, size: 200, slice: function() {}, file: { name: fileName } };
      var getURI = sinon.spy(UploadURIService, "getURI");
      
      storageFactory.folderPath = "test/";
      FileUploader.onAfterAddingFile(file1);
      
      var args = getURI.getCall(0).args;
      
      expect(getURI.called).to.be.true;
      expect(args[0].name).to.be.equal("test/test1.jpg");
    });

    it("should not modify the name if the file is being retried", function() {
      var fileName = "test/test1.jpg";
      var file1 = { name: fileName, size: 200, slice: function() {}, isRetrying: true, file: { name: fileName } };
      var getURI = sinon.spy(UploadURIService, "getURI");
      
      storageFactory.folderPath = "test/";
      FileUploader.onAfterAddingFile(file1);
      
      var args = getURI.getCall(0).args;
      
      expect(getURI.called).to.be.true;
      expect(args[0].name).to.be.equal("test/test1.jpg");
    });

    describe('onCompleteItem:',function(){

      it('should remove item on completed',function(){
        var spy = sinon.spy(FileUploader,'removeFromQueue');
        var file1 = { name: 'fileName' };
        var item = {isSuccess: true, file:file1};

        scope.activeUploadCount = function() {return 1};
        FileUploader.onCompleteItem(item);

        spy.should.have.been.calledWith(item);
        expect(scope.completed).to.contain(item.file.name);        
      });      
    });
});
