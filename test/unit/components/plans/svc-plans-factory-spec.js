/*jshint expr:true */
"use strict";

describe("Services: plans factory", function() {
  var storeApiFailure;

  beforeEach(module("risevision.common.components.plans"));
  beforeEach(module(function ($provide) {
    storeApiFailure = false;

    $provide.service("$q", function() {return Q;});
    $provide.service("$modal", function() {
      return {
        open: sinon.stub().returns({result: Q.defer().promise })
      };
    });
    $provide.service("storeAuthorization", function() {
      return storeAuthorization = {
        startTrial: sinon.spy(function() {
          return (startTrial ? Q.resolve() : Q.reject("error"));
        })
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

  var sandbox, $rootScope, $modal, userState, plansFactory;
  var storeAuthorization, startTrial;
  var VOLUME_PLAN;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    inject(function($injector, _$rootScope_) {
      $rootScope = _$rootScope_;
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
    expect(plansFactory.startVolumePlanTrial).to.be.a('function');
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

  describe("startVolumePlanTrial: ", function() {
    beforeEach(function() {
      startTrial = true;
    });

    it("should start trial: ", function(done) {
      plansFactory.startVolumePlanTrial()
        .then(function() {
          storeAuthorization.startTrial.should.have.been.calledWith(VOLUME_PLAN.productCode);

          done();
        }, done);
    });

    it("should update company settings", function(done) {
      plansFactory.startVolumePlanTrial()
        .then(function() {
          storeAuthorization.startTrial.should.have.been.called;

          userState.updateCompanySettings.should.have.been.calledWith({
            planProductCode: VOLUME_PLAN.productCode,
            planTrialPeriod: VOLUME_PLAN.trialPeriod,
            planSubscriptionStatus: "Trial",
            playerProTotalLicenseCount: VOLUME_PLAN.proLicenseCount,
            playerProAvailableLicenseCount: VOLUME_PLAN.proLicenseCount
          });

          done();
        });
    });

    it("should handle failure to start the trial", function(done) {
      startTrial = false;

      plansFactory.startVolumePlanTrial()
        .then(function() {
          done("fail");
        }, function(err) {
          expect(err).to.equal("error");

          storeAuthorization.startTrial.should.have.been.called;

          userState.updateCompanySettings.should.not.have.been.called;

          done();
        });
    });
  });

});
