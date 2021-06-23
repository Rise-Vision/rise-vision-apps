'use strict';
describe('service: registrationFactory:', function() {
  beforeEach(module('risevision.common.components.userstate'));

  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});

    $provide.service('userState', function(){
      return {
        getCopyOfProfile: function() {
          return {
            creationDate: 'creationDate'
          };
        },
        getUsername: function() {
          return 'e@mail.com';
        },
        _restoreState : function(){
          
        },
        getUserCompanyId : function(){
          return 'some_company_id';
        },
        getUserCompanyName: function() {
          return 'company_name';
        },
        updateCompanySettings: sinon.stub(),
        refreshProfile: sinon.stub().resolves(),
        getCopyOfUserCompany: function() {
          return {
            parentId: 'parentId'
          };
        }
      };
    });

    $provide.service('getUserProfile', function(){
      return sinon.stub().rejects();
    });

    $provide.service('getAccount', function(){
      return sinon.stub().resolves();
    });
    
    $provide.service('addAccount', function(){
      return sinon.stub().resolves('registered');
    });

    $provide.service('agreeToTermsAndUpdateUser', function() {
      return sinon.stub().resolves('registered');
    });

    $provide.service('currentPlanFactory', function() {
      return currentPlanFactory = {
        initVolumePlanTrial: sinon.spy()
      };
    });

    $provide.service('analyticsFactory', function() { 
      return {
        track: sinon.stub(),
        load: function() {}
      };
    });

    $provide.service('$exceptionHandler',function(){
      return sinon.spy();
    });

    $provide.service('bigQueryLogging', function() { 
      return {
        logEvent: sinon.spy()
      };
    });

    $provide.factory('customLoader', function ($q) {
      return function () {
        return Q.resolve({});
      };
    });

    $provide.factory('messageBox', function() {
      return function() {};
    });

    $provide.factory('hubspot', function() {
      return {
        loadAs: sinon.stub()
      };
    });

  }));
  
  var registrationFactory, userState, getUserProfile, getAccount, addAccount, agreeToTermsAndUpdateUser;
  var analyticsFactory, bigQueryLogging,
    updateCompanyCalled, currentPlanFactory, hubspot;

  beforeEach(function(){
    inject(function($injector){
      userState = $injector.get('userState');
      analyticsFactory = $injector.get("analyticsFactory");
      bigQueryLogging = $injector.get('bigQueryLogging');
      hubspot = $injector.get('hubspot');
      getUserProfile = $injector.get('getUserProfile');
      getAccount = $injector.get('getAccount');
      addAccount = $injector.get('addAccount');
      agreeToTermsAndUpdateUser = $injector.get('agreeToTermsAndUpdateUser');
      registrationFactory = $injector.get('registrationFactory');
    });
  });

  it('should initialize',function(){
    expect(registrationFactory).to.be.ok;
    expect(registrationFactory.init).to.be.a('function');
    expect(registrationFactory.register).to.be.a('function');
  });
  
  describe('init:', function() {
    it('should load data and start spinner',function(){
      registrationFactory.init();

      expect(registrationFactory.loading).to.be.true;

      getUserProfile.should.have.been.calledWith('e@mail.com');
      getAccount.should.have.been.called;
    });

    it('should reset old values',function(){
      registrationFactory.newUser = 'oldvalue';
      registrationFactory.profile = 'oldprofile';
      registrationFactory.company = 'oldcompany';

      registrationFactory.init();

      expect(registrationFactory.newUser).to.be.true;
      expect(registrationFactory.profile).to.deep.equal({});
      expect(registrationFactory.company).to.deep.equal({});

    });

    describe('_checkNewUser:', function() {
      it('should handle rejection with a random error',function(done){
        registrationFactory.init();

        registrationFactory.newUser = 'oldvalue';

        setTimeout(function() {
          expect(registrationFactory.newUser).to.be.true;

          done();
        });
      });

      it('should detect terms acceptance error',function(done){
        getUserProfile.rejects({
          message: 'User has not yet accepted the Terms of Service'
        });
        
        registrationFactory.init();

        setTimeout(function() {
          expect(registrationFactory.newUser).to.be.false;

          done();
        });
      });

      it('should use default value if function resolves (should never happen)',function(done){
        getUserProfile.resolves();

        registrationFactory.init();

        registrationFactory.newUser = 'oldvalue';

        setTimeout(function() {
          expect(registrationFactory.newUser).to.equal('oldvalue');

          done();
        });
      });

    });

    it('should update profile and company objects',function(done){
      getAccount.resolves({
        email : "RV_user_id",
        firstName : "first",
        lastName : "last",
        mailSyncEnabled: true,
        telephone : "telephone",
        companyIndustry: 'EDUCATION'
      });

      registrationFactory.init();

      setTimeout(function() {
        expect(registrationFactory.profile).to.deep.equal({
          email : "RV_user_id",
          firstName : "first",
          lastName : "last",
          mailSyncEnabled: true
        });

        expect(registrationFactory.company).to.deep.equal({
          companyIndustry: 'EDUCATION'
        });

        expect(registrationFactory.loading).to.be.false;

        done();
      });
    });

    it('should use username as email',function(done){
      registrationFactory.init();

      setTimeout(function() {
        expect(registrationFactory.profile).to.deep.equal({
          email : "e@mail.com"
        });

        expect(registrationFactory.company).to.deep.equal({
          companyIndustry: undefined
        });

        done();
      });
    });

    it('should handle failure to getAccount',function(done){
      getAccount.rejects();

      registrationFactory.init();

      setTimeout(function() {
        expect(registrationFactory.profile).to.deep.equal({
          email : "e@mail.com"
        });

        expect(registrationFactory.company).to.deep.equal({
          companyIndustry: undefined
        });

        done();
      });
    });

  });

  describe('save:', function() {
    beforeEach(function() {
      registrationFactory.profile = {};
      registrationFactory.company = {};
    });
    
    describe('mailSyncEnabled', function() {
      it('should enable for education', function() {
        registrationFactory.company.companyIndustry = 'PRIMARY_SECONDARY_EDUCATION';
        registrationFactory.register();
        
        expect(registrationFactory.profile.mailSyncEnabled).to.be.true;
      });

      it('should disable for non education', function() {
        registrationFactory.company.companyIndustry = 'MISC';
        registrationFactory.register();
        
        expect(registrationFactory.profile.mailSyncEnabled).to.be.false;
      });

      it('should not override existing subscription', function() {
        registrationFactory.profile.mailSyncEnabled = true;
        registrationFactory.company.companyIndustry = 'MISC';
        registrationFactory.register();
        
        expect(registrationFactory.profile.mailSyncEnabled).to.be.true;
      });
    });

    describe('new user: ', function() {      
      beforeEach(function() {
        registrationFactory.newUser = true;
      });

      it('should register user and close the modal', function(done){
        registrationFactory.register();
        expect(registrationFactory.loading).to.be.true;
        
        setTimeout(function() {
          addAccount.should.have.been.called;
          agreeToTermsAndUpdateUser.should.not.have.been.called;
          
          currentPlanFactory.initVolumePlanTrial.should.have.been.called;
          expect(analyticsFactory.track).to.have.been.calledWith('User Registered',{
            companyId: 'some_company_id',
            companyName: 'company_name',
            parentId: 'parentId',
            isNewCompany: true,
            registeredDate: 'creationDate',
            invitationAcceptedDate: null
          });
          bigQueryLogging.logEvent.should.have.been.calledWith('User Registered');
          hubspot.loadAs.should.have.been.calledWith('e@mail.com');

          userState.refreshProfile.should.have.been.called;

          expect(registrationFactory.loading).to.be.false;

          done();
        },10);
      });

      it('should handle failure to create user', function(done){
        addAccount.rejects('error');
        registrationFactory.register();
        
        setTimeout(function(){
          addAccount.should.have.been.called;
          agreeToTermsAndUpdateUser.should.not.have.been.called;

          currentPlanFactory.initVolumePlanTrial.should.not.have.been.called;
          expect(analyticsFactory.track).to.not.have.been.called;
          bigQueryLogging.logEvent.should.not.have.been.called;
          hubspot.loadAs.should.not.have.been.called;

          userState.refreshProfile.should.have.been.called;

          expect(registrationFactory.loading).to.be.false;

          done();
        },10);
      });
    });
      
    describe('existing user:', function() {
      beforeEach(function() {
        registrationFactory.newUser = false;
      });
      
      it('should register user and close the modal', function(done){
        registrationFactory.register();
        expect(registrationFactory.loading).to.be.true;
        
        setTimeout(function() {
          addAccount.should.not.have.been.called;
          agreeToTermsAndUpdateUser.should.have.been.called;

          currentPlanFactory.initVolumePlanTrial.should.not.have.been.called;
          expect(analyticsFactory.track).to.have.been.calledWithMatch('User Registered',{
            companyId: 'some_company_id',
            companyName: 'company_name',
            parentId: 'parentId',
            isNewCompany: false,
            registeredDate: 'creationDate'
          });
          expect(analyticsFactory.track.getCall(0).args[1].invitationAcceptedDate).to.be.a('date');
          bigQueryLogging.logEvent.should.have.been.calledWith('User Registered');
          hubspot.loadAs.should.have.been.calledWith('e@mail.com');

          userState.refreshProfile.should.have.been.called;

          expect(registrationFactory.loading).to.be.false;

          done();
        },10);
      });
      
      it('should handle failure to create user', function(done){
        agreeToTermsAndUpdateUser.rejects('error');
        registrationFactory.register();
        
        setTimeout(function(){
          addAccount.should.not.have.been.called;
          agreeToTermsAndUpdateUser.should.have.been.called;

          expect(analyticsFactory.track).to.not.have.been.called;
          bigQueryLogging.logEvent.should.not.have.been.called;
          hubspot.loadAs.should.not.have.been.called;
          expect(registrationFactory.loading).to.be.false;

          userState.refreshProfile.should.have.been.called;

          expect(registrationFactory.loading).to.be.false;

          done();
        },10);
      });
    });

  });

});
