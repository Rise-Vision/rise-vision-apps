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

        $provide.service('displayFactory',function(){
          return {
            newDisplay: sinon.spy(),
            setAssignedSchedule: sinon.spy()
          }
        });

        $provide.service('screenshotFactory',function(){
          return {
            screenshot: 'old screenshot'
          }
        });

      });

      inject(function ($injector) {
        $state = $injector.get('$state');
        userState = $injector.get('userState');
        displayFactory = $injector.get('displayFactory');
        screenshotFactory = $injector.get('screenshotFactory');
        canAccessApps = $injector.get('canAccessApps');

        sinon.stub($state, 'go');

        sinon.stub(userState, 'getSelectedCompanyId').returns('id');
        sinon.stub(userState, 'switchCompany').returns(Q.resolve());

      });
  });

  var $state, userState, displayFactory, screenshotFactory, canAccessApps;

  describe('state apps.displays.change:',function(){

    it('should register state',function(){
      var state = $state.get('apps.displays.change');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/displays/change/:displayId/:companyId');
      expect(state.controller).to.be.ok;
    });

    it('should navigate the display page',function(done){
      $state.get('apps.displays.change').controller[4](canAccessApps, userState, {displayId: 'displayId', companyId: 'id'}, $state);
      setTimeout(function() {
        canAccessApps.should.have.been.called;

        userState.switchCompany.should.not.have.been.called;

        $state.go.should.have.been.calledWith('apps.displays.details', {
          displayId: 'displayId',
          cid: 'id'
        }, {
          location: true
        });

        done();
      }, 10);
    });

    it('should change company if ids dont match',function(done){
      $state.get('apps.displays.change').controller[4](canAccessApps, userState, {displayId: 'displayId', companyId: 'otherId'}, $state);
      setTimeout(function() {
        canAccessApps.should.have.been.called;

        userState.switchCompany.should.have.been.calledWith('otherId');

        $state.go.should.have.been.calledWith('apps.displays.details', {
          displayId: 'displayId',
          cid: 'otherId'
        }, {
          location: 'replace'
        });

        done();
      }, 10);
    });
  });

  describe('state apps.displays.add:',function(){

    it('should register state',function(){
      var state = $state.get('apps.displays.add');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/displays/add');
      expect(state.controller).to.be.ok;
      expect(state.params).to.deep.equal({
        schedule: null
      });
    });

    it('should add new schedule',function(done){
      $state.get('apps.displays.add').resolve.scheduleInfo[4]({}, canAccessApps, displayFactory, screenshotFactory);
      setTimeout(function() {
        canAccessApps.should.have.been.called;

        expect(screenshotFactory.screenshot).to.not.be.ok;

        displayFactory.newDisplay.should.have.been.called;
        displayFactory.setAssignedSchedule.should.not.have.been.called;

        done();
      }, 10);
    });

    it('should add new schedule with a presentation item',function(done){
      $state.get('apps.displays.add').resolve.scheduleInfo[4]({schedule: 'item'}, canAccessApps, displayFactory, screenshotFactory);
      setTimeout(function() {
        canAccessApps.should.have.been.called;

        expect(screenshotFactory.screenshot).to.not.be.ok;

        displayFactory.newDisplay.should.have.been.called;
        displayFactory.setAssignedSchedule.should.have.been.calledWith('item');

        done();
      }, 10);
    });
  });

});
