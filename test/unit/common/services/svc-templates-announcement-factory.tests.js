'use strict';
describe('service: templates-announcement-factory', function() {
  var sandbox = sinon.sandbox.create();
  var factory, selectedCompany, localStorageService, executeStub, userState, $modal, segmentAnalytics, bigQueryLogging;

  beforeEach(module('risevision.apps.services'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.value('CHECK_TEMPLATES_ANNOUNCEMENT','true');
    $provide.service('$q', function() {return Q;});
    $provide.service('presentation', function() {
      return {};
    });
    $provide.service('userState', function() {
      return {
        getCopyOfSelectedCompany: function() {
          return selectedCompany;
        },
        isEducationCustomer: sandbox.stub().returns(true),
        _restoreState: sandbox.stub(),
        getSelectedCompanyId: sandbox.stub().returns('')
      };
    });
    $provide.service('localStorageService', function() {
      return {
        get: sandbox.stub().returns(false),
        set: sandbox.stub(),
        remove: sandbox.stub()
      }
    });
    $provide.service('CachedRequest', function() {
      return function(request, args) {
        return {
          execute: executeStub = sandbox.stub().returns(Q.resolve({items:[{changeDate: '2010-01-01'}]}))
        }
      }
    });
    $provide.service("$templateCache", function() {
      return {
        get: sandbox.stub().returns("template"),
        put: sandbox.stub()
      };
    });
    $provide.service('$modal', function() {
      return {
        open: sandbox.stub()
      }
    });
    $provide.service('segmentAnalytics', function() {
      return {
        load: sandbox.stub(), 
        track: sandbox.stub()
      }
    });
    $provide.service('bigQueryLogging', function() {
      return {
        logEvent: sandbox.stub()
      }
    });
  }));

  beforeEach(function() {
    inject(function($injector) {
      factory = $injector.get('templatesAnnouncementFactory');
      userState = $injector.get('userState');
      localStorageService = $injector.get('localStorageService');
      $modal = $injector.get('$modal');
      segmentAnalytics = $injector.get('segmentAnalytics');
      bigQueryLogging = $injector.get('bigQueryLogging');
      selectedCompany = {
        creationDate: '2010-01-01'
      };
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist',function(){
    expect(factory.showAnnouncementIfNeeded).to.be.a('function');
  });

  describe('showAnnouncementIfNeeded:', function() {    
    it('should show announcement',function(done){
      factory.showAnnouncementIfNeeded();
      setTimeout(function(){
        expect($modal.open).to.have.been.calledWithMatch({
          template: "template",
          controller: "TemplatesAnnouncementModalCtrl",
          size: "lg",
          backdrop: 'static',
          keyboard: false
        });
        done();
      },10);
    });

    it('should not show announcement if customer is non Education',function(done) {
      userState.isEducationCustomer.returns(false);
      factory.showAnnouncementIfNeeded();
      setTimeout(function(){
        expect($modal.open).to.not.have.been.called;
        done();
      },10);
    });

    it('should not show announcement if already dismissed',function(done) {
      localStorageService.get.returns(true);
      factory.showAnnouncementIfNeeded();
      setTimeout(function(){
        expect($modal.open).to.not.have.been.called;
        done();
      },10);
    });

    it('should not show announcement if company is recent',function(done) {
      selectedCompany = {creationDate: new Date()};
      factory.showAnnouncementIfNeeded();
      setTimeout(function(){
        expect($modal.open).to.not.have.been.called;
        done();
      },10);
    });

    it('should not show announcement if company is missing',function(done) {
      selectedCompany = undefined;
      factory.showAnnouncementIfNeeded();
      setTimeout(function(){
        expect($modal.open).to.not.have.been.called;
        done();
      },10);
    });

    describe('added HTML Presentations in the last 30 days',function () {
      it('should show announcement when presentations are older than 30 days',function(done) {
        executeStub.returns(Q.resolve({items:[{changeDate: '2015-01-01'}]}));
        factory.showAnnouncementIfNeeded();
        setTimeout(function(){
          expect($modal.open).to.have.been.called;
          done();
        },10);
      });

      it('should show announcement when no presentations are found',function(done) {
        executeStub.returns(Q.resolve({items:[]}));
        factory.showAnnouncementIfNeeded();
        setTimeout(function(){
          expect($modal.open).to.have.been.called;
          done();
        },10);
      });

      it('should not show announcement when there are recent html presentations',function(done) {
        executeStub.returns(Q.resolve({items:[{changeDate: new Date()}]}));
        factory.showAnnouncementIfNeeded();
        setTimeout(function(){
          expect($modal.open).to.not.have.been.called;
          done();
        },10);
      });

      it('should not show announcement if presentations request fail',function(done) {
        executeStub.returns(Q.reject());
        factory.showAnnouncementIfNeeded();
        setTimeout(function(){
          expect($modal.open).to.not.have.been.called;
          done();
        },10);
      });
    });

    describe('handle modal result', function() {
      it('should set as dismissed in localStorage', function(done) {
        $modal.open.returns({result: Q.resolve()});        
        factory.showAnnouncementIfNeeded();
        setTimeout(function(){
          expect(localStorageService.set).to.have.been.calledWith('templatesAnnouncement.dismissed',true);
          done();
        },10);
      });

      it('should log thumbsup event', function(done) {
        $modal.open.returns({result: Q.resolve(true)});
        factory.showAnnouncementIfNeeded();
        setTimeout(function(){
          expect(segmentAnalytics.track).to.have.been.calledWith('Templates Announcement Thumbs Up');
          expect(bigQueryLogging.logEvent).to.have.been.calledWith('Templates Announcement Thumbs Up');
          done();
        },10);
      });

      it('should log thumbs down event', function(done) {
        $modal.open.returns({result: Q.resolve(false)});
        factory.showAnnouncementIfNeeded();
        setTimeout(function(){
          expect(segmentAnalytics.track).to.have.been.calledWith('Templates Announcement Thumbs Down');
          expect(bigQueryLogging.logEvent).to.have.been.calledWith('Templates Announcement Thumbs Down');
          done();
        },10);
      });


      it('should not do anything on reject', function(done) {
        $modal.open.returns({result: Q.reject()});        
        factory.showAnnouncementIfNeeded();
        setTimeout(function(){
          expect(localStorageService.set).to.not.have.been.called;
          expect(segmentAnalytics.track).to.not.have.been.called;
          expect(bigQueryLogging.logEvent).to.not.have.been.called;
          done();
        },10);
      });
    });

  });

});
