'use strict';
describe('service: in-app-messages-factory', function() {
  var sandbox = sinon.sandbox.create();
  var factory, selectedCompany, localStorageService, executeStub, userState, $rootScope;

  beforeEach(module('risevision.apps.services'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {

    $provide.service('presentation', function() {
      return {};
    });

    $provide.service('userState', function() {
      return {
        getCopyOfSelectedCompany: function() {
          return selectedCompany;
        },
        isEducationCustomer: sandbox.stub().returns(false),
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

    $provide.service('CachedRequest', function() {
      return function(request, args) {
        return {
          execute: executeStub = sandbox.stub().returns(Q.resolve('OK'))
        }
      }
    });
  }));

  beforeEach(function() {
    inject(function($injector) {
      factory = $injector.get('inAppMessagesFactory');
      userState = $injector.get('userState');
      localStorageService = $injector.get('localStorageService');
      $rootScope = $injector.get('$rootScope');
      selectedCompany = {};
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('pickMessage:', function() {
    it('should not show message if company is missing',function(done) {
      selectedCompany = undefined;
      factory.pickMessage();
      setTimeout(function(){
        expect(factory.messageToShow).to.be.undefined;
        done();
      },10);
    });

    describe('confirmEmail:', function() {
      it('should not show for Google auth users', function() {
        factory.pickMessage();

        expect(factory.messageToShow).to.be.undefined;
        executeStub.should.have.been.called;
      });

      it('should not show if user profile is not available', function() {
        userState.isRiseAuthUser.returns(true);
        factory.pickMessage();

        expect(factory.messageToShow).to.be.undefined;
        executeStub.should.have.been.called;
      });

      it('should not show if userConfirmed value is not there', function() {
        userState.isRiseAuthUser.returns(true);
        userState.getCopyOfProfile.returns({});
        factory.pickMessage();

        expect(factory.messageToShow).to.be.undefined;
        executeStub.should.have.been.called;
      });

      it('should show account has not been confirmed', function() {
        userState.isRiseAuthUser.returns(true);
        userState.getCopyOfProfile.returns({
          userConfirmed: false
        });
        factory.pickMessage();

        expect(factory.messageToShow).to.equal('confirmEmail');
        executeStub.should.not.have.been.called;
      });

      it('should not show if account has been confirmed', function() {
        userState.isRiseAuthUser.returns(true);
        userState.getCopyOfProfile.returns({
          userConfirmed: true
        });
        factory.pickMessage();

        expect(factory.messageToShow).to.be.undefined;
        executeStub.should.have.been.called;
      });

    });

    describe('pricingChanges message',function(){
      it('should not show notice if company creationDate is after Jun 25', function() {
        selectedCompany.creationDate = 'Jun 26, 2019';
        factory.pickMessage();

        expect(factory.messageToShow).to.be.undefined;
        executeStub.should.have.been.called;
      });      

      it('should show notice if company creationDate is before Jun 25',function() {
        selectedCompany.creationDate = 'Jun 24, 2019';        
        factory.pickMessage();

        expect(factory.messageToShow).to.equal('pricingChanges');
        executeStub.should.not.have.been.called;
      });  

      it('should not show notice if dismissed',function() {
        selectedCompany.creationDate = 'Jun 24, 2019';

        localStorageService.get.withArgs('pricingChangesAlert.dismissed').returns(true);

        factory.pickMessage();

        expect(factory.messageToShow).to.be.undefined;
        executeStub.should.have.been.called;
      });    
    });

    describe('promoteTraining:',function(){
      beforeEach(function(){
        localStorageService.get.withArgs('pricingChangesAlert.dismissed').returns(true);
      });

      it('should show training message for education customers if pricing message was dismissed and company has created presentations',function(done){
        executeStub.returns(Q.resolve({items:[{id: 'presentationId'}]}));
        userState.isEducationCustomer.returns(true);

        factory.pickMessage();
        setTimeout(function(){
          expect(factory.messageToShow).to.equal('promoteTraining');
          done();
        },10);
      });

      it('should not show training message if not an education customer',function(done){
        executeStub.returns(Q.resolve({items:[{id: 'presentationId'}]}));
        userState.isEducationCustomer.returns(false);

        factory.pickMessage();
        setTimeout(function(){
          expect(factory.messageToShow).to.be.undefined;
          done();
        },10); 
      });

      it('should not show training message if company does not have presentations',function(done){
        executeStub.returns(Q.resolve({items:[]}));

        factory.pickMessage();
        setTimeout(function(){
          expect(factory.messageToShow).to.be.undefined;
          done();
        },10);
      });

      it('should not show training message if dismissed',function(done){
        executeStub.returns(Q.resolve({items:[{id: 'presentationId'}]}));

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
      selectedCompany.creationDate = 'Jun 24, 2019';        
        factory.pickMessage();
        setTimeout(function(){
          expect(factory.messageToShow).to.equal('pricingChanges');

          factory.dismissMessage();

          localStorageService.set.should.have.been.calledWith('pricingChangesAlert.dismissed', true);
          expect(factory.messageToShow).to.be.undefined;

          done();
        },10);
    });
  });

  describe('$rootScope.$watches', function() {
    it('should reload message on company updated', function() {
      sandbox.stub(factory,'pickMessage');

      factory.messageToShow = 'fakeMessage';
      $rootScope.$broadcast('risevision.company.updated');
      $rootScope.$digest();

      expect(factory.messageToShow).to.be.undefined;
      expect(factory.pickMessage).to.have.been.calledWith(true);
    })

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
