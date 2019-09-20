'use strict';
describe('service: in-app-messages-factory', function() {
  var sandbox = sinon.sandbox.create();
  var factory, selectedCompany, localStorageService, executeStub, userState, $rootScope;

  beforeEach(module('risevision.apps.services'));
  beforeEach(module(mockTranlate()));
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
        getSelectedCompanyId: sandbox.stub().returns('')
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

    describe('pricingChanges message',function(){
      it('should not show notice if company creationDate is after Jun 25', function(done) {
        selectedCompany.creationDate = 'Jun 26, 2019';
        factory.pickMessage();
        setTimeout(function(){
          expect(factory.messageToShow).to.be.undefined;
          done();
        },10);
      });      

      it('should show notice if company creationDate is before Jun 25',function(done) {
        selectedCompany.creationDate = 'Jun 24, 2019';        
        factory.pickMessage();
        setTimeout(function(){
          expect(factory.messageToShow).to.equal('pricingChanges');
          done();
        },10);
      });  

      it('should not show notice if dismissed',function(done) {
        selectedCompany.creationDate = 'Jun 24, 2019';

        localStorageService.get.withArgs('pricingChangesAlert.dismissed').returns(true);

        factory.pickMessage();
        setTimeout(function(){
          expect(factory.messageToShow).to.be.undefined;
          done();
        },10); 
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
  })

});
