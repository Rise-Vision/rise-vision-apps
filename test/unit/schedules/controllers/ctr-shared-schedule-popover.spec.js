'use strict';
describe('controller: SharedSchedulePopoverController', function() {
  beforeEach(module('risevision.schedules.controllers'));
  beforeEach(module(function ($provide) {
    $provide.value('environment', {
      SHARED_SCHEDULE_URL: 'https://widgets.risevision.com/viewer/?type=sharedschedule&id=SCHEDULE_ID'
    });

    $provide.service("scheduleFactory", function() {
       return {};
     });

    $provide.service("scheduleTracker", function() {
       return sinon.stub();
     });

    $provide.service('userState', function() {
      return {
        getCopyOfProfile: sinon.stub().returns({firstName:'userFirstName'}),
        _restoreState: sinon.stub()
      };
    });

    $provide.service('$state', function() {
      return $state = {
        current: {
          name: 'apps.schedules.details'
        }
      };
    });
  }));
  var $scope, $window, scheduleTracker, $state, $controller;

  beforeEach(function(){
    inject(function($injector,$rootScope){
      $controller = $injector.get('$controller');
      $scope = $rootScope.$new();
      $window = $injector.get('$window');
      scheduleTracker = $injector.get('scheduleTracker');

      $controller('SharedSchedulePopoverController', {
        $scope: $scope
      });
      $scope.schedule = {
        id: 'scheduleId',
        name: 'scheduleName'
      };
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.scheduleFactory).to.be.ok;
    expect($scope.isScheduleDetails).to.be.ok;
    expect($scope.copyToClipboard).to.be.a('function');
    expect($scope.getLink).to.be.a('function');
    expect($scope.getEmbedCode).to.be.a('function');
    expect($scope.getInviteMessage).to.be.a('function');
  });

  it('should initilize values', function() {
    expect($scope.currentTab).to.equal('link');
    expect($scope.isScheduleDetails).to.be.true;
  });

  it('should handle null schedule:', function() {
    $scope.schedule = null;

    expect($scope.getLink()).to.equal('');
    expect($scope.getEmbedCode()).to.equal('');
    expect($scope.getInviteMessage()).to.equal('');
  });

  it('getLink', function() {
    expect($scope.getLink()).to.equal('https://widgets.risevision.com/viewer/?type=sharedschedule&id=scheduleId');
  });

  describe('isScheduleDetails:', function() {
    it('should set isScheduleDetails to false if not in schedule details page', function() {
      $state.current.name = 'apps.schedules.list';
      $controller('SharedSchedulePopoverController', {
        $scope: $scope
      });
      $scope.$digest();
      expect($scope.isScheduleDetails).to.be.false;
    });

    it('should set isScheduleDetails to true if visiting schedule details page', function() {
      $state.current.name = 'apps.schedules.details';
      $controller('SharedSchedulePopoverController', {
        $scope: $scope
      });
      $scope.$digest();
      expect($scope.isScheduleDetails).to.be.true;
    });
  });

  describe('getEnterpriseLink', function() {
    it('should get schedule link with enterprise env', function() {
      expect($scope.getEnterpriseLink()).to.equal('https://widgets.risevision.com/viewer/?type=sharedschedule&id=scheduleId&env=enterprise'); 
    });

    it('should return blank if no schedule defined', function() {
      $scope.schedule = null;
      expect($scope.getEnterpriseLink()).to.equal(''); 
    });
  });

  it('getEmbedCode', function() {
    expect($scope.getEmbedCode()).to.be.contain('<div style="position:relative;padding-bottom:56.25%;">\n\
   <iframe style="width:100%;height:100%;position:absolute;left:0px;top:0px;"\n\
      frameborder="0" width="100%" height="100%"\n\
      src="https://widgets.risevision.com/viewer/?type=sharedschedule&id=scheduleId&env=embed">\n\
   </iframe>\n\
</div>\n\
<div style="background:#f2f2f2;color:#020620;font-family:Helvetica;font-size:12px;padding:5px;text-align:center;">\n\
   Powered by <a href="https://www.risevision.com" target="_blank">Rise Vision</a>\n\
</div>');
  });

  it('getInviteMessage', function() {
    expect($scope.getInviteMessage()).to.equal('I\'m using Rise Vision to help keep you in the loop. I\'d like for you to install the Rise Chrome Extension. Once installed, you\'ll see important information when you open a new tab.\n\nHere\'s how to install (promise, it only takes 2 minutes):\n 1. Click the following link to open the Rise Chrome Extension in the Chrome Store:\n    https://chrome.google.com/webstore/detail/rise-chrome-extension/dkoohkdagjpgjheoaaegomjhdccfbcle?hl=en\n 2. Click "Add to Chrome" in the top right\n 3. When prompted, copy and paste the following URL into the area provided:\n    https://widgets.risevision.com/viewer/?type=sharedschedule&id=scheduleId\n\nLet me know if you have any questions.\nRegards,\nuserFirstName');
  });

  describe('copyToClipboard:', function() {
    beforeEach(function() {
      //phantomJS does not provide navigator.clipboard, so we are mocking it
      sinon.stub($window.navigator.clipboard, 'writeText');
    });
    afterEach(function() {
      $window.navigator.clipboard.writeText.restore();
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
      sinon.stub($window, 'open');
    });
    afterEach(function() {
      $window.open.restore();
    });

    it('should open a popup with the correct sharing url', function() {
      $scope.shareOnSocial('twitter');

      $window.open.should.have.been.calledWith('https://twitter.com/share?via=RiseVision&url=https%3A%2F%2Fwidgets.risevision.com%2Fviewer%2F%3Ftype%3Dsharedschedule%26id%3DscheduleId', '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600');

      scheduleTracker.should.have.been.calledWith('schedule shared', 'scheduleId', 'scheduleName', {source: 'socialMedia', network: 'twitter'});
    });

    it('should use the correct social network url', function() {
      $scope.shareOnSocial('twitter');
      $window.open.should.have.been.calledWith('https://twitter.com/share?via=RiseVision&url=https%3A%2F%2Fwidgets.risevision.com%2Fviewer%2F%3Ftype%3Dsharedschedule%26id%3DscheduleId');
      scheduleTracker.should.have.been.calledWith('schedule shared', 'scheduleId', 'scheduleName', {source: 'socialMedia', network: 'twitter'});
      scheduleTracker.resetHistory();
      $window.open.resetHistory();


      $scope.shareOnSocial('facebook');
      $window.open.should.have.been.calledWith('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwidgets.risevision.com%2Fviewer%2F%3Ftype%3Dsharedschedule%26id%3DscheduleId');
      scheduleTracker.should.have.been.calledWith('schedule shared', 'scheduleId', 'scheduleName', {source: 'socialMedia', network: 'facebook'});
      scheduleTracker.resetHistory();
      $window.open.resetHistory();

      $scope.shareOnSocial('linkedin');
      $window.open.should.have.been.calledWith('https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwidgets.risevision.com%2Fviewer%2F%3Ftype%3Dsharedschedule%26id%3DscheduleId');
      scheduleTracker.should.have.been.calledWith('schedule shared', 'scheduleId', 'scheduleName', {source: 'socialMedia', network: 'linkedin'});
      scheduleTracker.resetHistory();
      $window.open.resetHistory();

      $scope.shareOnSocial('classroom');
      $window.open.should.have.been.calledWith('https://classroom.google.com/share?url=https%3A%2F%2Fwidgets.risevision.com%2Fviewer%2F%3Ftype%3Dsharedschedule%26id%3DscheduleId');
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
