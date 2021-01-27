'use strict';

var AddPaymentMethodPage = function() {

  var loader = element(by.xpath('//div[@spinner-key="payment-source-loader"]'));

  var cardName = element(by.id('new-card-name'));

  var addButton = element(by.id('addButton'));

  function _inputOnIframe(value, iframeSelector, elementName) {
    protractor.promise.controlFlow().execute(function(){
      browser.ignoreSynchronization = true;
      browser.switchTo().frame(browser.driver.findElement(protractor.By.css(iframeSelector)));
      browser.findElement(by.name(elementName)).sendKeys(value);
      browser.switchTo().defaultContent();
      browser.ignoreSynchronization = false;
    });
  }
  
  this.getLoader = function() {
    return loader;
  };

  this.getAddButton = function() {
    return addButton;
  };

  this.getCardName = function() {
    return cardName;
  };

  this.enterCardNumber = function(value) {
    _inputOnIframe(value, '#new-card-number iframe', 'cardnumber');
  };

  this.enterCardExpiration = function(value) {
    _inputOnIframe(value, '#new-card-expiry iframe', 'exp-date');    
  };

  this.enterCardCvc = function(value) {
    _inputOnIframe(value, '#new-card-cvc iframe', 'cvc');    
  };
};

module.exports = AddPaymentMethodPage;
