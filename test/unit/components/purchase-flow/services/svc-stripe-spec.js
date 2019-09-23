/*jshint expr:true */
"use strict";

describe("Services: stripe service", function() {
  beforeEach(module("risevision.common.components.purchase-flow"));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});
    $provide.service("stripeLoader", function() {
      return function() {
        return Q.resolve(stripeClient = {
          card: {
            createToken: sinon.spy(function(obj, callback) {
              callback("status", createTokenResponse);
            })
          }
        });
      };
    });
  }));

  var $window, cardObject, stripeService, stripeClient, STRIPE_ERRORS;
  var createTokenResponse;

  beforeEach(function() {
    cardObject = {
      number: "number",
      cvc: "cvc",
      expMonth: "month",
      expYear: "year"
    };

    inject(function($injector) {
      STRIPE_ERRORS = $injector.get("STRIPE_ERRORS");
      $window = $injector.get("$window");
      stripeService = $injector.get("stripeService");
    });
  });

  it("should exist", function() {
    expect(stripeService).to.be.ok;
    expect(stripeService.validateCard).to.be.a("function");
    expect(stripeService.createToken).to.be.a("function");
  });

  describe("validateCard: ", function() {
    beforeEach(function() {
      $window.Stripe = {
        card: {
          validateCardNumber: sinon.stub().returns(true),
          validateCVC: sinon.stub().returns(true),
          validateExpiry: sinon.stub().returns(true)
        }
      };
    });

    afterEach(function() {
      delete $window.Stripe;
    });

    it("should return Processing Error if Stripe is not found", function() {
      delete $window.Stripe;

      var errors = stripeService.validateCard(cardObject);

      expect(errors).to.be.an("array");
      expect(errors).to.have.length(1);
      expect(errors[0]).to.equal(STRIPE_ERRORS.processing_error);
    });

    it("should return no errors if all valid", function() {
      var errors = stripeService.validateCard(cardObject, true);

      expect(errors).to.be.an("array");
      expect(errors).to.have.length(0);
    });

    it("should validate all fields for new cards", function() {
      stripeService.validateCard(cardObject, true);

      $window.Stripe.card.validateCardNumber.should.have.been.calledWith("number");
      $window.Stripe.card.validateCVC.should.have.been.calledWith("cvc");
      $window.Stripe.card.validateExpiry.should.have.been.calledWith("month", "year");
    });

    it("should return only check Expiry if card is not new", function() {
      stripeService.validateCard(cardObject, false);

      $window.Stripe.card.validateCardNumber.should.not.have.been.called;
      $window.Stripe.card.validateCVC.should.not.have.been.called;
      $window.Stripe.card.validateExpiry.should.have.been.calledWith("month", "year");
    });

    it("should return all errors", function() {
      $window.Stripe.card.validateCardNumber.returns(false);
      $window.Stripe.card.validateCVC.returns(false);
      $window.Stripe.card.validateExpiry.returns(false);

      var errors = stripeService.validateCard(cardObject, true);

      expect(errors).to.be.an("array");
      expect(errors).to.have.length(3);
      expect(errors[0]).to.equal(STRIPE_ERRORS.invalid_number);
      expect(errors[1]).to.equal(STRIPE_ERRORS.invalid_cvc);
      expect(errors[2]).to.equal("Invalid Expiry Date.");
    });

  });

  describe("createToken: ", function() {
    var card, address;

    beforeEach(function() {
      card = {
        tokenError: "error",
        number: "number",
        cvc: "cvc",
        expMonth: "expMonth",
        expYear: "expYear",
        name: "name"
      };

      address = {
        street: "street",
        unit: "unit",
        city: "city",
        province: "province",
        postalCode: "postalCode",
        country: "country"
      };
    });

    it("should return a promise", function() {
      expect(stripeService.createToken(card, address).then).to.be.a("function");
    });

    it("should reset tokenError", function() {
      stripeService.createToken(card, address);

      expect(card.tokenError).to.not.be.ok;
    });

    it("should copy all the card and address fields", function(done) {
      stripeService.createToken(card, address);

      setTimeout(function() {
        stripeClient.card.createToken.should.have.been.calledWith(sinon.match.object, sinon.match.func);
        expect(stripeClient.card.createToken.getCall(0).args[0]).to.deep.equal({
          number: "number",
          cvc: "cvc",
          exp_month: "expMonth",
          exp_year: "expYear",
          name: "name",
          address_line1: "street",
          address_line2: "unit",
          address_city: "city",
          address_state: "province",
          address_zip: "postalCode",
          address_country: "country"
        });

        done();
      }, 10);
    });

    it("should reject on undefined response", function(done) {
      createTokenResponse = null;

      stripeService.createToken(card, address)
      .then(done, function() {
        expect(card.tokenError).to.be.ok;
        expect(card.tokenError).to.equal(STRIPE_ERRORS.processing_error);

        done();
      })
      .then(null,done);

    });

    it("should reject if no card is received", function(done) {
      createTokenResponse = {};

      stripeService.createToken(card, address)
      .then(done, function() {
        expect(card.tokenError).to.be.ok;
        expect(card.tokenError).to.equal(STRIPE_ERRORS.processing_error);

        done();
      })
      .then(null,done);

    });

    it("should resolve if call succeeds", function(done) {
      createTokenResponse = {
        card: {}
      };

      stripeService.createToken(card, address)
      .then(function(newCard) {
        expect(newCard).to.be.ok;
        expect(card.tokenError).to.not.be.ok;

        done();
      })
      .then(null,done);

    });

    it("should reject if call fails with a generic error", function(done) {
      createTokenResponse = {
        error: {
          code: "failure"
        }
      };

      stripeService.createToken(card, address)
      .then(done, function() {
        expect(card.tokenError).to.be.ok;
        expect(card.tokenError).to.equal(STRIPE_ERRORS.processing_error);

        done();
      })
      .then(null,done);

    });

    it("should reject and parse error code", function(done) {
      createTokenResponse = {
        error: {
          code: "incorrect_cvc"
        }
      };

      stripeService.createToken(card, address)
      .then(done, function() {
        expect(card.tokenError).to.be.ok;
        expect(card.tokenError).to.equal(STRIPE_ERRORS.incorrect_cvc);

        done();
      })
      .then(null,done);

    });


  });
});
