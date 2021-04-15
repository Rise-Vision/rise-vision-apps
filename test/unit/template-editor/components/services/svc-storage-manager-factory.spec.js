'use strict';

describe('service: storageManagerFactory:', function() {
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.template-editor.directives'));

  beforeEach(module(function ($provide) {
    $provide.service('storage', function() {
      return {
        files: {
          get: sinon.stub().returns(Q.resolve({}))
        }
      };
    });
  }));

  var storageManagerFactory, storage;

  beforeEach(function() {
    inject(function($injector) {
      storageManagerFactory = $injector.get('storageManagerFactory');
      storage = $injector.get('storage');
    });
  });

  it('should initialize', function() {
    expect(storageManagerFactory).to.be.ok;

    expect(storageManagerFactory.isListView).to.be.true;
    expect(storageManagerFactory.folderItems).to.have.lengthOf(0);
    expect(storageManagerFactory.loadFiles).to.be.a('function');
  });
  
  describe('loadFiles', function () {
    it('should call api and start spinner', function() {
      storageManagerFactory.folderItems = 'folderItems';

      storageManagerFactory.loadFiles('folder/');

      expect(storageManagerFactory.loadingFiles).to.be.true;

      storage.files.get.should.have.been.calledWith({
        folderPath: 'folder/'
      });
    });

    it('should return an empty list if files are missing', function (done) {
      storageManagerFactory.loadFiles('folder/')
        .then(function (result) {
          expect(storageManagerFactory.loadingFiles).to.be.false;

          expect(result).to.equal(storageManagerFactory.folderItems);

          expect(storageManagerFactory.folderItems).to.have.lengthOf(0);

          done();
        })
        .catch(done);
    });

    it('should load videos by default', function (done) {
      var files = [{
        name: 'folder/'
      }, {
        name: 'folder/file1.mp4'
      }, {
        name: 'folder/file2.mp4'
      }];

      storage.files.get.returns(Q.resolve({ files: files }));

      storageManagerFactory.loadFiles('folder/')
        .then(function (result) {
          expect(storageManagerFactory.loadingFiles).to.be.false;

          expect(result).to.equal(storageManagerFactory.folderItems);

          expect(storageManagerFactory.folderItems).to.have.lengthOf(2);

          done();
        })
        .catch(done);
    });

    describe('images', function() {
      it('should only load the files with the provided extensions', function (done) {
        storageManagerFactory.fileType = 'image';
        var files = [{
          name: 'folder/'
        }, {
          name: 'folder/file1.jpg'
        }, {
          name: 'folder/file2.png'
        }, {
          name: 'folder/file3.pdf'
        }];

        storage.files.get.returns(Q.resolve({ files: files }));

        storageManagerFactory.loadFiles('folder/')
          .then(function () {
            expect(storageManagerFactory.folderItems).to.have.lengthOf(2);

            done();
          })
          .catch(done);
      });      
    });

    describe('videos', function() {
      it('should only load the files with the provided extensions', function (done) {
        storageManagerFactory.fileType = 'video';
        var files = [{
          name: 'folder/'
        }, {
          name: 'folder/file1.mp4'
        }, {
          name: 'folder/file2.webm'
        }, {
          name: 'folder/file3.jpg'
        }];

        storage.files.get.returns(Q.resolve({ files: files }));

        storageManagerFactory.loadFiles('folder/')
          .then(function () {
            expect(storageManagerFactory.folderItems).to.have.lengthOf(2);

            done();
          })
          .catch(done);
      });      
    });

    it('should not clear information if loading fails', function (done) {
      var files = [{
        name: 'folder/file1.jpg'
      }, {
        name: 'folder/file2.jpg'
      }];

      storageManagerFactory.folderItems = files;

      storage.files.get.returns(Q.reject('Failed to load'));

      storageManagerFactory.loadFiles('folder/')
        .then(function () {
          expect(storageManagerFactory.loadingFiles).to.be.false;

          expect(storageManagerFactory.folderItems).to.have.lengthOf(2);

          done();
        })
        .catch(done);
    });

  });

});
