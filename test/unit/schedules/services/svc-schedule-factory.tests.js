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
        hasFreeDisplays: sinon.stub().returns(Q.resolve(true))
      };
    });
    $provide.service('plansFactory', function() {
      return {
        showLicenseRequiredToUpdateModal: sinon.stub()
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
  var scheduleFactory, trackerCalled, updateSchedule, $state, returnList, scheduleListSpy, scheduleAddSpy, processErrorCode, confirmModal;
  var $rootScope, blueprintFactory, display, plansFactory, apiError;
  beforeEach(function(){
    apiError = { message: 'ERROR; could not create schedule'};
    trackerCalled = undefined;
    updateSchedule = true;
    returnList = null;

    inject(function($injector){
      scheduleFactory = $injector.get('scheduleFactory');
      var schedule = $injector.get('schedule');
      scheduleListSpy = sinon.spy(schedule,'list');
      scheduleAddSpy = sinon.spy(schedule,'add');

      $rootScope = $injector.get('$rootScope');
      sinon.spy($rootScope, '$emit');
      $state = $injector.get('$state');
      blueprintFactory = $injector.get('blueprintFactory');
      display = $injector.get('display');
      plansFactory = $injector.get('plansFactory');
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
        expect(scheduleFactory.errorMessage).to.be.ok;
        expect(scheduleFactory.errorMessage).to.equal('Failed to get Schedule.');
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
        $state.go.should.not.have.been.called;
        $rootScope.$emit.should.have.been.calledWith('scheduleCreated');
        expect(trackerCalled).to.equal('Schedule Created');
        expect(scheduleFactory.savingSchedule).to.be.false;
        expect(scheduleFactory.loadingSchedule).to.be.false;
        expect(scheduleFactory.errorMessage).to.not.be.ok;
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

        expect(scheduleFactory.errorMessage).to.be.ok;
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

    it('should check if distrubuted to free displays and show notice if true',function(done){
      updateSchedule = true;
      scheduleFactory.schedule.distribution = ['display1'];

      scheduleFactory.addSchedule();

      display.hasFreeDisplays.should.have.been.calledWith('companyId',['display1']);
      expect(scheduleFactory.savingSchedule).to.be.true;

      setTimeout(function(){
        plansFactory.showLicenseRequiredToUpdateModal.should.have.been.called;
        
        expect(scheduleFactory.savingSchedule).to.be.false;
        done();
      },10);
    });

    it('should check if distrubuted to free displays and do not show notice if false',function(done){
      updateSchedule = true;
      display.hasFreeDisplays.returns(Q.resolve(false));

      scheduleFactory.addSchedule();

      display.hasFreeDisplays.should.have.been.called;
      setTimeout(function(){
        plansFactory.showLicenseRequiredToUpdateModal.should.not.have.been.called;
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

    it('should prompt to reassign displays in case of distribution conflict', function(done) {
      updateSchedule = false;
      apiError = { code: 409 };

      scheduleFactory.updateSchedule();

      setTimeout(function(){
        confirmModal.should.have.been.calledWith('The selected displays already have schedules.');
        done();
      },10);
    });

    it('should check if distrubuted to free displays and show notice if true',function(done){
      updateSchedule = true;
      scheduleFactory.schedule.distribution = ['display1'];

      scheduleFactory.updateSchedule();

      display.hasFreeDisplays.should.have.been.calledWith('companyId',['display1']);
      expect(scheduleFactory.savingSchedule).to.be.true;

      setTimeout(function(){
        plansFactory.showLicenseRequiredToUpdateModal.should.have.been.called;
        
        expect(scheduleFactory.savingSchedule).to.be.false;
        done();
      },10);
    });

    it('should check if distrubuted to free displays and do not show notice if false',function(done){
      updateSchedule = true;
      display.hasFreeDisplays.returns(Q.resolve(false));

      scheduleFactory.updateSchedule();

      display.hasFreeDisplays.should.have.been.called;
      setTimeout(function(){
        plansFactory.showLicenseRequiredToUpdateModal.should.not.have.been.called;
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

});
