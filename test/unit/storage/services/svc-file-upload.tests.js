/*jshint expr:true */

describe.only('Services: uploader', function() {
  'use strict';

  beforeEach(module('risevision.apps.config'));
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
    });

    $provide.service('ExifStripper', function() {
      return ExifStripper = { strip: function() {} };
    })
  }));

  var uploader, lastAddedFileItem, $timeout, XHRFactory, ExifStripper, Compressor;

  beforeEach(function() {
    inject(function($injector) {
      lastAddedFileItem = null;

      uploader = $injector.get('FileUploader');
      uploader.onAddingFiles = function() {};
      uploader.onAfterAddingFile = function(item) {
        lastAddedFileItem = item;
        return Q.resolve(item);
      };
      uploader.onBeforeUploadItem = function() {};
      uploader.onCancelItem = function() {};
      uploader.onCompleteItem = function() {};

      Compressor = $injector.get('JPGCompressor');
      $timeout = $injector.get('$timeout');
    });
  });

  it('should exist', function () {
      expect(uploader).be.defined;
  });

  describe('addToQueue:', function(){
    it('should add two regular files to the queue', function () {
      uploader.addToQueue([{ file: {name: 'test1.txt', size: 200, type: 'text' }}]);
      expect(uploader.queue.length).to.equal(1);
      expect(uploader.queue[0].file.name).to.equal('test1.txt');
      uploader.addToQueue([{file: { name: 'test2.txt', size: 200, type: 'text' }}]);
      expect(uploader.queue.length).to.equal(2);
    });

    it('should indicate whether some files are to be encoded', function () {
      uploader.addToQueue([{ taskToken: 'abc', file: {name: 'test1.txt', size: 200, type: 'text' }}]);
      expect(uploader.queue.length).to.equal(1);
      expect(uploader.someEncoding()).to.be.true;
    });

    it('should add one file inside a folder to the queue', function () {
      uploader.addToQueue([{file:{name: 'folder/test1.txt', size: 200, type: 'text' }}]);
      expect(uploader.queue.length).to.equal(1);
      expect(uploader.queue[0].file.name).to.equal('folder/test1.txt');
    });

    it('multiple files should be enqueued asynchronously after the first batch', function () {
      var fileItems = [];

      for(var i = 1; i <= uploader.queueLimit + 5; i++) {
        fileItems.push({file:{ name: 'folder/test' + i + '.txt', size: 200, type: 'text' }});
      }

      uploader.addToQueue(fileItems);

      expect(uploader.queue.length).to.equal(uploader.queueLimit);
      expect(uploader.queue[0].file.name).to.equal('folder/test1.txt');

      for(var j = uploader.queueLimit - 1; j >= 0; j--) {
        uploader.removeFromQueue(j);
      }

      $timeout.flush(500);

      expect(uploader.queue.length).to.equal(5);
      expect(uploader.queue[0].file.name).to.equal('folder/test' + (uploader.queueLimit + 1) + '.txt');
    });

    it('should invoke onAddingFiles and onAfterAddingFile', function() {
      var fileItem = { file: { name: 'test1.jpg', size: 200 }, domFileItem: { slice: function() {} } };
      var onAddingFilesSpy = sinon.spy(uploader,'onAddingFiles');
      var spy = sinon.spy(uploader,'onAfterAddingFile');

      uploader.addToQueue([ fileItem ]);

      onAddingFilesSpy.should.have.been.called;
      spy.should.have.been.called;

    });
  });

  it('removeAll: ', function () {
    var fileItems = [];

    for(var i = 1; i <= uploader.queueLimit + 5; i++) {
      fileItems.push({file: { name: 'folder/test' + i + '.txt', size: 200, type: 'text' }});
    }

    uploader.addToQueue(fileItems);

    expect(uploader.queue.length).to.equal(uploader.queueLimit);
    expect(uploader.queue[0].file.name).to.equal('folder/test1.txt');

    uploader.removeAll();

    expect(uploader.queue.length).to.equal(0);

    $timeout.flush(500);

    expect(uploader.queue.length).to.equal(0);
  });

  describe('uploadItem:',function() {
    it('should invoke onBeforeUploadItem', function(done) {
      var fileItem = { file: { name: 'test1.jpg', size: 200 }, domFileItem: { slice: function() {} } };
      var spy = sinon.spy(uploader,'onBeforeUploadItem');

      uploader.addToQueue([ fileItem ]);
      uploader.uploadItem(lastAddedFileItem);

      setTimeout(function() {
        spy.should.have.been.called;

        done();
      }, 10);
    });

    describe('Content-Range header: ', function() {
      it('should set correct header', function() {
        var fileItem = { file: { name: 'test1.jpg', size: 200 }, domFileItem: { slice: function() {} } };
        uploader.addToQueue([ fileItem ]);

        lastAddedFileItem.chunkSize = 10000;
        uploader.uploadItem(lastAddedFileItem);

        XHRFactory.setRequestHeader.should.have.been.calledWith('Content-Range', 'bytes 0-199/200');
      });

      it('should handle 0 byte file', function() {
        var fileItem = { file: { name: 'test1.jpg', size: 0, type: 'JPEG' }, domFileItem: { slice: function() {} } };
        uploader.addToQueue([ fileItem ]);

        lastAddedFileItem.chunkSize = 10000;
        uploader.uploadItem(lastAddedFileItem);

        XHRFactory.setRequestHeader.should.have.been.calledWith('Content-Range', 'bytes */0');
      });

      it('should chunk large file', function() {
        var fileItem = { file: { name: 'test1.jpg', size: 10000, type: 'JPEG'}, domFileItem: { slice: function() {} } };
        uploader.addToQueue([ fileItem ]);

        lastAddedFileItem.chunkSize = 1000;
        uploader.uploadItem(lastAddedFileItem);

        XHRFactory.setRequestHeader.should.have.been.calledWith('Content-Range', 'bytes 0-999/10000');
      });

    });

    describe('xhr.onload: ', function() {
      var fileItem;

      beforeEach(function() {
        sinon.spy(uploader, 'notifyErrorItem');
        uploader.notifySuccessItem = sinon.spy();
        uploader.notifyCompleteItem = sinon.spy();

        fileItem = { file: { name: 'test1.jpg', size: 200}, domFileItem: { slice: function() {} } };
        uploader.addToQueue([ fileItem ]);

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

        expect(lastAddedFileItem.isError).to.be.true;
        expect(lastAddedFileItem.isUnsupportedFile).to.be.false;
      });

      it('should detect unsupported files', function() {
        XHRFactory.status = 409;
        XHRFactory.onload();

        uploader.notifySuccessItem.should.not.have.been.called;
        uploader.notifyErrorItem.should.have.been.called;
        uploader.notifyCompleteItem.should.have.been.called;

        expect(lastAddedFileItem.isError).to.be.true;
        expect(lastAddedFileItem.isUnsupportedFile).to.be.true;
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

  describe('removeExif:', function(){

    beforeEach(function () {
      sinon.stub(ExifStripper, "strip", function(fileItem) {return Q.resolve(fileItem)});
    });

    it('should remove exif data of JPEG images', function () {
      var files = [{ name: 'image.jpg', size: 200, type: 'image/jpeg' }];

      return uploader.removeExif(files).then(function () {
        ExifStripper.strip.should.have.been.called;
      });
    });

    it('should not remove exif data of non JPEG files', function () {

      var files = [{ name: 'image.png', size: 200, type: 'image/png' }];

      return uploader.removeExif(files).then(function () {
        ExifStripper.strip.should.not.have.been.called;
      });

    });

    it('should return a fileItem for jpeg files', function () {
      var files = [{ name: 'image.jpg', webkitRelativePath: 'folder/image.jpg', size: 200, type: 'image/jpeg' }];

      return uploader.removeExif(files).then(function (fileItems) {
        ExifStripper.strip.should.have.been.called;
        expect(fileItems[0].file.name).to.equal('folder/image.jpg');
      });
    });

    it('should return a fileItem for non jpeg files', function () {
      var files = [{ name: 'image.png', webkitRelativePath: 'folder/image.png', size: 200, type: 'image/png' }];

      return uploader.removeExif(files).then(function (fileItems) {
        ExifStripper.strip.should.not.have.been.called;
        expect(fileItems[0].file.name).to.equal('folder/image.png');
      });
    });

  });

  describe('jpg compression:', function () {
    beforeEach(function () {
      window.Compressor = function () {
        return {
          compress: sinon.stub()
        };
      };
    });

    it('has the compressor', function () {
      Compressor.compress({domfileItem: {}});
    });
  });

});
