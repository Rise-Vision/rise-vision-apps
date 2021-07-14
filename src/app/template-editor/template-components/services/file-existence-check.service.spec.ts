import { expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { FileExistenceCheckService } from './file-existence-check.service';
import { FileMetadataUtilsService } from './file-metadata-utils.service';
import { StorageAPILoader } from 'src/app/ajs-upgraded-providers';

describe('FileExistenceCheckService', () => {
  let fileExistenceCheckService: FileExistenceCheckService;

  let TEST_BUCKET = 'risemedialibrary-7fa5ee92-7deb-450b-a8d5-e5ed648c575f/';
  let DEFAULT_TEST_FILE = TEST_BUCKET + 'Template Library/file1.png';
  let TEST_FILE = TEST_BUCKET + 'file1.png';
  let storageAPILoader, testFileEntry, fileMetadataUtilsService;

  beforeEach(() => {
    storageAPILoader = function() {
      return Promise.resolve({
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

    fileMetadataUtilsService = {
      thumbnailFor: sinon.stub().returns('http://thumbnail.png'),
      filesAttributeToArray: sinon.stub().returns([TEST_FILE]),
      timeCreatedFor: sinon.stub().returns(100),
    }

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageAPILoader, useValue: storageAPILoader},
        { provide: FileMetadataUtilsService, useValue: fileMetadataUtilsService }  
      ]
    });
    fileExistenceCheckService = TestBed.inject(FileExistenceCheckService);
  });

  it('should be created', () => {
    expect(fileExistenceCheckService).to.exist;
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
            'thumbnail-url': 'http://thumbnail.png'
          }
        ]);        
        done();
      })
      .catch(function(err) {
        expect.fail(err);
      });
    });

    it('should mark file as existing with default thumbnail if it\'s a default file in test environment', function(done) {
      fileMetadataUtilsService.filesAttributeToArray.returns([DEFAULT_TEST_FILE]);
      fileExistenceCheckService.requestMetadataFor(DEFAULT_TEST_FILE, 'http://default-url')
      .then(function(metadata) {
        expect(metadata).to.deep.equal([
          {
            file: DEFAULT_TEST_FILE,
            exists: true,
            'time-created': '',
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
