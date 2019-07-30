'use strict';

describe('directive: templateEditorFileEntry', function() {
  var sandbox = sinon.sandbox.create(), $scope, element, removeAction,
    testEntry = { file: 'dir/file.png' };;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('templateEditorUtils', function() {
      return {
        fileNameOf: function () { return 'file.png' }
      };
    });
  }));

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

  afterEach(function () {
    sandbox.restore();
  });

  it('should exist', function () {
    expect($scope).to.be.ok;
    expect($scope.removeAction).to.be.a.function;
    expect($scope.removeFileFromList).to.be.a.function;
    expect($scope.fileType).to.equal('image');
    expect($scope.entry).to.deep.equal(testEntry);
  });

  it('should have a file name', function () {
    expect($scope.fileName).to.equal('file.png');
  });

  it('should call remove', function () {
    $scope.removeFileFromList();

    expect(removeAction).to.have.been.calledWith(testEntry);
  });

});
