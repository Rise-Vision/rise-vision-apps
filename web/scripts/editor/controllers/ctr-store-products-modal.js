'use strict';
angular.module('risevision.editor.controllers')
  .constant('TEMPLATES_TYPE', 'Templates')
  .constant('PAYMENT_CATEGORIES', [
    'all',
    'free',
    'premium'
  ])
  .controller('storeProductsModal', ['$scope', 'ScrollingListService',
    'store', '$modalInstance', '$loading', '$filter', 'STORE_URL', 'category',
    '$modal', 'playlistItemFactory', 'PAYMENT_CATEGORIES',
    'TEMPLATES_TYPE',
    function ($scope, ScrollingListService, store, $modalInstance, $loading,
      $filter, STORE_URL, category, $modal, playlistItemFactory,
      PAYMENT_CATEGORIES, TEMPLATES_TYPE) {
      var defaultCount = 1000;

      $scope.paymentCategories = PAYMENT_CATEGORIES;

      $scope.search = {
        category: category,
        count: defaultCount
      };

      $scope.storeUrl = STORE_URL;
      $scope.factory = new ScrollingListService(store.product.list,
        $scope.search);

      $scope.filterConfig = {
        placeholder: $filter('translate')(
          'editor-app.storeProduct.' + (category === TEMPLATES_TYPE ?
            'templates' : 'content') + '.search'),
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
        if (category === TEMPLATES_TYPE) {
          var productDetailsModal = $modal.open({
            templateUrl: 'partials/editor/product-details-modal.html',
            size: 'lg',
            windowClass: 'product-preview-modal',
            controller: 'ProductDetailsModalController',
            resolve: {
              product: function () {
                return product;
              }
            }
          });
          productDetailsModal.result.then(function () {
            $modalInstance.close(product);
          });
        } else {
          $modalInstance.close(product);
        }
      };

      $scope.quickSelect = function (product) {
        $modalInstance.close(product);
      };

      $scope.addWidgetByUrl = function () {
        $modalInstance.dismiss();
        playlistItemFactory.addWidgetByUrl();
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
