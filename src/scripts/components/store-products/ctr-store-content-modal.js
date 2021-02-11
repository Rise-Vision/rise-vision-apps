'use strict';
angular.module('risevision.common.components.store-products')
  .controller('storeContentModal', ['$scope', '$loading', '$filter', '$modalInstance',
    'ScrollingListService', 'productsFactory', 'addWidgetByUrl',
    function ($scope, $loading, $filter, $modalInstance,
      ScrollingListService, productsFactory, addWidgetByUrl) {
      var defaultCount = 1000;

      $scope.search = {
        category: 'content',
        count: defaultCount,
        doSearch: function () {}
      };

      $scope.factory = new ScrollingListService(productsFactory.loadProducts,
        $scope.search);

      $scope.filterConfig = {
        placeholder: $filter('translate')('editor-app.storeProduct.content.search'),
        id: 'storeProductsSearchInput'
      };

      $scope.$watch('factory.loadingItems', function (loading) {
        if (loading) {
          $loading.start('product-list-loader');
        } else {
          $loading.stop('product-list-loader');
        }
      });

      $scope.select = function (product) {
        $modalInstance.close(product);
      };

      if (addWidgetByUrl) {
        $scope.addWidgetByUrl = function () {
          $modalInstance.dismiss();
          addWidgetByUrl();
        };
      }

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
