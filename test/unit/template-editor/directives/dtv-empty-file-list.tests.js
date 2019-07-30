'use strict';

describe('directive: templateEditorEmptyFileList', function() {
  var element, $scope;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranlate()));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put('partials/template-editor/empty-file-list.html', '<p>mock</p>');
    element = $compile('<template-editor-empty-file-list file-type="image"></template-editor-empty-file-list>')($rootScope.$new());
    $rootScope.$apply();

    $scope = element.isolateScope();
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.fileType).to.equal('image');
  });

});
