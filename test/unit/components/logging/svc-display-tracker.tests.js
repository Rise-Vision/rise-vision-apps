'use strict';
describe('service: display tracker:', function() {
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
    $provide.service('segmentAnalytics',function(){
      return {
        track: function(newEventName, newEventData) {
          eventName = newEventName;
          eventData = newEventData;
        }, 
        load: function(){}
      }
    });
    $provide.service('bigQueryLogging',function(){
      return {
        logEvent: function() {}
      }
    });
  }));
  
  var displayTracker, eventName, eventData, bQSpy;
  beforeEach(function(){
    eventName = undefined;
    eventData = undefined;
    inject(function($injector){
      displayTracker = $injector.get('displayTracker');
      var bigQueryLogging = $injector.get('bigQueryLogging');
      bQSpy = sinon.spy(bigQueryLogging,'logEvent');
    });
  });

  it('should exist',function(){
    expect(displayTracker).to.be.truely;
    expect(displayTracker).to.be.a('function');
  });
  
  it('should call segment analytics service',function(){
    displayTracker('Display Updated', 'displayId', 'displayName', 'downloadType');

    expect(eventName).to.equal('Display Updated');
    expect(eventData).to.deep.equal({displayId: 'displayId', displayName: 'displayName', companyId: 'companyId', downloadType: 'downloadType'});
    bQSpy.should.not.have.been.called;
  });

  it('should track Player Download event to BQ',function(){
    displayTracker('Player Download', 'displayId', 'displayName', 'downloadType');
    bQSpy.should.have.been.calledWith('Player Download', 'displayId');
  });

  it('should track Display Created event to BQ',function(){
    displayTracker('Display Created', 'displayId', 'displayName', 'downloadType');
    bQSpy.should.have.been.calledWith('Display Created', 'displayId');
  });

  it('should not call segment w/ blank event',function(){
    displayTracker();

    expect(eventName).to.not.be.ok;
    expect(eventData).to.not.be.ok;
    bQSpy.should.not.have.been.called;
  });


});
