'use strict';
  
describe('service: downloadFactory:', function() {
  beforeEach(module('risevision.storage.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {
      return Q;
    });
    $provide.service('storage', function() {
      return {
        getSignedDownloadURI: function() {
          var deferred = Q.defer();
          if(returnFiles){
            deferred.resolve({result: 200, message: 'downloadUrl'});
          }else{
            deferred.reject({
              result: { error: { message: 'failed to get downloadUrl' } }
            });
          }
          return deferred.promise;
        },
        getFolderContents: function() {
          var deferred = Q.defer();
          if(returnFiles){
            deferred.resolve({result: 200, items: folderResponse});
          }else{
            deferred.reject({
              result: { error: { message: 'failed to get downloadUrl' } }
            });
          }
          return deferred.promise;
        }
      };
    });

    $provide.service('fileRetriever',function(){
      return {
        retrieveFile: function(url, file) {
          var deferred = Q.defer();

          if (returnFiles) {
            // leave some time for cancelFolderDownload;
            setTimeout(function() {
              deferred.resolve({userData: file});
            }, 10);
          }
          else {
            deferred.reject(e);
          }
          return deferred.promise;
        }
      };
    });

  }));
  var folderResponse, downloadFactory, returnFiles, $timeout, $window, createElementSpy, folderContents;
  beforeEach(function(){
    returnFiles = true;
    folderResponse = [{ 'name': 'test/file1', 'objectId': 1, 'size': 5 }, 
      { 'name': 'test/file2', 'objectId': 2, 'size': 3 },
      { 'name': 'test/file3', 'objectId': 3, 'size': 8 },
      { 'name': 'test/', 'objectId': 4, 'size': 0, 'folder': true }];
    folderContents = [];
    
    inject(function($injector){  
      var $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', 'tmp/locales/translation_en.json').respond(function() {return ''});
      $httpBackend.when('GET', 'tmp/locales/translation_en_ca.json').respond(function() {return ''});

      $window = $injector.get('$window');
      $window.JSZip = function() {
        return {
          folder: function(objectId) {
            folderContents.push(objectId);
          },
          file: function(objectId) {
            folderContents.push(objectId);
          },
          generate: function() {}
        };
      };
      createElementSpy = sinon.spy($window.document, 'createElement');

      $timeout = $injector.get('$timeout');
      downloadFactory = $injector.get('downloadFactory');      
    });
  });
  
  it('should exist',function(){
    expect(downloadFactory).to.be.ok;

    expect(downloadFactory.downloadFiles).to.be.a('function');
    expect(downloadFactory.cancelFolderDownload).to.be.a('function');
  });
  
  it('should create container div', function() {
    createElementSpy.should.have.been.calledWith('div');
  })
  
  describe('downloadFiles: ', function() {
    beforeEach(function() {
      createElementSpy.reset();
    });

    describe('file(s): ', function() {
      it('should not download 0 files', function(done) {
        downloadFactory.downloadFiles([], 10);
        $timeout.flush();

        setTimeout(function() {
          createElementSpy.should.not.have.been.called;

          done();
        });
      });

      it('should download 1 file', function(done) {
        downloadFactory.downloadFiles([{name: 't1'}], 10);
        $timeout.flush();

        setTimeout(function() {
          createElementSpy.should.have.been.calledOnce;
          createElementSpy.should.have.been.calledWith('iframe');

          done();
        });
      });
      
      it('should download 2 files', function(done) {
        downloadFactory.downloadFiles([{name: 't1'}, {name: 't2'}]);
        $timeout.flush();
        
        setTimeout(function() {
          createElementSpy.should.have.been.calledOnce;
          createElementSpy.should.have.been.calledWith('iframe');
          
          $timeout.flush();

          setTimeout(function() {
            createElementSpy.should.have.been.calledTwice;
            createElementSpy.should.have.been.calledWith('iframe');

            done();
          });
        });
      });
    });
    
    describe('folder(s): ', function() {
      it('should download zipped folder', function(done) {
        downloadFactory.downloadFiles([{name: 'folder/'}], 10);
        $timeout.flush();

        setTimeout(function() {
          createElementSpy.should.have.been.calledOnce;
          createElementSpy.should.have.been.calledWith('a');

          expect(folderContents).to.deep.equal([4, 1, 2, 3]);
          expect(downloadFactory.activeFolderDownloads.length).to.equal(0);

          done();
        }, 500);
      });
      
      it('should catch download failure', function(done) {
        downloadFactory.downloadFiles([{name: 'folder/'}], 10);

        $timeout.flush();

        returnFiles = false;
        setTimeout(function() {
          createElementSpy.should.not.have.been.called;
          expect(downloadFactory.activeFolderDownloads.length).to.equal(0);

          done();
        }, 10);
      });
    });
  });
  
  it('cancelFolderDownload: ', function(done) {
    createElementSpy.reset();

    var folder = {name: 'folder/'}
    downloadFactory.downloadFiles([folder], 10);

    $timeout.flush();

    setTimeout(function() {
      downloadFactory.cancelFolderDownload(folder);

      setTimeout(function() {
        createElementSpy.should.not.have.been.called;
        expect(downloadFactory.activeFolderDownloads.length).to.equal(0);

        expect(folderContents).to.deep.equal([4]);
        done();
      }, 20);
    }, 5);
  });

  afterEach(function() {
    $window.document.createElement.restore();
  });

});
