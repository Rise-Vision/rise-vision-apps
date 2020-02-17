'use strict';
describe('service: company tracker:', function() {
  beforeEach(module('risevision.common.components.logging'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('userState',function(){
      return {
        getSelectedCompanyId: function() {
          return "companyId";
        },
        getUsername: function() {
          return 'username';
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
  
  var companyTracker, eventName, eventData, bQSpy;
  beforeEach(function(){
    eventName = undefined;
    eventData = undefined;
    inject(function($injector){
      companyTracker = $injector.get('companyTracker');
      var bigQueryLogging = $injector.get('bigQueryLogging');
      bQSpy = sinon.spy(bigQueryLogging,'logEvent');
    });
  });

  it('should exist',function(){
    expect(companyTracker).to.be.truely;
    expect(companyTracker).to.be.a('function');
  });
  
  it('should call analytics service',function(){
    companyTracker('Company Updated', 'companyId', 'companyName', true);

    expect(eventName).to.equal('Company Updated');
    expect(eventData).to.deep.equal({companyId: 'companyId', companyName: 'companyName', isUserCompany: true});
    bQSpy.should.not.have.been.called;
  });

  it('should track Company Created event to BQ',function(){
    companyTracker('Company Created', 'companyId', 'companyName', true);
    bQSpy.should.have.been.calledWith('Company Created', 'companyName', null, 'username', 'companyId');
  });

  it('should not call w/ blank event',function(){
    companyTracker();

    expect(eventName).to.not.be.ok;
    expect(eventData).to.not.be.ok;
    bQSpy.should.not.have.been.called;
  });


});
