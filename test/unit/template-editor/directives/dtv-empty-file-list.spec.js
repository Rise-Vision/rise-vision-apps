'use strict';

describe('directive: templateEditorEmptyFileList', function() {
  var element, $scope;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranslate()));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put('partials/template-editor/empty-file-list.html', '<p>mock</p>');
    element = $compile('<template-editor-empty-file-list file-type="image" is-editing-logo="true"></template-editor-empty-file-list>')($rootScope.$new());
    $rootScope.$apply();

    $scope = element.isolateScope();
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.fileType).to.equal('image');
    expect($scope.isEditingLogo).to.be.true;
  });

});
