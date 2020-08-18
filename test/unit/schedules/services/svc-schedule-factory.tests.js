'use strict';

describe('service: scheduleFactory:', function() {
  beforeEach(module('risevision.schedules.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('schedule',function () {
      return {
        _schedule: {
          id: 'scheduleId',
          name: 'some schedule'
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
            deferred.reject({result: {error: apiError}});
          }
          return deferred.promise;
        },
        update : function(schedule){
          var deferred = Q.defer();
          if(updateSchedule){
            deferred.resolve({item: {
              name: 'Updated Schedule'
            }});
          }else{
            deferred.reject({result: {error: apiError}});
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
        go : sinon.stub(),
        current: {}
      }
    });
    $provide.service('blueprintFactory', function() {
      return {
        isPlayUntilDone: sinon.stub()
      };
    });
    $provide.service('processErrorCode', function() {
      return processErrorCode = sinon.spy(function() { return 'error'; });
    });
    $provide.service('display', function() {
      return {
        hasFreeDisplays: sinon.stub().returns(Q.resolve(['freeDisplay']))
      };
    });
    $provide.service('userState', function() {
      return {
        getSelectedCompanyId: sinon.stub().returns('companyId'),
        getUsername: sinon.stub().returns('username'),
        _restoreState: sinon.stub()
      };
    });
    $provide.service('confirmModal', function() {
      return confirmModal = sinon.stub();
    });
  }));
  var scheduleFactory, trackerCalled, updateSchedule, $state, returnList, scheduleListSpy,
  scheduleUpdateSpy, processErrorCode, confirmModal;
  var $rootScope, blueprintFactory, display, apiError;
  beforeEach(function(){
    apiError = { message: 'ERROR; could not create schedule'};
    trackerCalled = undefined;
    updateSchedule = true;
    returnList = null;

    inject(function($injector){
      scheduleFactory = $injector.get('scheduleFactory');
      var schedule = $injector.get('schedule');
      scheduleListSpy = sinon.spy(schedule,'list');
      scheduleUpdateSpy = sinon.spy(schedule,'update');

      $rootScope = $injector.get('$rootScope');
      sinon.spy($rootScope, '$emit');
      $state = $injector.get('$state');
      blueprintFactory = $injector.get('blueprintFactory');
      display = $injector.get('display');
    });
  });

  it('should exist',function(){
    expect(scheduleFactory).to.be.ok;

    expect(scheduleFactory.schedule).to.be.ok;
    expect(scheduleFactory.loadingSchedule).to.be.false;
    expect(scheduleFactory.savingSchedule).to.be.false;
    expect(scheduleFactory.apiError).to.not.be.ok;

    expect(scheduleFactory.newSchedule).to.be.a('function');
    expect(scheduleFactory.getSchedule).to.be.a('function');
    expect(scheduleFactory.addSchedule).to.be.a('function');
    expect(scheduleFactory.updateSchedule).to.be.a('function');
    expect(scheduleFactory.deleteSchedule).to.be.a('function');
  });

  it('should initialize',function(){
    expect(scheduleFactory.schedule).to.deep.equal({name: 'New Schedule', companyId: 'companyId',content: [], distributeToAll: false, distribution: [], timeDefined: false});
  });

  describe('newSchedule:', function() {
    it('should reset the schedule',function(){
      scheduleFactory.schedule.id = 'scheduleId';

      scheduleFactory.newSchedule();

      expect(trackerCalled).to.equal('Add Schedule');

      expect(scheduleFactory.schedule).to.deep.equal({name: 'New Schedule', companyId: 'companyId', content: [], distributeToAll: false, distribution: [], timeDefined: false});
    });

    it('should not call tracker if param is true',function(){
      scheduleFactory.newSchedule(true);

      expect(trackerCalled).to.not.be.ok;
    });
    
  });

  describe('getSchedule:',function(){
    it('should get the schedule',function(done){
      scheduleFactory.getSchedule('scheduleId')
      .then(function() {
        expect(scheduleFactory.schedule).to.be.ok;
        expect(scheduleFactory.schedule.name).to.equal('some schedule');

        setTimeout(function() {
          expect(scheduleFactory.loadingSchedule).to.be.false;

          done();
        }, 10);
      })
      .then(null, function() {
        done('error');
      })
      .then(null,done);
    });

    it('should handle failure to get schedule correctly',function(done){
      updateSchedule = false;

      scheduleFactory.getSchedule()
      .then(function(result) {
        done(result);
      })
      .then(null, function() {
        processErrorCode.should.have.been.calledWith(sinon.match.object);
        expect(scheduleFactory.apiError).to.be.ok;

        setTimeout(function() {
          expect(scheduleFactory.loadingSchedule).to.be.false;

          done();
        }, 10);
      })
      .then(null,done);
    });

  });

  describe('hasFreeDisplays:', function() {
    it('should return true if distributed to free displays',function(done){
      scheduleFactory.schedule.distribution = ['display1'];

      scheduleFactory.hasFreeDisplays()
        .then(function(result) {
          expect(result).to.deep.equal(['freeDisplay']);

          done();
        });

      display.hasFreeDisplays.should.have.been.calledWith('companyId',['display1']);
    });

    it('should return false if distributed to licensed displays',function(done){
      scheduleFactory.schedule.distribution = ['display1'];

      display.hasFreeDisplays.returns(Q.resolve([]));

      scheduleFactory.hasFreeDisplays()
        .then(function(result) {
          expect(result).to.deep.equal([]);

          done();
        });

      display.hasFreeDisplays.should.have.been.called;
    });

    it('should check if distrubuted to all displays',function(){
      scheduleFactory.schedule.distributeToAll = true;

      scheduleFactory.hasFreeDisplays();

      display.hasFreeDisplays.should.have.been.calledWith('companyId', null);
    });

    it('should not check if distrubuted to free displays and do not show notice if false',function(done){
      scheduleFactory.schedule.distributeToAll = false;
      scheduleFactory.schedule.distribution = [];

      scheduleFactory.hasFreeDisplays()
        .then(function(result) {
          expect(result).to.deep.equal([]);

          done();
        });

      display.hasFreeDisplays.should.not.have.been.called;
    });

  });

  describe('addSchedule:',function(){
    it('should add the schedule',function(done){
      updateSchedule = true;

      scheduleFactory.addSchedule();

      expect(scheduleFactory.savingSchedule).to.be.true;
      expect(scheduleFactory.loadingSchedule).to.be.true;

      setTimeout(function(){
        $state.go.should.not.have.been.called;
        $rootScope.$emit.should.have.been.calledWith('scheduleCreated');
        expect(trackerCalled).to.equal('Schedule Created');
        expect(scheduleFactory.savingSchedule).to.be.false;
        expect(scheduleFactory.loadingSchedule).to.be.false;
        expect(scheduleFactory.apiError).to.not.be.ok;

        done();
      },10);
    });

    it('should only redirect from apps.schedules.add',function(done){
      $state.current.name = 'apps.schedules.add';
      updateSchedule = true;

      scheduleFactory.addSchedule();

      setTimeout(function(){
        $state.go.should.have.been.calledWith('apps.schedules.details');

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

        expect(scheduleFactory.apiError).to.be.ok;
        done();
      },10);
    });

    it('should prompt to reassign displays in case of distribution conflict', function(done) {
      updateSchedule = false;
      apiError = { code: 409 };

      scheduleFactory.addSchedule();

      setTimeout(function(){
        confirmModal.should.have.been.calledWith('The selected displays already have schedules.');
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
        expect(scheduleFactory.schedule.name).to.equal('Updated Schedule');

        expect(trackerCalled).to.equal('Schedule Updated');
        expect(scheduleFactory.savingSchedule).to.be.false;
        expect(scheduleFactory.loadingSchedule).to.be.false;
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

        expect(scheduleFactory.apiError).to.be.ok;
        done();
      },10);
    });

    it('should prompt to reassign displays in case of distribution conflict', function(done) {
      updateSchedule = false;
      apiError = { code: 409 };

      scheduleFactory.updateSchedule();

      setTimeout(function(){
        confirmModal.should.have.been.calledWith('The selected displays already have schedules.');
        done();
      },10);
    });

  });

  describe('forceUpdateSchedule: ',function(){
    it('should update the schedule with forceDistribution param',function(done){
      updateSchedule = true;

      scheduleFactory.schedule = {
        id: 'scheduleId',
        name: 'scheduleName'
      };

      scheduleFactory.forceUpdateSchedule();

      scheduleUpdateSpy.should.have.been.calledWith(scheduleFactory.schedule.id,scheduleFactory.schedule, true);

      expect(scheduleFactory.savingSchedule).to.be.true;
      expect(scheduleFactory.loadingSchedule).to.be.true;

      setTimeout(function(){

        expect(scheduleFactory.schedule.name).to.equal('Updated Schedule');

        expect(trackerCalled).to.equal('Schedule Updated');
        expect(scheduleFactory.savingSchedule).to.be.false;
        expect(scheduleFactory.loadingSchedule).to.be.false;
        expect(scheduleFactory.apiError).to.not.be.ok;
        done();
      },10);
    });  

    it('should show an error if fails to update the schedule',function(done){
      updateSchedule = false;

      scheduleFactory.forceUpdateSchedule();

      expect(scheduleFactory.savingSchedule).to.be.true;
      expect(scheduleFactory.loadingSchedule).to.be.true;

      setTimeout(function(){
        expect(trackerCalled).to.not.be.ok;
        expect(scheduleFactory.savingSchedule).to.be.false;
        expect(scheduleFactory.loadingSchedule).to.be.false;

        expect(scheduleFactory.apiError).to.be.ok;
        done();
      },10);
    });

    it('should update the provided schedule if present',function(){
      updateSchedule = true;
      scheduleFactory.schedule = {
        id: 'scheduleId',
        name: 'scheduleName'
      };
      var providedSchedule = {
        id: 'providedScheduleId',
        name: 'providedScheduleName'
      };

      scheduleFactory.forceUpdateSchedule(providedSchedule);

      scheduleUpdateSpy.should.have.been.calledWith(providedSchedule.id,providedSchedule, true);      
    });
  });

  describe('deleteSchedule: ',function(){
    it('should delete the schedule',function(done){
      updateSchedule = true;

      scheduleFactory.deleteSchedule();

      expect(scheduleFactory.loadingSchedule).to.be.true;

      setTimeout(function(){
        expect(scheduleFactory.loadingSchedule).to.be.false;
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

        expect(scheduleFactory.apiError).to.be.ok;
        done();
      },10);
    });
  });

  describe('checkFirstSchedule:', function(){

    it('should check first schedule', function(done) {
      returnList = {};
      scheduleFactory.checkFirstSchedule()
        .then(function(){
          scheduleListSpy.should.have.been.calledWith({count:1});

          done();
        });
    });

    it('should reject (schedule exists) after Get', function(done) {
      updateSchedule = true;

      scheduleFactory.getSchedule()
        .then(function() {
          scheduleFactory.checkFirstSchedule()
            .catch(function(){
              scheduleListSpy.should.not.have.been.called;

              done();
            });
        });
    });

    it('should reject (schedule exists) after Add', function(done) {
      updateSchedule = true;

      scheduleFactory.addSchedule()
        .then(function() {
          scheduleFactory.checkFirstSchedule()
            .catch(function(){
              scheduleListSpy.should.not.have.been.called;

              done();
            });
        });
    });

    it('should get list after Delete', function(done) {
      updateSchedule = true;
      returnList = {};

      // Add first
      scheduleFactory.addSchedule()
        .then(function() {
          // Delete second
          scheduleFactory.deleteSchedule()
            .then(function() {
              scheduleFactory.checkFirstSchedule()
                .then(function(){
                  scheduleListSpy.should.have.been.called;

                  done();
                });              
            });
        });
    });

    it('should reset after selectedCompanyChanged',function(done){
      returnList = { items: [{name:'schedule'}] };
      scheduleFactory.checkFirstSchedule()
      .then(null, function(){
        scheduleListSpy.should.have.been.calledWith({count:1});

        $rootScope.$broadcast('risevision.company.selectedCompanyChanged');
        $rootScope.$digest();

        returnList = {};

        scheduleFactory.checkFirstSchedule()
          .then(function(){
            scheduleListSpy.should.have.been.calledTwice;

            done();
          });
      });
    });

    it('should handle error loading list', function(done) {
      returnList = false;
      scheduleFactory.checkFirstSchedule()
      .then(null,function(){
        scheduleListSpy.should.have.been.calledOnce;
        done();
      });
    });

    it('should not create if already have schedules',function(done){
      returnList = { items: [{name:'schedule'}] };
      scheduleFactory.checkFirstSchedule()
      .then(null, function(){
        scheduleListSpy.should.have.been.calledWith({count:1});

        done();
      });
    });
  });

  describe('addToDistribution:', function() {
    beforeEach(function() {
      sinon.spy(scheduleFactory,'forceUpdateSchedule');
    });

    afterEach(function() {
      scheduleFactory.forceUpdateSchedule.restore();
    })

    it('should add display to distribution and force update schedule', function(done) {
      var display = { id: 'displayId' };
      var schedule = { id: 'scheduleId', name: 'scheduleName' };

      scheduleFactory.addToDistribution(display, schedule)
      setTimeout(function() {
        expect(schedule.distribution).to.deep.equal(['displayId']);

        expect(display.scheduleId).to.equal('scheduleId');
        expect(display.scheduleName).to.equal('scheduleName');

        scheduleFactory.forceUpdateSchedule.should.have.been.calledWith(schedule);
        done();
      },10);
    });

    it('should not update if display is already assigned to the schedule', function(done) {
      var display = { id: 'displayId', scheduleId: 'scheduleId' };
      var schedule = { id: 'scheduleId' };

      scheduleFactory.addToDistribution(display, schedule)
      setTimeout(function() {
        scheduleFactory.forceUpdateSchedule.should.not.have.been.called;
        done();
      },10);
    });

    it('should not add the display to distribution twice', function(done) {
      var display = { id: 'displayId' };
      var schedule = {
        id: 'scheduleId', 
        name: 'scheduleName',
        distribution: ['displayId']
      };

      scheduleFactory.addToDistribution(display, schedule)
      setTimeout(function() {
        expect(schedule.distribution).to.deep.equal(['displayId']);

        expect(display.scheduleId).to.equal('scheduleId');
        expect(display.scheduleName).to.equal('scheduleName');

        scheduleFactory.forceUpdateSchedule.should.have.been.calledWith(schedule);
        done();
      },10);
    });
  });

  describe('requiresLicense:', function() {
    it('should require license if schedule has presentations', function() {
      var schedule = {
        content: [{type:'presentation'}]
      };
      expect(scheduleFactory.requiresLicense(schedule)).to.be.true;

      schedule = {
        content: [
          {type:'url'},
          {type:'presentation', presentationType:'HTML Template'}
        ]
      };
      expect(scheduleFactory.requiresLicense(schedule)).to.be.true;
    });

    it('should not require license if schedule has only url items', function() {
      var schedule = {
        content: [{type:'url'}]
      };
      expect(scheduleFactory.requiresLicense(schedule)).to.be.false;
    });

    it('should not require license if schedule content is empty or null', function() {
      var schedule = {
        content: []
      };
      expect(scheduleFactory.requiresLicense(schedule)).to.be.false;

      schedule = {
        content: undefined
      };
      expect(scheduleFactory.requiresLicense(schedule)).to.be.false;
    });
  });

});
