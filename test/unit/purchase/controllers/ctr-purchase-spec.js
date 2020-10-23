"use strict";

describe("controller: purchase modal", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.service("$loading", function() {
      return {
        start: sinon.stub(),
        stop: sinon.stub()
      };
    });
    $provide.service("$state", function() {
      return {
        go: sinon.spy()
      }
    });
    $provide.service("addressFactory", function() {
      return addressFactory = {
        validateAddress: function(addressObject) {
          if (!validate) {
            addressObject.validationError = true;
          }

          return Q.resolve();
        },
        updateContact: sinon.stub(),
        updateAddress: sinon.stub()
      };
    });
    $provide.service("plansFactory", function() {
      return {
        showPlansModal: sinon.stub()
      };
    });
    $provide.service("storeService", function() {
      return storeService = {
        preparePurchase: sinon.spy(function() {
          return Q.resolve();
        })
      };
    });
    $provide.service("stripeService", function() {
      return stripeService = {
        createPaymentMethod: sinon.spy(function() {
          return Q.resolve();
        })
      };
    });
    $provide.service("purchaseFactory", function() {
      return purchaseFactory = {
        validatePaymentMethod: sinon.spy(function() {
          if (validate) {
            return Q.resolve();
          } else {
            return Q.reject();
          }
        }),
        preparePaymentIntent: sinon.spy(function() {
          return Q.resolve();
        }),
        initializeStripeElements: sinon.spy(function() {
          return Q.resolve();
        }),
        getEstimate: sinon.spy(function() {
          return Q.resolve();
        }),
        completePayment: sinon.spy(function() {
          if (validate) {
            return Q.resolve();
          } else {
            return Q.reject();
          }          
        }),
        purchase: {}
      };
    });
  }));

  var sandbox, $scope, $state, $loading, validate, purchaseFactory, stripeService, storeService, addressFactory;

  beforeEach(function() {
    validate = true;
    sandbox = sinon.sandbox.create();

    inject(function($injector, $rootScope, $controller) {
      $scope = $rootScope.$new();
      $state = $injector.get("$state");
      $loading = $injector.get("$loading");

      $controller("PurchaseCtrl", {
        $scope: $scope,
        $loading: $loading,
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

    expect($scope.PURCHASE_STEPS).to.be.ok;
    expect($scope.currentStep).to.equal(0);
    expect($scope.finalStep).to.be.false;

    expect($scope.validateAddress).to.be.a("function");
    expect($scope.validatePaymentMethod).to.be.a("function");
    expect($scope.completePayment).to.be.a("function");
    expect($scope.setNextStep).to.be.a("function");
    expect($scope.setPreviousStep).to.be.a("function");
    expect($scope.setCurrentStep).to.be.a("function");

    expect($scope.close).to.be.a("function");
    expect($scope.dismiss).to.be.a("function");
  });

  describe("$loading spinner: ", function() {
    it("should start and stop spinner", function() {
      purchaseFactory.loading = true;
      $scope.$digest();

      $loading.start.should.have.been.calledWith("purchase-modal");

      purchaseFactory.loading = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledTwice;
    });
  });

  describe("validateAddress: ", function() {
    beforeEach(function() {
      sinon.spy($scope, "setNextStep");
    });

    it("should not validate if the corresponding form is invalid", function(done) {
      $scope.form.billingAddressForm = {
        $invalid: true
      };

      $scope.validateAddress({});

      setTimeout(function() {
        $scope.setNextStep.should.not.have.been.called;

        done();
      }, 10);
    });

    it("should validate and proceed to next step", function(done) {
      $scope.validateAddress({}, "contact", "shipping");

      setTimeout(function() {
        addressFactory.updateContact.should.have.been.calledWith("contact");
        addressFactory.updateAddress.should.have.been.calledWith({}, "contact", "shipping");
        $scope.setNextStep.should.have.been.called;

        done();
      }, 10);
    });

    it("should validate and not proceed if there are errors", function(done) {
      validate = false;
      $scope.validateAddress({});

      setTimeout(function() {
        $scope.setNextStep.should.not.have.been.called;

        done();
      }, 10);
    });

  });

  describe("validatePaymentMethod: ", function() {
    beforeEach(function() {
      sinon.spy($scope, "setNextStep");
    });

    it("should not validate if the corresponding form is invalid", function(done) {
      $scope.form.billingAddressForm = {
        $invalid: true
      };

      $scope.validatePaymentMethod({});

      setTimeout(function() {
        $scope.setNextStep.should.not.have.been.called;

        done();
      }, 10);
    });

    it("should validate and proceed to next step", function(done) {
      $scope.validatePaymentMethod({});

      setTimeout(function() {
        $scope.setNextStep.should.have.been.called;

        done();
      }, 10);
    });

    it("should validate and not proceed if there are errors", function(done) {
      validate = false;
      $scope.validatePaymentMethod({});

      setTimeout(function() {
        $scope.setNextStep.should.not.have.been.called;

        done();
      }, 10);
    });

  });

  describe("completePayment: ", function() {
    beforeEach(function() {
      sinon.spy($scope, "setNextStep");
    });

    it("should complete payment and proceed to next step", function(done) {
      $scope.completePayment({});

      purchaseFactory.completePayment.should.have.been.called;

      setTimeout(function() {
        $scope.setNextStep.should.have.been.called;

        done();
      }, 10);
    });

    it("should not proceed if there are errors", function(done) {
      purchaseFactory.purchase.checkoutError = "error";
      $scope.completePayment({});

      setTimeout(function() {
        $scope.setNextStep.should.not.have.been.called;

        done();
      }, 10);
    });

    it("should not proceed if an error is thrown", function(done) {
      validate = false;
      $scope.completePayment({});

      setTimeout(function() {
        $scope.setNextStep.should.not.have.been.called;

        done();
      }, 10);
    });

  });

  describe("setNextStep: ", function() {
    it("should increment step", function() {
      $scope.setNextStep();

      expect($scope.currentStep).to.equal(1);
    });

    it("should not increment step if the corresponding form is invalid", function() {
      $scope.form.billingAddressForm = {
        $invalid: true
      };

      $scope.setNextStep();

      expect($scope.currentStep).to.equal(0);
    });

    it("should increment step if other forms are invalid", function() {
      $scope.form.billingAddressForm = {
        $valid: true
      };

      $scope.form.reviewSubscriptionForm = {
        $invalid: true
      };

      $scope.setNextStep();

      expect($scope.currentStep).to.equal(1);
    });

    it("should proceed to the 3rd step and get estimate", function() {
      $scope.setCurrentStep(2);

      $scope.setNextStep();

      expect($scope.currentStep).to.equal(3);
      expect($scope.finalStep).to.be.true;

      purchaseFactory.getEstimate.should.have.been.called;
    });

    it("should always set 3rd step and get estimate if form was completed once", function(done) {
      $scope.setCurrentStep(2);

      $scope.setNextStep();

      expect($scope.currentStep).to.equal(3);
      expect($scope.finalStep).to.be.true;

      purchaseFactory.getEstimate.should.have.been.called;

      setTimeout(function() {
        $scope.setCurrentStep(0);

        $scope.setNextStep();

        purchaseFactory.getEstimate.should.have.been.calledTwice;

        expect($scope.currentStep).to.equal(3);
        expect($scope.finalStep).to.be.true;

        done();
      }, 10);
    });

    it("should proceed past 3rd step", function() {
      $scope.setCurrentStep(3);

      $scope.setNextStep();

      expect($scope.currentStep).to.equal(4);
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
    it("should close modal", function() {
      $scope.close();

      $state.go.should.have.been.calledWith('apps.home');
    });

    it("should wait until Company is reloaded before closing modal", function() {
      purchaseFactory.purchase.reloadingCompany = true;
      $scope.close();

      $state.go.should.not.have.been.called;
      expect(purchaseFactory.loading).to.be.true;

      purchaseFactory.purchase.reloadingCompany = false;
      $scope.$digest();

      $state.go.should.have.been.calledWith('apps.home');
      expect(purchaseFactory.loading).to.be.false;
    });

  });

  it("dismiss: ", function() {
    $scope.dismiss();

    $state.go.should.have.been.calledWith('apps.home');
  });

});
