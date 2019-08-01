'use strict';

describe('service: fileExistenceCheckService:', function() {
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
                  files: [{
                    metadata: {
                      thumbnail: 'http://thumbnail.png'
                    },
                    timeCreated: {
                      value: 100
                    }
                  }]
                }
              };
            }
          }
        });
      };
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
      var TEST_FILE = 'risemedialibrary-7fa5ee92-7deb-450b-a8d5-e5ed648c575f/file1.png';
      fileExistenceCheckService.requestMetadataFor(TEST_FILE, 'default-url')
      .then(function(metadata) {
        console.log(metadata);
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

  });

});
