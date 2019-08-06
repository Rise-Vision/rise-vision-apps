'use strict';

describe('service: fileExistenceCheckService:', function() {

  var testFileEntry;

  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function($provide) {
    $provide.service('$q', function() {
      return Q;
    });

    $provide.service('storageAPILoader', function() {
      return function() {
        return Q.resolve({
          files: {
            get: function() {
              return {
                result: {
                  result: true,
                  files: [testFileEntry]
                }
              };
            }
          }
        });
      };
    });
  }));

  var TEST_FILE = 'risemedialibrary-7fa5ee92-7deb-450b-a8d5-e5ed648c575f/file1.png';
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
      testFileEntry = {
        metadata: {
          thumbnail: 'http://thumbnail.png'
        },
        timeCreated: {
          value: 100
        }
      };

      fileExistenceCheckService.requestMetadataFor(TEST_FILE, 'http://default-url')
      .then(function(metadata) {
        expect(metadata).to.deep.equal([
          {
            file: TEST_FILE,
            exists: true,
            'time-created': 100,
            'thumbnail-url': 'http://thumbnail.png?_=100'
          }
        ]);

        done();
      })
      .catch(function(err) {
        expect.fail(err);
      });
    });

    it('should return default thumbnail if metadata does not contain it', function(done) {
      testFileEntry = {
        timeCreated: {
          value: 100
        }
      };

      fileExistenceCheckService.requestMetadataFor(TEST_FILE, 'http://default-url')
      .then(function(metadata) {
        expect(metadata).to.deep.equal([
          {
            file: TEST_FILE,
            exists: true,
            'time-created': 100,
            'thumbnail-url': 'http://default-url'
          }
        ]);

        done();
      })
      .catch(function(err) {
        expect.fail(err);
      });
    });

  });

});
