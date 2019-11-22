'use strict';
angular.module('risevision.editor.controllers')
  .controller('storeProductsModal', ['$scope', '$loading', '$filter', '$modal', '$modalInstance',
    'userState', 'ScrollingListService', 'productsFactory', 'playlistItemFactory',
    'category', 'TEMPLATES_TYPE',
    function ($scope, $loading, $filter, $modal, $modalInstance,
      userState, ScrollingListService, productsFactory, playlistItemFactory,
      category, TEMPLATES_TYPE) {
      var defaultCount = 1000;

      $scope.isEducationCustomer = userState.isEducationCustomer();

      $scope.search = {
        category: category,
        count: defaultCount
      };

      $scope.factory = new ScrollingListService(productsFactory.loadProducts,
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
