'use strict';
describe('directive: selected-files-count', function() {
  var element;

  beforeEach(module('risevision.storage.directives'));

  beforeEach(inject(function($compile, $rootScope, $templateCache){    
    $templateCache.put('partials/storage/selected-files-count.html', '<p>mock</p>');

    element = $compile('<div selected-files-count checked-items-count="5"></div>')($rootScope);
    $rootScope.$apply();
  }));

  it('should render directive', function() {
    expect(element.html()).to.equal('<p>mock</p>');
    expect(element.isolateScope().checkedItemsCount).to.equal(5);
  });

});
