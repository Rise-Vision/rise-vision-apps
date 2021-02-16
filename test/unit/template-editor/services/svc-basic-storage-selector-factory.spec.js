'use strict';

describe('service: basicStorageSelectorFactory:', function() {
  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function ($provide) {

  }));

  var basicStorageSelectorFactory;

  beforeEach(function() {
    inject(function($injector) {
      basicStorageSelectorFactory = $injector.get('basicStorageSelectorFactory');
    });
  });

  it('should initialize', function() {
    expect(basicStorageSelectorFactory).to.be.ok;

    expect(basicStorageSelectorFactory.isListView).to.be.true;
  });
  
});
