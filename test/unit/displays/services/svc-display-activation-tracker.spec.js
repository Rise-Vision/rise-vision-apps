'use strict';
describe('service: display activation tracker', function() {
  beforeEach(module('risevision.displays.services'));

  beforeEach(module(function ($provide) {
    $provide.service('userState',function(){
      return {
        getUsername: sinon.stub().returns('username'), 
        isSubcompanySelected: sinon.stub().returns(false),
        getCopyOfProfile: sinon.stub().returns({}),
        updateUserProfile: sinon.stub(),
        _restoreState: function(){}
      }
    });
    $provide.service('analyticsFactory',function(){
      return {
        identify: sinon.stub(), 
        load: function(){}
      }
    });
    $provide.service('updateUser', function() {
      return sinon.stub().returns(Q.resolve({
        item: 'updatedUser'
      }));
    });
    $provide.service('displayTracker', function() {
      return sinon.stub();
    });

  }));
  
  var displayActivationTracker, userState, analyticsFactory, updateUser, displayTracker;
  beforeEach(function(){
    inject(function($injector){
      userState = $injector.get('userState');
      analyticsFactory = $injector.get('analyticsFactory');
      updateUser = $injector.get('updateUser');
      displayTracker = $injector.get('displayTracker');
      displayActivationTracker = $injector.get('displayActivationTracker');
    });
  });

  it('should exist',function(){
    expect(displayActivationTracker).to.be.ok;
    expect(displayActivationTracker).to.be.a('function');
  });
  
  it('should return early if subcompany is selected',function(){
    userState.isSubcompanySelected.returns(true);

    displayActivationTracker([]);

    userState.isSubcompanySelected.should.have.been.called;
    userState.getCopyOfProfile.should.not.have.been.called;

    analyticsFactory.identify.should.not.have.been.called;
    displayTracker.should.not.have.been.called;
  });

  it('should return early if setting exists',function(){
    userState.getCopyOfProfile.returns({
      settings: {
        firstDisplayActivationDate: '2020-08-21T15:19:02.716Z'
      }
    });

    displayActivationTracker([{
      lastActivityDate: new Date('2020-08-21T15:19:02.716Z')
    }]);

    userState.isSubcompanySelected.should.have.been.called;
    userState.getCopyOfProfile.should.have.been.called;

    analyticsFactory.identify.should.not.have.been.called;
    displayTracker.should.not.have.been.called;
  });

  describe('displays list:', function() {
    it('should not track if lastActivityDate is not available',function(){
      displayActivationTracker([{
        id: 'displayId1',
        name: 'displayName1'
      },{
        id: 'displayId2',
        name: 'displayName2'
      }]);

      userState.isSubcompanySelected.should.have.been.called;
      userState.getCopyOfProfile.should.have.been.called;

      analyticsFactory.identify.should.not.have.been.called;
      displayTracker.should.not.have.been.called;
    });

    it('should track earliest lastActivityDate',function(){
      displayActivationTracker([{
        id: 'displayId1',
        name: 'displayName1',
        lastActivityDate: new Date('2019-08-21T15:19:02.716Z')
      },{
        id: 'displayId2',
        name: 'displayName2',
        lastActivityDate: new Date('2020-08-21T15:19:02.716Z')
      },{
        id: 'displayId3',
        name: 'displayName3',
        lastActivityDate: new Date('2017-08-21T15:19:02.716Z')
      }]);

      analyticsFactory.identify.should.have.been.calledWith('username', {
        firstDisplayActivationDate: '2017-08-21T15:19:02.716Z'
      });
      displayTracker.should.have.been.calledWith('first display activated', 'displayId3', 'displayName3', {
        firstDisplayActivationDate: '2017-08-21T15:19:02.716Z'
      });
    });

  });

  it('should track event, send identify',function(){
    displayActivationTracker([{
      id: 'displayId',
      name: 'displayName',
      lastActivityDate: new Date('2020-08-21T15:19:02.716Z')
    }]);

    analyticsFactory.identify.should.have.been.calledWith('username', {
      firstDisplayActivationDate: '2020-08-21T15:19:02.716Z'
    });
    displayTracker.should.have.been.calledWith('first display activated', 'displayId', 'displayName', {
      firstDisplayActivationDate: '2020-08-21T15:19:02.716Z'
    });

  });

  it('should update user settings',function(done){
    displayActivationTracker([{
      id: 'displayId',
      name: 'displayName',
      lastActivityDate: new Date('2020-08-21T15:19:02.716Z')
    }]);

    setTimeout(function() {
      updateUser.should.have.been.calledWith('username', {
        settings: {
          firstDisplayActivationDate: new Date('2020-08-21T15:19:02.716Z').toISOString()
        }
      });
      userState.updateUserProfile.should.have.been.calledWith('updatedUser');

      done();
    }, 10);

  });

});
