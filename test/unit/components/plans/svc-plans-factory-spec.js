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
    $provide.service("storeAPILoader", function () {
      return function() {
        var deferred = Q.defer();
        var riseApiResponse = function() {
          return {
            execute: function(callback) {
              if (storeApiFailure) {
                callback({
                  error: "some error"
                });
              }
              else {
                callback({
                  result: {},
                  item: {}
                });
              }
            }
          };
        };

        deferred.resolve({
          product: {
            list: riseApiResponse
          }
        });

        return deferred.promise;
      };
    });
    $provide.factory("getCompany", function() {
      return function() {return Q.resolve();};
    });
    $provide.service("subscriptionStatusService", function () {
      return {
        get: function() {},
        list: function() {}
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

  var sandbox, $rootScope, $modal, userState, plansFactory, subscriptionStatusService;
  var storeAuthorization, startTrial;
  var BASIC_PLAN_CODE, ADVANCED_PLAN_CODE, ENTERPRISE_PLAN_CODE, VOLUME_PLAN_CODE;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    inject(function($injector, _$rootScope_) {
      $rootScope = _$rootScope_;
      $modal = $injector.get("$modal");
      userState =  $injector.get("userState");
      plansFactory = $injector.get("plansFactory");
      subscriptionStatusService = $injector.get("subscriptionStatusService");

      var plansByType = _.keyBy($injector.get("PLANS_LIST"), "type");

      BASIC_PLAN_CODE = plansByType.basic.productCode;
      ADVANCED_PLAN_CODE = plansByType.advanced.productCode;
      ENTERPRISE_PLAN_CODE = plansByType.enterprise.productCode;
      VOLUME_PLAN_CODE = plansByType.volume.productCode;
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should exist", function() {
    expect(plansFactory).to.be.ok;
    expect(plansFactory.getPlansDetails).to.be.a("function");
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

  describe("getPlansDetails: ", function() {
    beforeEach(function() {
      sandbox.stub(subscriptionStatusService, "list").returns(Q.resolve([
        { pc: BASIC_PLAN_CODE, status: "Subscribed" },
        { pc: ADVANCED_PLAN_CODE, status: "Not Subscribed" },
        { pc: ENTERPRISE_PLAN_CODE, status: "Suspended" }
      ]));      
    });
    it("should return existing plans", function(done) {
      plansFactory.getPlansDetails()
      .then(function(resp) {
        expect(resp.length).to.equal(5);
        expect(resp[0].productId).to.equal("000");
        expect(resp[0].name).to.equal("Free");
        expect(resp[2].productId).to.equal("289");
        expect(resp[2].name).to.equal("Basic");
        done();
      });
    });

    it("should return populated statuses", function(done) {
      plansFactory.getPlansDetails()
      .then(function(resp) {
        expect(resp[2].status).to.equal("Subscribed");
        expect(resp[3].status).to.equal("Not Subscribed");
        expect(resp[4].status).to.equal("Suspended");
        done();
      });
    });
  });

  describe("startTrial: ", function() {
    var plan = {
      name: "Advanced",
      type: "advanced",
      productCode: "93b5595f0d7e4c04a3baba1102ffaecb17607bf4",
      proLicenseCount: 11,
      trialPeriod: 14
    };
    
    beforeEach(function() {
      startTrial = true;
    });

    it("should start the trial and update company settings", function(done) {
      plansFactory.startTrial(plan)
        .then(function() {
          storeAuthorization.startTrial.should.have.been.calledWith(plan.productCode);

          userState.updateCompanySettings.should.have.been.calledWith({
            planProductCode: plan.productCode,
            planTrialPeriod: plan.trialPeriod,
            planSubscriptionStatus: "Trial",
            playerProTotalLicenseCount: plan.proLicenseCount,
            playerProAvailableLicenseCount: plan.proLicenseCount
          });

          done();
        });
    });

    it("should handle failure to start the trial", function(done) {
      startTrial = false;

      plansFactory.startTrial(plan)
        .then(function() {
          done("fail");
        }, function(err) {
          expect(err).to.equal("error");

          storeAuthorization.startTrial.should.have.been.calledWith(plan.productCode);

          userState.updateCompanySettings.should.not.have.been.called;

          done();
        });
    });

    it("startVolumePlanTrial: ", function(done) {
      plansFactory.startVolumePlanTrial()
        .then(function() {
          storeAuthorization.startTrial.should.have.been.calledWith(VOLUME_PLAN_CODE);

          done();
        }, done);
    });
  });

});
