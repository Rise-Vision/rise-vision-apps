'use strict';
  
describe('service: filesFactory:', function() {
  beforeEach(module('risevision.storage.services'));
  beforeEach(module(function ($provide) {
    filesResponse = {
      code: 200,
      files: [{'name':'test1', 'size': 5},
      {'name':'test2', 'size': 3},
      {'name':'folder1/'}]}

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
  var filesResponse, filesFactory, storageFactory, returnFiles;
  beforeEach(function(){
    returnFiles = true;
    
    inject(function($injector){  
      filesFactory = $injector.get('filesFactory');
      storageFactory = $injector.get('storageFactory');
    });
  });

  it('should exist',function(){
    expect(filesFactory).to.be.ok;
    
    expect(filesFactory.startTrial).to.be.ok;
    expect(filesFactory.filesDetails).to.be.ok;
    
    expect(filesFactory.addFile).to.be.a('function');
    expect(filesFactory.getFileNameIndex).to.be.a('function');    
    expect(filesFactory.removeFiles).to.be.a('function');    
    expect(filesFactory.refreshFilesList).to.be.a('function');
  });
  
  describe('refreshFilesList: ', function() {
    it('should load files; second (?) file is trash folder', function(done) {
      filesFactory.refreshFilesList();
      
      setTimeout(function() {
        expect(filesFactory.filesDetails.files.length).to.equal(4);
        expect(storageFactory.fileIsTrash(filesFactory.filesDetails.files[1])).to.be.true;

        done();
        
      });
    });
    
    it('should not load trash for selector', function(done) {
      storageFactory.storageFull = false;
      storageFactory.selectorType = 'single-folder';

      filesFactory.refreshFilesList()
      setTimeout(function() {
        expect(filesFactory.filesDetails.files.length).to.equal(4);
        
        done();
      });
    });
    
    it('should load sub-folder files', function(done) {
      storageFactory.folderPath = 'folder/';
      filesResponse.files = [{name: 'folder/'},
        { name: 'folder/file1.txt' },
        { name: 'folder/file2.txt' },
        { name: 'folder/subFolder/file2.txt' }];

      filesFactory.refreshFilesList();

      setTimeout(function() {
        expect(filesFactory.filesDetails.files.length).to.equal(4);
        expect(filesFactory.filesDetails.files[0].name).to.equal('folder/');
        expect(filesFactory.filesDetails.files[0].currentFolder).to.be.true;
        
        done();
      })
    });
    
    it('should add parent folder to sub-folder files', function(done) {
      storageFactory.folderPath = 'folder/';
      filesResponse.files = [{ name: 'folder/file1.txt' },
        { name: 'folder/file2.txt' },
        { name: 'folder/subFolder/file2.txt' }];

      filesFactory.refreshFilesList();

      setTimeout(function() {
        expect(filesFactory.filesDetails.files.length).to.equal(4);
        expect(filesFactory.filesDetails.files[0].name).to.equal('folder/');
        expect(filesFactory.filesDetails.files[0].currentFolder).to.be.true;
        
        done();
      })
    });

  });
  
  it('getFileNameIndex: ', function() {
    return filesFactory.refreshFilesList().then(function() {
      expect(filesFactory.getFileNameIndex('test1')).to.equal(0);
      expect(filesFactory.getFileNameIndex('test2')).to.equal(2);

      expect(filesFactory.getFileNameIndex('notfound')).to.equal(-1);
    });
  });
  
  describe('addFile: ', function() {
    it('should add two files, no duplicates', function () {
      return filesFactory.refreshFilesList().then(function() {
        filesFactory.addFile({ name: 'file1.txt' });
        filesFactory.addFile({ name: 'file2.txt' });
        filesFactory.addFile({ name: 'file2.txt' });

        expect(filesFactory.filesDetails.files.length).to.equal(6);
      });
    });
  
    it('should add one folder', function () {
      return filesFactory.refreshFilesList().then(function() {
        filesFactory.addFile({ name: 'folder/file1.txt' });
        filesFactory.addFile({ name: 'folder/file2.txt' });
        filesFactory.addFile({ name: 'folder/subFolder/file2.txt' });

        expect(filesFactory.filesDetails.files.length).to.equal(5);
        expect(filesFactory.filesDetails.files[4]).to.deep.equal({name: 'folder/', kind: 'folder'});
      });
    });

    it('should add one folder inside the current folder', function () {
      storageFactory.folderPath = 'test/';
      filesFactory.addFile({ name: 'test/folder/file1.txt' });

      expect(filesFactory.filesDetails.files.length).to.equal(1);
      expect(filesFactory.filesDetails.files[0].name).to.equal('test/folder/');
    });
  });
  
  it('removeFiles: ', function() {
    return filesFactory.refreshFilesList().then(function() {
      var newFile = { name: 'newFile.txt' };
      filesFactory.addFile(newFile);

      expect(filesFactory.filesDetails.files.length).to.equal(5);
      
      filesFactory.removeFiles([newFile]);
      
      expect(filesFactory.filesDetails.files.length).to.equal(4);
    });    
  });
  

});
