'use strict';
describe('directive: scheduleFields', function() {
  var $scope, $rootScope, scheduleFactory, playlistFactory, playerLicenseFactory, $modal, $sce;
  var classicPres1 = { name: 'classic1' };
  var classicPres2 = { name: 'classic2' };
  var htmlPres1 = { name: 'html1', presentationType: 'HTML Template' };
  var items = [ classicPres1, classicPres2, htmlPres1 ];
  var element;

  beforeEach(module('risevision.schedules.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('$modal', function() {
      return {
        open: sinon.stub()
      };
    });
    $provide.service('playlistFactory', function() {
      return {
        getNewUrlItem: sinon.stub().returns('urlItem'),
        newPresentationItem: sinon.stub().returns('presentationItem'),
        addPresentationItems: sinon.spy()
      };
    });
    $provide.service('scheduleFactory', function() {
      return {
        schedule: {
          changeDate: 'changeDate'
        },
        checkFreeDisplays: function() {
          return Q.resolve();
        },
        requiresLicense: sinon.stub().returns(true)
      };
    });
    $provide.service('playerLicenseFactory', function() {
      return {
        confirmAndLicense: sinon.stub().returns(Q.resolve())
      };
    });

    $provide.value('SHARED_SCHEDULE_URL','https://widgets.risevision.com/viewer/?type=sharedschedule&id=SCHEDULE_ID');
  }));

  beforeEach(inject(function($compile, _$rootScope_, $templateCache, $injector){
    $modal = $injector.get('$modal');
    scheduleFactory = $injector.get('scheduleFactory');
    playlistFactory = $injector.get('playlistFactory');
    playerLicenseFactory = $injector.get('playerLicenseFactory');
    $sce = $injector.get('$sce');

    $templateCache.put('partials/schedules/schedule-fields.html', '<p>mock</p>');
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();

    element = $compile('<schedule-fields></schedule-fields>')($scope);
    $rootScope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;

    expect($scope.addUrlItem).to.be.a('function');
    expect($scope.addPresentationItem).to.be.a("function");
    expect($scope.getEmbedUrl).to.be.a('function');

    expect($scope.applyTimeline).to.be.false;
    expect($scope.freeDisplays).to.deep.equal([]);

    expect($scope.factory).to.equal(scheduleFactory);
    expect($scope.playerLicenseFactory).to.equal(playerLicenseFactory);
  });

  describe('checkFreeDisplays:', function() {
    beforeEach(function() {
      sinon.stub(scheduleFactory, 'checkFreeDisplays').returns(Q.resolve(['display1']));
    });

    it('should watch distribution field & clear playerLicenseFactory errors', function() {
      playerLicenseFactory.apiError = 'apiError';
      scheduleFactory.schedule.distribution = ['displayId'];

      $scope.$digest();

      scheduleFactory.checkFreeDisplays.should.have.been.called;
      expect(playerLicenseFactory.apiError).to.equal('');
    });

    it('should watch distributeToAll field & clear playerLicenseFactory errors', function() {
      playerLicenseFactory.apiError = 'apiError';
      scheduleFactory.schedule.distributeToAll = true;

      $scope.$digest();

      scheduleFactory.checkFreeDisplays.should.have.been.called;
      expect(playerLicenseFactory.apiError).to.equal('');
    });

    it('should watch requiresLicense value', function() {
      scheduleFactory.requiresLicense.returns(false);

      $scope.$digest();

      scheduleFactory.checkFreeDisplays.should.have.been.called;
      expect(playerLicenseFactory.apiError).to.equal('');
    });

    it('should update scope variable with response', function(done) {
      scheduleFactory.schedule.distributeToAll = true;

      $scope.$digest();

      setTimeout(function() {
        expect($scope.freeDisplays).to.deep.equal(['display1']);        

        done();
      }, 10);
    });

  });

  it('addUrlItem:', function() {
    $scope.addUrlItem();

    $modal.open.should.have.been.calledWithMatch({
      templateUrl: 'partials/schedules/playlist-item.html',
      controller: 'playlistItemModal',
      size: 'md'
    });

    expect($modal.open.getCall(0).args[0].resolve.playlistItem()).to.equal('urlItem');
  });

  describe('licenseFreeDisplays:', function() {
    it('should license displays and clear freeDisplays', function(done) {
      var freeDisplays = ['displayId1', 'displayId2'];
      $scope.freeDisplays = freeDisplays;

      $scope.licenseFreeDisplays();

      setTimeout(function() {
        playerLicenseFactory.confirmAndLicense.should.have.been.calledWith(freeDisplays);
        expect($scope.freeDisplays).to.deep.equal([]);

        done();
      }, 10);
    });
  });

  describe('addPresentationItem:', function() {

    it('should open the Playlist Item modal for a single item', function(done) {
      $modal.open.returns({result: Q.resolve(['presentation1'])});

      $scope.addPresentationItem();

      $modal.open.should.have.been.calledOnce;
      $modal.open.should.have.been.calledWithMatch({
        templateUrl: 'partials/editor/presentation-multi-selector-modal.html',
        controller: 'PresentationMultiSelectorModal'
      });

      setTimeout(function() {
        $modal.open.should.have.been.calledTwice;
        $modal.open.should.have.been.calledWithMatch({
          templateUrl: 'partials/schedules/playlist-item.html',
          controller: 'playlistItemModal',
          size: 'md'
        });

        expect($modal.open.getCall(1).args[0].resolve.playlistItem()).to.equal('presentationItem');

        playlistFactory.addPresentationItems.should.not.have.been.called;

        done();
      }, 10);

    });

    it('should add multiple items to the list', function(done) {
      var presentations = ['presentation1', 'presentation2'];
      $modal.open.returns({result: Q.resolve(presentations)});

      $scope.addPresentationItem();

      $modal.open.should.have.been.calledOnce;
      $modal.open.should.have.been.calledWithMatch({
        templateUrl: 'partials/editor/presentation-multi-selector-modal.html',
        controller: 'PresentationMultiSelectorModal'
      });

      setTimeout(function() {
        $modal.open.should.have.been.calledOnce;

        playlistFactory.addPresentationItems.should.have.been.calledWith(presentations);

        done();
      }, 10);

    });
  });

  describe('getEmbedUrl:', function() {
    beforeEach(function() {
      sinon.stub($sce, 'trustAsResourceUrl').returns('http://trustedUrl');
    });

    afterEach(function() {
      $sce.trustAsResourceUrl.restore();
    });

    it('should return a trusted embed URL', function() {
      scheduleFactory.schedule.id = 'ID';

      expect($scope.getEmbedUrl()).to.equal('http://trustedUrl');
      $sce.trustAsResourceUrl.should.have.been.calledWith('https://widgets.risevision.com/viewer/?type=sharedschedule&id=ID&env=apps_schedule&applyTimeline=false');
    });

    it('should apply timelines if user selects the option', function() {
      scheduleFactory.schedule.id = 'ID';
      $scope.applyTimeline = true;

      expect($scope.getEmbedUrl()).to.equal('http://trustedUrl');
      $sce.trustAsResourceUrl.should.have.been.calledWith('https://widgets.risevision.com/viewer/?type=sharedschedule&id=ID&env=apps_schedule');
    });

    it('should indicate core data retrieval and append cachebuster parameter to force refresh', function() {
      scheduleFactory.schedule.id = 'ID';
      scheduleFactory.schedule.changeDate = 'updatedDate';

      expect($scope.getEmbedUrl()).to.equal('http://trustedUrl');
      $sce.trustAsResourceUrl.should.have.been.calledWith('https://widgets.risevision.com/viewer/?type=sharedschedule&id=ID&env=apps_schedule&applyTimeline=false&dataSource=core&changeDate=updatedDate');
    });

    it('should return null, to not render iframe, when schedule id is not provided', function() {
      scheduleFactory.schedule = null;

      expect($scope.getEmbedUrl()).to.equal(null);
      $sce.trustAsResourceUrl.should.not.have.been.called;
    });

  });

});
