/*jshint expr:true */

describe('Services: uploader', function() {
  'use strict';

  beforeEach(module('risevision.storage.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {
      return Q;
    });

    $provide.service('XHRFactory', function() {
      return {
        get: function() {
          return XHRFactory = {
            open: sinon.stub(),
            setRequestHeader: sinon.stub(),
            send: sinon.stub(),
            upload: {}
          };
        }
      };
    })
  }));
  
  var uploader, lastAddedFileItem, $timeout, XHRFactory;

  beforeEach(function() {
  	inject(function($injector) {
      lastAddedFileItem = null;

      uploader = $injector.get('FileUploader');
      uploader.onAfterAddingFile = function(item) {
        lastAddedFileItem = item;
        return Q.resolve(item);
      };
      uploader.onBeforeUploadItem = function() {};
      uploader.onCancelItem = function() {};
      uploader.onCompleteItem = function() {};

      $timeout = $injector.get('$timeout');
  	});
  });

  it('should exist', function () {
      expect(uploader).be.defined;      
  });

  describe('addToQueue:', function(){
    it('should add two regular files to the queue', function () {
      uploader.addToQueue([{ name: 'test1.txt', size: 200, type: 'text' }]);
      expect(uploader.queue.length).to.equal(1);
      expect(uploader.queue[0].file.name).to.equal('test1.txt');
      uploader.addToQueue([{ name: 'test2.txt', size: 200, type: 'text' }]);
      expect(uploader.queue.length).to.equal(2);
    });

    it('should add one file inside a folder to the queue', function () {
      uploader.addToQueue([{ name: 'test1.txt', webkitRelativePath: 'folder/test1.txt', size: 200, type: 'text' }]);
      expect(uploader.queue.length).to.equal(1);
      expect(uploader.queue[0].file.name).to.equal('folder/test1.txt');
    });

    it('multiple files should be enqueued asynchronously after the first batch', function () {
      var files = [];

      for(var i = 1; i <= uploader.queueLimit + 5; i++) {
        files.push({ name: 'test' + i + '.txt', webkitRelativePath: 'folder/test' + i + '.txt', size: 200, type: 'text' });
      }

      uploader.addToQueue(files);

      expect(uploader.queue.length).to.equal(uploader.queueLimit);
      expect(uploader.queue[0].file.name).to.equal('folder/test1.txt');

      for(var j = uploader.queueLimit - 1; j >= 0; j--) {
        uploader.removeFromQueue(j);
      }

      $timeout.flush(500);

      expect(uploader.queue.length).to.equal(5);
      expect(uploader.queue[0].file.name).to.equal('folder/test' + (uploader.queueLimit + 1) + '.txt');
    });

    it('should invoke onAfterAddingFile', function() {
      var file1 = { name: 'test1.jpg', size: 200, slice: function() {} };
      var spy = sinon.spy(uploader,'onAfterAddingFile');

      uploader.addToQueue([ file1 ]);

      spy.should.have.been.called;  

    });
  });

  it('removeAll: ', function () {
    var files = [];

    for(var i = 1; i <= uploader.queueLimit + 5; i++) {
      files.push({ name: 'test' + i + '.txt', webkitRelativePath: 'folder/test' + i + '.txt', size: 200, type: 'text' });
    }

    uploader.addToQueue(files);

    expect(uploader.queue.length).to.equal(uploader.queueLimit);
    expect(uploader.queue[0].file.name).to.equal('folder/test1.txt');
    
    uploader.removeAll();

    expect(uploader.queue.length).to.equal(0);

    $timeout.flush(500);

    expect(uploader.queue.length).to.equal(0);
  });

  describe('uploadItem:',function() {
    it('should invoke onBeforeUploadItem', function(done) {
      var file1 = { name: 'test1.jpg', size: 200, slice: function() {} };
      var spy = sinon.spy(uploader,'onBeforeUploadItem');

      uploader.addToQueue([ file1 ]);
      uploader.uploadItem(lastAddedFileItem);

      setTimeout(function() {
        spy.should.have.been.called;

        done();      
      }, 10);   
    });

    describe('Content-Range header: ', function() {      
      it('should set correct header', function() {
        var file1 = { name: 'test1.jpg', size: 200, slice: function() {} };
        uploader.addToQueue([ file1 ]);
        
        lastAddedFileItem.chunkSize = 10000;
        uploader.uploadItem(lastAddedFileItem);

        XHRFactory.setRequestHeader.should.have.been.calledWith('Content-Range', 'bytes 0-199/200');
      });

      it('should handle 0 byte file', function() {
        var file1 = { name: 'test1.jpg', size: 0, type: 'JPEG', slice: function() {} };
        uploader.addToQueue([ file1 ]);
        
        lastAddedFileItem.chunkSize = 10000;
        uploader.uploadItem(lastAddedFileItem);

        XHRFactory.setRequestHeader.should.have.been.calledWith('Content-Range', 'bytes */0');
      });

      it('should chunk large file', function() {
        var file1 = { name: 'test1.jpg', size: 10000, type: 'JPEG', slice: function() {} };
        uploader.addToQueue([ file1 ]);
        
        lastAddedFileItem.chunkSize = 1000;
        uploader.uploadItem(lastAddedFileItem);

        XHRFactory.setRequestHeader.should.have.been.calledWith('Content-Range', 'bytes 0-999/10000');
      });

    });

    describe('xhr.onload: ', function() {
      var file1;

      beforeEach(function() {
        uploader.notifyErrorItem = sinon.spy();
        uploader.notifySuccessItem = sinon.spy();
        uploader.notifyCompleteItem = sinon.spy();

        file1 = { name: 'test1.jpg', size: 200, slice: function() {} };
        uploader.addToQueue([ file1 ]);

        lastAddedFileItem.chunkSize = 10000;
        uploader.uploadItem(lastAddedFileItem);
      });

      it('should complete successful upload', function() {
        XHRFactory.status = 200;
        XHRFactory.onload();

        uploader.notifySuccessItem.should.have.been.called;
        uploader.notifyErrorItem.should.not.have.been.called;
        uploader.notifyCompleteItem.should.have.been.called;
      });

      it('should complete failed upload', function() {
        XHRFactory.status = 500;
        XHRFactory.onload();

        uploader.notifySuccessItem.should.not.have.been.called;
        uploader.notifyErrorItem.should.have.been.called;
        uploader.notifyCompleteItem.should.have.been.called;
      });

      it('should request next byte on 503 (Service Unavailable) errors', function() {
        XHRFactory.requestNextStartByte = sinon.spy();

        XHRFactory.status = 503;
        XHRFactory.onload();

        XHRFactory.requestNextStartByte.should.have.been.called;

        uploader.notifySuccessItem.should.not.have.been.called;
        uploader.notifyErrorItem.should.not.have.been.called;
        uploader.notifyCompleteItem.should.not.have.been.called;
      });

      describe('resumable uploads: ', function() {
        beforeEach(function() {
          XHRFactory.sendChunk = sinon.spy(function(size) {
            console.log('sendChunk:' + size);
          });
        });

        it('should resume upload based on Range header', function() {
          XHRFactory.getResponseHeader = function(header) {
            if (header === 'Range') {
              return '0-300';
            } else {
              return null;
            }
          };

          XHRFactory.status = 308;
          XHRFactory.onload();

          XHRFactory.sendChunk.should.have.been.calledWith(301);

          uploader.notifySuccessItem.should.not.have.been.called;
          uploader.notifyErrorItem.should.not.have.been.called;
          uploader.notifyCompleteItem.should.not.have.been.called;
        });

        it('should restart upload if Range header is missing', function() {
          XHRFactory.getResponseHeader = function(header) {
            return null;
          };

          XHRFactory.status = 308;
          lastAddedFileItem.progress = 30;
          XHRFactory.onload();

          expect(lastAddedFileItem.progress).to.equal(0);

          XHRFactory.sendChunk.should.have.been.calledWith(0);

          uploader.notifySuccessItem.should.not.have.been.called;
          uploader.notifyErrorItem.should.not.have.been.called;
          uploader.notifyCompleteItem.should.not.have.been.called;
        });


        it('should handle failure to parse Range header', function() {
          XHRFactory.getResponseHeader = function(header) {
            return 'asdf';
          };

          XHRFactory.status = 308;
          XHRFactory.onload();

          XHRFactory.sendChunk.should.not.have.been.called;

          uploader.notifySuccessItem.should.not.have.been.called;
          uploader.notifyErrorItem.should.have.been.called;
          uploader.notifyCompleteItem.should.have.been.called;
        });
      });

    });

  });
  
});
