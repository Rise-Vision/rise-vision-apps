'use strict';
describe('service: displayEmail:', function() {
  beforeEach(module('risevision.displays.services'));

  beforeEach(module(function ($provide) {
    $provide.service('email', function() {
      return {
        send: function() {
          return Q.resolve();
        }
      }
    })
    $provide.service('$templateCache',function(){
      return {
        get: function(url){
          expect(url).to.be.ok;

          return 'email template w/ {{display.id}} & {{display.name}}';
        },
        put: function() {}
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
      var emailService = $injector.get('email');
      sendSpy = sinon.spy(emailService, 'send');
    });
  });

  it('should exist',function(){
    expect(displayEmail).to.be.truely;
    expect(displayEmail.sendingEmail).to.be.false;
    expect(displayEmail.send).to.be.a('function');
  });
  
  it('should send email',function(done){
    displayEmail.send('displayId', 'displayName');
    expect(displayEmail.sendingEmail).to.be.true;
    sendSpy.should.have.been.calledWith('user@gmail.com',
      'Set Up Your Display With Rise Vision',
      'email template w/ displayId & displayName');

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
