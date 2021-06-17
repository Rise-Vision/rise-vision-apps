'use strict';
describe('service: storage:', function() {
  beforeEach(module('risevision.storage.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('userState',function(){
      return {
        getSelectedCompanyId : function(){
          return 'TEST_COMP_ID';
        },
        _restoreState:function(){}
      }
    });
    
    $provide.service('storageAPILoader',function () {
      return function(){
        var deferred = Q.defer();
                
        deferred.resolve({
          files: {
            get: function(obj){
              expect(obj).to.be.ok;
              folderPath = obj.folder;
              filePath = obj.file;
              
              var def = Q.defer();
              if (obj.companyId && returnResult) {
                def.resolve({
                  result: {
                    items: [{
                      "file": "image.jpg"
                    }]
                  }
                });
              } else {
                def.reject("API Failed");
              }
              return def.promise;
            },
            delete: function(obj) {
              expect(obj).to.be.ok;
              storageApiRequestObj = obj;
            
              var def = Q.defer();
              if (returnResult) {
                def.resolve({
                  result: {}
                });
              } else {
                def.reject("API Failed");
              }
              return def.promise;
            },
            rename: function(obj) {
              expect(obj).to.be.ok;
              storageApiRequestObj = obj;

              var def = Q.defer();
              if (returnResult) {
                def.resolve({
                  result: {}
                });
              } else {
                def.reject("API Failed");
              }
              return def.promise;
            },
            duplicate: function(obj) {
              expect(obj).to.be.ok;
              storageApiRequestObj = obj;

              var def = Q.defer();
              if (returnResult) {
                def.resolve({
                  result: {}
                });
              } else {
                def.reject("API Failed");
              }
              return def.promise;
            }
          },
          trash: {
            move: function(obj) {
              expect(obj).to.be.ok;
              storageApiRequestObj = obj;
            
              var def = Q.defer();
              if (returnResult) {
                def.resolve({
                  result: {}
                });
              } else {
                def.reject("API Failed");
              }
              return def.promise;
            },
            restore: function(obj) {
              expect(obj).to.be.ok;
              storageApiRequestObj = obj;
            
              var def = Q.defer();
              if (returnResult) {
                def.resolve({
                  result: {}
                });
              } else {
                def.reject("API Failed");
              }
              return def.promise;
            }
          },
          createFolder: function(obj) {
            expect(obj).to.be.ok;
            folderName = obj.folder;
            
            var def = Q.defer();
            if (returnResult) {
              def.resolve({
                result: {}
              });
            } else {
              def.reject("API Failed");
            }
            return def.promise;
          },
          getFolderContents: function(obj) {
            expect(obj).to.be.ok;
            folderName = obj.folderName;
            
            var def = Q.defer();
            if (returnResult) {
              def.resolve({
                result: {}
              });
            } else {
              def.reject("API Failed");
            }
            return def.promise;
          },
          getResumableUploadURI: function(obj) {
            expect(obj).to.be.ok;
            storageApiRequestObj = obj;
            
            var def = Q.defer();
            if (returnResult) {
              def.resolve({
                result: {}
              });
            } else {
              def.reject("API Failed");
            }
            return def.promise;
          },
          getSignedDownloadURI: function(obj) {
            expect(obj).to.be.ok;
            storageApiRequestObj = obj;
            
            var def = Q.defer();
            if (returnResult) {
              def.resolve({
                result: {}
              });
            } else {
              def.reject("API Failed");
            }
            return def.promise;
          }
        });
        return deferred.promise;
      };
    });

    $provide.service('processErrorCode', function() {
      return sinon.spy(function() { return 'error'; });
    });
  }));
  var storage, returnResult, folderPath, filePath, folderName, storageApiRequestObj, processErrorCode;
  beforeEach(function(){
    returnResult = true;
    folderPath = '';
    filePath = '';
    
    inject(function($injector){
      storage = $injector.get('storage');
      processErrorCode = $injector.get('processErrorCode');
    });
  });

  it('should exist',function(){
    expect(storage).to.be.ok;
    expect(storage.files.get).to.be.a('function');
    expect(storage.createFolder).to.be.a('function');
    expect(storage.getFolderContents).to.be.a('function');
    expect(storage.getResumableUploadURI).to.be.a('function');
    expect(storage.getSignedDownloadURI).to.be.a('function');
  });
  
  describe('files.get:',function(){
    it('should return a list of files',function(done){
      storage.files.get({})
      .then(function(result){
        expect(result).to.be.ok;
        expect(result.items).to.be.an.array;
        expect(result.items).to.have.length.above(0);
        done();
      })
      .then(null,done);
    });
    
    it('should create an empty searchString if query is empty',function(done){
      storage.files.get({folderPath: 'someFolder/'})
      .then(function(result){
        expect(folderPath).to.equal('someFolder/');

        done();
      })
      .then(null,done);
    });

    it('should handle % in folder name',function(done){
      storage.files.get({folderPath: 'some % Folder/'})
      .then(function(result){
        expect(folderPath).to.equal('some % Folder/');

        done();
      })
      .then(null,done);
    });

    it('should get single file',function(done){
      storage.files.get({file: 'someFile.jpg'})
      .then(function(result){
        expect(filePath).to.equal('someFile.jpg');

        done();
      })
      .then(null,done);
    });

    it('should handle % in file name',function(done){
      storage.files.get({file: 'some % File.jpg'})
      .then(function(result){
        expect(filePath).to.equal('some % File.jpg');

        done();
      })
      .then(null,done);
    });

    it('should handle failure to retrieve files',function(done){
      returnResult = false;
      
      storage.files.get({})
        .then(function(result) {
          done(result);
        })
        .then(null, function(error) {
          expect(processErrorCode).to.have.been.calledWith('Files', 'list', 'API Failed');
          expect(error).to.deep.equal('API Failed');
          done();
        })
        .then(null,done);
    });
  });

  describe('files.delete:',function(){
    it('should delete files',function(done){
      storage.files.delete(['file1','file2'])
      .then(function(result){
        expect(result).to.be.ok;
        expect(storageApiRequestObj.files).to.deep.equal(['file1','file2']);
        expect(storageApiRequestObj.companyId).to.equal('TEST_COMP_ID');

        done();
      })
      .then(null,done);
    });

    it('should handle failure',function(done){
      returnResult = false;
      
      storage.files.delete({})
        .then(function(result) {
          done(result);
        })
        .then(null, function(error) {
          expect(error).to.deep.equal('API Failed');
          done();
        })
        .then(null,done);
    });
  });

  describe('trash.move:',function(){
    it('should move files to trash',function(done){
      storage.trash.move(['file1','file2'])
      .then(function(result){
        expect(result).to.be.ok;
        expect(storageApiRequestObj.files).to.deep.equal(['file1','file2']);
        expect(storageApiRequestObj.companyId).to.equal('TEST_COMP_ID');

        done();
      })
      .then(null,done);
    });

    it('should handle failure',function(done){
      returnResult = false;
      
      storage.trash.move({})
        .then(function(result) {
          done(result);
        })
        .then(null, function(error) {
          expect(error).to.deep.equal('API Failed');
          done();
        })
        .then(null,done);
    });
  });

  describe('trash.restore:',function(){
    it('should restore files from trash',function(done){
      storage.trash.restore(['file1','file2'])
      .then(function(result){
        expect(result).to.be.ok;
        expect(storageApiRequestObj.files).to.deep.equal(['file1','file2']);
        expect(storageApiRequestObj.companyId).to.equal('TEST_COMP_ID');

        done();
      })
      .then(null,done);
    });

    it('should handle failure',function(done){
      returnResult = false;
      
      storage.trash.restore({})
        .then(function(result) {
          done(result);
        })
        .then(null, function(error) {
          expect(error).to.deep.equal('API Failed');
          done();
        })
        .then(null,done);
    });
  });

  describe('createFolder:',function(){
    it('should create folder',function(done){
      storage.createFolder("newFolder")
        .then(function(result){
          expect(result).to.be.ok;
          expect(folderName).to.equal('newFolder');

          done();
        })
        .then(null,done);
    });

    it("should handle failure to create folder",function(done){
      returnResult = false;

      storage.createFolder()
        .then(function(result) {
          done(result);
        })
        .then(null, function(error) {
          expect(error).to.deep.equal('API Failed');
          done();
        })
        .then(null,done);
    });
  });
  
  describe('getFolderContents:',function(){
    it('should get folder contents',function(done){
      storage.getFolderContents("folder1")
        .then(function(result){
          expect(result).to.be.ok;
          expect(folderName).to.equal('folder1');

          done();
        })
        .then(null,done);
    });

    it("should handle failure to get folder contents",function(done){
      returnResult = false;

      storage.getFolderContents()
        .then(function(result) {
          done(result);
        })
        .then(null, function(error) {
          expect(error).to.deep.equal('API Failed');
          done();
        })
        .then(null,done);
    });
  });

  describe('getResumableUploadURI:',function(){
    it('should get Resumable Upload URI',function(){
      return storage.getResumableUploadURI("fileName","fileType")
        .then(function(result){
          expect(result).to.be.ok;
          expect(storageApiRequestObj.fileName).to.equal('fileName');
          expect(storageApiRequestObj.fileType).to.equal('fileType');
          expect(storageApiRequestObj.companyId).to.equal('TEST_COMP_ID');
        })
    });
    
    it('should encode URI',function(done){
      storage.getResumableUploadURI("fileName#","fileType")
        .then(function(result){
          expect(storageApiRequestObj.fileName).to.equal('fileName%23');

          done();
        })
        .then(null,done);
    });

    it("should handle failure to get Resumable Upload URI",function(done){
      returnResult = false;

      storage.getResumableUploadURI("fileName","fileType")
        .then(function(result) {
          done(result);
        })
        .then(null, function(error) {
          expect(error).to.deep.equal('API Failed');
          done();
        })
        .then(null,done);
    });
  });
  
  describe('getSignedDownloadURI', function() {
    it('should get Signed Download URI',function(done){
      storage.getSignedDownloadURI({name: 'fileName', type: 'fileType'})
        .then(function(result){
          expect(result).to.be.ok;
          expect(storageApiRequestObj.fileName).to.equal('fileName');
          expect(storageApiRequestObj.fileType).to.equal('fileType');
          expect(storageApiRequestObj.companyId).to.equal('TEST_COMP_ID');

          done();
        })
        .then(null,done);
    });

    it("should handle failure to get Resumable Upload URI",function(done){
      returnResult = false;

      storage.getSignedDownloadURI("fileName","fileType")
        .then(function(result) {
          done(result);
        })
        .then(null, function(error) {
          expect(error).to.deep.equal('API Failed');
          done();
        })
        .then(null,done);
    });
  });

  describe('rename',function(){
    it('should rename files',function(done){
      storage.rename('file1', 'file2')
        .then(function(result){
          expect(result).to.be.ok;
          expect(storageApiRequestObj.companyId).to.equal('TEST_COMP_ID');
          expect(storageApiRequestObj.sourceName).to.equal('file1');
          expect(storageApiRequestObj.destinationName).to.equal('file2');

          done();
        });
    });

    it('should not call the server when provided the same source and destination',function(done){
      storageApiRequestObj = null;

      storage.rename('file1', 'file1')
        .then(null, function(error) {
          expect(error).to.be.ok;
          expect(error.status).to.equal(400);
          expect(storageApiRequestObj).to.be.null;
          done();
        });
    });

    it('should handle failure',function(done){
      returnResult = false;

      storage.rename('file1', 'file2')
        .then(null, function(error) {
          expect(error).to.deep.equal('API Failed');
          expect(storageApiRequestObj).to.not.be.null;
          done();
        });
    });
  });

  describe('duplicate',function(){
    it('should duplicate files',function(done){
      storage.duplicate('file1')
        .then(function(result){
          expect(result).to.be.ok;
          expect(storageApiRequestObj.companyId).to.equal('TEST_COMP_ID');
          expect(storageApiRequestObj.sourceName).to.equal('file1');

          done();
        });
    });

    it('should handle failure',function(done){
      returnResult = false;

      storage.duplicate('file1')
        .then(null, function(error) {
          expect(error).to.deep.equal('API Failed');
          expect(storageApiRequestObj).to.not.be.null;
          done();
        });
    });
  });

  describe('refreshFileMetadata',function() {
    it('should only call get once', function(done) {
      sinon.stub(storage.files, 'get').returns(Q.resolve({
        files: [{name: 'file1.jpg'}]
      }));

      storage.refreshFileMetadata('file1')
        .then(function(result) {
          expect(result).to.be.ok;
          expect(storage.files.get).have.been.calledOnce;

          done();
        });
    });

    it('should call get three times', function(done) {
      var getStub = sinon.stub(storage.files, 'get');

      getStub.onCall(0).returns(Q.resolve({
        files: [{ metadata: { 'needs-thumbnail-update': 'true' } }]
      }));
      getStub.onCall(1).returns(Q.resolve({
        files: [{ metadata: { 'needs-thumbnail-update': 'true' } }]
      }));
      getStub.onCall(2).returns(Q.resolve({
        files: [{name: 'file1.jpg'}]
      }));

      storage.refreshFileMetadata('file1')
        .then(function(result) {
          expect(result).to.be.ok;
          expect(storage.files.get).have.been.calledThrice;

          done();
        });
    });

    it('should return files on third failure attempt', function(done) {
      sinon.stub(storage.files, 'get').resolves({
        files: [{ metadata: { 'needs-thumbnail-update': 'true' } }]
      });


      storage.refreshFileMetadata('file1')
        .then(function(result) {
          expect(result).to.be.ok;
          expect(storage.files.get).have.been.calledThrice;

          done();
        });
    });

    it('should handle failure',function(done) {
      sinon.stub(storage.files, 'get').returns(Q.reject('error'));

      storage.refreshFileMetadata('file1')
        .catch(function(err) {
          expect(err).to.equal('error');

          done();
        });
    });
  });

});
