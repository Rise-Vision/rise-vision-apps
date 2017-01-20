/*jshint expr:true */

describe("Services: uploader", function() {
  "use strict";

  beforeEach(module("risevision.storage.services"));

  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {
      return Q;
    });
  }));
  
  var uploader, lastAddedFileItem;

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
    
    it("multiple files should be enqueued asynchronously after the first", function (done) {
      uploader.addToQueue([{ name: "test1.txt", webkitRelativePath: "folder/test1.txt", size: 200, type: "text" },
        { name: "test2.txt", webkitRelativePath: "folder/test2.txt", size: 200, type: "text" },
        { name: "test3.txt", webkitRelativePath: "folder/test3.txt", size: 200, type: "text" }]);

      expect(uploader.queue.length).to.equal(1);
      expect(uploader.queue[0].file.name).to.equal("folder/test1.txt");
      
      setTimeout(function() {
        expect(uploader.queue.length).to.equal(3);
        expect(uploader.queue[1].file.name).to.equal("folder/test2.txt");

        done();      
      }, 10);
    });

    it("should invoke onAfterAddingFile", function() {
      var file1 = { name: "test1.jpg", size: 200, slice: function() {} };
      var spy = sinon.spy(uploader,'onAfterAddingFile');

      uploader.addToQueue([ file1 ]);

      spy.should.have.been.called;  

    });
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
