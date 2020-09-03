/*jshint expr:true */
"use strict";

describe("Services: plans factory", function() {

  beforeEach(module("risevision.common.components.plans"));
  beforeEach(module(function ($provide) {
    $provide.service("$modal", function() {
      return {
        open: sinon.stub().returns({result: Q.defer().promise })
      };
    });
    $provide.service("analyticsFactory", function() {
      return {
        track: sinon.stub()
      };
    });
    $provide.service("userState", function () {
      return {
        _restoreState: function () {},
        getSelectedCompanyId: function () {
          return null;
        },
        getCopyOfSelectedCompany: function() {
          return {};
        },
        updateCompanySettings: sinon.stub()
      };
    });
    $provide.service("currentPlanFactory", function() {
      return {
        currentPlan: {
          subscriptionId: 'subscriptionId'
        },
        isSubscribed: sinon.stub().returns(true)
      };
    });
    $provide.service("$state", function() {
      return {
        go: sinon.stub()
      };
    });
    $provide.factory('confirmModal', function() {
       return confirmModalStub = sinon.stub().returns(Q.resolve());
    });
    $provide.factory('messageBox', function() {
       return messageBoxStub = sinon.stub();
    });
  }));

  var sandbox, $modal, userState, plansFactory, analyticsFactory, currentPlanFactory, $state,
    confirmModalStub, messageBoxStub, VOLUME_PLAN;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    inject(function($injector) {
      $modal = $injector.get("$modal");
      userState =  $injector.get("userState");
      plansFactory = $injector.get("plansFactory");
      analyticsFactory = $injector.get("analyticsFactory");
      currentPlanFactory  = $injector.get("currentPlanFactory");
      $state = $injector.get("$state");

      var plansByType = _.keyBy($injector.get("PLANS_LIST"), "type");

      VOLUME_PLAN = plansByType.volume;
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should exist", function() {
    expect(plansFactory).to.be.ok;
    expect(plansFactory.showPlansModal).to.be.a('function');
    expect(plansFactory.showPurchaseOptions).to.be.a('function');
    expect(plansFactory.initVolumePlanTrial).to.be.a('function');
  });

  describe("showPlansModal: ", function() {
    it("should show plans modal", function() {
      plansFactory.showPlansModal();

      expect($modal.open).to.have.been.called;
    });

    it("should not show plans modal more than once", function() {
      plansFactory.showPlansModal();
      plansFactory.showPlansModal();

      expect($modal.open).to.have.been.calledOnce;
    });

    it("should show plans modal again if closed", function(done) {
      $modal.open.returns({result: Q.resolve()});

      plansFactory.showPlansModal();
      
      setTimeout(function() {
        plansFactory.showPlansModal();

        expect($modal.open).to.have.been.calledTwice;

        done();
      }, 10);
    });
    
  });
  
  describe("showPurchaseOptions: ", function() {
    it('should go to billing page/edit subscription if company has a plan and manages it', function(done) {
      plansFactory.showPurchaseOptions();

      setTimeout(function(){
        expect($state.go).to.have.been.calledWith('apps.billing.home', {edit: 'subscriptionId'});

        expect(messageBoxStub).to.not.have.been.called;
        done();
      },10);
    });

    it('should show a message if company has a plan but it is managed by a parent company', function(done) {
      currentPlanFactory.currentPlan.isPurchasedByParent = true
      plansFactory.showPurchaseOptions();

      setTimeout(function(){
        expect(messageBoxStub).to.have.been.calledWith(
          'You can\'t edit your current plan.',
          'Your plan is managed by your parent company. Please contact your account administrator for additional licenses.',
          'Ok', 'madero-style centered-modal', 'partials/template-editor/message-box.html', 'sm'
        );

        expect($state.go).to.not.have.been.called;
        done();
      },10);
    });

    it('should show plan admin email if available', function(done) {
      currentPlanFactory.currentPlan.isPurchasedByParent = true      
      currentPlanFactory.currentPlan.parentPlanContactEmail = 'test@email.com';

      plansFactory.showPurchaseOptions();

      setTimeout(function(){
        expect(messageBoxStub).to.have.been.calledWith(
          'You can\'t edit your current plan.',
          'Your plan is managed by your parent company. Please contact your account administrator at test@email.com for additional licenses.',
          'Ok', 'madero-style centered-modal', 'partials/template-editor/message-box.html', 'sm'
        );

        expect($state.go).to.not.have.been.called;
        done();
      },10);
    });

    it('should open Plans Modal if company is not subscribed to a plan', function(done) {
      currentPlanFactory.isSubscribed.returns(false);

      plansFactory.showPurchaseOptions();

      setTimeout(function(){
        expect($modal.open).to.have.been.called;
        expect($modal.open).to.have.been.calledWithMatch({controller: 'PlansModalCtrl'});

        done();
      },10);
    });
  });

  describe("confirmAndPurchase:", function(){
    it("should show confirmation message and proceed to purchase on confirmation", function(done) {
      sinon.spy(plansFactory, "showPurchaseOptions");

      plansFactory.confirmAndPurchase();

      setTimeout(function() {        
        expect(confirmModalStub).to.have.been.calledWith(
          'Almost there!',
          'There aren\'t available licenses to assign. Subscribe to additional licenses?',
          'Yes', 'No', 'madero-style centered-modal',
          'partials/components/confirm-modal/madero-confirm-modal.html', 'sm'
        );
        expect(plansFactory.showPurchaseOptions).to.have.been.called;

        done();
      },10);
    });

    it("should not proceed to purchase if dismissed", function(done) {
      confirmModalStub.returns(Q.reject());
      sinon.spy(plansFactory, "showPurchaseOptions");

      plansFactory.confirmAndPurchase();

      setTimeout(function() {        
        expect(confirmModalStub).to.have.been.called;
        expect(plansFactory.showPurchaseOptions).to.not.have.been.called;

        done();
      },10);
    });
  });

  describe("initVolumePlanTrial:", function() {
    it("should update company settings", function() {
      plansFactory.initVolumePlanTrial();

      userState.updateCompanySettings.should.have.been.calledWith({
        planProductCode: VOLUME_PLAN.productCode,
        planTrialPeriod: VOLUME_PLAN.trialPeriod,
        planTrialExpiryDate: sinon.match.date,
        planSubscriptionStatus: "Trial",
        playerProTotalLicenseCount: VOLUME_PLAN.proLicenseCount,
        playerProAvailableLicenseCount: VOLUME_PLAN.proLicenseCount
      });

    });
    
    it("should calculate trial expiry", function() {
      plansFactory.initVolumePlanTrial();

      var plan = userState.updateCompanySettings.getCall(0).args[0];
      var daysDiff = function (date1, date2) {
        return Math.ceil(Math.abs((date1 - date2) / 1000 / 60 / 60 / 24));
      };

      expect(daysDiff(plan.planTrialExpiryDate, new Date())).to.equal(plan.planTrialPeriod);
    });
  });

  describe("showUnlockThisFeatureModal:", function() {
    it('should open Unlock This Feature Modal', function(){
      plansFactory.showUnlockThisFeatureModal();

      expect($modal.open).to.have.been.calledOnce;
      expect($modal.open).to.have.been.calledWith({
        templateUrl: 'partials/components/plans/unlock-this-feature-modal.html',
        controller: "confirmModalController",
        resolve: {
          cancelButton: null,
          confirmationButton: null,
          confirmationMessage: null,
          confirmationTitle: null
        },
        windowClass: 'madero-style centered-modal unlock-this-feature-modal',
        size: 'sm'
      });

      expect(analyticsFactory.track).to.have.been.calledWith('free user popup seen', {
        source: 'share schedule button'
      });
    });

    it('should open Plans Modal on confimation', function(done) {
      $modal.open.returns({result: Q.resolve()});

      plansFactory.showUnlockThisFeatureModal();

      setTimeout(function(){
        expect($modal.open).to.have.been.calledTwice;
        expect($modal.open).to.have.been.calledWithMatch({controller: "confirmModalController"});
        expect($modal.open).to.have.been.calledWithMatch({controller: 'PlansModalCtrl'});
        done();
      },10);
    });

    it('should not open Plans Modal if dismissed', function() {
      $modal.open.returns({result: Q.reject()});

      plansFactory.showUnlockThisFeatureModal();

      expect($modal.open).to.have.been.calledOnce;
      expect($modal.open).to.have.been.calledWithMatch({controller: "confirmModalController"});
      expect($modal.open).to.not.have.been.calledWithMatch({controller: 'PlansModalCtrl'});
    });
  });

});
