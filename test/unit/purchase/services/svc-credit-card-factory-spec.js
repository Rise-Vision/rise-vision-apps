/*jshint expr:true */
"use strict";

describe("Services: credit card factory", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});

    $provide.value("stripeService", {
      createPaymentMethod: sinon.stub().returns(Q.resolve({})),
      authenticate3ds: sinon.stub().returns(Q.resolve())
    });

    $provide.value("userState", {
      getCopyOfSelectedCompany: sinon.stub().returns({
        id: "id",
        street: "billingStreet",
      })
    });

    $provide.value('userAuthFactory', {
      authenticate: sinon.stub().returns(Q.resolve())
    });

    $provide.value('paymentSourcesFactory', {
      init: sinon.stub().returns(Q.resolve())
    });

  }));

  var creditCardFactory, stripeService, userState, userAuthFactory, paymentSourcesFactory;

  beforeEach(function() {
    inject(function($injector) {
      stripeService = $injector.get("stripeService");
      userState = $injector.get('userState');
      userAuthFactory = $injector.get('userAuthFactory');
      paymentSourcesFactory = $injector.get('paymentSourcesFactory');
      creditCardFactory = $injector.get("creditCardFactory");
    });
  });

  it("should exist", function() {
    expect(creditCardFactory).to.be.ok;

    expect(creditCardFactory.selectNewCreditCard).to.be.a("function");
    expect(creditCardFactory.initPaymentMethods).to.be.a("function");

    expect(creditCardFactory.validatePaymentMethod).to.be.a("function");
    expect(creditCardFactory.getPaymentMethodId).to.be.a("function");
    expect(creditCardFactory.authenticate3ds).to.be.a("function");
  });

  it("selectNewCreditCard:", function() {
    creditCardFactory.paymentMethods = {
      newCreditCard: 'newCard',
      selectedCard: 'selectedCard'
    };

    creditCardFactory.selectNewCreditCard();

    expect(creditCardFactory.paymentMethods.selectedCard).to.equal('newCard');
  });

  describe("initPaymentMethods:", function() {
    it("should init factory object", function() {
      creditCardFactory.initPaymentMethods(false);
      
      expect(creditCardFactory).to.be.ok;
      expect(creditCardFactory.paymentMethods).to.be.ok;
      expect(creditCardFactory.paymentMethods.newCreditCard).to.deep.equal({
        isNew: true,
        address: {},
        useBillingAddress: false
      });

      expect(creditCardFactory.paymentMethods.selectedCard).to.equal(creditCardFactory.paymentMethods.newCreditCard);
    });

    it('should authenticate user', function() {
      creditCardFactory.initPaymentMethods(false);

      userAuthFactory.authenticate.should.have.been.called;
    });

    it('should use company address', function(done) {
      creditCardFactory.initPaymentMethods(true)
        .then(function() {
          expect(creditCardFactory.paymentMethods.newCreditCard).to.deep.equal({
            isNew: true,
            address: {},
            useBillingAddress: true,
            billingAddress: {
              id: "id",
              name: undefined,
              street: "billingStreet",
              unit: undefined,
              city: undefined,
              country: undefined,
              postalCode: undefined,
              province: undefined
            }
          });

          done();
        });
    });

    it('should not update address on authentication failure', function(done) {
      userAuthFactory.authenticate.returns(Q.reject());

      creditCardFactory.initPaymentMethods(false)
        .catch(function() {
          expect(creditCardFactory.paymentMethods.newCreditCard).to.deep.equal({
            isNew: true,
            address: {},
            useBillingAddress: false
          });

          done();
        });
    });

    it('should not update address if selected company is invalid', function(done) {
      userState.getCopyOfSelectedCompany.returns({});

      creditCardFactory.initPaymentMethods(false)
        .then(function() {
          expect(creditCardFactory.paymentMethods.newCreditCard).to.deep.equal({
            isNew: true,
            address: {},
            useBillingAddress: false
          });

          done();
        });
    });

    it('should not load cards', function(done) {
      creditCardFactory.initPaymentMethods(false)
        .then(function() {
          paymentSourcesFactory.init.should.not.have.been.called;

          done();
        });
    });

    describe('_loadCreditCards:', function() {
      it('should handle failure to authenticate', function(done) {
        userAuthFactory.authenticate.returns(Q.reject());

        creditCardFactory.initPaymentMethods(true)
          .catch(function() {
            paymentSourcesFactory.init.should.not.have.been.called;

            done();
          });
      });

      it('should not retrieve cards selected company is invalid', function(done) {
        userState.getCopyOfSelectedCompany.returns({});

        creditCardFactory.initPaymentMethods(true)
          .then(function() {
            paymentSourcesFactory.init.should.not.have.been.called;

            done();
          });
      });

      it('should retrieve cards and update list if successful', function(done) {
        creditCardFactory.initPaymentMethods(true)
          .then(function() {
            paymentSourcesFactory.init.should.have.been.called;

            done();
          });
      });

      it('should set selected card to the first item if available', function(done) {
        paymentSourcesFactory.selectedCard = 'card1';

        creditCardFactory.initPaymentMethods(true)
          .then(function() {
            expect(creditCardFactory.paymentMethods.selectedCard).to.equal('card1');

            done();
          });
      });

    });

  });

  describe("validatePaymentMethod: ", function() {
    it("should clear errors", function() {
      creditCardFactory.paymentMethods = {
        selectedCard: {},
        tokenError: "tokenError"
      };

      creditCardFactory.validatePaymentMethod();

      expect(creditCardFactory.paymentMethods.tokenError).to.not.be.ok;
    });

    describe("existing card: ", function() {
      var card;
      beforeEach(function() {
        creditCardFactory.paymentMethods = {
          selectedCard: card = {
            isNew: true,
            number: "123"
          }
        };
      });

      it("should validate card and proceed to next step", function(done) {
        creditCardFactory.validatePaymentMethod()
        .then(function() {
          stripeService.createPaymentMethod.should.have.been.called;

          done();
        })
        .then(null,function(error) {
          done(error);
        });
      });

      it("should validate and not proceed if there are errors", function(done) {
        stripeService.createPaymentMethod.returns(Q.resolve({error: {}}));

        creditCardFactory.validatePaymentMethod()
        .then(function () {
          console.log("Should not be here");
        }, function() {
          stripeService.createPaymentMethod.should.have.been.called;
          done();
        });
      });
      
    });

    describe("new card:", function() {
      var card;

      beforeEach(function() {
        creditCardFactory.paymentMethods = {
          paymentMethod: "card",
          existingCreditCards: [],
          newCreditCard: card = {
            isNew: true,
            number: "123",
            address: {},
            billingAddress: {}
          }
        };
        creditCardFactory.paymentMethods.selectedCard = creditCardFactory.paymentMethods.newCreditCard;
      });

      it("should validate card", function() {
        creditCardFactory.validatePaymentMethod();

        stripeService.createPaymentMethod.should.have.been.called;
      });

      it("should validate and not proceed if there are errors", function(done) {
        stripeService.createPaymentMethod.returns(Q.resolve({error: {message: "tokenError"}}));

        creditCardFactory.validatePaymentMethod()
        .then(null, function() {
          stripeService.createPaymentMethod.should.have.been.called;

          expect(creditCardFactory.paymentMethods.tokenError).to.equal("tokenError");

          done();
        })
        .then(null,function() {
          done("should not be here");
        });
      });

      it("should use billing address if selected", function() {
        card.useBillingAddress = true;
        card.billingAddress = {city: "test-billing-city"};

        creditCardFactory.validatePaymentMethod();

        assert.equal(stripeService.createPaymentMethod.getCall(0).args[2].billing_details.address.city, "test-billing-city");
      });

    });

  });

  describe('getPaymentMethodId:', function() {
    beforeEach(function() {
      creditCardFactory.paymentMethods = {};
    });

    it('should return id from paymentMethodResponse', function() {
      creditCardFactory.paymentMethods.paymentMethodResponse = {
        paymentMethod: {
          id: 'paymentMethodId'
        }
      };

      expect(creditCardFactory.getPaymentMethodId()).to.equal('paymentMethodId');
    });

    it('should return selected card reference id', function() {
      creditCardFactory.paymentMethods.selectedCard = {
        payment_source: {
          reference_id: 'referenceId'
        }
      };

      expect(creditCardFactory.getPaymentMethodId()).to.equal('referenceId');
    });

    it('should return null if selected card does not have a payment source', function() {
      creditCardFactory.paymentMethods.selectedCard = {};

      expect(creditCardFactory.getPaymentMethodId()).to.be.null;
    });

    it('should return null', function() {
      creditCardFactory.paymentMethods = {};

      expect(creditCardFactory.getPaymentMethodId()).to.be.null;
    });

  });

});
