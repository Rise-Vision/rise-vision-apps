'use strict';
var config = require('../../config/config.json');

var HomePage = function() {
  var _this = this;

  var url = config.rootUrl + '/';
  var displaysUrl = config.rootUrl + '/displays/list';
  var editorUrl = config.rootUrl + '/editor/list';
  var schedulesUrl = config.rootUrl + '/schedules/list';
  var storageUrl = config.rootUrl + '/storage';

  var homeLink = element(by.css('.nav.navbar-nav #HomeLink'));
  var displaysLink = element(by.css('.nav.navbar-nav #DisplaysLink'));
  var editorLink = element(by.css('.nav.navbar-nav #PresentationsLink'));
  var schedulesLink = element(by.css('.nav.navbar-nav #SchedulesLink'));
  var storageLink = element(by.css('.nav.navbar-nav #StorageLink'));

  var appsHomeContainer = element(by.id('apps-home-container'));
  var appsHomeLoader = element(by.xpath('//div[@spinner-key="apps-home-loader"]'));

  var shareTooltipDismiss = element(by.id('share-tooltip-dismiss'));

  var presentationAddButton = element(by.id('presentationAddButton'));
  var presentationsList = element(by.id('presentationsList'));
  var presentationsListLoader = element(by.xpath('//div[@spinner-key="presentation-list-loader"]'));
  var presentationsViewAll = element(by.id('presentationsViewAll'));

  var scheduleAddButton = element(by.id('scheduleAddButton'));
  var schedulesList = element(by.id('schedulesList'));
  var schedulesListLoader = element(by.xpath('//div[@spinner-key="schedules-list-loader"]'));
  var schedulesViewAll = element(by.id('schedulesViewAll'));

  var displayAddButton = element(by.id('displayAddButton'));
  var displaysList = element(by.id('displaysList'));
  var displaysListLoader = element(by.xpath('//div[@spinner-key="displays-list-loader"]'));
  var displaysViewAll = element(by.id('displaysViewAll'));

  var signUpText = element(by.id('sign-up-text'));
  var signInText = element(by.id('sign-in-text'));
  var signUpLink = element(by.id('sign-up-link'));
  var signInLink = element(by.id('sign-in-link'));  

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

  this.getAppsHomeContainer = function() {
    return appsHomeContainer;
  };

  this.getAppsHomeLoader = function() {
    return appsHomeLoader;
  };

  this.getShareTooltipDismiss = function() {
    return shareTooltipDismiss;
  }

  this.getPresentationAddButton = function() {
    return presentationAddButton;
  };

  this.getPresentationsList = function() {
    return presentationsList;
  };
  
  this.getPresentationsListLoader = function() {
    return presentationsListLoader;
  };

  this.getPresentationsViewAll = function() {
    return presentationsViewAll;
  };

  this.getScheduleAddButton = function() {
    return scheduleAddButton;
  };

  this.getSchedulesList = function() {
    return schedulesList;
  };

  this.getSchedulesListLoader = function() {
    return schedulesListLoader;
  };

  this.getSchedulesViewAll = function() {
    return schedulesViewAll;
  };

  this.getDisplayAddButton = function() {
    return displayAddButton;
  };

  this.getDisplaysList = function() {
    return displaysList;
  };

  this.getDisplaysListLoader = function() {
    return displaysListLoader;
  };

  this.getDisplaysViewAll = function() {
    return displaysViewAll;
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

};

module.exports = HomePage;
