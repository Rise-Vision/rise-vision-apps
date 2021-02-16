/*jshint expr:true */
"use strict";

describe("Services: stripe loader", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});
    $provide.service("userState",function () {
      return {
        getCopyOfUserCompany: function() {
          return {
            isTest: true
          };
        }
      };
    });

  }));
  var stripeLoader, $window, $interval, STRIPE_TEST_KEY;
  beforeEach(function() {

    inject(function($injector) {
      STRIPE_TEST_KEY = $injector.get("STRIPE_TEST_KEY");
      $interval = $injector.get("$interval");
      $window = $injector.get("$window");
      stripeLoader = $injector.get("stripeLoader");
    });
  });

  afterEach( function() {
    delete $window.Stripe;
  });

  it("should exist", function() {
    expect(stripeLoader).to.be.ok;
    expect(stripeLoader).to.be.a("function");
  });
  
  it("should return a promise", function() {
    expect(stripeLoader().then).to.be.a("function");
  });

  it("should not resolve if Stripe object is not present", function(done) {
    stripeLoader()
    .then(function() {
      done("failed");
    });

    $interval.flush(100);

    done();
  });

  it("should resolve once stripe object is found", function(done) {
    $window.Stripe = function() {return 1;};

    stripeLoader()
    .then(function(result) {
      expect(result).to.be.ok;

      done();
    })
    .then(null,done);

    $interval.flush(100);
  });

  it("should initialize with the key", function(done) {
    $window.Stripe = sinon.spy();

    stripeLoader()
    .then(function() {
      expect($window.Stripe).to.have.been.calledWith(STRIPE_TEST_KEY);

      done();
    })
    .then(null,done);

    $interval.flush(100);
  });

});
