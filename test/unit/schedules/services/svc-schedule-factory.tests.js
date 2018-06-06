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
        go : function(state, params){
          if (state){
            currentState = state;
          }
          return currentState;
        }
      }
    });
    $provide.service('processErrorCode', function() {
      return processErrorCode = sinon.spy(function() { return 'error'; });
    });
    $provide.value('VIEWER_URL', 'http://rvaviewer-test.appspot.com');

  }));
  var scheduleFactory, trackerCalled, updateSchedule, currentState, returnList, scheduleListSpy, scheduleAddSpy, processErrorCode;
  beforeEach(function(){
    trackerCalled = undefined;
    currentState = undefined;
    updateSchedule = true;
    returnList = null;

    inject(function($injector){
      scheduleFactory = $injector.get('scheduleFactory');
      var schedule = $injector.get('schedule');
      scheduleListSpy = sinon.spy(schedule,'list');
      scheduleAddSpy = sinon.spy(schedule,'add');
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
        expect(currentState).to.equal('apps.schedules.details');
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
        expect(currentState).to.be.empty;
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
        expect(currentState).to.equal('apps.schedules.list');
        done();
      },10);
    });

    it('should show an error if fails to delete the schedule',function(done){
      updateSchedule = false;

      scheduleFactory.deleteSchedule();

      expect(scheduleFactory.loadingSchedule).to.be.true;

      setTimeout(function(){
        expect(currentState).to.be.empty;
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
    var firstScheduleSample = {
      name: 'All Displays - 24/7',
      content: [{
        name: 'presentationName',
        objectReference: 'presentationId',
        duration: 10,
        timeDefined: false,
        type: 'presentation'
      }],
      distributeToAll: true,
      timeDefined: false
    };

    it('should create first schedule', function(done) {
      returnList = {};
      scheduleFactory.createFirstSchedule('presentationId','presentationName')
      .then(function(){
        scheduleListSpy.should.have.been.calledWith({count:1});

        scheduleAddSpy.should.have.been.calledWith(firstScheduleSample);

        expect(trackerCalled).to.equal('Schedule Created');

        done();
      });
    });

    it('should not create twice', function(done) {
      returnList = {};
      scheduleFactory.createFirstSchedule('presentationId','presentationName')
      .then(function(){
        scheduleListSpy.should.have.been.calledWith({count:1});

        scheduleAddSpy.should.have.been.calledWith(firstScheduleSample);

        expect(trackerCalled).to.equal('Schedule Created');

        scheduleFactory.createFirstSchedule('presentationId','presentationName').then(function(){
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
      scheduleFactory.createFirstSchedule('presentationId','presentationName')
      .then(null,function(){
        scheduleListSpy.should.have.been.calledOnce;
        done();
      });
    });

    it('should handle error saving schedule', function(done) {
      returnList = {};
      updateSchedule = false;
      scheduleFactory.createFirstSchedule('presentationId','presentationName')
      .then(null,function(){
        scheduleListSpy.should.have.been.calledOnce;
        done();
      });
    });

    it('should not create if already have schedules',function(done){
      returnList = { items: [{name:'schedule'}] };
      scheduleFactory.createFirstSchedule('presentationId','presentationName')
      .then(null, function(){
        scheduleListSpy.should.have.been.calledWith({count:1});

        scheduleAddSpy.should.not.have.been.called;

        expect(trackerCalled).to.not.be.ok;

        done();
      });
    });

    it('should cache result',function(done){
      returnList = { items: [{name:'schedule'}] };
      scheduleFactory.createFirstSchedule('presentationId','presentationName')
      .then(null, function(){
        scheduleListSpy.should.have.been.calledWith({count:1});
        scheduleAddSpy.should.not.have.been.called;
        expect(trackerCalled).to.not.be.ok;

        scheduleFactory.createFirstSchedule('presentationId','presentationName').then(function(){
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
