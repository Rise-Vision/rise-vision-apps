(function () {
  'use strict';

  angular.module('risevision.editor.directives')
    .directive('gadgetSubscriptionStatus', ['gadgetFactory', 'userState', 'planFactory', 'STORE_URL',
      'EMBEDDED_PRESENTATIONS_CODE',
      function (gadgetFactory, userState, planFactory, STORE_URL, EMBEDDED_PRESENTATIONS_CODE) {
        var plansProductCodes = [EMBEDDED_PRESENTATIONS_CODE];

        return {
          restrict: 'E',
          scope: {
            item: '=',
          },
          templateUrl: 'partials/editor/subscription-status.html',
          link: function ($scope) {
            $scope.storeUrl = STORE_URL;
            $scope.companyId = userState.getSelectedCompanyId();
            $scope.showPlansModal = planFactory.showPlansModal;

            gadgetFactory.updateItemsStatus([$scope.item])
              .then(function () {
                var showSubscribe = false;
                $scope.showAccountButton = false;
                $scope.className = 'trial';

                switch ($scope.item.gadget.subscriptionStatus) {
                case 'Not Subscribed':
                  showSubscribe = true;
                  break;
                case 'On Trial':
                  showSubscribe = true;
                  break;
                case 'Trial Expired':
                  showSubscribe = true;
                  $scope.className = 'expired';
                  break;
                case 'Cancelled':
                  showSubscribe = true;
                  $scope.className = 'cancelled';
                  break;
                case 'Suspended':
                  $scope.showAccountButton = true;
                  $scope.className = 'suspended';
                  break;
                default:
                  break;
                }

                var showPlans = plansProductCodes.indexOf($scope.item.gadget.productCode) >= 0;

                $scope.showSubscribeStoreButton = showSubscribe && !showPlans;
                $scope.showSubscribePlanButton = showSubscribe && showPlans;
              });
          } //link()
        };
      }
    ]);
}());
