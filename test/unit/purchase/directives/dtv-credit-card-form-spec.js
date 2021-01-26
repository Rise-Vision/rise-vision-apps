"use strict";

describe("directive: credit card form", function() {
  beforeEach(module("risevision.apps.purchase"));

  beforeEach(module(function ($provide) {
    var _generateElement = function(id) {
      return {
        id: id,
        mount: sinon.stub(),
        on: sinon.stub()
      };
    }; 

    $provide.value("creditCardFactory", {});
    $provide.value("paymentSourcesFactory", {});
    $provide.value("stripeElementsFactory", {
      init: sinon.stub()
    });

  }));

  var $scope, element, stripeElementsFactory;

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    stripeElementsFactory = $injector.get('stripeElementsFactory');

    $templateCache.put("partials/purchase/credit-card-form.html", "<p>mock</p>");
    $rootScope.form = {
      creditCardForm: {}
    };

    element = $compile("<credit-card-form form-object=\"form.creditCardForm\"></credit-card-form>")($rootScope);

    $scope = element.isolateScope();
  }));

  it("should replace the element with the appropriate content", function() {
    expect(element.html()).to.equal("<p>mock</p>");
  });

  it("should initialize scope", function() {
    expect($scope).to.be.an("object");

    expect($scope.creditCardFactory).to.be.an('object');
    expect($scope.paymentSourcesFactory).to.be.an('object');
    expect($scope.formObject).to.be.an('object');

    expect($scope.stripeElementError).to.be.a("function");
  });

  it('stripeElementsFactory init', function() {
    stripeElementsFactory.init.should.have.been.called;
  });

  describe('stripeElementError:', function() {
    var stripeElement;

    beforeEach(function() {
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
        $scope.formObject.$submitted = true;
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
