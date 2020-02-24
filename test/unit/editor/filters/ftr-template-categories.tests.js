'use strict';

describe('filter: templateCategory', function() {
  beforeEach(module('risevision.editor.filters'));
  beforeEach(module(function ($provide) {

  }));

  var templateCategory, templatesList;

  beforeEach(function() {
    templatesList = [
      {
        categories: ['cat1', 'cat2']
      },
      {
        categories: ['cat2', 'cat3']
      },
      {
        categories: undefined
      }
    ];

    inject(function($injector, $filter) {
      templateCategory = $filter('templateCategory');  
    });
  });

  it('should exist',function(){
    expect(templateCategory).to.be.ok;
    expect(templateCategory).to.be.a('function');
  });

  it('should return the category list',function() {
    expect(templateCategory(templatesList, 'categories')).to.deep.equal(['cat1', 'cat2', 'cat3']);
  });

});
