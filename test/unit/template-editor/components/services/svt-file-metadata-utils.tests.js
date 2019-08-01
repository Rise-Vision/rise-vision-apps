'use strict';

describe('service: fileMetadataUtilsService:', function() {
  beforeEach(module('risevision.template-editor.services'));

  var fileMetadataUtilsService;

  beforeEach(function() {
    inject(function($injector) {
      fileMetadataUtilsService = $injector.get('fileMetadataUtilsService');
    });
  });

  it('should initialize', function () {
    expect(fileMetadataUtilsService).to.be.truely;
    expect(fileMetadataUtilsService.thumbnailFor).to.be.a('function');
    expect(fileMetadataUtilsService.timeCreatedFor).to.be.a('function');
  });

  describe('thumbnailFor', function() {

    it('should get thumbnail if provided in the entry', function() {
      var thumbnail = fileMetadataUtilsService.thumbnailFor({
        metadata: {
          thumbnail: 'http://thumbnail'
        },
        timeCreated: {
          value: 200
        }
      });

      expect(thumbnail).to.equal('http://thumbnail?_=200');
    });

    it('should use default thumbnail if the entry has no thumbnail', function() {
      var thumbnail = fileMetadataUtilsService.thumbnailFor({}, 'http://default-thumbnail');

      expect(thumbnail).to.equal('http://default-thumbnail');
    });

  });

  describe('timeCreatedFor', function() {

    it('should get time created if provided in the entry', function() {
      var timeCreated = fileMetadataUtilsService.timeCreatedFor({
        metadata: {
          thumbnail: 'http://thumbnail'
        },
        timeCreated: {
          value: 200
        }
      });

      expect(timeCreated).to.equal(200);
    });

    it('should not fail if time created is not provided in the entry', function() {
      var timeCreated = fileMetadataUtilsService.timeCreatedFor({});

      expect(timeCreated).to.be.falsey;
    });

  });

});
