'use strict';

describe('app:', function() {
  beforeEach(function () {
    angular.module('risevision.apps.partials',[]);

    module('risevision.apps');

    module(function ($provide) {
      $provide.service('canAccessApps',function(){
        return sinon.stub().returns(Q.resolve("auth"));
      });

      $provide.service('$modal', function() {
        return {
          open: sinon.stub().returns({result: Q.defer().promise})
        }
      });

      $provide.service('$modalStack', function() {
        return {
          dismissAll: sinon.spy()
        }
      });

      $provide.service('userState', function() {
        return {
          getSelectedCompanyId: sinon.stub().returns('selectedCompanyId'),
          isRiseVisionUser: sinon.stub().returns(true),
          _restoreState: function() {}
        }
      });

      $provide.value('$exceptionHandler', sinon.stub());
    });

    inject(function ($injector) {
      $state = $injector.get('$state');
      canAccessApps = $injector.get('canAccessApps');
      userState = $injector.get('userState');
      $rootScope = $injector.get('$rootScope');
      $location = $injector.get('$location');
      $modal = $injector.get('$modal');
      $modalStack = $injector.get('$modalStack');
      $exceptionHandler = $injector.get('$exceptionHandler');
    });
  });

  var $state, canAccessApps, userState, $rootScope, $location, $modal, $modalStack, $exceptionHandler;

  it('$stateChangeError:', function() {
    $rootScope.$broadcast('$stateChangeError', '', '', '', '', 'error');

    $exceptionHandler.should.have.been.calledWith('error', 'UI Router Error.', true);
  });

  describe('dismiss modals:',function(){
    it('should close any open and rendered modals when changing state', function() {
      $rootScope.$broadcast('$stateChangeStart');

      $modalStack.dismissAll.should.have.been.called;
    });

    it('should not close if the user is not registered', function() {
      userState.isRiseVisionUser.returns(false);

      $rootScope.$broadcast('$stateChangeStart');

      $modalStack.dismissAll.should.not.have.been.called;
    });

    it('should not close if the add user modal is open', function(done) {
      $state.go('apps.users.add');
      $rootScope.$digest();

      setTimeout(function() {
        canAccessApps.should.have.been.called;
        $modal.open.should.have.been.called;

        $modalStack.dismissAll.reset();
        $rootScope.$broadcast('$stateChangeStart');

        $modalStack.dismissAll.should.not.have.been.called;

        done();
      }, 10);
    });

    it('should close modals again after user add modal was closed', function(done) {
      $modal.open.returns({result: Q.resolve()});

      $state.go('apps.users.add');
      $rootScope.$digest();

      setTimeout(function() {
        canAccessApps.should.have.been.called;
        $modal.open.should.have.been.called;

        $modalStack.dismissAll.reset();
        $rootScope.$broadcast('$stateChangeStart');

        $modalStack.dismissAll.should.have.been.called;

        done();
      }, 10);

    });
  });
  
  describe('state apps.users.add:',function(){
    it('should register parent',function(){
      var state = $state.get('apps.users');
      expect(state).to.be.ok;
      expect(state.abstract).to.be.true;
      expect(state.template).to.equal('<div ui-view></div>');
    });

    it('should register state',function(){
      var state = $state.get('apps.users.add');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/users/add');
      expect(state.controller).to.be.ok;
    });

    it('should redirect to home',function(done){
      sinon.spy($state,'go');
      
      $state.get('apps.users.add').controller[1]($state);
      setTimeout(function() {
        $state.go.should.have.been.calledWith('apps.home', null, {
          location: 'replace'
        });

        done();
      }, 10);
    });

    it('should check next state and show add user modal', function(done) {
      $state.go('apps.users.add');
      $rootScope.$digest();

      setTimeout(function() {
        canAccessApps.should.have.been.called;

        $modal.open.should.have.been.calledWith({
          templateUrl: 'partials/common-header/user-settings-modal.html',
          controller: 'AddUserModalCtrl',
          resolve: sinon.match.object
        });
        expect($modal.open.getCall(0).args[0].resolve.companyId()).to.equal('selectedCompanyId');

        done();
      }, 10);
    });

  });

  it('state apps.home:',function(){
    var state = $state.get('apps.home');
    expect(state).to.be.ok;
    expect(state.url).to.equal('/');
    expect(state.redirectTo).to.equal('apps.editor.home');
  });

  describe('state common.auth.signup:',function(){
    it('should register state',function(){
      var state = $state.get('common.auth.signup');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/signup');
      expect(state.controller).to.be.ok;
    });

    it('should show purchase options for /signup?show_product=true', function(done) {
      var $location = {
        search: sinon.stub().returns({
          show_product: true
        }),
        replace: sinon.spy()
      };
      sinon.spy($state,'go');
      $state.get('common.auth.signup').controller[3]($location, $state, canAccessApps);
      $rootScope.$digest();

      canAccessApps.should.have.been.calledWith(true);

      setTimeout(function() {
        $location.replace.should.have.been.called;
        expect($state.go).to.have.been.calledWith('apps.purchase.plans');

        done();
      }, 10);

    });

    it('should redirect to home', function(done){
      var $location = {
        search: sinon.stub().returns({}),
        replace: sinon.spy()
      };
      sinon.spy($state,'go');
      $state.get('common.auth.signup').controller[3]($location, $state, canAccessApps);
      $rootScope.$digest();

      canAccessApps.should.have.been.calledWith(true);

      setTimeout(function() {
        $location.replace.should.have.been.called;
        $state.go.should.have.been.calledWith('apps.home');

        done();
      }, 10);
    });

  });

  describe('state common.auth.signin:',function(){
    it('should register state',function(){
      var state = $state.get('common.auth.signin');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/signin');
      expect(state.controller).to.be.ok;
    });

    it('should redirect to home',function(done){
      sinon.spy($state,'go');

      $state.get('common.auth.signin').controller[2]($state, canAccessApps);
      setTimeout(function() {
        $state.go.should.have.been.calledWith('apps.home', null, {
          location: 'replace'
        });

        done();
      }, 10);
    });

    it('should not redirect to home if not signed in',function(done){
      canAccessApps.returns(Q.reject());

      sinon.spy($state,'go');

      $state.get('common.auth.signin').controller[2]($state, canAccessApps);
      setTimeout(function() {
        $state.go.should.not.have.been.called;

        done();
      }, 10);
    });
  });

  describe('showWhiteBackground:', function(){
    beforeEach(function() {
      $rootScope.$digest();
    });

    it('should show white background for the Schedule page page',function() {
      $rootScope.$broadcast('$stateChangeSuccess', {name:'apps.schedules.details'});
      expect($rootScope.showWhiteBackground).to.be.true;
    });

    it('should not show white background for other pages',function() {
      $rootScope.$broadcast('$stateChangeSuccess', {name:'apps.storage.home'});
      expect($rootScope.showWhiteBackground).to.be.false;
    });

  });

});
