'use strict';
describe('service: encoding:', function() {
  beforeEach(module('risevision.storage.services'));

  var encoding;
  beforeEach(function(){
    inject(function($injector){
      encoding = $injector.get('encoding');
    });
  });

  it('should exist',function(){
    expect(encoding).to.be.ok;
  });
});

