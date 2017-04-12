'use strict';
describe('directive: pending-operations', function() {
  var element;

  beforeEach(module('risevision.storage.directives'));

  beforeEach(module(function ($provide) {
    $provide.service('downloadFactory', function() {
      return {};
    });
    $provide.service('pendingOperationsFactory',function(){
      return {};
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put('partials/storage/pending-operations-panel.html', '<p>mock</p>');

    element = $compile('<pending-operations></pending-operations>')($rootScope);
    $rootScope.$apply();
  }));

  it('should render directive', function() {
    expect(element.html()).to.equal('<p>mock</p>');
    expect(element.scope().downloadFactory).to.be.ok;
  });

});
