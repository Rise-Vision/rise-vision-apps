'use strict';
  
describe('service: placeholderFactory:', function() {
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(function ($provide) {
    placeholder = {
      id: 'ph1',
      type: 'url',
      items: [
        {
          name: 'item1',
          objectReference: 'widget1'
        },
        {
          name: 'item2',
          objectReference: undefined,
        },
        {
          name: 'item3',
          objectReference: 'widget1',
        }
      ]      
    };

  }));
  var placeholder, placeholderFactory, forceError;
  beforeEach(function(){    
    inject(function($injector){  
      placeholderFactory = $injector.get('placeholderFactory');
    });
  });

  it('should exist',function(){
    expect(placeholderFactory).to.be.truely;
    
    expect(placeholderFactory.setPlaceholder).to.be.a('function');
    expect(placeholderFactory.clearPlaceholder).to.be.a('function');    
  });

  it('should set placeholder', function() {
    placeholderFactory.setPlaceholder(placeholder)
    expect(placeholderFactory.placeholder).to.equal(placeholder);
  });

  it('should clear placeholder', function() {
    placeholderFactory.setPlaceholder(placeholder);
    placeholderFactory.clearPlaceholder();
    expect(placeholderFactory.placeholder).to.equal(undefined);
  });
  
});
