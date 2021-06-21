/*jshint expr:true */
"use strict";

describe("Services: current plan factory", function() {

  beforeEach(module("risevision.common.components.plans"));
  beforeEach(module(function ($provide) {
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
    $provide.service("$state", function() {
      return {
        go: sinon.stub()
      };
    });
    $provide.factory('confirmModal', function() {
       return confirmModalStub = sinon.stub().returns(Q.resolve());
    });

    $provide.factory('messageBox', function() {
       return messageBoxStub = sinon.stub().returns(Q.resolve());
    });

  }));

  var sandbox, $rootScope, $modal, currentPlanFactory, userState, analyticsFactory, $state,
    confirmModalStub, messageBoxStub;
  var VOLUME_PLAN, BASIC_PLAN_CODE, BASIC_PLAN_ID, ADVANCED_PLAN_CODE, ENTERPRISE_PLAN_CODE;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    inject(function($injector, _$rootScope_) {
      $rootScope = _$rootScope_;
      $state = $injector.get("$state");
      $modal = $injector.get("$modal");
      userState =  $injector.get("userState");
      analyticsFactory = $injector.get("analyticsFactory");

      currentPlanFactory = $injector.get("currentPlanFactory");


      var plansService = $injector.get("plansService");
      VOLUME_PLAN = plansService.getVolumePlan();

      var plansByType = _.keyBy($injector.get("PLANS_LIST"), "type");

      BASIC_PLAN_CODE = plansByType.basic.productCode;
      BASIC_PLAN_ID = plansByType.basic.productId;
      ADVANCED_PLAN_CODE = plansByType.advanced.productCode;
      ENTERPRISE_PLAN_CODE = plansByType.enterprise.productCode;
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should exist", function() {
    expect(currentPlanFactory).to.be.ok;
    expect(currentPlanFactory.isPlanActive).to.be.a("function");
    expect(currentPlanFactory.isFree).to.be.a("function");
    expect(currentPlanFactory.isParentPlan).to.be.a("function");
    expect(currentPlanFactory.isSubscribed).to.be.a("function");
    expect(currentPlanFactory.isOnTrial).to.be.a("function");
    expect(currentPlanFactory.isTrialExpired).to.be.a("function");
    expect(currentPlanFactory.isSuspended).to.be.a("function");
    expect(currentPlanFactory.isCancelled).to.be.a("function");
    expect(currentPlanFactory.isCancelledActive).to.be.a("function");

    expect(currentPlanFactory.showPurchaseOptions).to.be.a('function');
    expect(currentPlanFactory.initVolumePlanTrial).to.be.a('function');
  });

  describe("initialization", function() {
    it("should load the current plan when selected company changes", function(done) {
      sandbox.spy($rootScope, "$emit");
      sandbox.stub(userState, "getSelectedCompanyId").returns("companyId");
      sandbox.stub(userState, "getCopyOfSelectedCompany").returns({
        id: "companyId",
        planProductCode: BASIC_PLAN_CODE,
        planSubscriptionId: "subscriptionId",
        planSubscriptionStatus: "Subscribed",
        planCurrentPeriodEndDate: "Jan 1, 2018",
        planTrialExpiryDate: "Jan 14, 2018",
        playerProTotalLicenseCount: 3,
        playerProAvailableLicenseCount: 1
      });

      $rootScope.$emit("risevision.company.selectedCompanyChanged");
      $rootScope.$digest();

      setTimeout(function () {
        expect($rootScope.$emit).to.have.been.called;
        expect(currentPlanFactory.currentPlan).to.be.not.null;
        expect(currentPlanFactory.currentPlan.type).to.equal("basic");
        expect(currentPlanFactory.currentPlan.subscriptionId).to.equal("subscriptionId");
        expect(currentPlanFactory.currentPlan.status).to.equal("Subscribed");
        expect(currentPlanFactory.currentPlan.currentPeriodEndDate.getTime()).to.equal(new Date("Jan 1, 2018").getTime());
        expect(currentPlanFactory.currentPlan.trialExpiryDate.getTime()).to.equal(new Date("Jan 14, 2018").getTime());
        expect(currentPlanFactory.currentPlan.playerProTotalLicenseCount).to.equal(3);
        expect(currentPlanFactory.currentPlan.playerProAvailableLicenseCount).to.equal(1);

        expect(currentPlanFactory.currentPlan.isParentPlan).to.not.be.ok;

        done();
      }, 0);
    });

    it("should use shared Parent Company plan if no Plan is available for the Company", function(done) {
      sandbox.spy($rootScope, "$emit");
      sandbox.stub(userState, "getSelectedCompanyId").returns("companyId");
      sandbox.stub(userState, "getCopyOfSelectedCompany").returns({
        id: "companyId",
        playerProTotalLicenseCount: 3,
        playerProAvailableLicenseCount: 1,
        shareCompanyPlan: true,
        parentPlanProductCode: ADVANCED_PLAN_CODE,
        planSubscriptionId: "subscriptionId",
        parentPlanCompanyName: "parentName",
        parentPlanContactEmail: "administratorEmail"
      });

      $rootScope.$emit("risevision.company.selectedCompanyChanged");
      $rootScope.$digest();

      setTimeout(function () {
        expect($rootScope.$emit).to.have.been.called;
        expect(currentPlanFactory.currentPlan).to.be.not.null;
        expect(currentPlanFactory.currentPlan.type).to.equal("advanced");
        expect(currentPlanFactory.currentPlan.subscriptionId).to.equal("subscriptionId");
        expect(currentPlanFactory.currentPlan.status).to.equal("Active");
        expect(currentPlanFactory.currentPlan.playerProTotalLicenseCount).to.equal(3);
        expect(currentPlanFactory.currentPlan.playerProAvailableLicenseCount).to.equal(1);

        expect(currentPlanFactory.currentPlan.shareCompanyPlan).to.be.true;
        expect(currentPlanFactory.currentPlan.isParentPlan).to.be.true;
        expect(currentPlanFactory.currentPlan.parentPlanCompanyName).to.equal("parentName");
        expect(currentPlanFactory.currentPlan.parentPlanContactEmail).to.equal("administratorEmail");

        done();
      }, 0);
    });

    it("should give priority to Parent Company plan when available", function(done) {
      sandbox.spy($rootScope, "$emit");
      sandbox.stub(userState, "getSelectedCompanyId").returns("companyId");
      sandbox.stub(userState, "getCopyOfSelectedCompany").returns({
        id: "companyId",
        planProductCode: BASIC_PLAN_CODE,
        planSubscriptionStatus: "Subscribed",
        planCurrentPeriodEndDate: "Jan 1, 2018",
        planTrialExpiryDate: "Jan 14, 2018",
        playerProTotalLicenseCount: 3,
        playerProAvailableLicenseCount: 1,
        shareCompanyPlan: true,
        parentPlanProductCode: ADVANCED_PLAN_CODE,
        parentPlanCompanyName: "parentName",
        parentPlanContactEmail: "administratorEmail"
      });

      $rootScope.$emit("risevision.company.selectedCompanyChanged");
      $rootScope.$digest();

      setTimeout(function () {
        expect($rootScope.$emit).to.have.been.called;
        expect(currentPlanFactory.currentPlan).to.be.not.null;
        expect(currentPlanFactory.currentPlan.type).to.equal("advanced");
        expect(currentPlanFactory.currentPlan.status).to.equal("Active");
        expect(currentPlanFactory.currentPlan.playerProTotalLicenseCount).to.equal(3);
        expect(currentPlanFactory.currentPlan.playerProAvailableLicenseCount).to.equal(1);

        expect(currentPlanFactory.currentPlan.shareCompanyPlan).to.be.true;
        expect(currentPlanFactory.currentPlan.isParentPlan).to.be.true;
        expect(currentPlanFactory.currentPlan.parentPlanCompanyName).to.equal("parentName");
        expect(currentPlanFactory.currentPlan.parentPlanContactEmail).to.equal("administratorEmail");

        done();
      }, 0);
    });

    it("should correctly load the plan information when On Trial", function(done) {
      sandbox.spy($rootScope, "$emit");
      sandbox.stub(userState, "getCopyOfSelectedCompany").returns({
        id: "companyId",
        planProductCode: BASIC_PLAN_CODE,
        planSubscriptionStatus: "Trial",
        planTrialPeriod: 23,
        playerProTotalLicenseCount: 3,
        playerProAvailableLicenseCount: 1
      });

      $rootScope.$emit("risevision.company.selectedCompanyChanged");
      $rootScope.$digest();

      setTimeout(function () {
        expect($rootScope.$emit).to.have.been.called;
        expect(currentPlanFactory.currentPlan).to.be.not.null;
        expect(currentPlanFactory.currentPlan.type).to.equal("basic");
        expect(currentPlanFactory.currentPlan.status).to.equal("Trial");
        expect(currentPlanFactory.currentPlan.trialPeriod).to.equal(23);
        expect(currentPlanFactory.currentPlan.playerProTotalLicenseCount).to.equal(3);
        expect(currentPlanFactory.currentPlan.playerProAvailableLicenseCount).to.equal(1);
        expect(currentPlanFactory.currentPlan.parentPlanCompanyName).to.be.undefined;
        expect(currentPlanFactory.currentPlan.parentPlanContactEmail).to.be.undefined;

        done();
      }, 0);
    });

    it("should default to Free Plan if productCode is not defined", function(done) {
      sandbox.spy($rootScope, "$emit");
      sandbox.stub(userState, "getCopyOfSelectedCompany").returns({
        id: "companyId"
      });

      $rootScope.$emit("risevision.company.selectedCompanyChanged");
      $rootScope.$digest();

      setTimeout(function () {
        expect($rootScope.$emit).to.have.been.called;
        expect(currentPlanFactory.currentPlan).to.be.not.null;
        expect(currentPlanFactory.currentPlan.type).to.equal("free");
        expect(currentPlanFactory.currentPlan.status).to.equal("Active");
        expect(currentPlanFactory.currentPlan.parentPlanCompanyName).to.be.undefined;
        expect(currentPlanFactory.currentPlan.parentPlanContactEmail).to.be.undefined;

        done();
      }, 0);
    });
    
    describe("currentPlan.isPurchasedByParent: ", function() {
      it("should be false if billToId is missing", function(done) {
        sandbox.stub(userState, "getSelectedCompanyId").returns("companyId");
        sandbox.stub(userState, "getCopyOfSelectedCompany").returns({
          id: "companyId",
          playerProTotalLicenseCount: 3,
          playerProAvailableLicenseCount: 1,
          shareCompanyPlan: true,
          planShipToId: "shipToId",
          planProductCode: ADVANCED_PLAN_CODE,
          parentPlanCompanyName: "parentName",
          parentPlanContactEmail: "administratorEmail"
        });

        $rootScope.$emit("risevision.company.selectedCompanyChanged");
        $rootScope.$digest();

        setTimeout(function () {
          expect(currentPlanFactory.currentPlan).to.be.not.null;
          expect(currentPlanFactory.currentPlan.isPurchasedByParent).to.be.false;

          done();
        }, 0);

      });

      it("should be false if shipToId is missing", function(done) {
        sandbox.stub(userState, "getSelectedCompanyId").returns("companyId");
        sandbox.stub(userState, "getCopyOfSelectedCompany").returns({
          id: "companyId",
          playerProTotalLicenseCount: 3,
          playerProAvailableLicenseCount: 1,
          shareCompanyPlan: true,
          planShipToId: "shipToId",
          planProductCode: ADVANCED_PLAN_CODE,
          parentPlanCompanyName: "parentName",
          parentPlanContactEmail: "administratorEmail"
        });

        $rootScope.$emit("risevision.company.selectedCompanyChanged");
        $rootScope.$digest();

        setTimeout(function () {
          expect(currentPlanFactory.currentPlan).to.be.not.null;
          expect(currentPlanFactory.currentPlan.isPurchasedByParent).to.be.false;

          done();
        }, 0);

      });

      it("should be true if shipToId differs from billToId and plan is Active", function(done) {
        sandbox.stub(userState, "getSelectedCompanyId").returns("companyId");
        sandbox.stub(userState, "getCopyOfSelectedCompany").returns({
          id: "companyId",
          playerProTotalLicenseCount: 3,
          playerProAvailableLicenseCount: 1,
          shareCompanyPlan: true,
          planSubscriptionStatus: "Active",
          planShipToId: "shipToId",
          planBillToId: "billToId",
          planProductCode: ADVANCED_PLAN_CODE,
          parentPlanCompanyName: "parentName",
          parentPlanContactEmail: "administratorEmail"
        });

        $rootScope.$emit("risevision.company.selectedCompanyChanged");
        $rootScope.$digest();

        setTimeout(function () {
          expect(currentPlanFactory.currentPlan).to.be.not.null;
          expect(currentPlanFactory.currentPlan.isPurchasedByParent).to.be.true;

          done();
        }, 0);

      });

      it("should be false if shipToId differs from billToId and plan is Cancelled", function(done) {
        sandbox.stub(userState, "getSelectedCompanyId").returns("companyId");
        sandbox.stub(userState, "getCopyOfSelectedCompany").returns({
          id: "companyId",
          playerProTotalLicenseCount: 3,
          playerProAvailableLicenseCount: 1,
          shareCompanyPlan: true,
          planSubscriptionStatus: "Cancelled",
          planShipToId: "shipToId",
          planBillToId: "billToId",
          planProductCode: ADVANCED_PLAN_CODE,
          parentPlanCompanyName: "parentName",
          parentPlanContactEmail: "administratorEmail"
        });

        $rootScope.$emit("risevision.company.selectedCompanyChanged");
        $rootScope.$digest();

        setTimeout(function () {
          expect(currentPlanFactory.currentPlan).to.be.not.null;
          expect(currentPlanFactory.currentPlan.isPurchasedByParent).to.be.false;

          done();
        }, 0);

      });

      it("should be false if shipToId and billToId are the same", function(done) {
        sandbox.stub(userState, "getSelectedCompanyId").returns("companyId");
        sandbox.stub(userState, "getCopyOfSelectedCompany").returns({
          id: "companyId",
          playerProTotalLicenseCount: 3,
          playerProAvailableLicenseCount: 1,
          shareCompanyPlan: true,
          planShipToId: "billToId",
          planBillToId: "billToId",
          planProductCode: ADVANCED_PLAN_CODE,
          parentPlanCompanyName: "parentName",
          parentPlanContactEmail: "administratorEmail"
        });

        $rootScope.$emit("risevision.company.selectedCompanyChanged");
        $rootScope.$digest();

        setTimeout(function () {
          expect(currentPlanFactory.currentPlan).to.be.not.null;
          expect(currentPlanFactory.currentPlan.isPurchasedByParent).to.be.false;

          done();
        }, 0);

      });      
    });
  });

  describe("Plan active: ", function() {
    it("should return the plan is active when Subscribed", function() {
      sandbox.stub(currentPlanFactory, "isSubscribed").returns(true);
      expect(currentPlanFactory.isPlanActive()).to.be.true;
    });

    it("should return the plan is active when On Trial", function() {
      sandbox.stub(currentPlanFactory, "isOnTrial").returns(true);
      expect(currentPlanFactory.isPlanActive()).to.be.true;
    });

    it("should return the plan is active when canceled but still active", function() {
      sandbox.stub(currentPlanFactory, "isCancelledActive").returns(true);
      expect(currentPlanFactory.isPlanActive()).to.be.true;
    });

    it("should return the plan is not active otherwise", function() {
      sandbox.stub(currentPlanFactory, "isTrialExpired").returns(true);
      expect(currentPlanFactory.isPlanActive()).to.be.false;
    });
  });

  describe("Free plan: ", function() {
    it("should return the plan is Free", function() {
      currentPlanFactory.currentPlan = { type: "free" };
      expect(currentPlanFactory.isFree()).to.be.true;
    });

    it("should return the plan is not Free", function() {
      currentPlanFactory.currentPlan = { type: "advanced" };
      expect(currentPlanFactory.isFree()).to.be.false;
    });
  });

  describe("Parent plan: ", function() {
    it("should return the plan is inherited from the Parent", function() {
      currentPlanFactory.currentPlan = { isParentPlan: true };
      expect(currentPlanFactory.isParentPlan()).to.be.true;
    });

    it("should return the plan is not inherited from the Parent", function() {
      currentPlanFactory.currentPlan = {};
      expect(currentPlanFactory.isParentPlan()).to.be.false;
    });
  });

  describe("Enterprise Sub Company plan: ", function() {
    it("should return the plan is Enterprise Sub Company", function() {
      currentPlanFactory.currentPlan = { type: "enterprisesub" };
      expect(currentPlanFactory.isEnterpriseSubCompany()).to.be.true;
    });

    it("should return the plan is not Enterprise Sub Company", function() {
      currentPlanFactory.currentPlan = { type: "advanced" };
      expect(currentPlanFactory.isEnterpriseSubCompany()).to.be.false;
    });
  });

  describe("Subscribed status: ", function() {
    it("should return the subscription status is Subscribed", function() {
      currentPlanFactory.currentPlan = { status: "Active" };
      expect(currentPlanFactory.isSubscribed()).to.be.true;
    });

    it("should return the subscription status is not Subscribed", function() {
      currentPlanFactory.currentPlan = { status: "Cancelled" };
      expect(currentPlanFactory.isSubscribed()).to.be.false;
    });
  });

  describe("On Trial status: ", function() {
    it("should return the subscription status is On Trial", function() {
      currentPlanFactory.currentPlan = { status: "Trial" };
      expect(currentPlanFactory.isOnTrial()).to.be.true;
    });

    it("should return the subscription status is not On Trial", function() {
      currentPlanFactory.currentPlan = { status: "Cancelled" };
      expect(currentPlanFactory.isOnTrial()).to.be.false;
    });
  });

  describe("Trial Expired status: ", function() {
    it("should return the subscription status is Trial Expired", function() {
      currentPlanFactory.currentPlan = { status: "Trial Expired" };
      expect(currentPlanFactory.isTrialExpired()).to.be.true;
    });

    it("should return the subscription status is not Trial Expired", function() {
      currentPlanFactory.currentPlan = { status: "Cancelled" };
      expect(currentPlanFactory.isTrialExpired()).to.be.false;
    });
  });

  describe("Suspended status: ", function() {
    it("should return the subscription status is Suspended", function() {
      currentPlanFactory.currentPlan = { status: "Suspended" };
      expect(currentPlanFactory.isSuspended()).to.be.true;
    });

    it("should return the subscription status is not Suspended", function() {
      currentPlanFactory.currentPlan = { status: "Cancelled" };
      expect(currentPlanFactory.isSuspended()).to.be.false;
    });
  });

  describe("Cancelled status: ", function() {
    it("should return the subscription status is Cancelled", function() {
      currentPlanFactory.currentPlan = { status: "Cancelled" };
      expect(currentPlanFactory.isCancelled()).to.be.true;
    });

    it("should return the subscription status is not Cancelled", function() {
      currentPlanFactory.currentPlan = { status: "Suspended" };
      expect(currentPlanFactory.isCancelled()).to.be.false;
    });
  });

  describe("Cancelled Active status: ", function() {
    var clock;

    beforeEach(function() {
      clock = sandbox.useFakeTimers(new Date(2018, 1, 1).getTime());
    });

    it("should return not Active if currentPeriodEndDate is missing", function() {
      currentPlanFactory.currentPlan = { status: "Cancelled" };
      expect(currentPlanFactory.isCancelledActive()).to.be.false;
    });

    it("should return Active if currentPeriodEndDate is after today", function() {
      currentPlanFactory.currentPlan = { 
        status: "Cancelled",
        currentPeriodEndDate: new Date(2018, 1, 2)
      };
      expect(currentPlanFactory.isCancelledActive()).to.be.true;
    });

    it("should return not Active if currentPeriodEndDate is before today", function() {
      currentPlanFactory.currentPlan = { 
        status: "Cancelled",
        currentPeriodEndDate: new Date(2017, 12, 31)
      };
      expect(currentPlanFactory.isCancelledActive()).to.be.false;
    });

    it("should return not Active if status it not Cancelled", function() {
      currentPlanFactory.currentPlan = { status: "Suspended" };
      expect(currentPlanFactory.isCancelledActive()).to.be.false;
    });
  });

  describe("isUnlimitedPlan:", function() {
    it("should return true is plan type is unlimited", function() {
      currentPlanFactory.currentPlan = { type: "unlimited" };
      expect(currentPlanFactory.isUnlimitedPlan()).to.be.true;
    });

    it("should return false is plan type is not unlimited", function() {
      currentPlanFactory.currentPlan = { type: "other" };
      expect(currentPlanFactory.isUnlimitedPlan()).to.be.false;
    });

    it("should return false is plan type is missing", function() {
      currentPlanFactory.currentPlan = {};
      expect(currentPlanFactory.isUnlimitedPlan()).to.be.false;
    });
  });

  // plans factory
  it("showPurchaseOptions: ", function() {
    currentPlanFactory.showPurchaseOptions('displayCount');

    $state.go.should.have.been.calledWith('apps.purchase.home', {
      displayCount: 'displayCount'
    });
  });

  describe("confirmAndPurchase:", function(){
    beforeEach(function() {
      currentPlanFactory.currentPlan = {
        isParentPlan: false,
        isPurchasedByParent: false,
        parentPlanContactEmail: "admin@test.com"
      };
    });

    it("should show confirmation message and proceed to purchase on confirmation", function(done) {
      sinon.spy(currentPlanFactory, "showPurchaseOptions");

      currentPlanFactory.confirmAndPurchase('displayCount');

      setTimeout(function() {        
        expect(confirmModalStub).to.have.been.calledWith(
          'Almost there!',
          'There aren\'t available display licenses to assign to the selected displays. Subscribe to additional licenses?',
          'Yes', 'No', 'madero-style centered-modal',
          'partials/components/confirm-modal/madero-confirm-modal.html', 'sm'
        );
        expect(currentPlanFactory.showPurchaseOptions).to.have.been.calledWith('displayCount');

        done();
      },10);
    });

    it("should not proceed to purchase if dismissed", function(done) {
      confirmModalStub.returns(Q.reject());
      sinon.spy(currentPlanFactory, "showPurchaseOptions");

      currentPlanFactory.confirmAndPurchase();

      setTimeout(function() {        
        expect(confirmModalStub).to.have.been.called;
        expect(currentPlanFactory.showPurchaseOptions).to.not.have.been.called;

        done();
      },10);
    });

    it("should show a message to contact administrator if plan is inherited from parent", function(done) {
      currentPlanFactory.currentPlan.isParentPlan = true;
      sinon.spy(currentPlanFactory, "showPurchaseOptions");

      currentPlanFactory.confirmAndPurchase();

      setTimeout(function() {        
        expect(messageBoxStub).to.have.been.calledWith('Almost there!',
              'There aren\'t available display licenses to assign to the selected displays. Contact your account administrator at admin@test.com for additional display licenses.',
              'Okay, I Got It', 'madero-style centered-modal', 'partials/template-editor/message-box.html','sm');

        expect(confirmModalStub).to.not.have.been.called;
        expect(currentPlanFactory.showPurchaseOptions).to.not.have.been.called;

        done();
      },10);

    });

    it("should show a message to contact administrator if plan is managed by parent", function(done) {
      currentPlanFactory.currentPlan.isPurchasedByParent = true;

      currentPlanFactory.confirmAndPurchase();

      setTimeout(function() {        
        expect(messageBoxStub).to.have.been.calledWith('Almost there!',
              'There aren\'t available display licenses to assign to the selected displays. Contact your account administrator at admin@test.com for additional display licenses.',
              'Okay, I Got It', 'madero-style centered-modal', 'partials/template-editor/message-box.html','sm');
        done();
      },10);
    });

  });


  describe("initVolumePlanTrial:", function() {
    it("should update company settings", function() {
      currentPlanFactory.initVolumePlanTrial();

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
      currentPlanFactory.initVolumePlanTrial();

      var plan = userState.updateCompanySettings.getCall(0).args[0];
      var daysDiff = function (date1, date2) {
        return Math.ceil(Math.abs((date1 - date2) / 1000 / 60 / 60 / 24));
      };

      expect(daysDiff(plan.planTrialExpiryDate, new Date())).to.equal(plan.planTrialPeriod);
    });
  });

  describe("showUnlockThisFeatureModal:", function() {
    it('should open Unlock This Feature Modal', function(){
      currentPlanFactory.showUnlockThisFeatureModal();

      expect($modal.open).to.have.been.calledOnce;
      expect($modal.open).to.have.been.calledWith({
        templateUrl: 'partials/plans/unlock-this-feature-modal.html',
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

      currentPlanFactory.showUnlockThisFeatureModal();

      setTimeout(function(){
        $state.go.should.have.been.calledWith('apps.purchase.home');

        done();
      },10);
    });

    it('should not open Plans Modal if dismissed', function() {
      $modal.open.returns({result: Q.reject()});

      currentPlanFactory.showUnlockThisFeatureModal();

      expect($modal.open).to.have.been.calledOnce;
      expect($modal.open).to.have.been.calledWithMatch({controller: "confirmModalController"});

      $state.go.should.not.have.been.called;
    });
  });

});
