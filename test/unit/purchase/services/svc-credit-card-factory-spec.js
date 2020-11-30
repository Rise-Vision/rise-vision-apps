/*jshint expr:true */
"use strict";

describe("Services: credit card factory", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});

    var _generateElement = function(id) {
      return {
        id: id,
        mount: sinon.stub(),
        on: sinon.stub()
      };
    };

    $provide.value("stripeService", {
      initializeStripeElements: sinon.stub().returns(Q.resolve([_generateElement(1), _generateElement(2), _generateElement(3)])),
      createPaymentMethod: sinon.stub().returns(Q.resolve({})),
      authenticate3ds: sinon.stub().returns(Q.resolve())
    });

    $provide.value("userState", {
      getCopyOfSelectedCompany: sinon.stub().returns({
        id: "id",
        street: "billingStreet",
      })
    });

  }));

  var $rootScope, creditCardFactory, stripeService;

  beforeEach(function() {
    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      stripeService = $injector.get("stripeService");
      creditCardFactory = $injector.get("creditCardFactory");
    });
  });

  it("should exist", function() {
    expect(creditCardFactory).to.be.ok;
    expect(creditCardFactory.initStripeElements).to.be.a("function");
    expect(creditCardFactory.initPaymentMethods).to.be.a("function");

    expect(creditCardFactory.validatePaymentMethod).to.be.a("function");
    expect(creditCardFactory.authenticate3ds).to.be.a("function");
  });

  describe("initStripeElements: ", function() {
    beforeEach(function(done) {
      creditCardFactory.initStripeElements();
      setTimeout(function() {
        done();
      }, 10);
    });

    it('should initialize', function() {
      stripeService.initializeStripeElements.should.have.been.calledWith([
        'cardNumber',
        'cardExpiry',
        'cardCvc'
      ], sinon.match.object);
    });

    it('should initialize elements and add them to the scope', function() {
      expect(creditCardFactory.stripeElements['cardNumber']).to.be.an('object');
      expect(creditCardFactory.stripeElements['cardExpiry']).to.be.an('object');
      expect(creditCardFactory.stripeElements['cardCvc']).to.be.an('object');
    });

    it('should initialize handlers', function() {
      creditCardFactory.stripeElements['cardNumber'].mount.should.have.been.calledWith('#new-card-number');

      creditCardFactory.stripeElements['cardNumber'].on.should.have.been.calledTwice;
      creditCardFactory.stripeElements['cardNumber'].on.should.have.been.calledWith('blur', sinon.match.func);
      creditCardFactory.stripeElements['cardNumber'].on.should.have.been.calledWith('change', sinon.match.func);
    });

    it('should $digest on blur', function() {
      sinon.spy($rootScope, '$digest');

      creditCardFactory.stripeElements['cardNumber'].on.getCall(0).args[1]();

      $rootScope.$digest.should.have.been.called;
    });

    it('should add dirty class and $digest on change', function() {
      var cardElement = angular.element('<div id="new-card-number"/>').appendTo('body');

      sinon.spy($rootScope, '$digest');

      creditCardFactory.stripeElements['cardNumber'].on.getCall(1).args[1]();

      expect(cardElement[0].className).to.contain('dirty');
      $rootScope.$digest.should.have.been.called;

      cardElement.remove();
    });

    it('should handle failure to get element', function() {
      sinon.spy($rootScope, '$digest');

      creditCardFactory.stripeElements['cardNumber'].on.getCall(1).args[1]();

      $rootScope.$digest.should.have.been.called;
    });

  });

  it("initPaymentMethods:", function() {
    creditCardFactory.initPaymentMethods();
    
    expect(creditCardFactory).to.be.ok;
    expect(creditCardFactory.paymentMethods).to.be.ok;
    expect(creditCardFactory.paymentMethods.existingCreditCards).to.deep.equal([]);

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

    expect(creditCardFactory.paymentMethods.selectedCard).to.equal(creditCardFactory.paymentMethods.newCreditCard);
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
  

});
