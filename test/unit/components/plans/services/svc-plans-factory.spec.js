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
    $provide.service("$state", function() {
      return {
        go: sinon.stub()
      };
    });
    $provide.factory('confirmModal', function() {
       return confirmModalStub = sinon.stub().returns(Q.resolve());
    });
    $provide.service("currentPlanFactory", function() {
      return {
        isParentPlan: sinon.stub().returns(false),
        currentPlan: {
          isPurchasedByParent: false,
          parentPlanContactEmail: "admin@test.com"
        }
      };
    });
    $provide.factory('messageBox', function() {
       return messageBoxStub = sinon.stub().returns(Q.resolve());
    });
  }));

  var sandbox, $modal, userState, plansFactory, analyticsFactory, $state,
    confirmModalStub, VOLUME_PLAN, currentPlanFactory, messageBoxStub;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    inject(function($injector) {
      $modal = $injector.get("$modal");
      userState =  $injector.get("userState");
      plansFactory = $injector.get("plansFactory");
      analyticsFactory = $injector.get("analyticsFactory");
      currentPlanFactory = $injector.get("currentPlanFactory");
      $state = $injector.get("$state");

      var plansService = $injector.get("plansService");
      VOLUME_PLAN = plansService.getVolumePlan();
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should exist", function() {
    expect(plansFactory).to.be.ok;
    expect(plansFactory.showPurchaseOptions).to.be.a('function');
    expect(plansFactory.initVolumePlanTrial).to.be.a('function');
  });

  it("showPurchaseOptions: ", function() {
    plansFactory.showPurchaseOptions('displayCount');

    $state.go.should.have.been.calledWith('apps.purchase.home', {
      displayCount: 'displayCount'
    });
  });

  describe("confirmAndPurchase:", function(){
    it("should show confirmation message and proceed to purchase on confirmation", function(done) {
      sinon.spy(plansFactory, "showPurchaseOptions");

      plansFactory.confirmAndPurchase('displayCount');

      setTimeout(function() {        
        expect(confirmModalStub).to.have.been.calledWith(
          'Almost there!',
          'There aren\'t available display licenses to assign to the selected displays. Subscribe to additional licenses?',
          'Yes', 'No', 'madero-style centered-modal',
          'partials/components/confirm-modal/madero-confirm-modal.html', 'sm'
        );
        expect(plansFactory.showPurchaseOptions).to.have.been.calledWith('displayCount');

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

    it("should show a message to contact administrator if plan is inherited from parent", function(done) {
      currentPlanFactory.isParentPlan.returns(true);
      sinon.spy(plansFactory, "showPurchaseOptions");

      plansFactory.confirmAndPurchase();

      setTimeout(function() {        
        expect(messageBoxStub).to.have.been.calledWith('Almost there!',
              'There aren\'t available display licenses to assign to the selected displays. Contact your account administrator at admin@test.com for additional display licenses.',
              'Okay, I Got It', 'madero-style centered-modal', 'partials/template-editor/message-box.html','sm');

        expect(confirmModalStub).to.not.have.been.called;
        expect(plansFactory.showPurchaseOptions).to.not.have.been.called;

        done();
      },10);

    });

    it("should show a message to contact administrator if plan is managed by parent", function(done) {
      currentPlanFactory.isParentPlan.returns(false);
      currentPlanFactory.currentPlan.isPurchasedByParent = true;

      plansFactory.confirmAndPurchase();

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

      plansFactory.showUnlockThisFeatureModal();

      setTimeout(function(){
        $state.go.should.have.been.calledWith('apps.purchase.home');

        done();
      },10);
    });

    it('should not open Plans Modal if dismissed', function() {
      $modal.open.returns({result: Q.reject()});

      plansFactory.showUnlockThisFeatureModal();

      expect($modal.open).to.have.been.calledOnce;
      expect($modal.open).to.have.been.calledWithMatch({controller: "confirmModalController"});

      $state.go.should.not.have.been.called;
    });
  });

});
