'use strict';
describe('directive: empty-state', function() {
  var element;

  beforeEach(module('risevision.storage.directives'));

  beforeEach(module(function ($provide) {
    $provide.value('SELECTOR_TYPES', {
      MULTIPLE_FILES_FOLDERS: 'multiple-files-folders'
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put('partials/storage/empty-state.html', '<p>mock</p>');

    $rootScope.storageFactory = {
      selectorType: 'multiple-files-folders'
    };

    element = $compile('<empty-state></empty-state>')($rootScope);
    $rootScope.$apply();
  }));

  it('should render directive', function() {
    expect(element.html()).to.equal('<p>mock</p>');
    expect(element.scope().isMultipleFilesFoldersSelector).to.be.true;
  });

});
