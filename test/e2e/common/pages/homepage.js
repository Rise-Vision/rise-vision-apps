'use strict';
var config = require('../../config/config.json');
var helper = require('rv-common-e2e').helper;

var HomePage = function() {
  var _this = this;

  var url = config.rootUrl + '/';
  var displaysUrl = config.rootUrl + '/displays/list';
  var editorUrl = config.rootUrl + '/editor/list';
  var schedulesUrl = config.rootUrl + '/schedules/list';
  var storageUrl = config.rootUrl + '/storage';
  var defaultSubscriptionUrl = config.rootUrl + '/billing/subscription/';

  var displaysLink = element(by.css('.nav.navbar-nav #DisplaysLink'));
  var editorLink = element(by.css('.nav.navbar-nav #PresentationsLink'));
  var schedulesLink = element(by.css('.nav.navbar-nav #SchedulesLink'));
  var storageLink = element(by.css('.nav.navbar-nav #StorageLink'));

  var signUpText = element(by.id('sign-up-text'));
  var signInText = element(by.id('sign-in-text'));
  var signUpLink = element(by.id('sign-up-link'));
  var signInLink = element(by.id('sign-in-link'));

  var accountBillingButton = element(by.css(".dropdown-menu .store-account-button.ng-scope"));

  this.confirmGet = function(url) {
    return browser.get(url)
      .then(null,function () {
        return browser.switchTo().alert().then(function (alert) {
          alert.accept();

          return _this.confirmGet(url);
        })
        .catch(function(error) {
          // no Alert shown, proceed
          console.log(error);
        });
      });
  };

  this.get = function() {
    this.confirmGet(url);
  };

  this.getProtectedPage = function() {
    this.confirmGet(displaysUrl);
  };

  this.getDisplays = function() {
    this.confirmGet(displaysUrl);
  };

  this.getEditor = function() {
    this.confirmGet(editorUrl);
  };

  this.getSchedules = function() {
    this.confirmGet(schedulesUrl);
  };

  this.getStorage = function() {
    this.confirmGet(storageUrl);
  };

  this.getDefaultSubscription = function() {
    this.confirmGet(defaultSubscriptionUrl);
  };

  this.getUrl = function() {
    return url;
  }

  this.getProtectedPageUrl = function() {
    return displaysUrl;
  }

  this.getHomeLink = function() {
    return homeLink;
  };

  this.getDisplaysLink = function() {
    return displaysLink;
  };

  this.getEditorLink = function() {
    return editorLink;
  };

  this.getSchedulesLink = function() {
    return schedulesLink;
  };

  this.getStorageLink = function() {
    return storageLink;
  };

  this.getSignUpText = function() {
    return signUpText;
  };

  this.getSignInText = function() {
    return signInText;
  };

  this.getSignUpLink = function() {
    return signUpLink;
  };

  this.getSignInLink = function() {
    return signInLink;
  };

  this.getMetaByName = function(name) {
    return element(by.xpath("//meta[@name='"+name+"']"));
  };

  this.getMetaByItemProp = function(itemprop) {
    return element(by.xpath("//meta[@itemprop='"+itemprop+"']"));
  };

  this.getMetaByProperty = function(property) {
    return element(by.xpath("//meta[@property='"+property+"']"));
  };

  this.getAccountBillingButton = function() {
    return accountBillingButton;
  };

};

module.exports = HomePage;
