'use strict';
describe('service: in-app-messages-factory', function() {
  var sandbox = sinon.sandbox.create();
  var factory, selectedCompany, localStorageService, executeStub;

  beforeEach(module('risevision.apps.services'));
  beforeEach(module(function ($provide) {

    $provide.service('presentation', function() {
      return {};
    });

    $provide.service('userState', function() {
      return {
        getCopyOfSelectedCompany: function() {
          return selectedCompany;
        },
        _restoreState: sandbox.stub()
      };
    });

    $provide.service('localStorageService', function() {
      return {
        get: sandbox.stub().returns('false'),
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
      localStorageService = $injector.get('localStorageService');
      selectedCompany = {};
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('pickMessage:', function() {
    it('should not show message if company is missing',function(done) {
      selectedCompany = undefined;
      factory.pickMessage().then(function(message){
        expect(message).to.be.undefined;
        done();
      });
    });

    describe('pricingChanges message',function(){
      it('should not show notice if company creationDate is after Jun 25', function(done) {
        selectedCompany.creationDate = 'Jun 26, 2019';
        factory.pickMessage().then(function(message){
          expect(message).to.be.undefined;
          done();
        });
      });      

      it('should show notice if company creationDate is before Jun 25',function(done) {
        selectedCompany.creationDate = 'Jun 24, 2019';        
        factory.pickMessage().then(function(message){
          expect(message).to.equal('pricingChanges');
          done();
        });  
      });  

      it('should not show notice if dismissed',function(done) {
        selectedCompany.creationDate = 'Jun 24, 2019';

        localStorageService.get.withArgs('pricingChangesAlert.dismissed').returns("true");
        factory.pickMessage().then(function(message){
          expect(message).to.be.undefined;
          done();
        });  
      });    
    });

    describe('promoteTraining:',function(){
      beforeEach(function(){
        localStorageService.get.withArgs('pricingChangesAlert.dismissed').returns("true");
      });

      it('should show training message if pricing is dismissed and company has created presentations',function(done){
        executeStub.returns(Q.resolve({items:[{id: 'presentationId'}]}));

        factory.pickMessage().then(function(message){
          expect(message).to.equal('promoteTraining');
          done();
        });
      });

      it('should not show training message if company does not have presentations',function(done){
        executeStub.returns(Q.resolve({items:[]}));

        factory.pickMessage().then(function(message){
          expect(message).to.be.undefined;
          done();
        });
      });

      it('should not show training message if dismissed',function(done){
        executeStub.returns(Q.resolve({items:[{id: 'presentationId'}]}));

        localStorageService.get.withArgs('promoteTrainingAlert.dismissed').returns("true");

        factory.pickMessage().then(function(message){
          expect(message).to.be.undefined;
          done();
        });
      });
    })
  });

  describe('dismissMessage:',function() {
    it('should update local storage value', function() {
      factory.dismissMessage('pricingChanges');

      localStorageService.set.should.have.been.calledWith('pricingChangesAlert.dismissed', 'true');
    });
  });

});
