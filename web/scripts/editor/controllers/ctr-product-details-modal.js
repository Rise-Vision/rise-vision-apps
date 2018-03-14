(function () {
  'use strict';

  angular.module('risevision.editor.controllers')
    .controller('ProductDetailsModalController', ['$scope', '$rootScope', '$modalInstance',
      'product', 'userState', 'currencyService', 'storeAuthorization', 'checkTemplateAccess',
      '$loading', '$timeout', 'STORE_URL', 'TEMPLATE_LIBRARY_PRODUCT_CODE', "planFactory",
      function ($scope, $rootScope, $modalInstance, product, userState, currencyService,
        storeAuthorization, checkTemplateAccess, $loading, $timeout, STORE_URL, TEMPLATE_LIBRARY_PRODUCT_CODE,
        planFactory) {
        $scope.storeUrl = STORE_URL;
        $scope.product = product;
        $scope.canUseProduct = product.paymentTerms === 'free';
        $scope.showSubscriptionStatus = product.paymentTerms !== 'free';
        $scope.detailsOpen = false;

        if ($scope.canUseProduct) {
          $timeout(function () {
            $loading.stop('loading-price');
          });
        } else {
          checkTemplateAccess(product.productCode)
            .then(function () {
              $scope.canUseProduct = true;
              $loading.stop('loading-price');
            }, function () {
              currencyService().then(function (currency) {
                var company = userState.getCopyOfUserCompany();
                var country = (company && company.country) ? company.country :
                  '';
                var selectedCurrency = currency.getByCountry(country);
                $scope.currencyName = selectedCurrency.getName();
                $scope.price = selectedCurrency.pickPrice(product.pricing[
                  0].priceUSD, product.pricing[0].priceCAD);
              }).finally(function () {
                $loading.stop('loading-price');
              });
            });
        }

        $scope.startTemplateTrial = function () {
          planFactory.showPlansModal();
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
