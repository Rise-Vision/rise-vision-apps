/*jshint expr:true */

describe("Services: uploader", function() {
  "use strict";

  beforeEach(module("risevision.storage.services"));

  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {
      return Q;
    });
  }));
  
  var uploader, lastAddedFileItem, $timeout;

  beforeEach(function() {
  	inject(function($injector) {
      lastAddedFileItem = null;
      var $httpBackend = $injector.get("$httpBackend");
      $httpBackend.whenGET(/\.*/).respond(200, {});

      uploader = $injector.get('FileUploader');
      uploader.onAfterAddingFile = function(item) {
        lastAddedFileItem = item;
        return Q.resolve(item);
      };
      uploader.onBeforeUploadItem = function() {};
      uploader.onCancelItem = function() {};
      uploader.onCompleteItem = function() {};

      $timeout = $injector.get("$timeout");
  	});
  });

  it("should exist", function () {
      expect(uploader).be.defined;      
  });

  describe('addToQueue:', function(){
    it("should add two regular files to the queue", function () {
      uploader.addToQueue([{ name: "test1.txt", size: 200, type: "text" }]);
      expect(uploader.queue.length).to.equal(1);
      expect(uploader.queue[0].file.name).to.equal("test1.txt");
      uploader.addToQueue([{ name: "test2.txt", size: 200, type: "text" }]);
      expect(uploader.queue.length).to.equal(2);
    });

    it("should add one file inside a folder to the queue", function () {
      uploader.addToQueue([{ name: "test1.txt", webkitRelativePath: "folder/test1.txt", size: 200, type: "text" }]);
      expect(uploader.queue.length).to.equal(1);
      expect(uploader.queue[0].file.name).to.equal("folder/test1.txt");
    });

    it("multiple files should be enqueued asynchronously after the first batch", function () {
      var files = [];

      for(var i = 1; i <= uploader.queueLimit + 5; i++) {
        files.push({ name: "test" + i + ".txt", webkitRelativePath: "folder/test" + i + ".txt", size: 200, type: "text" });
      }

      uploader.addToQueue(files);

      expect(uploader.queue.length).to.equal(uploader.queueLimit);
      expect(uploader.queue[0].file.name).to.equal("folder/test1.txt");

      for(var j = uploader.queueLimit - 1; j >= 0; j--) {
        uploader.removeFromQueue(j);
      }

      $timeout.flush(500);

      expect(uploader.queue.length).to.equal(5);
      expect(uploader.queue[0].file.name).to.equal("folder/test" + (uploader.queueLimit + 1) + ".txt");
    });

    it("should invoke onAfterAddingFile", function() {
      var file1 = { name: "test1.jpg", size: 200, slice: function() {} };
      var spy = sinon.spy(uploader,'onAfterAddingFile');

      uploader.addToQueue([ file1 ]);

      spy.should.have.been.called;  

    });
  });

  it("removeAll: ", function () {
    var files = [];

    for(var i = 1; i <= uploader.queueLimit + 5; i++) {
      files.push({ name: "test" + i + ".txt", webkitRelativePath: "folder/test" + i + ".txt", size: 200, type: "text" });
    }

    uploader.addToQueue(files);

    expect(uploader.queue.length).to.equal(uploader.queueLimit);
    expect(uploader.queue[0].file.name).to.equal("folder/test1.txt");
    
    uploader.removeAll();

    expect(uploader.queue.length).to.equal(0);

    $timeout.flush(500);

    expect(uploader.queue.length).to.equal(0);
  });

  describe('uploadItem:',function(){
    it("should invoke onBeforeUploadItem", function(done) {
      var file1 = { name: "test1.jpg", size: 200, slice: function() {} };
      var spy = sinon.spy(uploader,'onBeforeUploadItem');

      uploader.addToQueue([ file1 ]);
      uploader.uploadItem(lastAddedFileItem);

      setTimeout(function() {
        spy.should.have.been.called;

        done();      
      }, 10);   
    });

  });
  
});
