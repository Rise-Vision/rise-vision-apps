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

      });

      inject(function ($injector) {
        $state = $injector.get('$state');
        $location = $injector.get('$location');
        userState = $injector.get('userState');
        canAccessApps = $injector.get('canAccessApps');

        sinon.stub($state, 'go');
        sinon.stub($location, 'replace');

        sinon.stub(userState, 'getSelectedCompanyId').returns('id');
        sinon.stub(userState, 'switchCompany').returns(Q.resolve());

      });
  });

  var $state, $location, userState, canAccessApps;

  describe('state apps.displays.change:',function(){

    it('should register state',function(){
      var state = $state.get('apps.displays.change');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/displays/change/:displayId/:companyId');
      expect(state.controller).to.be.ok;
    });

    it('should navigate the display page',function(done){
      $state.get('apps.displays.change').controller[5](canAccessApps, userState, {displayId: 'displayId', companyId: 'id'}, $state, $location);
      setTimeout(function() {
        canAccessApps.should.have.been.called;

        $location.replace.should.not.have.been.called;
        userState.switchCompany.should.not.have.been.called;

        $state.go.should.have.been.calledWith('apps.displays.details', {
          displayId: 'displayId'
        });

        done();
      }, 10);
    });

    it('should change company if ids dont match',function(done){
      $state.get('apps.displays.change').controller[5](canAccessApps, userState, {displayId: 'displayId', companyId: 'otherId'}, $state, $location);
      setTimeout(function() {
        canAccessApps.should.have.been.called;

        $location.replace.should.have.been.called;
        userState.switchCompany.should.have.been.calledWith('otherId');

        $state.go.should.have.been.calledWith('apps.displays.details', {
          displayId: 'displayId'
        });

        done();
      }, 10);
    });
  });

});
