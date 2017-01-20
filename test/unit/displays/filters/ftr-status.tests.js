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

  it('should default to notinstalled if no status provide',function(){
    expect(status()).to.equal('notinstalled');
  });

  it('should default to notinstalled if display does not have player version',function(){
    var display = {
    }
    expect(status(display)).to.equal('notinstalled');
  });
    
  it('should show blocked display',function() {
    var display = {
      playerVersion: 'RisePlayer',
      blockExpiryDate: 'Jan1'
    }
    
    expect(status(display)).to.equal("blocked");
  });

  it('should show offline display',function() {
    var display = {
      playerVersion: 'RisePlayer',
      playerErrorCode: 0
    };
    expect(status(display)).to.equal("offline");
  });
  
  it('should show error display',function() {
    var display = {
      playerVersion: 'RisePlayer',
      playerErrorCode: 1
    };
    expect(status(display)).to.equal("error");
  });
  
  it('should show online display',function() {
    var display = {
      playerVersion: 'RisePlayer',
      playerErrorCode: 0,
      onlineStatus: "online"
    };
    expect(status(display)).to.equal("online");
  });
  
  it('should show error display',function() {
    var display = {
      playerVersion: 'RisePlayer',
      playerErrorCode: 0,
      onlineStatus: "offline"
    };
    expect(status(display)).to.equal("offline");
  });
});
