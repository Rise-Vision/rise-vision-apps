'use strict';

angular.module('risevision.apps.directives')
  .directive('inAppMessages', ['inAppMessagesFactory', 'templatesAnnouncementFactory', 'CHECK_TEMPLATES_ANNOUNCEMENT',
    function (inAppMessagesFactory, templatesAnnouncementFactory, CHECK_TEMPLATES_ANNOUNCEMENT) {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'partials/common/in-app-messages.html',
        link: function ($scope) {
          $scope.inAppMessagesFactory = inAppMessagesFactory;
          inAppMessagesFactory.pickMessage();

          if (CHECK_TEMPLATES_ANNOUNCEMENT === 'true') {
            templatesAnnouncementFactory.showAnnouncementIfNeeded();
          }
        }
      };
    }
  ]);
