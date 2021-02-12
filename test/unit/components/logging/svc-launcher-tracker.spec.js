'use strict';
describe('service: launcher tracker:', function() {
  beforeEach(module('risevision.common.components.logging'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('userState',function(){
      return {
        getSelectedCompanyId: function() {
          return "companyId";
        }, 
        _restoreState: function(){}
      }
    });
    $provide.service('analyticsFactory',function(){
      return {
        track: function(newEventName, newEventData) {
          eventName = newEventName;
          eventData = newEventData;
        }, 
        load: function(){}
      }
    });
  }));
  
  var launcherTracker, eventName, eventData;
  beforeEach(function(){
    eventName = undefined;
    eventData = undefined;
    inject(function($injector){
      launcherTracker = $injector.get('launcherTracker');
    });
  });

  it('should exist',function(){
    expect(launcherTracker).to.be.truely;
    expect(launcherTracker).to.be.a('function');
  });
  
  it('should call analytics service',function(){
    launcherTracker('Add Presentation');

    expect(eventName).to.equal('Add Presentation');
    expect(eventData).to.deep.equal({companyId: 'companyId'});
  });

  it('should not call w/ blank event',function(){
    launcherTracker();

    expect(eventName).to.not.be.ok;
    expect(eventData).to.not.be.ok;
  });


});
