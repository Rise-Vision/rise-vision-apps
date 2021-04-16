'use strict';

describe('directive: templateComponentVideo', function() {
  var $scope,
      element,
      factory,
      storageManagerFactory,
      testMetadata,
      $timeout;

  beforeEach(function() {
    factory = { selected: { id: 'TEST-ID' } };
  });

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('templateEditorFactory', function() {
      return factory;
    });

    $provide.service('fileExistenceCheckService', function() {
      return {
        requestMetadataFor: function() {
          return Q.resolve(testMetadata);
        }
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    $templateCache.put('partials/template-editor/components/component-video.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    $scope.registerDirective = sinon.stub();
    $scope.getAttributeData = sinon.stub();
    $scope.getAvailableAttributeData = sinon.stub();
    $scope.setAttributeData = sinon.stub();
    $scope.editComponent = sinon.stub();
    $scope.getBlueprintData = function() {
      return null;
    };

    $timeout = $injector.get('$timeout');
    storageManagerFactory = $injector.get('storageManagerFactory');

    element = $compile('<template-component-video></template-component-video>')($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.factory).to.deep.equal({ selected: { id: 'TEST-ID' } })
    expect($scope.sortItem).to.be.a('function');
  });

  describe('registerDirective:', function() {
    it('should initialize', function() {
      $scope.registerDirective.should.have.been.called;

      var directive = $scope.registerDirective.getCall(0).args[0];
      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-video');
      expect(directive.element).to.be.an('object');
      expect(directive.show).to.be.a('function');
    });

    it('show:', function() {
      $scope.registerDirective.getCall(0).args[0].show();

      expect(storageManagerFactory.fileType).to.equal('video');
      expect(storageManagerFactory.onSelectHandler).to.be.a('function');
    });

  });

  it('should set video lists when available as attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    testMetadata = [
      { 'file': 'video.mp4', 'thumbnail-url': 'http://video' },
      { 'file': 'test|character.mp4', 'thumbnail-url': 'http://test%7Ccharacter.mp4' }
    ];

    $scope.getAttributeData = function(componentId, key) {
      return testMetadata;
    };
    $scope.getAvailableAttributeData = function(componentId, key) {
      return "";
    };

    directive.show();

    expect($scope.selectedFiles).to.deep.equal(testMetadata);

    $timeout.flush();
  });

  it('should detect default files', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleFiles = [
      { "file": "video.mp4", "thumbnail-url": "http://video" }
    ];

    $scope.getAttributeData = function(componentId, key) {
      return sampleFiles;
    };
    $scope.getBlueprintData = function(componentId, key) {
      return "video.mp4";
    };
    $scope.getAvailableAttributeData = function(componentId, key) {
      return "0";
    };

    directive.show();

    expect($scope.isDefaultFileList).to.be.true;

    $timeout.flush();
  });

  it('should not consider a default value if it is not', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleFiles = [
      { "file": "video.mp4", "thumbnail-url": "http://video" }
    ];

    $scope.getAttributeData = function(componentId, key) {
      return sampleFiles;
    };
    $scope.getBlueprintData = function(componentId, key) {
      return "default.mp4";
    };
    $scope.getAvailableAttributeData = function(componentId, key) {
      return "0";
    };

    directive.show();

    expect($scope.isDefaultFileList).to.be.false;

    $timeout.flush();
  });

  it('should get thumbnail URLs when not available as attribute data', function(done) {
    var TEST_FILE = 'risemedialibrary-7fa5ee92-7deb-450b-a8d5-e5ed648c575f/file1.mp4';
    var directive = $scope.registerDirective.getCall(0).args[0];

    $scope.getAttributeData = function() {
      return null;
    };
    $scope.getBlueprintData = function() {
      return TEST_FILE;
    };
    $scope.getAvailableAttributeData = function(componentId, key) {
      return "";
    };

    testMetadata = [
      {
        file: TEST_FILE,
        exists: true,
        'time-created': 100,
        'thumbnail-url': 'http://thumbnail.mp4'
      }
    ];

    directive.show();
    $timeout.flush();

    setTimeout(function() {
      expect($scope.selectedFiles).to.deep.equal(testMetadata);

      expect($scope.setAttributeData).to.have.been.called.once;
      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'metadata', testMetadata
      )).to.be.true;

      done();
    }, 100);
  });

  it('should get volume data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];

    $scope.getAttributeData = function(componentId, key) {
      return [];
    };
    $scope.getAvailableAttributeData = function(componentId, key) {
      return "10";
    };

    directive.show();

    expect($scope.values).to.deep.equal({ volume: 10 });

    $timeout.flush();
  });

  it('should default volume data to 0', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];

    $scope.getAttributeData = function(componentId, key) {
      return [];
    };
    $scope.getAvailableAttributeData = function(componentId, key) {
    };

    directive.show();

    expect($scope.values).to.deep.equal({ volume: 0 });

    $timeout.flush();
  });

  it('should set volume as 0 if it has an invalid vaue', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];

    $scope.getAttributeData = function(componentId, key) {
      return [];
    };
    $scope.getAvailableAttributeData = function(componentId, key) {
      return "NOT A NUMBER !"
    };

    directive.show();

    expect($scope.values).to.deep.equal({ volume: 0 });

    $timeout.flush();
  });

  describe('showSettingsUI', function() {

    it('should not show settings UI if it is uploading', function()
    {
      $scope.selectedFiles = [ 'a' ];
      $scope.isUploading = true;

      var show = $scope.showSettingsUI();

      expect(show).to.be.false;
    });

    it('should not show settings UI if there are no selected files', function()
    {
      $scope.selectedFiles = [];
      $scope.isUploading = false;

      var show = $scope.showSettingsUI();

      expect(show).to.be.false;
    });

    it('should show settings UI if there are selected files and it\'s not uploading', function()
    {
      $scope.selectedFiles = [ 'a' ];
      $scope.isUploading = false;

      var show = $scope.showSettingsUI();

      expect(show).to.be.true;
    });

  });

  describe('updateFileMetadata', function() {

    var sampleVideos;

    beforeEach(function() {
      sampleVideos = [
        {
          'file': 'video.mp4',
          exists: true,
          'thumbnail-url': 'http://video',
          'time-created': '123'
        },
        {
          'file': 'video2.mp4',
          exists: false,
          'thumbnail-url': 'http://video2',
          'time-created': '345'
        }
      ];

      $scope.componentId = 'TEST-ID';
      $scope.getBlueprintData = function(componentId, key) {
        return "video.mp4";
      };
    });

    it('should directly set metadata if it\'s not already loaded', function()
    {
      $scope.getAttributeData = function() {
        return null;
      };

      $scope.updateFileMetadata(sampleVideos);

      expect($scope.isDefaultFileList).to.be.false;
      expect($scope.selectedFiles).to.deep.equal(sampleVideos);

      expect($scope.setAttributeData).to.have.been.called.once;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'metadata', sampleVideos
      ), 'set metadata attribute').to.be.true;
    });

    it('should combine metadata if it\'s already loaded', function()
    {
      var updatedVideos = [
        {
          'file': 'video.mp4',
          exists: false,
          'thumbnail-url': 'http://video5',
          'time-created': '543'
        },
        {
          'file': 'video2.mp4',
          exists: false,
          'thumbnail-url': 'http://video6',
          'time-created': '777'
        }
      ];

      $scope.getAttributeData = function() {
        return sampleVideos;
      };

      $scope.updateFileMetadata(updatedVideos);

      expect($scope.isDefaultFileList).to.be.false;
      expect($scope.selectedFiles).to.deep.equal(updatedVideos);

      expect($scope.setAttributeData).to.have.been.called.once;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'metadata', updatedVideos
      ), 'set metadata attribute').to.be.true;
    });

    it('should only update the provided videos', function()
    {
      var updatedVideos = [
        {
          'file': 'video.mp4',
          exists: false,
          'thumbnail-url': 'http://video5',
          'time-created': '533'
        }
      ];
      var expectedVideos = [
        {
          'file': 'video.mp4',
          exists: false,
          'thumbnail-url': 'http://video5',
          'time-created': '533'
        },
        {
          'file': 'video2.mp4',
          exists: false,
          'thumbnail-url': 'http://video2',
          'time-created': '345'
        }
      ];

      $scope.getAttributeData = function() {
        return sampleVideos;
      };

      $scope.updateFileMetadata(updatedVideos);

      expect($scope.isDefaultFileList).to.be.false;
      expect($scope.selectedFiles).to.deep.equal(expectedVideos);

      expect($scope.setAttributeData).to.have.been.called.once;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'metadata', expectedVideos
      ), 'set metadata attribute').to.be.true;
    });

    it('should not update videos that are not already present', function()
    {
      var updatedVideos = [
        {
          'file': 'video.mp4',
          exists: false,
          'thumbnail-url': 'http://video5',
          'time-created': '765'
        },
        {
          'file': 'videoNew.mp4',
          exists: false,
          'thumbnail-url': 'http://video-thumbnail',
          'time-created': '544'
        }
      ];
      var expectedVideos = [
        {
          'file': 'video.mp4',
          exists: false,
          'thumbnail-url': 'http://video5',
          'time-created': '765'
        },
        {
          'file': 'video2.mp4',
          exists: false,
          'thumbnail-url': 'http://video2',
          'time-created': '345'
        }
      ];

      $scope.getAttributeData = function() {
        return sampleVideos;
      };

      $scope.updateFileMetadata(updatedVideos);

      expect($scope.isDefaultFileList).to.be.false;
      expect($scope.selectedFiles).to.deep.equal(expectedVideos);

      expect($scope.setAttributeData).to.have.been.called.once;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'metadata', expectedVideos
      ), 'set metadata attribute').to.be.true;
    });

  });

  it('selectFromStorage:', function() {
    $scope.selectFromStorage();

    $scope.editComponent.should.have.been.calledWith({
      type: 'rise-storage-selector'
    });
  });

  describe('showSettingsUI', function() {
    it('should save volume', function()
    {
      $scope.componentId = 'TEST-ID';
      $scope.values.volume = 100;

      $scope.saveVolume();

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'volume', 100
      ), 'set volume attribute').to.be.true;
    });
  });

  describe('sortItem: ', function() {
    var _callSort = function(oldIndex, newIndex) {
      $scope.sortItem({
        data: {
          oldIndex: oldIndex,
          newIndex: newIndex
        }
      });
    };

    beforeEach(function() {
      $scope.selectedFiles = [
        'file0',
        'file1',
        'file2',
        'file3'
      ];
    });

    it('should move item up/down: ', function() {
      _callSort(0, 1);

      expect($scope.selectedFiles.indexOf('file0')).to.equal(1);

      _callSort(2, 1);

      expect($scope.selectedFiles.indexOf('file2')).to.equal(1);
      expect($scope.selectedFiles.indexOf('file0')).to.equal(2);

      _callSort(2, 0);
      expect($scope.selectedFiles.indexOf('file0')).to.equal(0);
    });

  });

});
