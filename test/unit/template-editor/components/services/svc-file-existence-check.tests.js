'use strict';

describe('service: fileExistenceCheckService:', function() {
  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function($provide) {
    $provide.service('$q', function() {
      return Q;
    });
  }));

  var fileExistenceCheckService;

  beforeEach(function() {
    inject(function($injector) {
      fileExistenceCheckService = $injector.get('fileExistenceCheckService');
    });
  });

  it('should initialize', function () {
    expect(fileExistenceCheckService).to.be.truely;
    expect(fileExistenceCheckService.requestMetadataFor).to.be.a('function');
  });

  describe('requestMetadataFor', function() {

    it('should request metadata for a file', function(done) {
      fileExistenceCheckService.requestMetadataFor('file.txt', 'default-url')
      .then(function(metadata) {
        expect(metadata).to.deep.equal([]);

        done();
      })
      .catch(function(err) {
        expect.fail(err);
      });
    });

  });

});
