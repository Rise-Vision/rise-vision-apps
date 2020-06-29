/*jshint multistr: true */
'use strict';

angular.module('risevision.schedules.controllers')
  .value('SHARED_SCHEDULE_EMBED_CODE', '<div style="position:relative;padding-bottom:56.25%;">\n\
   <iframe style="width:100%;height:100%;position:absolute;left:0px;top:0px;"\n\
      frameborder="0" width="100%" height="100%"\n\
      src="SHARED_SCHEDULE_URL&env=embed">\n\
   </iframe>\n\
</div>\n\
<div style="background:#f2f2f2;color:#020620;font-family:Helvetica;font-size:12px;padding:5px;text-align:center;">\n\
   Powered by <a href="https://www.risevision.com" target="_blank">Rise Vision</a>\n\
</div>')
  .value('SHARED_SCHEDULE_INVITE_MESSAGE', 'I\'m using Rise Vision to help keep you in the loop. I\'d like for you to install the Rise Chrome Extension. Once installed, you\'ll see important information when you open a new tab.\n\n\
Here\'s how to install (promise, it only takes 2 minutes):\n\
 1. Click the following link to open the Rise Chrome Extension in the Chrome Store:\n\
    https://chrome.google.com/webstore/detail/rise-chrome-extension/dkoohkdagjpgjheoaaegomjhdccfbcle?hl=en\n\
 2. Click "Add to Chrome" in the top right\n\
 3. When prompted, copy and paste the following URL into the area provided:\n\
    SHARED_SCHEDULE_URL\n\n\
Let me know if you have any questions.\n\
Regards,\n\
USER_FIRST_NAME')
  .controller('SharedSchedulePopoverController', ['$scope', '$window', 'scheduleTracker', 'userState',
    'SHARED_SCHEDULE_URL', 'SHARED_SCHEDULE_EMBED_CODE', 'SHARED_SCHEDULE_INVITE_MESSAGE',
    function ($scope, $window, scheduleTracker, userState,
      SHARED_SCHEDULE_URL, SHARED_SCHEDULE_EMBED_CODE, SHARED_SCHEDULE_INVITE_MESSAGE) {
      $scope.currentTab = 'link';

      $scope.getLink = function() {
        return $scope.schedule ? SHARED_SCHEDULE_URL.replace('SCHEDULE_ID', $scope.schedule.id) : '';
      };

      $scope.getEmbedCode = function() {
        return $scope.schedule ? SHARED_SCHEDULE_EMBED_CODE.replace('SHARED_SCHEDULE_URL', $scope.getLink()) : '';
      };

      $scope.getInviteMessage = function() {
        if (!$scope.schedule) {
          return '';
        }
        var profile = userState.getCopyOfProfile();
        var firstName =  profile.firstName ? profile.firstName : '';
        return SHARED_SCHEDULE_INVITE_MESSAGE
          .replace('SHARED_SCHEDULE_URL', $scope.getLink())
          .replace('USER_FIRST_NAME',firstName);
      };

      $scope.copyToClipboard = function (text) {
        $scope.trackScheduleShared();

        if ($window.navigator.clipboard) {
          $window.navigator.clipboard.writeText(text);
        }
      };

      $scope.onTextFocus = function (event) {
        event.target.select();
      };

      $scope.shareOnSocial = function (network) {
        $scope.trackScheduleShared({
          network: network
        });
        var encodedLink = encodeURIComponent($scope.getLink());
        var url;
        switch (network) {
        case 'twitter':
          url = 'https://twitter.com/share?via=RiseVision&url=' + encodedLink;
          break;
        case 'facebook':
          url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodedLink;
          break;
        case 'linkedin':
          url = 'https://www.linkedin.com/shareArticle?mini=true&url=' + encodedLink;
          break;
        case 'classroom':
          url = 'https://classroom.google.com/share?url=' + encodedLink;
          break;
        default:
          return;
        }
        $window.open(url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600');
      };

      $scope.trackScheduleShared = function (extraProperties) {
        var properties = extraProperties || {};
        properties.source = $scope.currentTab;

        scheduleTracker('schedule shared', $scope.schedule.id, $scope.schedule.name, properties);
      };
    }
  ]);
