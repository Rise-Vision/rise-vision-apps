'use strict';
describe('filter: status', function() {
  beforeEach(module('risevision.displays.filters'));
  var status;
  beforeEach(function(){
    inject(function($filter){
      status = $filter('status');
    });
  });

  it('should exist',function(){
    expect(status).to.be.truely;
  });
  
  it('should show correct status',function() {
    expect(status('online')).to.equal('Online');
    expect(status('offline')).to.equal('Offline');
    expect(status('not_activated')).to.equal('Not Activated');
  });

  it('should default to Not Activated if no status provided',function(){
    expect(status()).to.equal('Not Activated');
  });

  it('should default to Not Activated if status is not valid',function(){
    expect(status('notsupported')).to.equal('Not Activated');
  });

});
