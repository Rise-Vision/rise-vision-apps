'use strict';
describe('service: user tracker:', function() {
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
    $provide.service('bigQueryLogging',function(){
      return {
        logEvent: function() {}
      }
    });
  }));
  
  var userTracker, eventName, eventData, bQSpy;
  beforeEach(function(){
    eventName = undefined;
    eventData = undefined;
    inject(function($injector){
      userTracker = $injector.get('userTracker');
      var bigQueryLogging = $injector.get('bigQueryLogging');
      bQSpy = sinon.spy(bigQueryLogging,'logEvent');
    });
  });

  it('should exist',function(){
    expect(userTracker).to.be.truely;
    expect(userTracker).to.be.a('function');
  });
  
  it('should call analytics service',function(){
    userTracker('User Updated', 'userId', true);

    expect(eventName).to.equal('User Updated');
    expect(eventData).to.deep.equal({userId: 'userId', companyId: 'companyId', isSelf: true});
    bQSpy.should.not.have.been.called;
  });

  it('should call analytics service with invitedEmail if present',function(){
    userTracker('User Created', 'userId', false, 'invitedEmail');

    expect(eventName).to.equal('User Created');
    expect(eventData).to.deep.equal({userId: 'userId', companyId: 'companyId', isSelf: false, invitedEmail: 'invitedEmail'});
    bQSpy.should.not.have.been.called;
  });

  it('should not call w/ blank event',function(){
    userTracker();

    expect(eventName).to.not.be.ok;
    expect(eventData).to.not.be.ok;
    bQSpy.should.not.have.been.called;
  });


});
