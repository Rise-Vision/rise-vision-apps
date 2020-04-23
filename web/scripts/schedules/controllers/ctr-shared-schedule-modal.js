/*jshint multistr: true */
'use strict';

angular.module('risevision.schedules.controllers')
  .value('SHARED_SCHEDULE_LINK', 'https://preview.risevision.com/?type=sharedschedule&id=')
  .value('SHARED_SCHEDULE_EMBED_CODE', '<div style="position:relative;padding-bottom:56.25%;">\n\
   <iframe style="width:100%;height:100%;position:absolute;left:0px;top:0px;"\n\
      frameborder="0" width="100%" height="100%"\n\
      src="SHARED_SCHEDULE_LINK">\n\
   </iframe>\n\
</div>\n\
<div style="background:#f2f2f2;color:#020620;font-family:Helvetica;font-size:12px;padding:5px;text-align:center;">\n\
   Powered by <a href="https://www.risevision.com" target="_blank">risevision.com</a>.\n\
</div>')
  .controller('SharedScheduleModalController', ['$scope', '$modalInstance', 'scheduleFactory', '$window',
    'SHARED_SCHEDULE_LINK', 'SHARED_SCHEDULE_EMBED_CODE',
    function ($scope, $modalInstance, scheduleFactory, $window, SHARED_SCHEDULE_LINK, SHARED_SCHEDULE_EMBED_CODE) {
      $scope.schedule = scheduleFactory.schedule;
      $scope.currentTab = 'link';
      $scope.sharedScheduleLink = SHARED_SCHEDULE_LINK + scheduleFactory.schedule.id;
      $scope.sharedScheduleEmbedCode = SHARED_SCHEDULE_EMBED_CODE.replace('SHARED_SCHEDULE_LINK', $scope
        .sharedScheduleLink);

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

      $scope.copyToClipboard = function (text) {
        if ($window.navigator.clipboard) {
          $window.navigator.clipboard.writeText(text);
        }
      };

      $scope.shareOnSocial = function (network) {
        var encodedLink = encodeURIComponent($scope.sharedScheduleLink);
        var url;
        switch (network) {
        case 'twitter':
          url = 'https://twitter.com/share?via=RiseVision&url=' + encodedLink;
          break;
        case 'facebook':
          url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodedLink
          break;
        case 'linkedin':
          url = 'https://www.linkedin.com/shareArticle?mini=true&url=' + encodedLink;
          break;
        case 'classroom':
          url = 'https://classroom.google.com/share?url=' + encodedLink;
          break;
        }
        $window.open(url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600');
      };
    }
  ]); //ctr
