(function () {
  'use strict';

  angular.module('risevision.editor.controllers')
    .controller('ProductDetailsModalController', ['$scope', '$rootScope',
      '$loading', '$modalInstance', 'userState',
      'checkTemplateAccess', 'plansFactory', 'product',
      function ($scope, $rootScope, $loading, $modalInstance, userState,
        checkTemplateAccess, plansFactory, product) {
        $scope.product = product;
        $scope.canUseProduct = product.paymentTerms === 'free';
        $scope.showSubscriptionStatus = product.paymentTerms !== 'free';
        $scope.detailsOpen = false;

        if (!$scope.canUseProduct) {
          $loading.start('loading-price');

          checkTemplateAccess(product.productCode)
            .then(function () {
              $scope.canUseProduct = true;
            })
            .finally(function () {
              $loading.stop('loading-price');
            });
        }

        $scope.startTemplateTrial = function () {
          plansFactory.showPlansModal();
        };

        $rootScope.$on('risevision.company.updated', function () {
          var company = userState.getCopyOfSelectedCompany();

          if (company.planSubscriptionStatus === 'Trial') {
            $modalInstance.close(product);
          }
        });

        $scope.toggleDetails = function () {
          $scope.detailsOpen = !$scope.detailsOpen;
        };

        $scope.select = function () {
          $modalInstance.close(product);
        };

        $scope.dismiss = function () {
          $modalInstance.dismiss();
        };
      }
    ]);
}());
