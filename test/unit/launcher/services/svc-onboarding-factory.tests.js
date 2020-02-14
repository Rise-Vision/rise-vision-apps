'use strict';
describe('service: onboardingFactory:', function() {
  beforeEach(module('risevision.apps.launcher.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('companyAssetsFactory', function() {
      return {
        hasTemplates: sinon.stub(),
        hasSchedules: sinon.stub(),
        hasDisplays: sinon.stub()
      };
    });

    $provide.service('userState',function(){
      return {
        getCopyOfSelectedCompany: sinon.stub().returns({
          creationDate: 'Jan 8, 2020'
        }),
        getCopyOfProfile: sinon.stub(),
        isEducationCustomer: sinon.stub().returns(true),
        _restoreState: function(){},
        getUsername: sinon.stub().returns('username'),
        updateUserProfile: sinon.stub(),
        getSelectedCompanyId: sinon.stub().returns('companyId'),
        updateCompanySettings: sinon.stub()
      }
    });

    $provide.service('segmentAnalytics',function(){
      return {
        track: sinon.stub()
      }
    });

    $provide.service("updateUser", function() {
      return updateUser = sinon.stub().returns(Q.resolve({}));
    });

    $provide.service("updateCompany", function() {
      return updateCompany = sinon.stub().returns(Q.resolve({}));
    });

  }));
  
  var onboardingFactory, userState, companyAssetsFactory, segmentAnalytics, updateUser, $rootScope, updateCompany;
  beforeEach(function() {
    inject(function($injector) {
      userState = $injector.get('userState');
      companyAssetsFactory = $injector.get('companyAssetsFactory');
      segmentAnalytics = $injector.get('segmentAnalytics');
      $rootScope = $injector.get('$rootScope');
      
      onboardingFactory = $injector.get('onboardingFactory');
    });
  });

  it('should exist', function() {
    expect(onboardingFactory).to.be.ok;
    expect(onboardingFactory.isCurrentStep).to.be.a('function');
    expect(onboardingFactory.isCurrentTab).to.be.a('function');
    expect(onboardingFactory.setCurrentTab).to.be.a('function');
    expect(onboardingFactory.isTabCompleted).to.be.a('function');
    expect(onboardingFactory.isOnboarding).to.be.a('function');
    expect(onboardingFactory.isTemplateOnboarding).to.be.a('function');
    expect(onboardingFactory.refresh).to.be.a('function');
    expect(onboardingFactory.setPlaybookSignup).to.be.a('function');
    expect(onboardingFactory.onboardingStep).to.be.undefined;
  });

  describe('isOnboarding:', function() {
    it('should return false if not an education customer', function() {
      userState.isEducationCustomer.returns(false);

      expect(onboardingFactory.isOnboarding()).to.be.false;
    });

    it('should return false if company was created before the launch date', function() {
      userState.getCopyOfSelectedCompany.returns({
        creationDate: 'Nov 25, 2010'
      });

      expect(onboardingFactory.isOnboarding()).to.be.false;
    });

    it('should return true if company was created after the launch date', function() {
      expect(onboardingFactory.isOnboarding()).to.be.true;
    });

    it('should return true if company has not completed onboarding', function() {
      userState.getCopyOfSelectedCompany.returns({
        creationDate: 'Nov 25, 2010',
        settings:{
          onboardingCompleted: "false"
        }
      });
      expect(onboardingFactory.isOnboarding()).to.be.false;
    });

    it('should return false if user and company have completed onboarding', function() {
      userState.getCopyOfSelectedCompany.returns({
        creationDate: 'Nov 25, 2010',
        settings:{
          onboardingCompleted: "true"
        }
      });
      userState.getCopyOfProfile.returns({
        settings:{
          onboardingCompleted: "true"
        }
      });

      expect(onboardingFactory.isOnboarding()).to.be.false;
    });
  });

  describe('isTemplateOnboarding',function() {
    it('should return true if is onboarding and first step', function() {
      sinon.stub(onboardingFactory, 'isOnboarding').returns(true);
      sinon.stub(onboardingFactory, 'isCurrentTab').withArgs(1).returns(true);
      expect(onboardingFactory.isTemplateOnboarding()).to.be.true;
    });

    it('should return false if not onboarding', function() {
      sinon.stub(onboardingFactory, 'isOnboarding').returns(false);
      sinon.stub(onboardingFactory, 'isCurrentTab').withArgs(1).returns(true);
      expect(onboardingFactory.isTemplateOnboarding()).to.be.false;
    });

    it('should return false if is onboarding but not first step', function() {
      sinon.stub(onboardingFactory, 'isOnboarding').returns(true);
      sinon.stub(onboardingFactory, 'isCurrentTab').withArgs(1).returns(false);
      expect(onboardingFactory.isTemplateOnboarding()).to.be.false;
    });
  });

  
  describe("loading:",function(){
    beforeEach(function() {
      sinon.stub(onboardingFactory, 'refresh');
    });

    it("should refresh on companyAssetsUpdated event",function(){
      $rootScope.$emit('companyAssetsUpdated');
      $rootScope.$digest();

      onboardingFactory.refresh.should.have.been.called;
    });

    it("should refresh on selectedCompanyChanged event and reset details",function(){
      $rootScope.$emit('risevision.company.selectedCompanyChanged');
      $rootScope.$digest();

      onboardingFactory.refresh.should.have.been.called;
      onboardingFactory.refresh.should.have.been.calledWith(true);
    });

  });

  describe('refresh:', function() {
    it('should go to initial step', function(done) {
      expect(onboardingFactory.isCurrentStep('addTemplate')).to.be.false;
      companyAssetsFactory.hasSchedules.returns(Q.resolve(false));
      
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('addTemplate')).to.be.true;
        expect(onboardingFactory.isCurrentTab(1)).to.be.true;
        expect(onboardingFactory.isTabCompleted(1)).to.be.false;
        expect(onboardingFactory.loading).to.be.false;
        done();
      });
      expect(onboardingFactory.loading).to.be.true;
    });

    it('should resolve if not onboarding', function(done) {
      sinon.stub(onboardingFactory, 'isOnboarding').returns(false);
      companyAssetsFactory.hasSchedules.returns(Q.resolve(false));
      
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('addTemplate')).to.be.false;
        expect(onboardingFactory.isCurrentTab(1)).to.be.false;
        expect(onboardingFactory.isTabCompleted(1)).to.be.false;
        done();
      });
    });

    it('should reject on rejected requests', function(done) {
      expect(onboardingFactory.isCurrentStep('addTemplate')).to.be.false;
      companyAssetsFactory.hasSchedules.returns(Q.reject());
      
      onboardingFactory.refresh()
        .then(done)
        .catch(function(){
          expect(onboardingFactory.loading).to.be.false;
          expect(onboardingFactory.isCurrentStep('addTemplate')).to.be.false;
          expect(onboardingFactory.isCurrentTab(1)).to.be.false;
          expect(onboardingFactory.isTabCompleted(1)).to.be.false;
          done();
        });
      expect(onboardingFactory.loading).to.be.true;
    });

    it('should show templateAdded after addTemplate', function(done) {
      companyAssetsFactory.hasSchedules.returns(Q.resolve(false));
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('addTemplate')).to.be.true;
        
        companyAssetsFactory.hasSchedules.returns(Q.resolve(true));
        onboardingFactory.refresh().then(function(){
          expect(onboardingFactory.isCurrentStep('templateAdded')).to.be.true;
          expect(onboardingFactory.isCurrentTab(1)).to.be.true;
          expect(onboardingFactory.isTabCompleted(1)).to.be.true;
          expect(onboardingFactory.isCurrentStep('addTemplate')).to.be.false;
          done();
        });
      });
    });

    it('should show addDisplay', function(done) {
      companyAssetsFactory.hasSchedules.returns(Q.resolve(true));
      companyAssetsFactory.hasDisplays.returns(Q.resolve({
        hasDisplays: false        
      }));
      
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('addDisplay')).to.be.true;
        expect(onboardingFactory.isCurrentTab(2)).to.be.true;

        expect(onboardingFactory.isTabCompleted(1)).to.be.true;
        expect(onboardingFactory.isTabCompleted(2)).to.be.false;
        done();
      });
    });

    it('should show activateDisplay', function(done) {
      companyAssetsFactory.hasSchedules.returns(Q.resolve(true));
      companyAssetsFactory.hasDisplays.returns(Q.resolve({
        hasDisplays: true,
        hasActivatedDisplays: false        
      }));
      
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('activateDisplay')).to.be.true;
        expect(onboardingFactory.isCurrentTab(2)).to.be.true;

        expect(onboardingFactory.isTabCompleted(1)).to.be.true;
        expect(onboardingFactory.isTabCompleted(2)).to.be.false;
        done();
      });
    });

    it('should show displayActivated after addDisplay', function(done) {
      companyAssetsFactory.hasSchedules.returns(Q.resolve(true));
      companyAssetsFactory.hasDisplays.returns(Q.resolve({
        hasDisplays: false
      }));      
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('addDisplay')).to.be.true;
        companyAssetsFactory.hasDisplays.returns(Q.resolve({
          hasDisplays: true,
          hasActivatedDisplays: true
        }));
        onboardingFactory.refresh().then(function(){
          expect(onboardingFactory.isCurrentStep('displayActivated')).to.be.true;
          expect(onboardingFactory.isCurrentTab(2)).to.be.true;

          expect(onboardingFactory.isTabCompleted(1)).to.be.true;
          expect(onboardingFactory.isTabCompleted(2)).to.be.true;
          done();
        });
      });
    });

    it('should show displayActivated after activateDisplay', function(done) {
      companyAssetsFactory.hasSchedules.returns(Q.resolve(true));
      companyAssetsFactory.hasDisplays.returns(Q.resolve({
        hasDisplays: true,
        hasActivatedDisplays: false
      }));      
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('activateDisplay')).to.be.true;
        companyAssetsFactory.hasDisplays.returns(Q.resolve({
          hasDisplays: true,
          hasActivatedDisplays: true
        }));
        onboardingFactory.refresh().then(function(){
          expect(onboardingFactory.isCurrentStep('displayActivated')).to.be.true;
          expect(onboardingFactory.isCurrentTab(2)).to.be.true;
          done();
        });
      });
    });

    it('should show promotePlaybook', function(done) {
      companyAssetsFactory.hasSchedules.returns(Q.resolve(true));
      companyAssetsFactory.hasDisplays.returns(Q.resolve({
        hasDisplays: true,
        hasActivatedDisplays: true
      }));
      
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('promotePlaybook')).to.be.true;
        expect(onboardingFactory.isCurrentTab(3)).to.be.true;
        expect(onboardingFactory.isTabCompleted(3)).to.be.false;
        done();
      });
    });

    it('should show promoteTraining and complete onboarding', function(done) {
      companyAssetsFactory.hasSchedules.returns(Q.resolve(true));
      companyAssetsFactory.hasDisplays.returns(Q.resolve({
        hasDisplays: true,
        hasActivatedDisplays: true
      }));
      userState.getCopyOfProfile.returns({mailSyncEnabled:true});
      
      onboardingFactory.refresh().then(function(){
        expect(updateUser).to.have.been.calledWith('username',{
          'mailSyncEnabled': true,
          'settings': {
            'onboardingCompleted': 'true'
          }
        });
        expect(updateCompany).to.have.been.calledWith('companyId',{
          'settings': {
            'onboardingCompleted': 'true'
          }
        });
        expect(onboardingFactory.isCurrentStep('promoteTraining')).to.be.true;
        expect(onboardingFactory.isCurrentTab(3)).to.be.true;
        expect(onboardingFactory.isTabCompleted(3)).to.be.true;
        expect(onboardingFactory.alreadySubscribed).to.be.true;

        expect(segmentAnalytics.track).to.have.been.calledWith('Onboarding Newsletter Signup Completed');
        expect(userState.updateCompanySettings).to.have.been.called;
        expect(userState.updateUserProfile).to.have.been.called;
        
        done();
      });
    });
  });

  describe('setPlaybookSignup', function(){
    it('should signup to playbook and complete onboarding', function(done) {
      sinon.spy($rootScope,'$emit');
      onboardingFactory.setPlaybookSignup(true);
      setTimeout(function(){
        expect(updateUser).to.have.been.calledWith('username',{
          'mailSyncEnabled': true,
          'settings': {
            'onboardingCompleted': 'true'
          }
        });
        expect(updateCompany).to.have.been.calledWith('companyId',{
          'settings': {
            'onboardingCompleted': 'true'
          }
        });
        expect(onboardingFactory.isCurrentStep('promoteTraining')).to.be.true;
        expect(onboardingFactory.isCurrentTab(3)).to.be.true;
        expect(onboardingFactory.isTabCompleted(3)).to.be.true;
        expect(onboardingFactory.alreadySubscribed).to.be.undefined;

        expect(segmentAnalytics.track).to.have.been.calledWith('Onboarding Newsletter Signup Completed');
        expect(userState.updateCompanySettings).to.have.been.called;
        expect(userState.updateUserProfile).to.have.been.called;

        done();
      },10);
    });

    it('should not signup to playbook and complete onboarding', function(done) {
      sinon.spy($rootScope,'$emit');
      onboardingFactory.setPlaybookSignup(false);
      setTimeout(function(){
        expect(updateUser).to.have.been.calledWith('username',{
          'mailSyncEnabled': false,
          'settings': {
            'onboardingCompleted': 'true'
          }
        });
        expect(updateCompany).to.have.been.calledWith('companyId',{
          'settings': {
            'onboardingCompleted': 'true'
          }
        });
        expect(onboardingFactory.isCurrentStep('promoteTraining')).to.be.true;
        expect(onboardingFactory.isCurrentTab(3)).to.be.true;
        expect(onboardingFactory.isTabCompleted(3)).to.be.true;
        expect(onboardingFactory.alreadySubscribed).to.be.undefined;

        expect(segmentAnalytics.track).to.have.been.calledWith('Onboarding Newsletter Signup Completed');
        expect(userState.updateCompanySettings).to.have.been.called;
        expect(userState.updateUserProfile).to.have.been.called;
        
        done();
      },10);
    });
    
  });

  describe('setCurrentTab', function() {

    it('should show message to complete previous step on navigatin to a future step',function(done){
      companyAssetsFactory.hasSchedules.returns(Q.resolve(false));
      
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('addTemplate')).to.be.true;

        onboardingFactory.setCurrentTab(2);

        expect(onboardingFactory.isCurrentTab(2)).to.be.true;
        expect(onboardingFactory.isCurrentStep('templateNotAdded1')).to.be.true;
        expect(onboardingFactory.isTabCompleted(2)).to.be.false;
        done();
      });
    });

    it('should proceed to first step of a tab after congratulatory step',function(done){
      companyAssetsFactory.hasSchedules.returns(Q.resolve(false));
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('addTemplate')).to.be.true;
        
        companyAssetsFactory.hasSchedules.returns(Q.resolve(true));
        onboardingFactory.refresh().then(function(){
          expect(onboardingFactory.isCurrentStep('templateAdded')).to.be.true;
          
          onboardingFactory.setCurrentTab(2);

          expect(onboardingFactory.isCurrentStep('addDisplay')).to.be.true;
          expect(onboardingFactory.isCurrentTab(2)).to.be.true;          
          expect(onboardingFactory.isTabCompleted(1)).to.be.true;
          expect(onboardingFactory.isTabCompleted(2)).to.be.false;
          done()
        });
      });
    });
  });

});
