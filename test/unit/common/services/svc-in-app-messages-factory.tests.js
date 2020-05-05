'use strict';
describe('service: in-app-messages-factory', function() {
  var sandbox = sinon.sandbox.create();
  var factory, localStorageService, companyAssetsFactory, userState, $rootScope;

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

    $provide.service('companyAssetsFactory', function() {
      return {
        hasPresentations: sandbox.stub().returns(Q.resolve(true))
      }
    });
  }));

  beforeEach(function() {
    inject(function($injector) {
      factory = $injector.get('inAppMessagesFactory');
      userState = $injector.get('userState');
      localStorageService = $injector.get('localStorageService');
      $rootScope = $injector.get('$rootScope');
      companyAssetsFactory = $injector.get('companyAssetsFactory');
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
        companyAssetsFactory.hasPresentations.should.have.been.called;
      });

      it('should not show if user profile is not available', function() {
        userState.isRiseAuthUser.returns(true);
        factory.pickMessage();

        expect(factory.messageToShow).to.be.undefined;
        companyAssetsFactory.hasPresentations.should.have.been.called;
      });

      it('should not show if userConfirmed value is not there', function() {
        userState.isRiseAuthUser.returns(true);
        userState.getCopyOfProfile.returns({});
        factory.pickMessage();

        expect(factory.messageToShow).to.be.undefined;
        companyAssetsFactory.hasPresentations.should.have.been.called;
      });

      it('should show account has not been confirmed', function() {
        userState.isRiseAuthUser.returns(true);
        userState.getCopyOfProfile.returns({
          userConfirmed: false
        });
        factory.pickMessage();

        expect(factory.messageToShow).to.equal('confirmEmail');
        companyAssetsFactory.hasPresentations.should.not.have.been.called;
      });

      it('should not show if account has been confirmed', function() {
        userState.isRiseAuthUser.returns(true);
        userState.getCopyOfProfile.returns({
          userConfirmed: true
        });
        factory.pickMessage();

        expect(factory.messageToShow).to.be.undefined;
        companyAssetsFactory.hasPresentations.should.have.been.called;
      });

    });

    describe('promoteTraining:',function(){
      it('should show training message if the company has created presentations',function(done){
        factory.pickMessage();
        setTimeout(function(){
          expect(factory.messageToShow).to.equal('promoteTraining');
          done();
        },10);
      });

      it('should not show training message if company does not have presentations',function(done){
        companyAssetsFactory.hasPresentations.returns(Q.resolve(false));

        factory.pickMessage();
        setTimeout(function(){
          expect(factory.messageToShow).to.be.undefined;
          done();
        },10);
      });

      it('should not show training message if dismissed',function(done){
        localStorageService.get.withArgs('promoteTrainingAlert.dismissed').returns(true);

        factory.pickMessage();
        setTimeout(function(){
          expect(factory.messageToShow).to.be.undefined;
          done();
        },10); 
      });
    })
  });

  describe('dismissMessage:',function() {
    it('should dsimiss message and update local storage value', function(done) {
      factory.pickMessage();
      setTimeout(function(){
        expect(factory.messageToShow).to.equal('promoteTraining');

        factory.dismissMessage();

        localStorageService.set.should.have.been.calledWith('promoteTrainingAlert.dismissed', true);
        expect(factory.messageToShow).to.be.undefined;

        done();
      },10);
    });
  });

  describe('$rootScope.$watches', function() {
    it('should reload message on selected company changed', function() {
      sandbox.stub(factory,'pickMessage');

      factory.messageToShow = 'fakeMessage';
      $rootScope.$broadcast('risevision.company.selectedCompanyChanged');
      $rootScope.$digest();

      expect(factory.messageToShow).to.be.undefined;
      expect(factory.pickMessage).to.have.been.calledWith(true);
    })
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
