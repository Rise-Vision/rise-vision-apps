'use strict';

var PurchaseLicensesSuccessPage = function() {

  var purchaseSuccessPanel = element(by.id('checkout-success'));
  var doneButton = element(by.id('doneButton'));

  this.getPurchaseSuccessPanel = function() {
    return purchaseSuccessPanel;
  };

  this.getDoneButton = function() {
    return doneButton;
  };

};

module.exports = PurchaseLicensesSuccessPage;
