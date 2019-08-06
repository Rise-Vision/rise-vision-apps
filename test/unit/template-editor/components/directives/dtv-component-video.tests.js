'use strict';

describe('directive: templateComponentVideo', function() {
  var $scope,
      element,
      factory,
      testMetadata,
      timeout;

  beforeEach(function() {
    factory = { selected: { id: 'TEST-ID' } };
  });

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranlate()));
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

  beforeEach(inject(function($compile, $rootScope, $templateCache, $timeout){
    $templateCache.put('partials/template-editor/components/component-video.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    $scope.registerDirective = sinon.stub();
    $scope.setAttributeData = sinon.stub();
    $scope.showNextPanel = sinon.stub();
    $scope.getBlueprintData = function() {
      return null;
    };

    timeout = $timeout;
    element = $compile('<template-component-video></template-component-video>')($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.factory).to.deep.equal({ selected: { id: 'TEST-ID' } })
    expect($scope.registerDirective).to.have.been.called;

    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-video');
    expect(directive.iconType).to.equal('streamline');
    expect(directive.icon).to.exist;
    expect(directive.show).to.be.a('function');
    expect(directive.onBackHandler).to.be.a('function');
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

    directive.show();

    expect($scope.selectedFiles).to.deep.equal(testMetadata);

    timeout.flush();
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

    testMetadata = [
      {
        file: TEST_FILE,
        exists: true,
        'time-created': 100,
        'thumbnail-url': 'http://thumbnail.mp4'
      }
    ];

    directive.show();
    timeout.flush();

    setTimeout(function() {
      expect($scope.selectedFiles).to.deep.equal(testMetadata);

      expect($scope.setAttributeData).to.have.been.called.once;
      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'metadata', testMetadata
      )).to.be.true;

      done();
    }, 100);
  });

  describe('updateFileMetadata', function() {

    var sampleVideos;

    beforeEach(function() {
      sampleVideos = [
        { 'file': 'video.mp4', exists: true, 'thumbnail-url': 'http://video' },
        { 'file': 'video2.mp4', exists: false, 'thumbnail-url': 'http://video2' }
      ];

      $scope.componentId = 'TEST-ID';
    });

    it('should directly set metadata if it\'s not already loaded', function()
    {
      $scope.getAttributeData = function() {
        return null;
      };

      $scope.updateFileMetadata(sampleVideos);

      expect($scope.selectedFiles).to.deep.equal(sampleVideos);

      expect($scope.setAttributeData).to.have.been.called.once;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'metadata', sampleVideos
      ), 'set metadata attribute').to.be.true;
    });

    it('should combine metadata if it\'s already loaded', function()
    {
      var updatedVideos = [
        { 'file': 'video.mp4', exists: false, 'thumbnail-url': 'http://video5' },
        { 'file': 'video2.mp4', exists: false, 'thumbnail-url': 'http://video6' }
      ];

      $scope.getAttributeData = function() {
        return sampleVideos;
      };

      $scope.updateFileMetadata(updatedVideos);

      expect($scope.selectedFiles).to.deep.equal(updatedVideos);

      expect($scope.setAttributeData).to.have.been.called.once;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'metadata', updatedVideos
      ), 'set metadata attribute').to.be.true;
    });

    it('should only update the provided videos', function()
    {
      var updatedVideos = [
        { 'file': 'video.mp4', exists: false, 'thumbnail-url': 'http://video5' }
      ];
      var expectedVideos = [
        { 'file': 'video.mp4', exists: false, 'thumbnail-url': 'http://video5' },
        { 'file': 'video2.mp4', exists: false, 'thumbnail-url': 'http://video2' }
      ];

      $scope.getAttributeData = function() {
        return sampleVideos;
      };

      $scope.updateFileMetadata(updatedVideos);

      expect($scope.selectedFiles).to.deep.equal(expectedVideos);

      expect($scope.setAttributeData).to.have.been.called.once;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'metadata', expectedVideos
      ), 'set metadata attribute').to.be.true;
    });

    it('should not update videos that are not already present', function()
    {
      var updatedVideos = [
        { 'file': 'video.mp4', exists: false, 'thumbnail-url': 'http://video5' },
        { 'file': 'videoNew.mp4', exists: false, 'thumbnail-url': 'http://video-thumbnail' }
      ];
      var expectedVideos = [
        { 'file': 'video.mp4', exists: false, 'thumbnail-url': 'http://video5' },
        { 'file': 'video2.mp4', exists: false, 'thumbnail-url': 'http://video2' }
      ];

      $scope.getAttributeData = function() {
        return sampleVideos;
      };

      $scope.updateFileMetadata(updatedVideos);

      expect($scope.selectedFiles).to.deep.equal(expectedVideos);

      expect($scope.setAttributeData).to.have.been.called.once;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'metadata', expectedVideos
      ), 'set metadata attribute').to.be.true;
    });

  });

});
