'use strict';
describe('service: display tracker:', function() {
  beforeEach(module('risevision.common.components.logging'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('userState',function(){
      return {
        getUsername: sinon.stub().returns('userId'),
        getUserEmail: sinon.stub().returns('userEmail'),
        getSelectedCompanyId: sinon.stub().returns('companyId'),
        getSelectedCompanyName: sinon.stub().returns('companyName'),
        _restoreState: function(){}
      };
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
  
  it('should call analytics service',function(){
    displayTracker('Display Updated', 'displayId', 'displayName');

    expect(eventName).to.equal('Display Updated');
    expect(eventData).to.deep.equal({
      displayId: 'displayId', 
      displayName: 'displayName', 
      userId: 'userId',
      email: 'userEmail',
      companyId: 'companyId',
      companyName: 'companyName'});
    bQSpy.should.not.have.been.called;
  });

  it('should append additional properties',function(){
    displayTracker('Display Updated', 'displayId', 'displayName', {
      property1: 'value1',
      property2: 'value2'
    });

    expect(eventName).to.equal('Display Updated');
    expect(eventData).to.deep.equal({
      displayId: 'displayId', 
      displayName: 'displayName', 
      userId: 'userId',
      email: 'userEmail',
      companyId: 'companyId',
      companyName: 'companyName',
      property1: 'value1',
      property2: 'value2'
    });

    bQSpy.should.not.have.been.called;
  });

  it('should track Display Created event to BQ',function(){
    displayTracker('Display Created', 'displayId', 'displayName');

    bQSpy.should.have.been.calledWith('Display Created', 'displayId');
  });

  it('should not call w/ blank event',function(){
    displayTracker();

    expect(eventName).to.not.be.ok;
    expect(eventData).to.not.be.ok;
    bQSpy.should.not.have.been.called;
  });


});
