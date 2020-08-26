'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../pages/homepage.js');
var SignInPage = require('./../pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var PresentationListPage = require('./../../editor/pages/presentationListPage.js');
var GoogleAuthPage = require('rv-common-e2e').googleAuthPage;
var helper = require('rv-common-e2e').helper;

var HomepageScenarios = function() {
  
  browser.driver.manage().window().setSize(1400, 900);
  describe('Homepage', function() {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var googleAuthPage;
    var presentationListPage;
    before(function (){
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      googleAuthPage = new GoogleAuthPage();
      presentationListPage = new PresentationListPage();

      homepage.get();
      //wait for spinner to go away.
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
    });

    it('should show login page',function(){
      expect(signInPage.getSignInPageContainer().isPresent()).to.eventually.be.true;
    });

    it('should sign in the user and load presentations page',function(){
      signInPage.signIn();

      expect(presentationListPage.getEditorAppContainer().isDisplayed()).to.eventually.be.true;
    });

    it('should show common header',function(){
      expect(commonHeaderPage.getCommonHeader().isDisplayed()).to.eventually.be.true;
    });

    describe('NavMenu', function(){

      it("should load menu items", function() {
        // expect 8 menu items (4 for the off-canvas menu)
        expect(commonHeaderPage.getCommonHeaderMenuItems().count()).to.eventually.equal(8);
        
        expect(commonHeaderPage.getCommonHeaderMenuItems().get(0).getText()).to.eventually.equal('Presentations');
        expect(commonHeaderPage.getCommonHeaderMenuItems().get(1).getText()).to.eventually.equal('Schedules');
        expect(commonHeaderPage.getCommonHeaderMenuItems().get(2).getText()).to.eventually.equal('Displays');
        expect(commonHeaderPage.getCommonHeaderMenuItems().get(3).getText()).to.eventually.equal('Storage');
      });

      it("off canvas menu should not show", function() {
        expect(commonHeaderPage.getCommonHeaderMenuItems().get(0).isDisplayed()).to.eventually.be.true;

        expect(commonHeaderPage.getCommonHeaderMenuItems().get(4).isDisplayed()).to.eventually.be.false;
        expect(commonHeaderPage.getCommonHeaderMenuItems().get(5).isDisplayed()).to.eventually.be.false;
        expect(commonHeaderPage.getCommonHeaderMenuItems().get(6).isDisplayed()).to.eventually.be.false;
        expect(commonHeaderPage.getCommonHeaderMenuItems().get(7).isDisplayed()).to.eventually.be.false;
      });

      it("links target & href should be configured", function(done) {
        commonHeaderPage.getCommonHeaderMenuItems().then(function(elements) {
          expect(elements[0].element(by.tagName('a')).getAttribute('target')).to.eventually.not.be.ok;
          expect(elements[0].element(by.tagName('a')).getAttribute('href')).to.eventually.contain('?cid=');

          expect(elements[1].element(by.tagName('a')).getAttribute('target')).to.eventually.not.be.ok;
          expect(elements[1].element(by.tagName('a')).getAttribute('href')).to.eventually.contain('?cid=');
          
          done();
        });
      });
    })
    
    describe('Given a user who wants to share the url', function () {
      before(function () {
        homepage.get();
        //wait for spinner to go away.
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
      });

      it('should contain meta tags for sharing it nicely', function () {
        expect(homepage.getMetaByName('description').getAttribute('content')).to.eventually.equal('We have a couple of apps that will allow you to manage your Digital Signage. Managing from the content creation to its delivery on an unlimited number of displays anywhere in the world.');
      });

      it('should contain meta tags for sharing it nicely on G+', function () {
        expect(homepage.getMetaByItemProp('name').getAttribute('content')).to.eventually.equal('Rise Vision | Apps');
        expect(homepage.getMetaByItemProp('description').getAttribute('content')).to.eventually.equal('We have a couple of apps that will allow you to manage your Digital Signage. Managing from the content creation to its delivery on an unlimited number of displays anywhere in the world.');
        expect(homepage.getMetaByItemProp('image').getAttribute('content')).to.eventually.equal('https://s3.amazonaws.com/Rise-Images/landing-page/rv-image.png');
      });

      it('should contain meta tags for sharing it nicely on Twitter', function () {
        expect(homepage.getMetaByName('twitter:card').getAttribute('content')).to.eventually.equal('summary_large_image');
        expect(homepage.getMetaByName('twitter:site').getAttribute('content')).to.eventually.equal('@RiseVision');
        expect(homepage.getMetaByName('twitter:domain').getAttribute('content')).to.eventually.equal('https://apps.risevision.com');
        expect(homepage.getMetaByName('twitter:title').getAttribute('content')).to.eventually.equal('Rise Vision | Apps');
        expect(homepage.getMetaByName('twitter:description').getAttribute('content')).to.eventually.equal('We have a couple of apps that will allow you to manage your Digital Signage. Managing from the content creation to its delivery on an unlimited number of displays anywhere in the world.');
        expect(homepage.getMetaByName('twitter:image:src').getAttribute('content')).to.eventually.equal('https://s3.amazonaws.com/Rise-Images/landing-page/rv-image.png');
        expect(homepage.getMetaByName('twitter:url').getAttribute('content')).to.eventually.equal('https://apps.risevision.com');
      });

      it('should contain meta tags for sharing it nicely on Facebook', function () {
        expect(homepage.getMetaByProperty('og:locale').getAttribute('content')).to.eventually.equal('en_US');
        expect(homepage.getMetaByProperty('og:title').getAttribute('content')).to.eventually.equal('Rise Vision | Apps');
        expect(homepage.getMetaByProperty('og:type').getAttribute('content')).to.eventually.equal('product');
        expect(homepage.getMetaByProperty('og:url').getAttribute('content')).to.eventually.equal('https://apps.risevision.com');
        expect(homepage.getMetaByProperty('og:image').getAttribute('content')).to.eventually.equal('https://s3.amazonaws.com/Rise-Images/landing-page/rv-image.png');
        expect(homepage.getMetaByProperty('og:description').getAttribute('content')).to.eventually.equal('We have a couple of apps that will allow you to manage your Digital Signage. Managing from the content creation to its delivery on an unlimited number of displays anywhere in the world.');
        expect(homepage.getMetaByProperty('article:publisher').getAttribute('content')).to.eventually.equal('https://www.facebook.com/risevision');
        expect(homepage.getMetaByProperty('og:site_name').getAttribute('content')).to.eventually.equal('Rise Vision | Apps');
      });
    });

    after('Should sign out user', function() {
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
      commonHeaderPage.signOut(true);
    });
  });
};

module.exports = HomepageScenarios;
