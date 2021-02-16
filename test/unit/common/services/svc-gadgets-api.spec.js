'use strict';
describe('service: gadgetsApi:', function() {
  beforeEach(module('risevision.apps.services'));
  var gadgetsApi;
  beforeEach(function(){
    inject(function($injector){
      var $window = $injector.get('$window');
      $window.gadgets = 'gadgetsApi';

      gadgetsApi = $injector.get('gadgetsApi');
    });
  });

  it('should exist',function(){
    expect(gadgetsApi).to.be.ok;
  });
  
  it('should return gadgets object',function(){
    expect(gadgetsApi).to.equal('gadgetsApi');
  });
  
});
