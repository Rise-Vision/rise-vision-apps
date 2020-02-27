'use strict';
angular.module('risevision.editor.controllers')
  .controller('storeProductsModal', ['$scope', '$loading', '$filter', '$modal', '$modalInstance',
    'userState', 'ScrollingListService', 'productsFactory', 'playlistItemFactory', 'templateCategoryFilter',
    'category', 'TEMPLATES_TYPE',
    function ($scope, $loading, $filter, $modal, $modalInstance,
      userState, ScrollingListService, productsFactory, playlistItemFactory, templateCategoryFilter,
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

      $scope.getTemplatesFilter = function () {
        var filter = {};

        if ($scope.search.templatesFilter) {
          var values = $scope.search.templatesFilter.split('|');
          filter[values[0]] = values[1];
        }

        return filter;
      };

      var _updateProductFilters = function () {
        if (category === TEMPLATES_TYPE && !$scope.categoryFilters && $scope.factory.items.list.length) {
          $scope.categoryFilters = {
            templateCategories: templateCategoryFilter($scope.factory.items.list, 'templateCategories'),
            templateLocations: templateCategoryFilter($scope.factory.items.list, 'templateLocations'),
            templateContentTypes: templateCategoryFilter($scope.factory.items.list, 'templateContentTypes')
          };
        }
      };

      $scope.$watch('factory.loadingItems', function (loading) {
        if (loading) {
          $loading.start('product-list-loader');
        } else {
          $loading.stop('product-list-loader');

          _updateProductFilters();
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
