'use strict';
angular.module('risevision.editor.controllers')
  .constant('TEMPLATES_CATEGORY', 'Templates')
  .constant('TEMPLATE_PRODUCT_TAGS', [
    'all',
    'education',
    'business',
    'lifestyle',
    'worship',
    'healthcare',
    'hospitality',
    'retail',
    'other'
  ])
  .controller('storeProductsModal', ['$scope', 'ScrollingListService',
    'store', '$modalInstance', '$loading', '$filter', 'STORE_URL', 'category',
    '$modal', 'playlistItemFactory', 'TEMPLATE_PRODUCT_TAGS',
    'TEMPLATES_CATEGORY',
    function ($scope, ScrollingListService, store, $modalInstance, $loading,
      $filter, STORE_URL, category, $modal, playlistItemFactory,
      TEMPLATE_PRODUCT_TAGS, TEMPLATES_CATEGORY) {
      var defaultCount = 1000;

      $scope.productTags = TEMPLATE_PRODUCT_TAGS;

      $scope.search = {
        category: category,
        count: defaultCount
      };

      $scope.storeUrl = STORE_URL;
      $scope.factory = new ScrollingListService(store.product.list,
        $scope.search);

      $scope.filterConfig = {
        placeholder: $filter('translate')(
          'editor-app.storeProduct.' + (category === TEMPLATES_CATEGORY ?
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

      $scope.selectProductTag = function (tag) {
        if (tag !== $scope.search.productTag && !(!$scope.search.productTag &&
            tag === 'all')) {
          $scope.search.productTag = tag === 'all' ? undefined : tag;

          $scope.factory.doSearch();
        }
      };

      $scope.select = function (product) {
        if (category === TEMPLATES_CATEGORY) {
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
