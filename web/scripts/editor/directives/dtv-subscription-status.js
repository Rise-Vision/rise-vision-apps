(function () {
  'use strict';

  angular.module('risevision.editor.directives')
    .directive('gadgetSubscriptionStatus', ['gadgetFactory', 'STORE_URL',
      function (gadgetFactory, STORE_URL) {
        return {
          restrict: 'E',
          scope: {
            item: '=',
          },
          templateUrl: 'partials/editor/subscription-status.html',
          link: function ($scope) {
              $scope.storeUrl = STORE_URL;

              gadgetFactory.getGadgetWithStatus($scope.item.objectReference)
                .then(function (gadget) {
                  $scope.gadget = gadget;
                  $scope.showBuyButton = false;
                  $scope.showAccountButton = false;
                  $scope.className = 'trial';

                  switch ($scope.gadget.subscriptionStatus) {
                  case 'Not Subscribed':
                    $scope.showBuyButton = true;
                    break;
                  case 'On Trial':
                    $scope.showBuyButton = true;
                    break;
                  case 'Trial Expired':
                    $scope.showBuyButton = true;
                    $scope.className = 'expired';
                    break;
                  case 'Cancelled':
                    $scope.showBuyButton = true;
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
