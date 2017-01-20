(function () {
  'use strict';

  angular.module('risevision.editor.controllers')
    .controller('ProductDetailsModalController', ['$scope', '$modalInstance',
      'product', 'userState', 'currencyService', 'storeAuthorization',
      '$loading', '$timeout', 'STORE_URL',
      function ($scope, $modalInstance, product, userState, currencyService,
        storeAuthorization, $loading, $timeout, STORE_URL) {
        $scope.storeUrl = STORE_URL;
        $scope.product = product;
        $scope.canUseProduct = product.paymentTerms === 'free';

        if ($scope.canUseProduct) {
          $timeout(function () {
            $loading.stop('loading-price');
          });
        } else {
          storeAuthorization.check(product.productCode).then(function () {
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

        $scope.select = function () {
          $modalInstance.close(product);
        };

        $scope.dismiss = function () {
          $modalInstance.dismiss();
        };
      }
    ]);
}());
