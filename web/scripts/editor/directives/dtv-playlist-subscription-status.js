(function () {
  'use strict';

  angular.module('risevision.editor.directives')
    .directive('playlistSubscriptionStatus', ['playlistItemFactory',
      function (playlistItemFactory) {
        return {
          restrict: 'E',
          replace: true,
          scope: {
            item: '='
          },
          templateUrl: 'partials/editor/playlist-subscription-status.html',
          link: function ($scope) {
            $scope.playlistItemFactory = playlistItemFactory;

            $scope.showStatus = function () {
              var gadget = $scope.item && $scope.item.gadget;

              return gadget && gadget.subscriptionStatus && !gadget.isSubscribed && !gadget.isLicensed;
            };

          } //link()
        };
      }
    ]);
}());
