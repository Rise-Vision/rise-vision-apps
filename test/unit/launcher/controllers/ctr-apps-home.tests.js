'use strict';
describe('controller: AppsHomeCtrl', function() {
  beforeEach(module('risevision.apps.launcher.controllers'));
  var $rootScope, $controller, $scope, $loading, schedule, ScrollingListService, $sce;
  beforeEach(function(){
    module(function ($provide) {
      $provide.service('$loading', function() {
        return {
          start: sinon.spy(),
          stop: sinon.spy()
        };
      });
      $provide.service('schedule', function() {
        return {
          list: sinon.stub()
        };
      });
      $provide.service('ScrollingListService', function() {
        return sinon.stub().returns({
          items: {
            list: []
          }
        });
      });
      $provide.service('$sce', function() {
        return {
          trustAsResourceUrl: sinon.stub().returns('http://trustedUrl')
        }
      });
      $provide.service('translateFilter', function(){
        return function(key){
          return key;
        };
      });

      $provide.value('SHARED_SCHEDULE_URL','https://preview.risevision.com/?type=sharedschedule&id=SCHEDULE_ID');
    })
    inject(function($injector) {
      $loading = $injector.get('$loading');
      schedule = $injector.get('schedule');
      ScrollingListService = $injector.get('ScrollingListService');
      $sce = $injector.get('$sce');
      $rootScope = $injector.get('$rootScope');
      $controller = $injector.get('$controller');

      $scope = $rootScope.$new();
      $controller('AppsHomeCtrl', {
        $scope: $scope
      });
      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.getEmbedUrl).to.be.a('function');
  });

  it('should initialize',function(){
    expect($scope.schedules).to.be.ok;
    ScrollingListService.should.have.been.calledWith(schedule.list, $scope.search);

    expect($scope.tooltipKey).to.not.be.ok;
    expect($scope.search).to.deep.equal({
      sortBy: 'changeDate',
      reverse: true
    });
    expect($scope.filterConfig).to.deep.equal({
      placeholder: 'schedules-app.list.filter.placeholder'
    });
  });

  describe('spinner:', function() {
    it("should show spinner when list is loading",function(){
      $scope.schedules.loadingItems = true;
      $scope.$digest();

      $loading.start.should.have.been.calledWith('apps-home-loader');
    });

    it("should not show spinner when schedule has been initialized",function(){
      $scope.selectedSchedule = {};
      $scope.schedules.loadingItems = true;
      $scope.$digest();

      $loading.start.should.not.have.been.called;
    });

    it("should hide spinner when load is complete",function(){
      $loading.stop.should.have.been.calledWith('apps-home-loader');
    });    

    it('should configure selectedSchedule as the first item', function() {
      $scope.schedules.items.list.push('schedule1');
      $scope.schedules.items.list.push('schedule2');
      $scope.schedules.loadingItems = false;
      $scope.$digest();

      expect($scope.selectedSchedule).to.equal('schedule1');
    });
    
    describe('triggerOverlay', function() {
      it('should trigger overlay on API results', function() {
        $scope.schedules.items.list.push('item');
        $scope.schedules.loadingItems = false;
        $scope.$digest();

        expect($scope.tooltipKey).to.equal('ShareTooltip');
      });

      it('should not show overlay if list is empty', function() {
        $scope.schedules.loadingItems = false;
        $scope.$digest();

        expect($scope.tooltipKey).to.not.be.ok;
      });

    });
  });

  describe('getEmbedUrl:', function() {
    it('should return a trusted embed URL', function() {     
      expect($scope.getEmbedUrl('ID')).to.equal('http://trustedUrl');
      $sce.trustAsResourceUrl.should.have.been.calledWith('https://preview.risevision.com/?type=sharedschedule&id=ID&env=apps_home');
    });

    it('should return null, to not render iframe, when scheduleId is not provided', function() {
      expect($scope.getEmbedUrl(null)).to.equal(null);
      $sce.trustAsResourceUrl.should.not.have.been.called;
    });
  });

});
