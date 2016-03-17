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
            }
          },
          startTrial: function(obj) {
            expect(obj).to.be.ok;
            
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
          notifyGCMTargetsChanged: function(obj) {
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

  }));
  var storage, returnResult, folderPath, folderName, $rootScope, storageApiRequestObj;
  beforeEach(function(){
    returnResult = true;
    folderPath = '';
    
    inject(function($injector){
      $rootScope = $injector.get('$rootScope');
      
      storage = $injector.get('storage');
    });
  });

  it('should exist',function(){
    expect(storage).to.be.truely;
    expect(storage.files.get).to.be.a('function');
    expect(storage.startTrial).to.be.a('function');
    expect(storage.createFolder).to.be.a('function');
  });
  
  describe('files.get:',function(){
    it('should return a list of files',function(done){
      storage.files.get({})
      .then(function(result){
        expect(result).to.be.truely;
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

    it('should handle failure to retrieve files',function(done){
      returnResult = false;
      
      storage.files.get({})
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

  describe('startTrial:',function(){
    it('should start trial',function(done){
      var $emitSpy = sinon.spy($rootScope, '$emit');

      storage.startTrial()
        .then(function(result){
          expect(result).to.be.truely;
          expect(result.item).to.be.truely;

          $emitSpy.should.have.been.calledWith('refreshSubscriptionStatus');

          done();
        })
        .then(null,done);
    });

    it("should handle failure to start trial",function(done){
      returnResult = false;

      storage.startTrial()
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
          expect(result).to.be.truely;
          expect(result.item).to.be.truely;
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

  describe('getResumableUploadURI:',function(){
    it('should get Resumable Upload URI',function(done){
      storage.getResumableUploadURI("fileName","fileType")
        .then(function(result){
          expect(result).to.be.truely;
          expect(result.item).to.be.truely;
          expect(storageApiRequestObj.fileName).to.equal('fileName');
          expect(storageApiRequestObj.fileType).to.equal('fileType');
          expect(storageApiRequestObj.companyId).to.equal('TEST_COMP_ID');

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

  
  describe('notifyGCMTargetsChanged:',function(){
    it('should notify GCM Targets Changed',function(done){
      var files = ["file1","file2"]
      storage.notifyGCMTargetsChanged(files)
        .then(function(result){
          expect(result).to.be.truely;
          expect(result.item).to.be.truely;
          expect(storageApiRequestObj.targets).to.equal(files);
          expect(storageApiRequestObj.companyId).to.equal('TEST_COMP_ID');

          done();
        })
        .then(null,done);
    });

    it("should handle failure to notify GCM Targets Changed",function(done){
      returnResult = false;
      var files = ["file1","file2"]
      storage.notifyGCMTargetsChanged(files)
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

});
