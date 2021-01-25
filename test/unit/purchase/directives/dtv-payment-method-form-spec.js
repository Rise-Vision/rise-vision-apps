"use strict";

describe("directive: payment method form", function() {
  beforeEach(module("risevision.apps.purchase"));

  beforeEach(module(function ($provide) {
    $provide.value("creditCardFactory", {
      paymentMethods: "paymentMethods"
    });
  }));

  var $scope, element;

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    $templateCache.put("partials/purchase/payment-method-form.html", "<p>mock</p>");

    $rootScope.form = 'paymentMethodForm';
    $rootScope.showInvoice = 'no';
    $rootScope.contactEmail = 'someEmail';

    element = $compile("<payment-method-form form-object=\"form\" show-invoice-option=\"showInvoice\" contact-email=\"contactEmail\"></payment-method-form>")($rootScope);

    $scope = element.isolateScope();
  }));

  it("should replace the element with the appropriate content", function() {
    expect(element.html()).to.equal("<p>mock</p>");
  });

  it("should initialize scope", function() {
    expect($scope).to.be.an("object");

    expect($scope.formObject).to.equal("paymentMethodForm");
    expect($scope.showInvoiceOption).to.equal("no");
    expect($scope.contactEmail).to.equal("someEmail");

    expect($scope.paymentMethods).to.equal("paymentMethods");
  });

});
