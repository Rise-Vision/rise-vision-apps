'use strict';

var helper = require('rv-common-e2e').helper;
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');

var PurchaseFlowModalPage = function() {
  var commonHeaderPage = new CommonHeaderPage();
  var seePlansLink = element(by.xpath('//a[contains(text(), "See Our Plans")]'));

  var emailField = element(by.id('contact-email'));
  var paymentMethod = element(by.id('payment-method-select'));
  var cardName = element(by.id('new-card-name'));
  var cardNumber = element(by.id('new-card-number'));
  var cardExpMon = element(by.id('new-card-expiry-month'));
  var cardExpYr = element(by.id('new-card-expiry-year'));
  var cardCVC = element(by.id('new-card-cvc'));
  var street = element(by.id('address-form-streetAddress'));
  var city = element(by.id('address-form-city'));
  var country = element(by.id('address-form-country'));
  var prov = element(by.css('select[name="province-selector"]'));
  var pc = element(by.id('address-form-postalCode'));
  var companyNameField = element(by.id('address-form-companyName'));
  var payButton = element(by.id('payButton'));

  function _waitForPlanUpdate(retries) {
    helper.waitDisappear(seePlansLink, 'See Plans Link')
      .catch(function () {
        retries = typeof(retries) === 'undefined' ? 3 : retries;

        if (retries > 0) {
          browser.call(()=>console.log("waiting for plan bar to disappear, attempt: " + (4 - retries)));

          browser.sleep(30 * 1000);

          browser.driver.navigate().refresh();

          browser.sleep(10000);
          helper.waitDisappear(commonHeaderPage.getLoader(), 'CH Spinner Loader')

          _waitForPlanUpdate(retries - 1);
        }
      });
  }

  this.purchase = function(useCreditCard) {
    helper.waitForSpinner();
    helper.wait(this.getContinueButton(), 'Purchase flow Billing');
    browser.sleep(1000);
    helper.clickWhenClickable(this.getContinueButton(), 'Purchase flow Billing');
    helper.waitDisappear(this.getEmailField(), 'Purchase flow Billing');
    browser.sleep(1000);
    this.getCompanyNameField().sendKeys('same');
    this.getStreet().sendKeys('2967 Dundas St. W #632');
    this.getCity().sendKeys('Toronto');
    this.getCountry().sendKeys('Can');
    this.getProv().sendKeys('O');
    this.getPC().sendKeys('M6P 1Z2');
    browser.sleep(1000);
    helper.clickWhenClickable(this.getContinueButton(), 'Purchase flow Shipping');
    helper.waitForSpinner();
    helper.wait(this.getCardName(), 'Purchase flow Payment');
    if (useCreditCard) {
      console.log('Purchase using Credit Card');
      this.getCardName().sendKeys('AAA');
      this.getCardNumber().sendKeys('4242424242424242');
      this.getCardExpMon().sendKeys('0');
      this.getCardExpYr().sendKeys('222');
      this.getCardCVS().sendKeys('222');
    } else {
      console.log('Purchase using Invoice Me');
      this.getPaymentMethod().element(by.cssContainingText('option', 'Invoice Me')).click();
    }
    browser.sleep(1000);
    helper.clickWhenClickable(this.getContinueButton(), 'Purchase flow Payment');
    helper.wait(this.getPayButton(), 'Purchase flow Payment');
    helper.waitForSpinner();
    helper.clickWhenClickable(this.getPayButton(), 'Purchase flow Review');
    helper.waitForSpinner();

    console.log('Purchase complete');

    _waitForPlanUpdate();
  };

  this.getSeePlansLink = function () {
    return seePlansLink;
  };

  this.getContinueButton = function() {
    return element(by.id('continueButton'));
  };

  this.getPayButton = function() {
    return payButton;
  };

  this.getFadeOverlay = function() {
    return fadeOverlay;
  };

  this.getEmailField = function() {
    return emailField;
  }

  this.getPaymentMethod = function() {
    return paymentMethod;
  }

  this.getCompanyNameField = function() {
    return companyNameField;
  }

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
};

module.exports = PurchaseFlowModalPage;
