'use strict';

var FinancialComponentPage = function() {
  var instrumentItems = element.all(by.repeater('instr in instruments track by $index'));
  var addCurrenciesButton = element(by.css('[ng-click="showSymbolSearch()"]'));
  var addInstrumentButton = element(by.css('[ng-click="addInstrument()"]'));
  var jpyUsdSelector = element(by.css('[for="JPYUSD=X"]'));

  this.getInstrumentItems = function () {
    return instrumentItems;
  };

  this.getAddCurrenciesButton = function () {
    return addCurrenciesButton;
  };

  this.getAddInstrumentButton = function () {
    return addInstrumentButton;
  };

  this.getJpyUsdSelector = function () {
    return jpyUsdSelector;
  };
};

module.exports = FinancialComponentPage;
