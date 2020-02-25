'use strict';

describe('directive: templateEditorFileEntry', function() {
  var sandbox = sinon.sandbox.create(), $scope, element, removeAction;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('templateEditorUtils', function() {
      return {
        fileNameOf: function () { return 'file.png' }
      };
    });
  }));

  afterEach(function () {
    sandbox.restore();
  });

  describe('regular', function() {
    var testEntry = { file: 'dir/file.png' };

    beforeEach(inject(function($injector, $compile, $rootScope, $templateCache) {
      removeAction = sandbox.stub();

      $rootScope.entry = testEntry;
      $rootScope.removeAction = removeAction;

      $templateCache.put('partials/template-editor/file-entry.html', '<p>mock</p>');
      element = $compile('<template-editor-file-entry file-type="image" entry="entry" remove-action="removeAction" show-grip-handle="true"></template-editor-file-entry>')($rootScope);
      $rootScope.$apply();

      $scope = element.isolateScope();
      $scope.$digest();
    }));

    it('should exist', function () {
      expect($scope).to.be.ok;

      expect($scope.removeAction).to.be.a.function;
      expect($scope.removeFileFromList).to.be.a.function;
      expect($scope.getFileName).to.be.a.function;
      expect($scope.isStreamlineThumbnail).to.be.a.function;
      expect($scope.getStreamlineIcon).to.be.a.function;
      expect($scope.fileType).to.equal('image');
      expect($scope.entry).to.deep.equal(testEntry);
      expect($scope.showGripHandle).to.be.true;
    });

    it('should have a file name', function () {
      expect($scope.getFileName()).to.equal('file.png');
    });

    it('should not be a streamline thumbnail', function () {
      expect($scope.isStreamlineThumbnail()).to.be.false;
      expect($scope.getStreamlineIcon()).to.equal('');
    });

    it('should call remove', function () {
      $scope.removeFileFromList();

      expect(removeAction).to.have.been.calledWith(testEntry);
    });

  });

  describe('streamline thumbnails', function() {
    var testEntry = {
      file: 'dir/file.png',
      'thumbnail-url': 'streamline:video'
    };

    beforeEach(inject(function($injector, $compile, $rootScope, $templateCache) {
      removeAction = sandbox.stub();

      $rootScope.entry = testEntry;
      $rootScope.removeAction = removeAction;

      $templateCache.put('partials/template-editor/file-entry.html', '<p>mock</p>');
      element = $compile('<template-editor-file-entry file-type="image" entry="entry" remove-action="removeAction"></template-editor-file-entry>')($rootScope);
      $rootScope.$apply();

      $scope = element.isolateScope();
      $scope.$digest();
    }));

    it('should be a streamline thumbnail', function () {
      expect($scope.isStreamlineThumbnail()).to.be.true;
      expect($scope.getStreamlineIcon()).to.equal('video');
    });

  });

});
