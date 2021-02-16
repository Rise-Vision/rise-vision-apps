'use strict';

describe('app:', function() {
  beforeEach(function () {
      angular.module('risevision.apps.partials',[]);

      module('risevision.apps');

      module(function ($provide) {
        $provide.service('canAccessApps',function(){
          return sinon.spy(function() {
            return Q.resolve("auth");
          })
        });

        $provide.service('scheduleFactory',function(){
          return {
            newSchedule: sinon.spy()
          }
        });

        $provide.service('playlistFactory',function(){
          return {
            addPresentationItem: sinon.spy()
          };
        });

      });

      inject(function ($injector) {
        $state = $injector.get('$state');
        canAccessApps = $injector.get('canAccessApps');
        scheduleFactory = $injector.get('scheduleFactory');
        playlistFactory = $injector.get('playlistFactory');
      });
  });

  var $state, canAccessApps, scheduleFactory, playlistFactory;

  describe('state apps.schedules.add:',function(){

    it('should register state',function(){
      var state = $state.get('apps.schedules.add');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/schedules/add');
      expect(state.controller).to.be.ok;
      expect(state.params).to.deep.equal({
        presentationItem: null
      });
    });

    it('should add new schedule',function(done){
      $state.get('apps.schedules.add').resolve.scheduleInfo[4]({}, canAccessApps, scheduleFactory, playlistFactory);
      setTimeout(function() {
        canAccessApps.should.have.been.called;

        scheduleFactory.newSchedule.should.have.been.called;
        playlistFactory.addPresentationItem.should.not.have.been.called;

        done();
      }, 10);
    });

    it('should add new schedule with a presentation item',function(done){
      $state.get('apps.schedules.add').resolve.scheduleInfo[4]({presentationItem: 'item'}, canAccessApps, scheduleFactory, playlistFactory);
      setTimeout(function() {
        canAccessApps.should.have.been.called;

        scheduleFactory.newSchedule.should.have.been.called;
        playlistFactory.addPresentationItem.should.have.been.calledWith('item');

        done();
      }, 10);
    });
  });

});
