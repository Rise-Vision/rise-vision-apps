'use strict';

var AddPaymentMethodPage = function() {

  var loader = element(by.xpath('//div[@spinner-key="payment-source-loader"]'));

  var cardName = element(by.id('new-card-name'));

  var addButton = element(by.id('addButton'));
  
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
  	protractor.promise.controlFlow().execute(function(){
	    browser.ignoreSynchronization = true;
	    browser.switchTo().frame(browser.driver.findElement(protractor.By.css('#new-card-number iframe')));
	    browser.findElement(by.name('cardnumber')).sendKeys(value);
	    browser.switchTo().defaultContent();
	    browser.ignoreSynchronization = false;
	  });
  };

  this.enterCardExpiration = function(value) {
    protractor.promise.controlFlow().execute(function(){
      browser.ignoreSynchronization = true;
      browser.switchTo().frame(browser.driver.findElement(protractor.By.css('#new-card-expiry iframe')));
      browser.findElement(by.name('exp-date')).sendKeys(value);
      browser.switchTo().defaultContent();
      browser.ignoreSynchronization = false;
    });
  };

  this.enterCardCvc = function(value) {
    protractor.promise.controlFlow().execute(function(){
      browser.ignoreSynchronization = true;
      browser.switchTo().frame(browser.driver.findElement(protractor.By.css('#new-card-cvc iframe')));
      browser.findElement(by.name('cvc')).sendKeys(value);
      browser.switchTo().defaultContent();
      browser.ignoreSynchronization = false;
    });
  };
};

module.exports = AddPaymentMethodPage;
