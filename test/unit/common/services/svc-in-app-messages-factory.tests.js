'use strict';
describe('service: in-app-messages-factory', function() {
  var sandbox = sinon.sandbox.create();
  var factory, localStorageService, userState;

  beforeEach(module('risevision.apps.services'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {

    $provide.service('userState', function() {
      return {
        _restoreState: sandbox.stub(),
        getSelectedCompanyId: sandbox.stub().returns(''),
        getCopyOfProfile: sandbox.stub().returns(null),
        isRiseAuthUser: sandbox.stub().returns(false)
      };
    });

    $provide.service('localStorageService', function() {
      return {
        get: sandbox.stub().returns(false),
        set: sandbox.stub(),
        remove: sandbox.stub()
      }
    });
  }));

  beforeEach(function() {
    inject(function($injector) {
      factory = $injector.get('inAppMessagesFactory');
      userState = $injector.get('userState');
      localStorageService = $injector.get('localStorageService');
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('pickMessage:', function() {
    describe('confirmEmail:', function() {
      it('should not show for Google auth users', function() {
        factory.pickMessage();

        expect(factory.messageToShow).to.be.undefined;
      });

      it('should not show if user profile is not available', function() {
        userState.isRiseAuthUser.returns(true);
        factory.pickMessage();

        expect(factory.messageToShow).to.be.undefined;
      });

      it('should not show if userConfirmed value is not there', function() {
        userState.isRiseAuthUser.returns(true);
        userState.getCopyOfProfile.returns({});
        factory.pickMessage();

        expect(factory.messageToShow).to.be.undefined;
      });

      it('should show account has not been confirmed', function() {
        userState.isRiseAuthUser.returns(true);
        userState.getCopyOfProfile.returns({
          userConfirmed: false
        });
        factory.pickMessage();

        expect(factory.messageToShow).to.equal('confirmEmail');
      });

      it('should not show if account has been confirmed', function() {
        userState.isRiseAuthUser.returns(true);
        userState.getCopyOfProfile.returns({
          userConfirmed: true
        });
        factory.pickMessage();

        expect(factory.messageToShow).to.be.undefined;
      });

    });
  });

  describe('dismissMessage:',function() {
    it('should dismiss message and update local storage value', function() {
      factory.messageToShow = 'randomMessage';

      factory.dismissMessage();

      localStorageService.set.should.have.been.calledWith('randomMessageAlert.dismissed', true);
      expect(factory.messageToShow).to.be.undefined;
    });
  });

  describe('canDismiss:', function() {
    it('should not show dismiss message for confirmEmail', function() {
      factory.messageToShow = 'confirmEmail';

      expect(factory.canDismiss()).to.be.false;
    });

    it('should show dismiss message for other messages', function() {
      factory.messageToShow = 'randomMessage';

      expect(factory.canDismiss()).to.be.true;
    });

  });
});
