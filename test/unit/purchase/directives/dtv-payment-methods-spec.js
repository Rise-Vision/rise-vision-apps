"use strict";

describe("directive: payment methods", function() {
  beforeEach(module("risevision.apps.purchase"));

  beforeEach(module(function ($provide) {
    $provide.value("purchaseFactory", {
      purchase: {
        paymentMethods: "paymentMethods",
        contact: {
          email: "contactEmail"
        }
      }
    });

    var _generateElement = function(id) {
      return {
        id: id,
        mount: sinon.stub(),
        on: sinon.stub()
      };
    }; 

    $provide.value("stripeService", {
      initializeStripeElements: sinon.stub().returns(Q.resolve([_generateElement(1), _generateElement(2), _generateElement(3)]))
    });

  }));

  var $scope, element, stripeService;

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    stripeService = $injector.get('stripeService');

    $templateCache.put("partials/purchase/checkout-payment-methods.html", "<p>mock</p>");
    $scope = $rootScope.$new();

    element = $compile("<payment-methods></payment-methods>")($scope);
  }));

  it("should replace the element with the appropriate content", function() {
    expect(element.html()).to.equal("<p>mock</p>");
  });

  it("should initialize scope", function() {
    expect($scope).to.be.an("object");

    expect($scope.paymentMethods).to.equal("paymentMethods");
    expect($scope.contactEmail).to.equal("contactEmail");

    expect($scope.getCardDescription).to.be.a("function");
    expect($scope.stripeElementError).to.be.a("function");
  });

  describe('initializeStripeElements:', function() {
    beforeEach(function(done) {
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
      expect($scope['cardNumber']).to.be.an('object');
      expect($scope['cardExpiry']).to.be.an('object');
      expect($scope['cardCvc']).to.be.an('object');
    });

    it('should initialize handlers', function() {
      $scope['cardNumber'].mount.should.have.been.calledWith('#new-card-number');

      $scope['cardNumber'].on.should.have.been.calledTwice;
      $scope['cardNumber'].on.should.have.been.calledWith('blur', sinon.match.func);
      $scope['cardNumber'].on.should.have.been.calledWith('change', sinon.match.func);
    });

    it('should $digest on blur', function() {
      sinon.spy($scope, '$digest');

      $scope['cardNumber'].on.getCall(0).args[1]();

      $scope.$digest.should.have.been.called;
    });

    it('should add dirty class and $digest on change', function() {
      var cardElement = angular.element('<div id="new-card-number"/>').appendTo('body');

      sinon.spy($scope, '$digest');

      $scope['cardNumber'].on.getCall(1).args[1]();

      expect(cardElement[0].className).to.contain('dirty');
      $scope.$digest.should.have.been.called;

      element.remove();
    });

    it('should handle failure to get element', function() {
      sinon.spy($scope, '$digest');

      $scope['cardNumber'].on.getCall(1).args[1]();

      $scope.$digest.should.have.been.called;
    });

  });

  it("getCardDescription: ", function() {
    var card = {
      last4: "2345",
      cardType: "Visa",
      isDefault: false
    };

    expect($scope.getCardDescription(card)).to.equal("***-2345, Visa");

    card.isDefault = true;

    expect($scope.getCardDescription(card)).to.equal("***-2345, Visa (default)");
  });

  describe('stripeElementError:', function() {
    var stripeElement;

    beforeEach(function() {
      $scope.form = {
        paymentMethodsForm: {}
      };

      stripeElement = angular.element('<div id="stripe-element"/>').appendTo('body');
    });

    afterEach(function() {
      stripeElement.remove();
    });

    it('should return false if element is not found', function() {
      expect($scope.stripeElementError('blank')).to.be.false;
    });

    it('should return false for blank element', function() {
      expect($scope.stripeElementError('stripe-element')).to.not.be.ok;
    });

    describe('form is submitted', function() {
      beforeEach(function() {
        $scope.form.paymentMethodsForm.$submitted = true;
      });

      it('should return false if there are no validation errors', function() {
        expect($scope.stripeElementError('stripe-element')).to.not.be.ok;
      });

      it('should return true if the field is empty', function() {
        stripeElement[0].classList.add('StripeElement--empty');

        expect($scope.stripeElementError('stripe-element')).to.be.true;
      });

      it('should return true if the field is invalid', function() {
        stripeElement[0].classList.add('StripeElement--invalid');

        expect($scope.stripeElementError('stripe-element')).to.be.true;
      });

    });

    describe('element is dirty', function() {
      beforeEach(function() {
        stripeElement[0].classList.add('dirty');
      });

      it('should return false if there are no validation errors', function() {
        expect($scope.stripeElementError('stripe-element')).to.not.be.ok;
      });

      it('should return true if the field is empty', function() {
        stripeElement[0].classList.add('StripeElement--empty');

        expect($scope.stripeElementError('stripe-element')).to.be.true;
      });

      it('should return true if the field is invalid', function() {
        stripeElement[0].classList.add('StripeElement--invalid');

        expect($scope.stripeElementError('stripe-element')).to.be.true;
      });

    });

  });

});
