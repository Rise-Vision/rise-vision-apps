'use strict';
describe('service: createFirstSchedule:', function() {
  beforeEach(module('risevision.schedules.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('scheduleFactory',function () {
      return {
        checkFirstSchedule: sinon.stub().returns(Q.resolve()),
        newSchedule: sinon.spy(),
        addSchedule: sinon.stub().returns(Q.resolve()),
        schedule: {}
      };
    });
    $provide.service('playlistFactory', function() {
      return {
        addPresentationItem: sinon.stub().returns(Q.resolve())
      }
    })
    $provide.service('$state',function(){
      return {
        go : sinon.stub()
      }
    });

  }));
  var createFirstSchedule, $state, scheduleFactory, playlistFactory;
  beforeEach(function(){

    inject(function($injector){
      createFirstSchedule = $injector.get('createFirstSchedule');

      $state = $injector.get('$state');
      scheduleFactory = $injector.get('scheduleFactory');
      playlistFactory = $injector.get('playlistFactory');
    });
  });

  it('should exist',function(){
    expect(createFirstSchedule).to.be.ok;
    expect(createFirstSchedule).to.be.a('function');
  });

  var samplePresentation, firstScheduleSample;

  beforeEach(function() {
    samplePresentation = {
      name: 'presentationName',
      id: 'presentationId'
    };
    firstScheduleSample = {
      name: 'All Displays - 24/7',
      content: [{
        name: 'presentationName',
        objectReference: 'presentationId',
        playUntilDone: false,
        duration: 10,
        timeDefined: false,
        type: 'presentation'
      }],
      distributeToAll: true,
      timeDefined: false
    };
    
  });

  it('should create first schedule', function(done) {
    createFirstSchedule(samplePresentation)
      .then(function(){
        scheduleFactory.checkFirstSchedule.should.have.been.called;
        scheduleFactory.newSchedule.should.have.been.calledWith(true);

        expect(scheduleFactory.schedule.name).to.equal('All Displays - 24/7');
        expect(scheduleFactory.schedule.distributeToAll).to.be.true;

        playlistFactory.addPresentationItem.should.have.been.calledWith(samplePresentation);

        scheduleFactory.addSchedule.should.have.been.called;

        $state.go.should.not.have.been.called;

        done();
      });
  });

  it('should not create twice, checkFirstSchedule reject', function(done) {
    scheduleFactory.checkFirstSchedule.returns(Q.reject());

    createFirstSchedule(samplePresentation)
      .then(function(){
        done("Error: schedule created again");
      },function(){
        scheduleFactory.addSchedule.should.not.have.been.called;

        done();
      });
  });

  it('should handle failure to create schedule, addSchedule returns error', function(done) {
    scheduleFactory.errorMessage = 'Failed to create schedule';

    createFirstSchedule()
      .then(function(){
        done("Error: schedule created again");
      },function(err){
        expect(err).to.equal('Failed to create schedule');

        done();
      });
  });

});
