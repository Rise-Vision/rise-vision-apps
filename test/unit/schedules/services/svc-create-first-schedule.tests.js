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
    $provide.service('$modal',function(){
      return {
        open: sinon.stub()
      };
    });
    $provide.service('onboardingFactory', function() {
      return {
        isTemplateOnboarding: sinon.stub().returns(false)
      };
    });
    $provide.service('blueprintFactory', function() {
      return {
        isPlayUntilDone: sinon.stub()
      };
    });

  }));
  var createFirstSchedule, $state, scheduleFactory, playlistFactory, $modal;
  var onboardingFactory, blueprintFactory;
  beforeEach(function(){

    inject(function($injector){
      createFirstSchedule = $injector.get('createFirstSchedule');

      $modal = $injector.get('$modal');
      $state = $injector.get('$state');
      scheduleFactory = $injector.get('scheduleFactory');
      playlistFactory = $injector.get('playlistFactory');
      onboardingFactory = $injector.get('onboardingFactory');
      blueprintFactory = $injector.get('blueprintFactory');
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

  it('should create first schedule and show modal', function(done) {
    createFirstSchedule(samplePresentation)
      .then(function(){
        scheduleFactory.checkFirstSchedule.should.have.been.called;
        scheduleFactory.newSchedule.should.have.been.calledWith(true);

        expect(scheduleFactory.schedule.name).to.equal('All Displays - 24/7');
        expect(scheduleFactory.schedule.distributeToAll).to.be.true;

        playlistFactory.addPresentationItem.should.have.been.calledWith(samplePresentation);

        scheduleFactory.addSchedule.should.have.been.called;

        $state.go.should.not.have.been.called;
        $modal.open.should.have.been.called;

        expect($modal.open.getCall(0).args[0].templateUrl).to.equal('partials/schedules/auto-schedule-modal.html');
        expect($modal.open.getCall(0).args[0].controller).to.equal('AutoScheduleModalController');
        expect($modal.open.getCall(0).args[0].resolve.presentationName()).to.equal('presentationName');

        done();
      });
  });

  it('should create first schedule and redirect to onboarding', function(done) {
    onboardingFactory.isTemplateOnboarding.returns(true);
    createFirstSchedule(samplePresentation)
      .then(function(){
        $state.go.should.have.been.calledWith('apps.launcher.onboarding');
        $modal.open.should.not.have.been.called;

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
