'use strict';
describe('service: resource loader:', function() {
  var sandbox, server, clock;
  var imageBlobLoader;

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
      imageBlobLoader = $injector.get('imageBlobLoader');
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should handle success response', function(done) {
    var promise = imageBlobLoader("http://localhost/image.jpg");

    sandbox.server.requests[0].respond(200, {}, 'Image data');

    promise
      .then(function(resp) {
        expect(resp.status).to.equal(200);
        expect(resp.imageUrl).to.have.string('blob');
        done();
      });
  });

  it('should handle not found response', function(done) {
    var promise = imageBlobLoader("http://localhost/image.jpg");

    sandbox.server.requests[0].respond(404, {}, '');

    promise
      .then(function(resp) {
        expect(resp.status).to.equal(404);
        done();
      });
  });
});
