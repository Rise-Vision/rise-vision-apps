'use strict';
  
describe('service: filesFactory:', function() {
  beforeEach(module('risevision.storage.services'));
  beforeEach(module(function ($provide) {
    filesResponse = {
      code: 200,
      files: [{"name":"test1", "size": 5}
                      ,{"name":"test1", "size": 3}]}

    $provide.service('storage', function() {
      return {
        files: {
          get: function() {
            var deferred = Q.defer();
            if(returnFiles){
              deferred.resolve(filesResponse);
            }else{
              deferred.reject({result: {error: { message: 'ERROR; could not restore presentation'}}});
            }
            return deferred.promise;
          }
        },
        startTrial: function() {}
      };
    });

  }));
  var filesResponse, filesFactory, returnFiles;
  beforeEach(function(){
    returnFiles = true;
    
    inject(function($injector){  
      filesFactory = $injector.get('filesFactory');
    });
  });

  it('should exist',function(){
    expect(filesFactory).to.be.ok;
    
    expect(filesFactory.startTrial).to.be.ok;
    expect(filesFactory.filesDetails).to.be.ok;
    expect(filesFactory.singleFolderSelector).to.be.false;
    
    expect(filesFactory.addFile).to.be.a('function');
    expect(filesFactory.getFileNameIndex).to.be.a('function');    
    expect(filesFactory.removeFiles).to.be.a('function');    
    expect(filesFactory.refreshFilesList).to.be.a('function');
  });
  
  describe('refreshFilesList: ', function() {
    it('should load files', function(done) {
      filesFactory.refreshFilesList()
      .then(function() {
        expect(filesFactory.filesDetails.files.length).to.equal(3);
        
        done();
      })
      .then(null, function() {
        done("error");
      })
      .then(null,done);
    });
  });
  
  describe('addFile: ', function() {
    it("should add two files", function () {
      return filesFactory.refreshFilesList().then(function() {
        filesFactory.addFile({ name: "file1.txt" });
        filesFactory.addFile({ name: "file2.txt" });
        filesFactory.addFile({ name: "file2.txt" });

        expect(filesFactory.filesDetails.files.length).to.equal(5);
      });
    });
  
    it("should add one folder", function () {
      return filesFactory.refreshFilesList().then(function() {
        filesFactory.addFile({ name: "folder/file1.txt" });
        filesFactory.addFile({ name: "folder/file2.txt" });
        filesFactory.addFile({ name: "folder/subFolder/file2.txt" });

        expect(filesFactory.filesDetails.files.length).to.equal(4);
      });
    });

    it("should add one folder inside the current folder", function () {
      filesFactory.folderPath = "test/";
      filesFactory.addFile({ name: "test/folder/file1.txt" });

      expect(filesFactory.filesDetails.files.length).to.equal(1);
      expect(filesFactory.filesDetails.files[0].name).to.equal("test/folder/");
    });
  });
  

});
