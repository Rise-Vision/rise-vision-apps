(function () {
  'use strict';

  angular.module('risevision.editor.directives')
    .directive('gadgetSubscriptionStatus', ['gadgetFactory', 'userState', 'STORE_URL',
      function (gadgetFactory, userState, STORE_URL) {
        return {
          restrict: 'E',
          scope: {
            item: '=',
            useCustomOnClick: '@',
            customOnClick: '&'
          },
          templateUrl: 'partials/editor/subscription-status.html',
          link: function ($scope) {
            $scope.storeUrl = STORE_URL;
            $scope.companyId = userState.getSelectedCompanyId();

            gadgetFactory.updateItemsStatus([$scope.item])
              .then(function () {
                $scope.showSubscribe = false;
                $scope.showAccountButton = false;
                $scope.className = 'trial';

                switch ($scope.item.gadget.subscriptionStatus) {
                case 'Not Subscribed':
                  $scope.showSubscribe = true;
                  break;
                case 'On Trial':
                  $scope.showSubscribe = true;
                  break;
                case 'Trial Expired':
                  $scope.showSubscribe = true;
                  $scope.className = 'expired';
                  break;
                case 'Cancelled':
                  $scope.showSubscribe = true;
                  $scope.className = 'cancelled';
                  break;
                case 'Suspended':
                  $scope.showAccountButton = true;
                  $scope.className = 'suspended';
                  break;
                default:
                  break;
                }
              });
          } //link()
        };
      }
    ]);
}());
