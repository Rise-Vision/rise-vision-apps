(function () {
  'use strict';

  angular.module(
      'risevision.common.components.subscription-status.directives')
    .directive('subscriptionStatus', ['$rootScope', '$templateCache', 'subscriptionStatusService',
      'STORE_URL', 'ACCOUNT_PATH', 'IN_RVA_PATH',
      function ($rootScope, $templateCache, subscriptionStatusService, STORE_URL, ACCOUNT_PATH,
        IN_RVA_PATH) {
        return {
          restrict: 'AE',
          require: '?ngModel',
          scope: {
            productId: '@',
            productCode: '@',
            companyId: '@',
            displayId: '@',
            expandedFormat: '@',
            showStoreModal: '=?',
            customProductLink: '@',
            customOnClick: '&'
          },
          template: $templateCache.get('partials/components/subscription-status/subscription-status-template.html'),
          link: function ($scope, elm, attrs, ctrl) {
            $scope.subscriptionStatus = {
              'status': 'N/A',
              'statusCode': 'na',
              'subscribed': false,
              'expiry': null
            };

            var updateUrls = function () {
              $scope.storeAccountUrl = STORE_URL + ACCOUNT_PATH.replace('companyId', $scope.companyId);

              if ($scope.customProductLink) {
                $scope.storeUrl = $scope.customProductLink;
              } else {
                $scope.storeUrl = STORE_URL + IN_RVA_PATH
                  .replace('productId', $scope.productId)
                  .replace('companyId', $scope.companyId);
              }
            };

            function checkSubscriptionStatus() {
              if ($scope.productCode && $scope.productId && ($scope.companyId || $scope.displayId)) {
                subscriptionStatusService.get($scope.productCode, $scope.companyId, $scope.displayId)
                  .then(function (subscriptionStatus) {
                      if (subscriptionStatus) {
                        if (!$scope.subscriptionStatus || $scope.subscriptionStatus.status !== subscriptionStatus
                          .status) {
                          $rootScope.$emit('subscription-status:changed', subscriptionStatus);
                        }

                        $scope.subscriptionStatus = subscriptionStatus;
                      }
                    },
                    function (err) {
                      console.log('Error checking subscription status', err);
                    });
              }
            }

            $scope.$watch('companyId', function () {
              checkSubscriptionStatus();

              updateUrls();
            });

            var subscriptionStatusListener = $rootScope.$on(
              'refreshSubscriptionStatus',
              function (event, data) {
                // Only refresh if currentStatus code matches the provided value, or value is null
                if (data === null || $scope.subscriptionStatus.statusCode === data) {
                  checkSubscriptionStatus();
                }
              });

            $scope.$on('$destroy', function () {
              subscriptionStatusListener();
            });

            if (ctrl) {
              $scope.$watch('subscriptionStatus', function (subscriptionStatus) {
                ctrl.$setViewValue(subscriptionStatus);
              });
            }
          }
        };
      }
    ])
    .filter('to_trusted', ['$sce',
      function ($sce) {
        return function (text) {
          return $sce.trustAsHtml(text);
        };
      }
    ]);
}());
