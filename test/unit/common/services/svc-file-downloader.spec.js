'use strict';
describe('service: file downloader:', function() {
  var sandbox;
  var fileDownloader;

  beforeEach(module('risevision.apps.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {
      return Q;
    });
  }));

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.useFakeServer();

    inject(function($injector) {
      fileDownloader = $injector.get('fileDownloader');
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should handle success response', function(done) {
    var filepath = 'folder/file.jpg';
    var promise = fileDownloader('http://localhost/image.jpg',filepath);

    sandbox.server.requests[0].respond(200, {}, 'Image data');

    promise.then(function(file) {
      expect(file.name).to.equal(filepath);

      var reader = new FileReader();
      reader.onload = function(event) {
        var content = event.target.result;
          expect(content).to.equal('Image data');
          done();
      };
      reader.readAsText(file);
    });
  });

  it('should handle not found response', function(done) {
    var promise = fileDownloader('http://localhost/image.jpg','folder/file.jpg');

    sandbox.server.requests[0].respond(404, {}, '');

    promise.catch(function(resp) {
      expect(resp.status).to.equal(404);
      expect(resp.err).to.equal('Status Error');
      done();
    });
  });

  it('should handle request error', function(done) {
    var promise = fileDownloader('http://localhost/image.jpg','folder/file.jpg');

    sandbox.server.requests[0].error();

    promise.catch(function(resp) {
      expect(resp.status).to.equal(0);
      done();
    });
  });
});
