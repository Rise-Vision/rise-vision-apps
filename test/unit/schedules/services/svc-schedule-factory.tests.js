'use strict';
describe('service: scheduleFactory:', function() {
  beforeEach(module('risevision.schedules.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('schedule',function () {
      return {
        _schedule: {
          id: "scheduleId",
          name: "some schedule"
        },
        list: function() {
          var deferred = Q.defer();
          if(returnList){
            deferred.resolve(returnList);
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not load list'}}});
          }
          return deferred.promise;
        },
        add : function(){
          var deferred = Q.defer();
          if(updateSchedule){
            deferred.resolve({item: this._schedule});
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not create schedule'}}});
          }
          return deferred.promise;
        },
        update : function(schedule){
          var deferred = Q.defer();
          if(updateSchedule){
            deferred.resolve({item: this._schedule});
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not update schedule'}}});
          }
          return deferred.promise;
        },
        get: function(scheduleId) {
          var deferred = Q.defer();
          if(updateSchedule){
            deferred.resolve({item: this._schedule});
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not get schedule'}}});
          }
          return deferred.promise;
        },
        delete: function(scheduleId) {
          var deferred = Q.defer();
          if(updateSchedule){
            deferred.resolve(scheduleId);
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not delete schedule'}}});
          }
          return deferred.promise;
        }
      };
    });
    $provide.service('scheduleTracker', function() {
      return function(name) {
        trackerCalled = name;
      };
    });
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

    $provide.service('processErrorCode', function() {
      return processErrorCode = sinon.spy(function() { return 'error'; });
    });
    $provide.value('VIEWER_URL', 'http://rvaviewer-test.appspot.com');

  }));
  var scheduleFactory, trackerCalled, updateSchedule, $state, returnList, scheduleListSpy, scheduleAddSpy, processErrorCode, $modal;
  var $rootScope, onboardingFactory, blueprintFactory;
  beforeEach(function(){
    trackerCalled = undefined;
    updateSchedule = true;
    returnList = null;

    inject(function($injector){
      scheduleFactory = $injector.get('scheduleFactory');
      var schedule = $injector.get('schedule');
      scheduleListSpy = sinon.spy(schedule,'list');
      scheduleAddSpy = sinon.spy(schedule,'add');

      $modal = $injector.get('$modal');
      $rootScope = $injector.get('$rootScope');
      sinon.spy($rootScope, '$emit');
      $state = $injector.get('$state');
      onboardingFactory = $injector.get('onboardingFactory');
      blueprintFactory = $injector.get('blueprintFactory');
    });
  });

  it('should exist',function(){
    expect(scheduleFactory).to.be.truely;

    expect(scheduleFactory.schedule).to.be.truely;
    expect(scheduleFactory.loadingSchedule).to.be.false;
    expect(scheduleFactory.savingSchedule).to.be.false;
    expect(scheduleFactory.apiError).to.not.be.truely;

    expect(scheduleFactory.newSchedule).to.be.a('function');
    expect(scheduleFactory.getSchedule).to.be.a('function');
    expect(scheduleFactory.addSchedule).to.be.a('function');
    expect(scheduleFactory.updateSchedule).to.be.a('function');
    expect(scheduleFactory.deleteSchedule).to.be.a('function');
    expect(scheduleFactory.getPreviewUrl).to.be.a('function');
  });

  it('should initialize',function(){
    expect(scheduleFactory.schedule).to.deep.equal({content: [], distributeToAll: false, distribution: []});
    expect(scheduleFactory.scheduleId).to.not.be.truely;
  });

  it('newSchedule: should reset the schedule',function(){
    scheduleFactory.schedule.id = 'scheduleId';
    scheduleFactory.scheduleId = 'scheduleId';

    scheduleFactory.newSchedule();

    expect(trackerCalled).to.equal('Add Schedule');

    expect(scheduleFactory.schedule).to.deep.equal({content: [], distributeToAll: false, distribution: []});
    expect(scheduleFactory.scheduleId).to.not.be.truely;
  });

  describe('getSchedule:',function(){
    it("should get the schedule",function(done){
      scheduleFactory.getSchedule("scheduleId")
      .then(function() {
        expect(scheduleFactory.schedule).to.be.truely;
        expect(scheduleFactory.schedule.name).to.equal("some schedule");

        setTimeout(function() {
          expect(scheduleFactory.loadingSchedule).to.be.false;

          done();
        }, 10);
      })
      .then(null, function() {
        done("error");
      })
      .then(null,done);
    });

    it("should handle failure to get schedule correctly",function(done){
      updateSchedule = false;

      scheduleFactory.getSchedule()
      .then(function(result) {
        done(result);
      })
      .then(null, function() {
        expect(scheduleFactory.errorMessage).to.be.ok;
        expect(scheduleFactory.errorMessage).to.equal("Failed to get Schedule.");
        processErrorCode.should.have.been.calledWith('Schedule', 'get', sinon.match.object);
        expect(scheduleFactory.apiError).to.be.ok;

        setTimeout(function() {
          expect(scheduleFactory.loadingSchedule).to.be.false;

          done();
        }, 10);
      })
      .then(null,done);
    });
  });

  describe('addSchedule:',function(){
    it('should add the schedule',function(done){
      updateSchedule = true;

      scheduleFactory.addSchedule();

      expect(scheduleFactory.savingSchedule).to.be.true;
      expect(scheduleFactory.loadingSchedule).to.be.true;

      setTimeout(function(){
        $state.go.should.have.been.calledWith('apps.schedules.details');
        $rootScope.$emit.should.have.been.calledWith('scheduleCreated');
        expect(trackerCalled).to.equal('Schedule Created');
        expect(scheduleFactory.savingSchedule).to.be.false;
        expect(scheduleFactory.loadingSchedule).to.be.false;
        expect(scheduleFactory.errorMessage).to.not.be.ok;
        expect(scheduleFactory.apiError).to.not.be.ok;

        done();
      },10);
    });

    it('should show an error if fails to create schedule',function(done){
      updateSchedule = false;

      scheduleFactory.addSchedule();

      expect(scheduleFactory.savingSchedule).to.be.true;
      expect(scheduleFactory.loadingSchedule).to.be.true;

      setTimeout(function(){
        $state.go.should.not.have.been.called;
        $rootScope.$emit.should.not.have.been.calledWith('scheduleCreated');
        expect(trackerCalled).to.not.be.ok;
        expect(scheduleFactory.savingSchedule).to.be.false;
        expect(scheduleFactory.loadingSchedule).to.be.false;

        expect(scheduleFactory.errorMessage).to.be.ok;
        expect(scheduleFactory.apiError).to.be.ok;
        done();
      },10);
    });
  });

  describe('updateSchedule: ',function(){
    it('should update the schedule',function(done){
      updateSchedule = true;

      scheduleFactory.updateSchedule();

      expect(scheduleFactory.savingSchedule).to.be.true;
      expect(scheduleFactory.loadingSchedule).to.be.true;

      setTimeout(function(){
        expect(trackerCalled).to.equal('Schedule Updated');
        expect(scheduleFactory.savingSchedule).to.be.false;
        expect(scheduleFactory.loadingSchedule).to.be.false;
        expect(scheduleFactory.errorMessage).to.not.be.ok;
        expect(scheduleFactory.apiError).to.not.be.ok;
        done();
      },10);
    });

    it('should show an error if fails to update the schedule',function(done){
      updateSchedule = false;

      scheduleFactory.updateSchedule();

      expect(scheduleFactory.savingSchedule).to.be.true;
      expect(scheduleFactory.loadingSchedule).to.be.true;

      setTimeout(function(){
        expect(trackerCalled).to.not.be.ok;
        expect(scheduleFactory.savingSchedule).to.be.false;
        expect(scheduleFactory.loadingSchedule).to.be.false;

        expect(scheduleFactory.errorMessage).to.be.ok;
        expect(scheduleFactory.apiError).to.be.ok;
        done();
      },10);
    });
  });

  describe('deleteSchedule: ',function(){
    it('should delete the schedule',function(done){
      updateSchedule = true;

      scheduleFactory.deleteSchedule();

      expect(scheduleFactory.loadingSchedule).to.be.true;

      setTimeout(function(){
        expect(scheduleFactory.loadingSchedule).to.be.false;
        expect(scheduleFactory.errorMessage).to.not.be.ok;
        expect(scheduleFactory.apiError).to.not.be.ok;
        expect(trackerCalled).to.equal('Schedule Deleted');
        $state.go.should.have.been.calledWith('apps.schedules.list');
        done();
      },10);
    });

    it('should show an error if fails to delete the schedule',function(done){
      updateSchedule = false;

      scheduleFactory.deleteSchedule();

      expect(scheduleFactory.loadingSchedule).to.be.true;

      setTimeout(function(){
        $state.go.should.not.have.been.called;
        expect(trackerCalled).to.not.be.ok;
        expect(scheduleFactory.loadingSchedule).to.be.false;

        expect(scheduleFactory.errorMessage).to.be.ok;
        expect(scheduleFactory.apiError).to.be.ok;
        done();
      },10);
    });
  });

  it('getPreviewUrl: ', function(done) {
    expect(scheduleFactory.getPreviewUrl()).to.not.be.ok;

    scheduleFactory.getSchedule("scheduleId")
      .then(function() {
        expect(scheduleFactory.getPreviewUrl()).to.be.ok;
        expect(scheduleFactory.getPreviewUrl()).to.equal('http://rvaviewer-test.appspot.com/?type=schedule&id=scheduleId');

        done();
      })
      .then(null, function(e) {
        done(e);
      })
      .then(null,done);
  });

  describe('createFirstSchedule:', function(){
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
      returnList = {};
      scheduleFactory.createFirstSchedule(samplePresentation)
      // .then(function(){
      setTimeout(function() {
        scheduleListSpy.should.have.been.calledWith({count:1});

        scheduleAddSpy.should.have.been.calledWith(firstScheduleSample);

        $rootScope.$emit.should.have.been.calledWith('scheduleCreated');
        expect(trackerCalled).to.equal('Schedule Created');

        $state.go.should.not.have.been.called;
        $modal.open.should.have.been.called;

        expect($modal.open.getCall(0).args[0].templateUrl).to.equal('partials/schedules/auto-schedule-modal.html');
        expect($modal.open.getCall(0).args[0].controller).to.equal('AutoScheduleModalController');

        done();
      }, 100);
    });

    describe('HTML_PRESENTATION_TYPE:', function() {
      beforeEach(function() {
        samplePresentation.presentationType = 'HTML Template';
        firstScheduleSample.content[0].presentationType = 'HTML Template';

        blueprintFactory.isPlayUntilDone.returns(Q.resolve(false));
      });

      it('should set correct presentation type', function(done) {
        returnList = {};
        scheduleFactory.createFirstSchedule(samplePresentation)
        // .then(function(){
        setTimeout(function() {
          scheduleAddSpy.should.have.been.calledWith(firstScheduleSample);

          done();
        }, 100);
      });

      it('should retrieve and update playUntilDone', function(done) {
        blueprintFactory.isPlayUntilDone.returns(Q.resolve(true));
        firstScheduleSample.content[0].playUntilDone = true;

        returnList = {};
        scheduleFactory.createFirstSchedule(samplePresentation)
        // .then(function(){
        setTimeout(function() {
          scheduleAddSpy.should.have.been.calledWith(firstScheduleSample);

          done();
        }, 100);
      });

      it('should handle failure to retrieve blueprint', function(done) {
        blueprintFactory.isPlayUntilDone.returns(Q.reject());

        returnList = {};
        scheduleFactory.createFirstSchedule(samplePresentation)
        // .then(function(){
        setTimeout(function() {
          scheduleAddSpy.should.have.been.calledWith(firstScheduleSample);

          done();
        }, 100);
      });
    });

    it('should create first schedule and redirect to onboarding', function(done) {
      returnList = {};
      onboardingFactory.isTemplateOnboarding.returns(true);
      scheduleFactory.createFirstSchedule(samplePresentation)
      .then(function(){
        scheduleListSpy.should.have.been.calledWith({count:1});

        scheduleAddSpy.should.have.been.calledWith(firstScheduleSample);

        $rootScope.$emit.should.have.been.calledWith('scheduleCreated');
        expect(trackerCalled).to.equal('Schedule Created');

        $state.go.should.have.been.calledWith('apps.launcher.onboarding');
        $modal.open.should.not.have.been.called;

        done();
      });
    });

    it('should not create twice', function(done) {
      returnList = {};
      scheduleFactory.createFirstSchedule(samplePresentation)
      .then(function(){
        scheduleListSpy.should.have.been.calledWith({count:1});

        scheduleAddSpy.should.have.been.calledWith(firstScheduleSample);

        $rootScope.$emit.should.have.been.calledWith('scheduleCreated');
        expect(trackerCalled).to.equal('Schedule Created');

        scheduleFactory.createFirstSchedule(samplePresentation).then(function(){
          done("Error: schedule created again");
        },function(){
          scheduleListSpy.should.have.been.calledOnce;
          scheduleAddSpy.should.have.been.calledOnce
          done();
        });
      });
    });

    it('should handle error loading list', function(done) {
      returnList = false;
      scheduleFactory.createFirstSchedule(samplePresentation)
      .then(null,function(){
        scheduleListSpy.should.have.been.calledOnce;
        done();
      });
    });

    it('should handle error saving schedule', function(done) {
      returnList = {};
      updateSchedule = false;
      scheduleFactory.createFirstSchedule(samplePresentation)
      .then(null,function(){
        scheduleListSpy.should.have.been.calledOnce;
        done();
      });
    });

    it('should not create if already have schedules',function(done){
      returnList = { items: [{name:'schedule'}] };
      scheduleFactory.createFirstSchedule(samplePresentation)
      .then(null, function(){
        scheduleListSpy.should.have.been.calledWith({count:1});

        scheduleAddSpy.should.not.have.been.called;

        expect(trackerCalled).to.not.be.ok;

        done();
      });
    });

    it('should cache result',function(done){
      returnList = { items: [{name:'schedule'}] };
      scheduleFactory.createFirstSchedule(samplePresentation)
      .then(null, function(){
        scheduleListSpy.should.have.been.calledWith({count:1});
        scheduleAddSpy.should.not.have.been.called;
        expect(trackerCalled).to.not.be.ok;

        scheduleFactory.createFirstSchedule(samplePresentation).then(function(){
          done("Error: schedule created again");
        },function(){
          scheduleListSpy.should.have.been.calledOnce;
          scheduleAddSpy.should.not.have.been.called;
          expect(trackerCalled).to.not.be.ok;
          done();
        });
      });
    });

  });

});
