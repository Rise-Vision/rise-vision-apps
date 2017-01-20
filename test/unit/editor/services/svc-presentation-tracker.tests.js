'use strict';
describe('service: presentation tracker:', function() {
  beforeEach(module('risevision.editor.services'));

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
  
  var presentationTracker, eventName, eventData, bQSpy;
  beforeEach(function(){
    eventName = undefined;
    eventData = undefined;
    inject(function($injector){
      presentationTracker = $injector.get('presentationTracker');
      var bigQueryLogging = $injector.get('bigQueryLogging');
      bQSpy = sinon.spy(bigQueryLogging,'logEvent');
    });
  });

  it('should exist',function(){
    expect(presentationTracker).to.be.truely;
    expect(presentationTracker).to.be.a('function');
  });
  
  it('should call segment analytics service',function(){
    presentationTracker('Presentation Updated', 'presentationId', 'presentationName');

    expect(eventName).to.equal('Presentation Updated');
    expect(eventData).to.deep.equal({presentationId: 'presentationId', presentationName: 'presentationName', companyId: 'companyId'});
    bQSpy.should.not.have.been.called;
  });

  it('should log Presentation Created to BQ',function(){
    presentationTracker('Presentation Created', 'presentationId', 'presentationName');

    bQSpy.should.have.been.calledWith('Presentation Created', 'presentationId');
  });

  it('should not call segment w/ blank event',function(){
    presentationTracker();

    expect(eventName).to.not.be.ok;
    expect(eventData).to.not.be.ok;
    bQSpy.should.not.have.been.called;
  });


});
