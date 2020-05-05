'use strict';
describe('service: UploadURIService', function() {
  beforeEach(module('risevision.storage.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.factory('storage',function () {
      return {
        getResumableUploadURI: function(fileName, fileType) {
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
      };
    });

    $provide.service('encoding', function () {
      return {
        getResumableUploadURI: function(fileName, fileType) {
          return Q.resolve(true);
        },
        isApplicable: function(fileType) { return Q.resolve(encodingApplicable); }
      };
    });

    $provide.service('processErrorCode', function() {
      return function(type, item, error) { return type + item + error; };
    });

  }));
  var uploadURIService, storage, encoding, encodingApplicable, returnResult, $rootScope, storageRequestObj;
  beforeEach(function(){
    returnResult = true;
    encodingApplicable = false;

    inject(function($injector){
      $rootScope = $injector.get('$rootScope');
      storage = $injector.get('storage');
      encoding = $injector.get('encoding');
      uploadURIService = $injector.get('UploadURIService');
    });
  });

  it('should exist',function(){
    expect(uploadURIService).to.be.truely;
    expect(uploadURIService.getURI).to.be.a('function');
  });

  describe('getURI:',function(){
    it('should get Resumable Upload URI',function(done){
      var spy = sinon.spy(storage,'getResumableUploadURI');
      var file = {name: "fileName", type: "fileType"};
      uploadURIService.getURI(file)
        .then(function(result){
          expect(result).to.be.truely;
          spy.should.have.been.calledWith("fileName","fileType")

          done();
        })
        .then(null,done);
    });

    it("should handle failure to get Resumable Upload URI",function(done){
      returnResult = false;

      var file = {name: "fileName", type: "fileType"};
      uploadURIService.getURI(file).then(function(result) {
        fail('getURI should had thrown error');
        done(result);
      })
      .then(null, function(error) {
        expect(error.message).to.deep.equal('FileuploadAPI Failed');
        done();
      })
      .then(null,done);
    });

    it("should use encoder service when uploading video and encoder master switch is on",function(done){
      encodingApplicable = true;

      var file = {name: "fileName", type: "video/mp4"};
      var spy = sinon.spy(encoding,'getResumableUploadURI');
      uploadURIService.getURI(file).then(function(result) {
        spy.should.have.been.calledWith(file.name, file.type);
        done();
      });
    });
  });
});
