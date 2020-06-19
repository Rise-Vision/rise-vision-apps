'use strict';
describe('controller: AppHomeCtrl', function() {
  beforeEach(module('risevision.apps.launcher.controllers'));
  var $rootScope, $controller, $scope, $loading, schedule, $sce;
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
          list: sinon.stub().returns(Q.resolve({items: [{id: '123'}]}))
        };
      });
      $provide.service('processErrorCode', function() {
        return sinon.stub().returns('API_ERROR');
      });
      $provide.service('$sce', function() {
        return {
          trustAsResourceUrl: sinon.stub().returns('http://trustedUrl')
        }
      });
      $provide.value('SHARED_SCHEDULE_URL','https://preview.risevision.com/?type=sharedschedule&id=SCHEDULE_ID');
    })
    inject(function($injector) {
      $loading = $injector.get('$loading');
      schedule = $injector.get('schedule');
      $sce = $injector.get('$sce');
      $rootScope = $injector.get('$rootScope');
      $controller = $injector.get('$controller');

      $scope = $rootScope.$new();
      $controller('AppHomeCtrl', {
        $scope: $scope
      });
      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.schedules).to.be.ok;
    expect($scope.getEmbedUrl).to.be.a('function');
    expect($scope.load).to.be.a('function');
  });

  describe('spinner:', function() {
    it("should show spinner at startup",function(){
      $loading.start.should.have.been.calledWith('app-home-loader');
    });

    it("should hide spinner when load is complete",function(){
      $scope.loadingItems = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledWith('app-home-loader');
    });    
  });

  describe('getEmbedUrl:', function() {
    it('should return a trusted embed URL', function() {     
      expect($scope.getEmbedUrl('ID')).to.equal('http://trustedUrl');
      $sce.trustAsResourceUrl.should.have.been.calledWith('https://preview.risevision.com/?type=sharedschedule&id=ID&env=embed');
    });

    it('should return null, to not render iframe, when scheduleId is not provided', function() {
      expect($scope.getEmbedUrl(null)).to.equal(null);
      $sce.trustAsResourceUrl.should.not.have.been.called;
    });
  });

  describe('load:', function() {
    it('should load Schedules and clear messages', function(done) {
      $scope.errorMessage = 'ERROR';
      $scope.apiError = 'ERROR';
      $scope.loadingItems = false;

      $scope.load();

      schedule.list.should.have.been.calledWith({
        sortBy: 'changeDate',
        count: 10,
        reverse: true,
      });
      expect($scope.errorMessage).to.equal('');
      expect($scope.apiError).to.equal('');
      expect($scope.loadingItems).to.be.true;
      setTimeout(function() {
        expect($scope.schedules).to.deep.equal([{id: '123'}]);
        expect($scope.selectedScheduleId).to.equal('123');
        expect($scope.loadingItems).to.be.false;
        done();
      },10);
    });

    it('should handle API failures', function(done) {
      schedule.list.returns(Q.reject());

      $scope.load();

      setTimeout(function() {
        expect($scope.errorMessage).to.equal('Failed to load Schedules.');
        expect($scope.apiError).to.equal('API_ERROR');
        expect($scope.loadingItems).to.be.false;
        done();
      },10);
    });
  });

});
