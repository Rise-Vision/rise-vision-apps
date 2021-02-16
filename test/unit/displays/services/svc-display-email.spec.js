'use strict';
describe('service: displayEmail:', function() {
  beforeEach(module('risevision.displays.services'));

  beforeEach(module(function ($provide) {
    $provide.service('display', function() {
      return {
    	sendSetupEmail : function(){
          return Q.resolve();
        }
      }
    });

    $provide.service('userState', function() {
      return {
        getUserEmail: function() {
          return 'user@gmail.com';
        },
        _restoreState: function() {}
      };
    });
  }));
  
  var displayEmail, sendSpy;
  beforeEach(function(){
    inject(function($injector){
      displayEmail = $injector.get('displayEmail');
      var displayService = $injector.get('display');
      sendSpy = sinon.spy(displayService, 'sendSetupEmail');
    });
  });

  it('should exist',function(){
    expect(displayEmail).to.be.truely;
    expect(displayEmail.sendingEmail).to.be.false;
    expect(displayEmail.send).to.be.a('function');
  });
  
  it('should send email',function(done){
    displayEmail.send('displayId');
    expect(displayEmail.sendingEmail).to.be.true;
    sendSpy.should.have.been.calledWith('displayId', 'user@gmail.com');

    setTimeout(function() {
      expect(displayEmail.sendingEmail).to.be.false;
      done()
    }, 10);
  });
  
  it('should send email to another user',function(done){
    displayEmail.send('displayId', 'another.user@gmail.com');
    expect(displayEmail.sendingEmail).to.be.true;
    sendSpy.should.have.been.calledWith('displayId', 'another.user@gmail.com');

    setTimeout(function() {
	  expect(displayEmail.sendingEmail).to.be.false;
	  done()
	}, 10);
  });

  it('should not call w/ missing parameters',function(){
    displayEmail.send();
    expect(displayEmail.sendingEmail).to.be.false;
    sendSpy.should.not.have.been.called;
  });


});
