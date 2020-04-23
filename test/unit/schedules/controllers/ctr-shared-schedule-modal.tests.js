'use strict';
describe('controller: SharedScheduleModalController', function() {
  beforeEach(module('risevision.schedules.controllers'));
  beforeEach(module(function ($provide) {
    schedule = {id: 'scheduleId'};

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
  }));
  var $scope, $modalInstance, scheduleFactory, schedule, $window;

  beforeEach(function(){
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      $window = $injector.get('$window');

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
      src="https://preview.risevision.com/?type=sharedschedule&id=scheduleId">\n\
   </iframe>\n\
</div>\n\
<div style="background:#f2f2f2;color:#020620;font-family:Helvetica;font-size:12px;padding:5px;text-align:center;">\n\
   Powered by <a href="https://www.risevision.com" target="_blank">risevision.com</a>.\n\
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
    });
  });

});
