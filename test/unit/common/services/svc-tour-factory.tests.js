'use strict';
describe('service: tourFactory:', function() {
  beforeEach(module('risevision.apps.services'));
  var tourFactory, $sessionStorage, userState, updateUser;
  beforeEach(function(){
    module(function ($provide) {
      $provide.value('$sessionStorage', {});

      $provide.service('userState',function(){
        return {
          getCopyOfProfile: sinon.stub(),
          _restoreState: function(){},
          getUsername: sinon.stub().returns('username'),
          updateUserProfile: sinon.stub()
        }
      });

      $provide.service('updateUser', function() {
        return sinon.stub().returns(Q.resolve({
          item: 'userProfile'
        }));
      });
    });

    inject(function($injector) {
      tourFactory = $injector.get('tourFactory');
      $sessionStorage = $injector.get('$sessionStorage');
      userState = $injector.get('userState');
      updateUser = $injector.get('updateUser');
    });
  });

  it('should exist',function(){
    expect(tourFactory).to.be.ok;
    expect(tourFactory.isShowing).to.be.ok;
    expect(tourFactory.dismissed).to.be.a('function');
  });

  describe('isShowing:', function() {
    it('should check session storage if the tour was seen',function(){
      $sessionStorage.tooltipKeySeen = true;

      expect(tourFactory.isShowing('tooltipKey')).to.be.false;

      userState.getCopyOfProfile.should.not.have.been.called;
      updateUser.should.not.have.been.called;
    });

    it('should check how many times the tour was seen',function(){
      $sessionStorage.tooltipKeySeen = false;
      userState.getCopyOfProfile.returns({
        settings: {
          tooltipKeySeen: '6'
        }
      });

      expect(tourFactory.isShowing('tooltipKey')).to.be.false;

      userState.getCopyOfProfile.should.have.been.called;
      updateUser.should.not.have.been.called;
    });

    it('should show and initialize the number of times the tour was seen',function(){
      $sessionStorage.tooltipKeySeen = false;
      userState.getCopyOfProfile.returns({
        settings: {}
      });

      expect(tourFactory.isShowing('tooltipKey')).to.be.true;

      userState.getCopyOfProfile.should.have.been.called;
      updateUser.should.have.been.calledWith('username', {
        settings: {
          tooltipKeySeen: 1
        }
      });
    });

    it('should show and increment the number of times the tour was seen',function(){
      $sessionStorage.tooltipKeySeen = false;
      userState.getCopyOfProfile.returns({
        settings: {
          tooltipKeySeen: '2'
        }
      });

      expect(tourFactory.isShowing('tooltipKey')).to.be.true;

      userState.getCopyOfProfile.should.have.been.called;
      updateUser.should.have.been.calledWith('username', {
        settings: {
          tooltipKeySeen: 3
        }
      });
    });

    it('should handle NaN when parsing',function(){
      $sessionStorage.tooltipKeySeen = false;
      userState.getCopyOfProfile.returns({
        settings: {
          tooltipKeySeen: 'two'
        }
      });

      expect(tourFactory.isShowing('tooltipKey')).to.be.true;

      userState.getCopyOfProfile.should.have.been.called;
      updateUser.should.have.been.calledWith('username', {
        settings: {
          tooltipKeySeen: 1
        }
      });
    });

    it('should update user profile', function(done) {
      $sessionStorage.tooltipKeySeen = false;
      userState.getCopyOfProfile.returns({});

      expect(tourFactory.isShowing('tooltipKey')).to.be.true;

      updateUser.should.have.been.calledWith('username', {
        settings: {
          tooltipKeySeen: 1
        }
      });

      setTimeout(function(){
        expect(userState.updateUserProfile).to.have.been.calledWith('userProfile');
        
        done();
      },10);
    });
  });

  describe('dismissed:', function() {
    it('should update session storage', function() {     
      tourFactory.dismissed('tooltipKey');

      expect($sessionStorage.tooltipKeySeen).to.be.true;
    });
  });

});
