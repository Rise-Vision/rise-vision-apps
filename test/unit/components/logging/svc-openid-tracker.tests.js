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
  }));

  var openidTracker, eventName, eventData;
  beforeEach(function(){
    eventName = undefined;
    eventData = undefined;
    inject(function($injector){
      openidTracker = $injector.get('openidTracker');
    });
  });

  it('should exist',function(){
    expect(openidTracker).to.be.truely;
    expect(openidTracker).to.be.a('function');
  });

  it('should call analytics service',function(){
    openidTracker('user loaded', {sub: '12345'});

    expect(eventName).to.equal('OpenId Event');
    expect(eventData).to.deep.equal({
      openidEventType: 'user loaded',
      userId: 'userId',
      email: 'userEmail',
      googleUserId: '12345',
      companyId: 'companyId'
    });
  });

  it('should append additional properties',function(){
    openidTracker('user loaded', {sub: '12345'}, {extra: 'param'});

    expect(eventName).to.equal('OpenId Event');
    expect(eventData).to.deep.equal({
      openidEventType: 'user loaded',
      userId: 'userId',
      email: 'userEmail',
      googleUserId: '12345',
      companyId: 'companyId',
      extra: 'param'
    });
  });

});
