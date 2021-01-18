"use strict";

describe("controller: purchase", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.service("$loading", function() {
      return {
        start: sandbox.stub(),
        stop: sandbox.stub()
      };
    });
    $provide.service("$state", function() {
      return {
        go: sandbox.spy()
      }
    });
    $provide.service("addressFactory", function() {
      return {
        validateAddress: sinon.spy(function(addressObject) {
          if (!validate) {
            addressObject.validationError = true;
          }

          return Q.resolve();
        }),
        updateContact: sandbox.stub(),
        updateAddress: sandbox.stub()
      };
    });
    $provide.value("taxExemptionFactory", {
      taxExemption: {},
      init: sandbox.stub()
    });
    $provide.service("purchaseFactory", function() {
      return {
        validatePaymentMethod: sandbox.stub().returns(Q.resolve()),
        preparePaymentIntent: sandbox.stub().returns(Q.resolve()),
        initializeStripeElements: sandbox.stub().returns(Q.resolve()),
        getEstimate: sandbox.stub().returns(Q.resolve()),
        completePayment: sandbox.stub().returns(Q.resolve()),
        purchase: {},
        init: sandbox.stub()
      };
    });
    $provide.service("$location", function() {
      return {
        path: sandbox.stub().returns("/purchase")
      };
    });    
  }));

  var sandbox, $scope, $state, $loading, validate, purchaseFactory, addressFactory, taxExemptionFactory, $location, redirectTo;

  beforeEach(function() {
    validate = true;
    sandbox = sinon.sandbox.create();

    inject(function($injector, $rootScope, $controller) {
      $scope = $rootScope.$new();
      $state = $injector.get("$state");
      $loading = $injector.get("$loading");
      addressFactory = $injector.get("addressFactory");
      purchaseFactory = $injector.get("purchaseFactory");
      taxExemptionFactory = $injector.get('taxExemptionFactory');
      $location = $injector.get("$location");
      redirectTo =  '/displays/list'

      $controller("PurchaseCtrl", {
        $scope: $scope,
        $loading: $loading,
        redirectTo: redirectTo
      });

      $scope.$digest();
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should initialize",function() {
    expect($scope.form).to.be.an("object");
    expect($scope.factory).to.equal(purchaseFactory);
    expect($scope.taxExemptionFactory).to.equal(taxExemptionFactory);

    expect($scope.PURCHASE_STEPS).to.be.ok;
    expect($scope.currentStep).to.equal(0);
    expect($scope.finalStep).to.be.false;

    expect($scope.validateAddress).to.be.a("function");
    expect($scope.applyTaxExemption).to.be.a("function");
    expect($scope.completePayment).to.be.a("function");
    expect($scope.completeCardPayment).to.be.a("function");
    expect($scope.setNextStep).to.be.a("function");
    expect($scope.setPreviousStep).to.be.a("function");
    expect($scope.setCurrentStep).to.be.a("function");

    expect($scope.close).to.be.a("function");

    purchaseFactory.init.should.have.been.called;
  });

  it("should initialize tax exemption", function() {
    taxExemptionFactory.init.should.have.been.calledWith(purchaseFactory.getEstimate);
  });

  describe("$loading spinner: ", function() {
    it("should start and stop spinner from purchaseFactory", function() {
      purchaseFactory.loading = true;
      $scope.$digest();

      $loading.start.should.have.been.calledWith("purchase-loader");

      purchaseFactory.loading = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledTwice;
    });

    it("should start and stop spinner from taxExemptionFactory", function() {
      taxExemptionFactory.loading = true;
      $scope.$digest();

      $loading.start.should.have.been.calledWith("purchase-loader");

      taxExemptionFactory.loading = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledTwice;
    });

  });

  describe("validateAddress: ", function() {
    beforeEach(function() {
      sandbox.spy($scope, "setNextStep");
      $scope.setCurrentStep(1);
    });

    it("should not validate if the corresponding form is invalid", function(done) {
      $scope.form.billingAddressForm = {
        $valid: false
      };

      $scope.validateAddress({});

      addressFactory.validateAddress.should.not.have.been.called;

      setTimeout(function() {
        $scope.setNextStep.should.not.have.been.called;

        done();
      }, 10);
    });

    it("should increment step if other forms are invalid", function(done) {
      $scope.form.billingAddressForm = {
        $valid: true
      };

      $scope.form.reviewSubscriptionForm = {
        $valid: false
      };

      $scope.validateAddress({});

      addressFactory.validateAddress.should.have.been.called;

      setTimeout(function() {
        $scope.setNextStep.should.have.been.called;

        done();
      }, 10);
    });

    it("should validate and proceed to next step", function(done) {
      $scope.validateAddress({}, "contact");

      addressFactory.validateAddress.should.have.been.called;

      setTimeout(function() {
        addressFactory.updateContact.should.have.been.calledWith("contact");
        addressFactory.updateAddress.should.have.been.calledWith({}, "contact");
        $scope.setNextStep.should.have.been.called;

        done();
      }, 10);
    });

    it("should validate and not proceed if there are errors", function(done) {
      validate = false;
      $scope.validateAddress({});

      addressFactory.validateAddress.should.have.been.called;

      setTimeout(function() {
        $scope.setNextStep.should.not.have.been.called;

        done();
      }, 10);
    });

  });

  describe("applyTaxExemption:", function () {
    it("should not apply if already sent", function() {
      taxExemptionFactory.taxExemption.sent = true;

      $scope.applyTaxExemption();

      expect(taxExemptionFactory.taxExemption.show).to.not.be.ok;
    });

    it("should toggle checkbox", function () {
      $scope.applyTaxExemption();

      expect(taxExemptionFactory.taxExemption.show).to.be.true;

      $scope.applyTaxExemption();

      expect(taxExemptionFactory.taxExemption.show).to.be.false;
    });
  });

  describe('completePayment:', function() {
    beforeEach(function() {
      sandbox.spy($scope, "setNextStep");
      $scope.setCurrentStep(1);
    });

    it("should complete payment even if the corresponding form is invalid", function() {
      $scope.form.billingAddressForm = {
        $valid: false
      };

      $scope.completePayment();

      purchaseFactory.completePayment.should.have.been.called;
    });

    it("should complete payment and proceed", function(done) {
      $scope.completePayment();

      setTimeout(function() {
        purchaseFactory.completePayment.should.have.been.called;

        $scope.setNextStep.should.have.been.called;

        done();
      }, 10);
    });

    it("should not proceed if there are errors", function(done) {
      purchaseFactory.completePayment.returns(Q.reject());

      $scope.completePayment();

      setTimeout(function() {
        purchaseFactory.completePayment.should.have.been.called;

        $scope.setNextStep.should.not.have.been.called;

        done();
      }, 10);
    });

  });

  describe("completeCardPayment: ", function() {
    beforeEach(function() {
      sandbox.spy($scope, "completePayment");
      $scope.setCurrentStep(1);
    });

    it("should not validate if the corresponding form is invalid", function(done) {
      $scope.form.billingAddressForm = {
        $valid: false
      };

      $scope.completeCardPayment({});

      purchaseFactory.validatePaymentMethod.should.not.have.been.called;

      setTimeout(function() {
        $scope.completePayment.should.not.have.been.called;

        done();
      }, 10);
    });

    describe('validatePaymentMethod:', function() {
      it("should validate and proceed", function(done) {
        $scope.completeCardPayment('cardElement');

        purchaseFactory.validatePaymentMethod.should.have.been.calledWith('cardElement');

        setTimeout(function() {
          purchaseFactory.preparePaymentIntent.should.have.been.called;

          $scope.completePayment.should.have.been.called;

          done();
        }, 10);
      });

      it("should not proceed if there are errors", function(done) {
        purchaseFactory.validatePaymentMethod.returns(Q.reject());

        $scope.completeCardPayment();

        purchaseFactory.validatePaymentMethod.should.have.been.called;

        setTimeout(function() {
          purchaseFactory.preparePaymentIntent.should.not.have.been.called;

          $scope.completePayment.should.not.have.been.called;

          done();
        }, 10);
      });

    });

    describe('preparePaymentIntent:', function() {
      it("should prepare intent and proceed", function(done) {
        $scope.completeCardPayment('cardElement');

        setTimeout(function() {
          purchaseFactory.preparePaymentIntent.should.have.been.called;
          purchaseFactory.completePayment.should.have.been.called;

          done();
        }, 10);
      });

      it("should not proceed if there are errors", function(done) {
        purchaseFactory.preparePaymentIntent.returns(Q.reject());

        $scope.completeCardPayment();

        setTimeout(function() {
          purchaseFactory.preparePaymentIntent.should.have.been.called;
          purchaseFactory.completePayment.should.not.have.been.called;

          done();
        }, 10);
      });

    });

  });

  describe("_refreshEstimate:", function() {
    it('should not refresh the estimate on step 0', function() {
      $scope.setCurrentStep(0);

      purchaseFactory.getEstimate.should.not.have.been.called;
    });

    it('should refresh the estimate on step 1', function() {
      $scope.setCurrentStep(1);

      purchaseFactory.getEstimate.should.have.been.called;
    });

    it('should refresh the estimate on step 2', function() {
      $scope.setCurrentStep(2);

      purchaseFactory.getEstimate.should.have.been.called;
    });

    it('should not refresh the estimate on step 3', function() {
      $scope.setCurrentStep(3);

      purchaseFactory.getEstimate.should.not.have.been.called;
    });

    it('should refresh the estimate on setNextStep', function() {
      $scope.setCurrentStep(0);
      $scope.setNextStep();

      purchaseFactory.getEstimate.should.have.been.called;
    });

    it('should not refresh the estimate on setPreviousStep', function() {
      $scope.setCurrentStep(3);
      $scope.setPreviousStep();

      purchaseFactory.getEstimate.should.not.have.been.called;
    });
  });

  describe("setNextStep: ", function() {
    it("should increment step", function() {
      $scope.setNextStep();

      expect($scope.currentStep).to.equal(1);
    });

    it("should proceed to the 2nd step", function() {
      $scope.setCurrentStep(1);

      $scope.setNextStep();

      expect($scope.currentStep).to.equal(2);
      expect($scope.finalStep).to.be.true;
    });

    it("should always set 2nd step if form was completed once", function(done) {
      $scope.setCurrentStep(1);

      $scope.setNextStep();

      expect($scope.currentStep).to.equal(2);
      expect($scope.finalStep).to.be.true;

      setTimeout(function() {
        $scope.setCurrentStep(0);

        $scope.setNextStep();

        expect($scope.currentStep).to.equal(2);
        expect($scope.finalStep).to.be.true;

        done();
      }, 10);
    });

    it("should proceed past 2nd step", function() {
      $scope.setCurrentStep(2);

      $scope.setNextStep();

      expect($scope.currentStep).to.equal(3);
    });

  });

  describe("setPreviousStep: ", function() {
    it("should decrement step", function() {
      $scope.currentStep = 2;
      $scope.setPreviousStep();

      expect($scope.currentStep).to.equal(1);
    });

    it("should stop at 0", function() {
      $scope.currentStep = 1;
      $scope.setPreviousStep();
      $scope.setPreviousStep();

      expect($scope.currentStep).to.equal(0);
    });

  });

  it("setCurrentStep: ", function() {
    purchaseFactory.purchase.checkoutError = "error";

    $scope.setCurrentStep(2);

    expect($scope.currentStep).to.equal(2);
    expect(purchaseFactory.purchase.checkoutError).to.not.be.ok;
  });

  describe("close: ", function() {
    it("should close modal and redirect to provided path", function() {
      $scope.close();

      $location.path.should.have.been.calledWith(redirectTo);
    });

    it("should wait until Company is reloaded before closing modal", function() {
      purchaseFactory.purchase.reloadingCompany = true;
      $scope.close();

      $location.path.should.not.have.been.calledWith(redirectTo);
      expect(purchaseFactory.loading).to.be.true;

      purchaseFactory.purchase.reloadingCompany = false;
      $scope.$digest();

      $location.path.should.have.been.calledWith(redirectTo);
      expect(purchaseFactory.loading).to.be.false;
    });

  });

});
