'use strict';
describe('controller: SharedScheduleModalController', function() {
  beforeEach(module('risevision.schedules.controllers'));
  beforeEach(module(function ($provide) {
    schedule = {
      id: 'scheduleId',
      name: 'scheduleName'
    };

    $provide.value('SHARED_SCHEDULE_URL','https://preview.risevision.com/?type=sharedschedule&id=SCHEDULE_ID');

    $provide.service('$modalInstance',function(){
      return {
        dismiss : function(){}
      }
    });  
    $provide.service('scheduleFactory',function(){
      return scheduleFactory = {
        schedule: schedule
      }
    });
    $provide.service("scheduleTracker", function() {
       return sinon.stub();
     });
  }));
  var $scope, $modalInstance, scheduleFactory, schedule, $window, scheduleTracker;

  beforeEach(function(){
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      $window = $injector.get('$window');
      scheduleTracker = $injector.get('scheduleTracker');

      sinon.spy($modalInstance, 'dismiss');

      $controller('SharedScheduleModalController', {
        $scope: $scope,
        $modalInstance : $modalInstance
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.dismiss).to.be.a('function');
    expect($scope.copyToClipboard).to.be.a('function');
    expect($scope.schedule).to.be.ok;
    expect($scope.currentTab).to.be.ok;
    expect($scope.sharedScheduleLink).to.be.ok;
    expect($scope.sharedScheduleEmbedCode).to.be.ok;
  });

  it('should initilize values', function() {
    expect($scope.schedule).to.equal(schedule);
    expect($scope.currentTab).to.equal('link');
    expect($scope.sharedScheduleLink).to.equal('https://preview.risevision.com/?type=sharedschedule&id=scheduleId');
    expect($scope.sharedScheduleEmbedCode).to.be.contain('<div style="position:relative;padding-bottom:56.25%;">\n\
   <iframe style="width:100%;height:100%;position:absolute;left:0px;top:0px;"\n\
      frameborder="0" width="100%" height="100%"\n\
      src="https://preview.risevision.com/?type=sharedschedule&id=scheduleId&env=embed">\n\
   </iframe>\n\
</div>\n\
<div style="background:#f2f2f2;color:#020620;font-family:Helvetica;font-size:12px;padding:5px;text-align:center;">\n\
   Powered by <a href="https://www.risevision.com" target="_blank">Rise Vision</a>\n\
</div>');
  });

  it('should dismiss modal',function(){
      $scope.dismiss();
      $modalInstance.dismiss.should.have.been.called;
  });

  describe('copyToClipboard:', function() {
    beforeEach(function() {
      //phantomJS does not provide navigator.clipboard, so we are mocking it
      $window.navigator.clipboard = {
        writeText: sinon.stub()
      };
    });
    afterEach(function() {
      delete $window.navigator.clipboard;
    });

    it('should copy to clipboard', function(){
      $scope.copyToClipboard('text');
      $window.navigator.clipboard.writeText.should.have.been.calledWith('text');
      scheduleTracker.should.have.been.calledWith('schedule shared', 'scheduleId', 'scheduleName', {source: 'link'});
    });
  });

  describe('onTextFocus', function() {
    it('should select target element text', function() {
      var event = {
        target: {
          select: sinon.stub()
        }
      };

      $scope.onTextFocus(event);

      event.target.select.should.have.been.called;
    });
  });

  describe('shareOnSocial', function() {
    beforeEach(function() {
      $scope.currentTab = 'socialMedia';
      sinon.stub($window, 'open');
    });
    afterEach(function() {
      $window.open.restore();
    });

    it('should open a popup with the correct sharing url', function() {
      $scope.shareOnSocial('twitter');

      $window.open.should.have.been.calledWith('https://twitter.com/share?via=RiseVision&url=https%3A%2F%2Fpreview.risevision.com%2F%3Ftype%3Dsharedschedule%26id%3DscheduleId', '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600');

      scheduleTracker.should.have.been.calledWith('schedule shared', 'scheduleId', 'scheduleName', {source: 'socialMedia', network: 'twitter'});
    });

    it('should use the correct social network url', function() {
      $scope.shareOnSocial('twitter');
      $window.open.should.have.been.calledWith('https://twitter.com/share?via=RiseVision&url=https%3A%2F%2Fpreview.risevision.com%2F%3Ftype%3Dsharedschedule%26id%3DscheduleId');
      scheduleTracker.should.have.been.calledWith('schedule shared', 'scheduleId', 'scheduleName', {source: 'socialMedia', network: 'twitter'});
      scheduleTracker.resetHistory();
      $window.open.resetHistory();


      $scope.shareOnSocial('facebook');
      $window.open.should.have.been.calledWith('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fpreview.risevision.com%2F%3Ftype%3Dsharedschedule%26id%3DscheduleId');
      scheduleTracker.should.have.been.calledWith('schedule shared', 'scheduleId', 'scheduleName', {source: 'socialMedia', network: 'facebook'});
      scheduleTracker.resetHistory();
      $window.open.resetHistory();

      $scope.shareOnSocial('linkedin');
      $window.open.should.have.been.calledWith('https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fpreview.risevision.com%2F%3Ftype%3Dsharedschedule%26id%3DscheduleId');
      scheduleTracker.should.have.been.calledWith('schedule shared', 'scheduleId', 'scheduleName', {source: 'socialMedia', network: 'linkedin'});
      scheduleTracker.resetHistory();
      $window.open.resetHistory();

      $scope.shareOnSocial('classroom');
      $window.open.should.have.been.calledWith('https://classroom.google.com/share?url=https%3A%2F%2Fpreview.risevision.com%2F%3Ftype%3Dsharedschedule%26id%3DscheduleId');
      scheduleTracker.should.have.been.calledWith('schedule shared', 'scheduleId', 'scheduleName', {source: 'socialMedia', network: 'classroom'});
    });

    it('should not open popup for invalid/unsupported social networks', function() {
      $scope.shareOnSocial('google+');

      $window.open.should.not.have.been.called;
    });
  });

  describe('trackScheduleShared:', function() {
    it('should track event setting "source" as current tab', function(){
      $scope.trackScheduleShared();
      scheduleTracker.should.have.been.calledWith('schedule shared', 'scheduleId', 'scheduleName', {source: 'link'});

      scheduleTracker.resetHistory();
      $scope.currentTab = 'chromeExtension';

      $scope.trackScheduleShared();
      scheduleTracker.should.have.been.calledWith('schedule shared', 'scheduleId', 'scheduleName', {source: 'chromeExtension'});
    });
  });

});
