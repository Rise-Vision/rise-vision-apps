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
  }));

  var sandbox, $modal, userState, plansFactory;
  var VOLUME_PLAN;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    inject(function($injector) {
      $modal = $injector.get("$modal");
      userState =  $injector.get("userState");
      plansFactory = $injector.get("plansFactory");

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

  it("initVolumePlanTrial: ", function() {
    plansFactory.initVolumePlanTrial();

    userState.updateCompanySettings.should.have.been.calledWith({
      planProductCode: VOLUME_PLAN.productCode,
      planTrialPeriod: VOLUME_PLAN.trialPeriod,
      planSubscriptionStatus: "Trial",
      playerProTotalLicenseCount: VOLUME_PLAN.proLicenseCount,
      playerProAvailableLicenseCount: VOLUME_PLAN.proLicenseCount
    });
  });

});
