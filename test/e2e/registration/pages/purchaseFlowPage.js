'use strict';

var helper = require('rv-common-e2e').helper;
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');

var PurchaseFlowPage = function() {
  var _this = this;
  var commonHeaderPage = new CommonHeaderPage();
  var planBanner = element(by.css('#plan-banner div.alert:not(.ng-hide)'));
  var planSubscribeLink = planBanner.element(by.tagName("a"));

  var seePlansLink = element(by.xpath('//a[contains(text(), "See Our Plans")]'));
  var subscribeNowButton = element(by.cssContainingText('#trial-plan-banner a', 'Subscribe Now'));

  var billingAddressPage = element(by.id('checkout-billing-address'));

  var emailField = element(by.id('contact-email'));
  var companyNameField = element(by.id('address-form-companyName'));
  var street = element(by.id('address-form-streetAddress'));
  var city = element(by.id('address-form-city'));
  var country = element(by.id('address-form-country'));
  var prov = element(by.css('select[name="province-selector"]'));
  var pc = element(by.id('address-form-postalCode'));

  var paymentMethodsPage = element(by.id('checkout-payment-methods'));
  var newCreditCardForm = element(by.id('new-credit-card-form'));
  var generateInvoiceForm = element(by.id('generateInvoice'));

  var paymentMethod = element(by.id('payment-method-select'));
  var paymentMethodInvoiceMe = paymentMethod.element(by.cssContainingText('button', 'Credit Card'));
  var paymentMethodCreditCard = paymentMethod.element(by.cssContainingText('button', 'Invoice'));

  var cardName = element(by.id('new-card-name'));
  var cardNumber = element(by.id('new-card-number'));
  var cardExpMon = element(by.id('new-card-expiry-month'));
  var cardExpYr = element(by.id('new-card-expiry-year'));
  var cardCVC = element(by.id('new-card-cvc'));

  var reviewPurchasePage = element(by.id('checkout-purchase-summary'));
  var payButton = element(by.id('payButton'));

  var checkoutSuccessPage = element(by.id('checkout-success'));
  var checkoutDoneButton = element(by.id('doneButton'));

  this.waitForPlanUpdate = function(retries) {
    helper.waitDisappear(planBanner, 'Plan Banner')
      .catch(function (e) {
        retries = typeof(retries) === 'undefined' ? 3 : retries;

        if (retries > 0) {
          browser.call(()=>console.log("waiting for plan bar to disappear, attempt: " + (4 - retries)));

          browser.driver.navigate().refresh();

          helper.waitDisappear(commonHeaderPage.getLoader(), 'CH Spinner Loader');

          _this.waitForPlanUpdate(retries - 1);
        } else {
          throw e;
        }
      });
  };

  this.getPlanBanner = function () {
    return planBanner;
  };

  this.getPlanSubscribeLink = function() {
    return planSubscribeLink;
  };

  this.getSeePlansLink = function () {
    return seePlansLink;
  };

  this.getSubscribeNowButton = function() {
    return subscribeNowButton;
  };

  this.getContinueButton = function() {
    return element(by.id('continueButton'));
  };

  this.getBillingAddressPage = function() {
    return billingAddressPage;
  };

  this.getEmailField = function() {
    return emailField;
  }

  this.getCompanyNameField = function() {
    return companyNameField;
  }

  this.getStreet = function() {
    return street;
  }

  this.getCity = function() {
    return city;
  }

  this.getCountry = function() {
    return country;
  }

  this.getProv = function() {
    return prov;
  }

  this.getPC = function() {
    return pc;
  }

  this.getPaymentMethodsPage = function() {
    return paymentMethodsPage;
  };

  this.getNewCreditCardForm = function() {
    return newCreditCardForm;
  };

  this.getGenerateInvoiceForm = function() {
    return generateInvoiceForm;
  };

  this.getPaymentMethod = function() {
    return paymentMethod;
  };

  this.getPaymentMethodSelected = function() {
    return paymentMethod.element(by.css('button.btn-toggle-blue-on'));
  };

  this.getPaymentMethodInvoiceMe = function() {
    return paymentMethodInvoiceMe;
  };

  this.getPaymentMethodCreditCard = function() {
    return paymentMethodCreditCard;
  };

  this.getCardName = function() {
    return cardName;
  }

  this.getCardNumber = function() {
    return cardNumber;
  }

  this.getCardCVS = function() {
    return cardCVC;
  }

  this.getCardExpMon = function() {
    return cardExpMon;
  }

  this.getCardExpYr = function() {
    return cardExpYr;
  }

  this.getReviewPurchasePage = function() {
    return reviewPurchasePage;
  };

  this.getPayButton = function() {
    return payButton;
  };

  this.getCheckoutSuccessPage = function() {
    return checkoutSuccessPage;
  };

  this.getCheckoutDoneButton = function() {
    return checkoutDoneButton;
  };

};

module.exports = PurchaseFlowPage;
